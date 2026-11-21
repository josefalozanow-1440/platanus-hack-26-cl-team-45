from datetime import date, datetime
from decimal import Decimal
from enum import StrEnum

from pydantic import BaseModel

from app.models.domain import DocumentKind, DocumentStatus, Stage


class StepStatus(StrEnum):
    LISTO = "listo"
    AHORA = "ahora"
    PENDIENTE = "pendiente"
    SEGUIMIENTO = "seguimiento"


class CarpetaProgress(BaseModel):
    ready: int
    total: int
    listos: int
    por_vencer: int
    faltan: int


class ComiteProgress(BaseModel):
    complete: int
    total: int


class DocumentItem(BaseModel):
    kind: DocumentKind
    code: str
    name: str
    detail: str | None
    status: DocumentStatus
    status_label: str


class Person(BaseModel):
    name: str
    initials: str


class SignerItem(BaseModel):
    first_name: str
    signed: bool


class PendingAction(BaseModel):
    title: str
    body: str
    member_name: str


class SavingsCutoff(BaseModel):
    due_on: date
    days_left: int
    savings_uf: Decimal
    required_uf: Decimal


class FamilyHeader(BaseModel):
    family_name: str
    contact_name: str | None
    comite_name: str
    member_count: int


class CarpetaResponse(FamilyHeader):
    progress: CarpetaProgress
    pending_action: PendingAction | None
    documents: list[DocumentItem]
    family_access: list[Person]
    others_access: list[Person]
    dj49_1_signers: list[SignerItem]
    savings_cutoff: SavingsCutoff | None
    comite_progress: ComiteProgress


class PrivacySettings(BaseModel):
    shares_with_comite: bool
    shares_with_ep: bool
    shares_sensitive: bool


class PrivacyResponse(FamilyHeader):
    ep_name: str
    progress: CarpetaProgress
    settings: PrivacySettings


class StepItem(BaseModel):
    stage: Stage
    name: str
    status: StepStatus


class ActivityItem(BaseModel):
    actor: str
    initials: str
    text: str
    occurred_at: datetime


class GrupoResponse(BaseModel):
    comite_name: str
    family_count: int
    stage_number: int
    stage_total: int
    stage_name: str
    observations_total: int
    observations_for_family: int
    business_days_left: int | None
    steps: list[StepItem]
    wait_years: int
    wait_months: int
    activities: list[ActivityItem]


class FirmaResponse(BaseModel):
    signer_name: str
    signer_age: int
    requested_by: str
    comite_name: str
    lives_with: list[str]
    signers: list[SignerItem]
    already_signed: bool
    observation_number: int | None
    family_count: int
