"""Copiloto de Carpeta: a Claude agent with read-only tools plus one proposal tool.

Limits are enforced here, not only in the prompt (L-01):
- No tool takes a family_id: tools only see the family bound to the request, and the group tool
  only returns counts (L-06).
- The tool set is closed. Any other tool name, such as an invented exclude_family, is refused and
  logged (L-02). There is no tool that approves anything (L-12).
- request_signature_link only records a ProposedAction; it never sends or marks as signed (L-01).
- explain_document answers only from a fixed glossary (L-04).
- A pending step without an owner is reported as such (L-13).
"""

import logging
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import date
from typing import Protocol

from anthropic.types import Message, MessageParam, ToolParam, ToolResultBlockParam, ToolUseBlock
from sqlalchemy.orm import Session

from app.models import Family
from app.models.domain import DocumentKind, DocumentStatus
from app.prompts import copilot as prompts
from app.schemas.copilot import (
    ActionKind,
    CarpetaItem,
    CopilotRequest,
    CopilotResponse,
    FamilyCarpeta,
    GroupProgress,
    PendingStep,
    ProposedAction,
    ReplySource,
)
from app.services.ep import upcoming_deadlines
from app.services.familia import comite_progress
from app.services.llm import LlmUnavailableError, complete

logger = logging.getLogger(__name__)

MAX_TOOL_ROUNDS = 5
ADULT_AGE = 18
PENDING_STATUSES = {DocumentStatus.FALTA, DocumentStatus.VENCE}

CompleteFn = Callable[[str, list[MessageParam], list[ToolParam]], Message]


class FamilyNotFoundError(Exception):
    pass


class CarpetaSource(Protocol):
    """What the copiloto reads about one family. Tests swap it for an in-memory fake."""

    def family_carpeta(self, family_id: int) -> FamilyCarpeta | None: ...

    def group_progress(self, family_id: int) -> GroupProgress | None: ...


@dataclass
class DbCarpetaSource:
    session: Session
    today: date

    def family_carpeta(self, family_id: int) -> FamilyCarpeta | None:
        family = self.session.get(Family, family_id)
        if family is None:
            return None
        items = [
            CarpetaItem(
                kind=document.kind,
                name=prompts.DOCUMENT_LABELS[document.kind],
                status=document.status,
                detail=document.detail or "",
                pending_signers=[s.member.first_name for s in document.signatures if s.signed_at is None],
            )
            for document in family.documents
            if document.status != DocumentStatus.NO_APLICA
        ]
        return FamilyCarpeta(
            family_id=family.id,
            contact_name=family.contact_name or family.display_name,
            adults=[m.first_name for m in family.members if m.age >= ADULT_AGE],
            items=items,
        )

    def group_progress(self, family_id: int) -> GroupProgress | None:
        family = self.session.get(Family, family_id)
        if family is None:
            return None
        comite = family.comite
        counts = comite_progress(comite)
        deadlines = upcoming_deadlines(comite, self.today)
        return GroupProgress(
            committee_name=comite.name,
            families_total=counts.total,
            families_complete=counts.complete,
            stage=prompts.STAGE_LABELS[comite.stage],
            next_deadline=prompts.NEXT_DEADLINE.format(title=deadlines[0].title, due_on=deadlines[0].due_on)
            if deadlines
            else None,
            pending_steps=[
                PendingStep(description=o.description, owner=o.assignee_name)
                for o in comite.observations
                if o.family_id == family.id and o.answered_at is None
            ],
        )


@dataclass
class ToolOutcome:
    text: str
    is_error: bool = False


@dataclass
class CopilotTools:
    """Dispatches the model's tool calls for one family. Nothing here writes to the database."""

    carpeta: FamilyCarpeta
    progress: GroupProgress | None
    proposed_actions: list[ProposedAction] = field(default_factory=list)

    def run(self, name: str, tool_input: dict[str, object]) -> ToolOutcome:
        match name:
            case "get_my_carpeta":
                return ToolOutcome(self.carpeta.model_dump_json())
            case "get_group_progress":
                return ToolOutcome(_progress_for_model(self.progress))
            case "explain_document":
                return ToolOutcome(explain_document(str(tool_input.get("name", ""))))
            case "request_signature_link":
                return self._request_signature_link(str(tool_input.get("member", "")))
            case _:
                logger.warning("Copiloto refused tool %s for family %s", name, self.carpeta.family_id)
                return ToolOutcome(prompts.TOOL_NOT_ALLOWED, is_error=True)

    def _request_signature_link(self, member: str) -> ToolOutcome:
        signer = _find_pending_signer(self.carpeta, member)
        if signer is None:
            return ToolOutcome(prompts.UNKNOWN_MEMBER.format(member=member), is_error=True)
        action = ProposedAction(kind=ActionKind.SEND_SIGNATURE_LINK, family_id=self.carpeta.family_id, member=signer)
        if action not in self.proposed_actions:
            self.proposed_actions.append(action)
        return ToolOutcome(prompts.SIGNATURE_LINK_PROPOSED.format(member=signer))


