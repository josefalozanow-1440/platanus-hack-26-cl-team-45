from enum import StrEnum

from pydantic import BaseModel, Field

from app.models.domain import DocumentKind, DocumentStatus

MAX_MESSAGE_CHARS = 2000
MAX_HISTORY_TURNS = 20


class CarpetaItem(BaseModel):
    """One requirement of the family's carpeta, as the family itself may see it."""

    kind: DocumentKind
    name: str
    status: DocumentStatus
    detail: str = ""
    pending_signers: list[str] = []


class FamilyCarpeta(BaseModel):
    family_id: int
    contact_name: str
    adults: list[str]
    items: list[CarpetaItem]


class PendingStep(BaseModel):
    """A pending step that concerns this family, e.g. an SERVIU observation about its carpeta."""

    description: str
    # None means nobody has taken the step yet (L-13).
    owner: str | None = None


class GroupProgress(BaseModel):
    """Only aggregate counts: a family never sees another family's documents (L-06)."""

    committee_name: str
    families_total: int
    families_complete: int
    stage: str
    next_deadline: str | None = None
    pending_steps: list[PendingStep] = []


class ChatRole(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"


class ChatTurn(BaseModel):
    role: ChatRole
    text: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)


class ActionKind(StrEnum):
    SEND_SIGNATURE_LINK = "enviar_enlace_firma"


class ProposedAction(BaseModel):
    """Something the copiloto proposes; an executor in code decides whether it runs (L-01)."""

    kind: ActionKind
    family_id: int
    member: str


class ReplySource(StrEnum):
    LLM = "llm"
    FALLBACK = "fallback"


class CopilotRequest(BaseModel):
    family_id: int
    message: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)
    history: list[ChatTurn] = Field(default=[], max_length=MAX_HISTORY_TURNS)


class CopilotResponse(BaseModel):
    reply: str
    quick_replies: list[str]
    proposed_actions: list[ProposedAction]
    source: ReplySource
