import logging
from datetime import date

import pytest
from anthropic.types import Message, MessageParam, TextBlock, ToolParam, ToolUseBlock
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Family
from app.models.domain import DocumentKind, DocumentStatus
from app.prompts import copilot as prompts
from app.schemas.copilot import (
    ActionKind,
    CarpetaItem,
    CopilotRequest,
    FamilyCarpeta,
    GroupProgress,
    PendingStep,
    ReplySource,
)
from app.seed import seed
from app.services import copilot, llm

FAMILY_ID = 7
CARPETA = FamilyCarpeta(
    family_id=FAMILY_ID,
    contact_name="Marta Rojas",
    adults=["Marta", "Pedro", "Sofía"],
    items=[
        CarpetaItem(kind=DocumentKind.RSH, name="RSH", status=DocumentStatus.LISTO),
        CarpetaItem(
            kind=DocumentKind.DJ49_1,
            name="DJ49-1",
            status=DocumentStatus.FALTA,
            detail="Firmada por 2 de 3 adultos",
            pending_signers=["Pedro"],
        ),
        CarpetaItem(kind=DocumentKind.AHORRO, name="Ahorro", status=DocumentStatus.VENCE, detail="Hoy 9,5 UF"),
    ],
)
PROGRESS = GroupProgress(
    committee_name="Los Aromos",
    families_total=40,
    families_complete=34,
    stage="Revisión del SERVIU",
    pending_steps=[PendingStep(description="Observación 3: falta la firma de Pedro.")],
)


class FakeSource:
    def family_carpeta(self, family_id: int) -> FamilyCarpeta | None:
        return CARPETA if family_id == FAMILY_ID else None

    def group_progress(self, family_id: int) -> GroupProgress | None:
        return PROGRESS if family_id == FAMILY_ID else None


def _message(stop_reason: str, *blocks: TextBlock | ToolUseBlock) -> Message:
    return Message.model_construct(role="assistant", content=list(blocks), stop_reason=stop_reason)


class FakeLlm:
    """Plays back canned model answers and records what it was sent."""

    def __init__(self, *answers: Message) -> None:
        self.answers = list(answers)
        self.calls: list[list[MessageParam]] = []

    def __call__(self, system: str, messages: list[MessageParam], tools: list[ToolParam]) -> Message:
        self.calls.append(list(messages))
        return self.answers.pop(0)


def _request(message: str) -> CopilotRequest:
    return CopilotRequest(family_id=FAMILY_ID, message=message)


def _unconfigured(_system: str, _messages: list[MessageParam], _tools: list[ToolParam]) -> Message:
    raise llm.LlmUnavailableError("no key")


def test_fallback_lists_what_is_missing_and_says_nobody_took_the_step() -> None:
    response = copilot.reply(FakeSource(), _request("Hola"), _unconfigured)

    assert response.source == ReplySource.FALLBACK
    assert "DJ49-1" in response.reply
    assert "Pedro" in response.reply
    assert "Ahorro" in response.reply
    assert "RSH" not in response.reply
    assert "34 de 40" in response.reply
    assert prompts.NOBODY_TOOK_STEP in response.reply  # L-13
    assert response.quick_replies == ["¿Qué es DJ49-1?", "¿Cómo deposito?", "Ver mi carpeta"]


def test_fallback_explains_a_known_document() -> None:
    response = copilot.reply(FakeSource(), _request("¿Qué es DJ49-1?"), _unconfigured)

    assert response.reply == prompts.GLOSSARY["dj49-1"]


def test_unknown_tools_are_refused_and_logged(caplog: pytest.LogCaptureFixture) -> None:
    tools = copilot.CopilotTools(carpeta=CARPETA, progress=PROGRESS)

    with caplog.at_level(logging.WARNING):
        outcome = tools.run("exclude_family", {"family_id": 3})

    assert outcome.is_error
    assert "exclude_family" in caplog.text
    assert tools.proposed_actions == []


def test_the_tool_set_is_closed() -> None:
    """L-02 and L-12: the model is offered only read tools and the signature-link proposal."""
    offered = {tool["name"] for tool in prompts.TOOLS}

    assert offered == {"get_my_carpeta", "get_group_progress", "explain_document", "request_signature_link"}
    tools = copilot.CopilotTools(carpeta=CARPETA, progress=PROGRESS)
    assert all(not tools.run(name, {"name": "DJ49-1", "member": "Pedro"}).is_error for name in offered)


def test_explain_document_does_not_invent() -> None:
    """L-04: unknown documents get no made-up explanation."""
    assert copilot.explain_document("Formulario 99") == prompts.UNKNOWN_DOCUMENT


def test_signature_link_only_for_a_pending_signer() -> None:
    tools = copilot.CopilotTools(carpeta=CARPETA, progress=PROGRESS)

    assert tools.run("request_signature_link", {"member": "Marta"}).is_error
    assert not tools.run("request_signature_link", {"member": "Pedro Rojas"}).is_error
    assert [(a.kind, a.member) for a in tools.proposed_actions] == [(ActionKind.SEND_SIGNATURE_LINK, "Pedro")]


def test_agent_loop_runs_a_tool_then_answers() -> None:
    fake = FakeLlm(
        _message(
            "tool_use", ToolUseBlock(type="tool_use", id="t1", name="request_signature_link", input={"member": "Pedro"})
        ),
        _message("end_turn", TextBlock(type="text", text="Listo, le pedí el enlace a Pedro.")),
    )

    response = copilot.reply(FakeSource(), _request("Mándaselo, porfa"), fake)

    assert response.source == ReplySource.LLM
    assert response.reply == "Listo, le pedí el enlace a Pedro."
    assert [a.member for a in response.proposed_actions] == ["Pedro"]
    tool_result = fake.calls[1][-1]["content"][0]
    assert tool_result["tool_use_id"] == "t1"
    assert not tool_result["is_error"]


def test_a_refusal_falls_back_to_the_script() -> None:
    fake = FakeLlm(_message("refusal"))

    response = copilot.reply(FakeSource(), _request("Hola"), fake)

    assert response.source == ReplySource.FALLBACK


def test_unknown_family_is_an_error() -> None:
    with pytest.raises(copilot.FamilyNotFoundError):
        copilot.reply(FakeSource(), CopilotRequest(family_id=999, message="Hola"), _unconfigured)


def test_endpoint_answers_marta_from_the_seed(
    client: TestClient, session: Session, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(llm, "ANTHROPIC_API_KEY", "")
    seed(session)
    rojas = session.scalars(select(Family).where(Family.surname == "Rojas")).one()

    response = client.post("/copilot/messages", json={"family_id": rojas.id, "message": "Hola", "history": []})

    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "fallback"
    assert "DJ49-1" in body["reply"]
    assert "Pedro" in body["reply"]
    assert "Ver mi carpeta" in body["quick_replies"]


def test_endpoint_404_for_unknown_family(client: TestClient) -> None:
    response = client.post("/copilot/messages", json={"family_id": 999_999, "message": "Hola"})

    assert response.status_code == 404


def test_db_source_reads_counts_only(session: Session) -> None:
    seed(session)
    rojas = session.scalars(select(Family).where(Family.surname == "Rojas")).one()

    progress = copilot.DbCarpetaSource(session, date.today()).group_progress(rojas.id)

    assert progress is not None
    assert progress.families_complete <= progress.families_total
    assert progress.pending_steps[0].owner == "Marta Rojas"