def explain_document(name: str) -> str:
    return prompts.GLOSSARY.get(name.strip().lower(), prompts.UNKNOWN_DOCUMENT)


def reply(source: CarpetaSource, request: CopilotRequest, complete_fn: CompleteFn = complete) -> CopilotResponse:
    carpeta = source.family_carpeta(request.family_id)
    if carpeta is None:
        raise FamilyNotFoundError(request.family_id)
    tools = CopilotTools(carpeta=carpeta, progress=source.group_progress(request.family_id))
    try:
        text, reply_source = _run_agent(tools, request, complete_fn), ReplySource.LLM
    except LlmUnavailableError as error:
        logger.info("Copiloto using scripted fallback: %s", error)
        text, reply_source = fallback_reply(carpeta, tools.progress, request.message), ReplySource.FALLBACK
    return CopilotResponse(
        reply=text,
        quick_replies=quick_replies(carpeta),
        proposed_actions=tools.proposed_actions,
        source=reply_source,
    )


def _run_agent(tools: CopilotTools, request: CopilotRequest, complete_fn: CompleteFn) -> str:
    messages: list[MessageParam] = [{"role": turn.role.value, "content": turn.text} for turn in request.history]
    messages.append({"role": "user", "content": request.message})
    for _ in range(MAX_TOOL_ROUNDS):
        response = complete_fn(prompts.SYSTEM_PROMPT, messages, prompts.TOOLS)
        if response.stop_reason != "tool_use":
            text = "\n".join(block.text for block in response.content if block.type == "text").strip()
            # Refusals, truncation or an empty answer fall back to the scripted reply.
            if response.stop_reason != "end_turn" or not text:
                raise LlmUnavailableError(f"unusable model answer: {response.stop_reason}")
            return text
        results = [_tool_result(tools, block) for block in response.content if block.type == "tool_use"]
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": results})
    raise LlmUnavailableError("too many tool rounds")


def _tool_result(tools: CopilotTools, block: ToolUseBlock) -> ToolResultBlockParam:
    outcome = tools.run(block.name, block.input)
    return {"type": "tool_result", "tool_use_id": block.id, "content": outcome.text, "is_error": outcome.is_error}


def fallback_reply(carpeta: FamilyCarpeta, progress: GroupProgress | None, message: str) -> str:
    explanation = _glossary_match(message)
    if explanation:
        return explanation
    lines = [prompts.FALLBACK_GREETING.format(name=carpeta.contact_name.split()[0])]
    pending = [item for item in carpeta.items if item.status in PENDING_STATUSES]
    if not pending:
        lines.append(prompts.FALLBACK_COMPLETE)
    elif len(pending) == 1:
        lines.append(prompts.FALLBACK_MISSING_ONE)
    else:
        lines.append(prompts.FALLBACK_MISSING_HEADER.format(count=len(pending)))
    lines += [_fallback_item(item) for item in pending]
    if progress:
        lines.append(prompts.FALLBACK_GROUP.format(complete=progress.families_complete, total=progress.families_total))
        if progress.next_deadline:
            lines.append(prompts.FALLBACK_NEXT_DEADLINE.format(deadline=progress.next_deadline))
        lines += [
            prompts.FALLBACK_PENDING_STEP.format(step=step.description, owner=step.owner or prompts.NOBODY_TOOK_STEP)
            for step in progress.pending_steps
        ]
    return "\n".join(lines)


def quick_replies(carpeta: FamilyCarpeta) -> list[str]:
    buttons = []
    for item in carpeta.items:
        if item.status not in PENDING_STATUSES:
            continue
        if item.kind == DocumentKind.AHORRO:
            buttons.append(prompts.QUICK_REPLY_DEPOSIT)
        elif item.name.lower() in prompts.GLOSSARY:
            buttons.append(prompts.QUICK_REPLY_WHAT_IS.format(name=item.name))
    return [*buttons, prompts.QUICK_REPLY_SEE_CARPETA]


def _fallback_item(item: CarpetaItem) -> str:
    line = prompts.FALLBACK_MISSING_ITEM.format(name=item.name, detail=item.detail or item.status.value)
    if item.pending_signers:
        line += prompts.FALLBACK_PENDING_SIGNERS.format(names=", ".join(item.pending_signers))
    return line


def _glossary_match(message: str) -> str | None:
    text = message.lower()
    return next((explanation for alias, explanation in prompts.GLOSSARY.items() if alias in text), None)


def _find_pending_signer(carpeta: FamilyCarpeta, member: str) -> str | None:
    # Members are stored by first name; the model may say "Pedro" or "Pedro Rojas".
    wanted = member.lower().split()[:1]
    signers = {signer for item in carpeta.items for signer in item.pending_signers}
    return next((s for s in signers if wanted == s.lower().split()[:1]), None)


def _progress_for_model(progress: GroupProgress | None) -> str:
    if progress is None:
        return prompts.NO_GROUP_PROGRESS
    steps = [s.model_copy(update={"owner": s.owner or prompts.NOBODY_TOOK_STEP}) for s in progress.pending_steps]
    return progress.model_copy(update={"pending_steps": steps}).model_dump_json()
