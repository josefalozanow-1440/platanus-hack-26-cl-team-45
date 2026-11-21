from datetime import date

from pydantic import BaseModel

from app.models.domain import DeadlineKind, DocumentKind, DocumentStatus, ObservationCategory, Stage


class DeadlineView(BaseModel):
    kind: DeadlineKind
    title: str
    due_on: date
    business_days: bool
    remaining_days: int
    total_days: int | None
    article: str | None
    note: str | None
    critical: bool


class FolderCounts(BaseModel):
    complete: int
    missing: int
    expiring: int
    total: int


class ObservationCounts(BaseModel):
    answered: int
    total: int
    # Who the first pending observation corresponds to (not who accepted it, L-14).
    pending_assignee: str | None
    # When nothing is pending, the last observation's text, so the row says what was answered.
    last_answered: str | None


class PanelRow(BaseModel):
    slug: str
    name: str
    stage: Stage
    folders: FolderCounts
    deadlines: list[DeadlineView]
    observations: ObservationCounts
    wait_months: int


class Panel(BaseModel):
    ep_name: str
    comite_count: int
    family_count: int
    families_complete: int
    critical_deadlines: int
    observations_answered: int
    observations_total: int
    average_wait_months: int
    comites: list[PanelRow]


class ObservationView(BaseModel):
    id: int
    number: int
    category: ObservationCategory
    description: str
    assignee_role: str | None
    assignee_name: str | None
    draft_answer: str | None
    draft_accepted_by: str | None
    note: str | None
    answered: bool


class ObservationsPage(BaseModel):
    slug: str
    name: str
    round: int
    received_on: date | None
    deadline: DeadlineView | None
    observations: list[ObservationView]
    answered: int
    # The line families see about this round (F3).
    family_message: str


class AcceptDraft(BaseModel):
    accepted_by: str


class FamilyFolder(BaseModel):
    id: int
    name: str
    documents: dict[DocumentKind, DocumentStatus]


class Composition(BaseModel):
    in_rsh_40: int
    total: int
    share_percent: int
    compliant: bool


class Carpeta(BaseModel):
    slug: str
    name: str
    stage: Stage
    family_count: int
    missing: int
    deadline: DeadlineView | None
    families: list[FamilyFolder]
    composition: Composition
    next_assembly: DeadlineView | None


class ReminderResult(BaseModel):
    families: int
