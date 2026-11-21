from datetime import date

from pydantic import BaseModel

from app.schemas.ep import Composition, DeadlineView, FolderCounts


class MissingFolder(BaseModel):
    """A family with something missing. Only the status of its carpeta, never the content (L-06)."""

    id: int
    name: str
    done: int
    total: int
    missing_label: str
    companion_name: str | None


class SavingsCutoff(BaseModel):
    deadline: DeadlineView
    # Families still under the minimum savings. A count, not amounts (L-06).
    below_minimum: int


class ComiteCarpetas(BaseModel):
    slug: str
    name: str
    counts: FolderCounts
    composition: Composition
    savings_cutoff: SavingsCutoff | None
    # Families that share their carpeta with the comité and have something missing.
    missing: list[MissingFolder]
    # Families that did not authorize the comité to see their carpeta; they are only counted.
    hidden: int


class Companion(BaseModel):
    companion_name: str


class ReminderSent(BaseModel):
    family: str
    # False when a reminder was already open for this family (L-03: insisting does not raise priority).
    sent: bool


class Renunciation(BaseModel):
    family_id: int
    name: str
    renounced_on: date


class Requirement(BaseModel):
    label: str
    # Key requirements are the ones a waiting family most often fails.
    key: bool


class CompositionEffect(BaseModel):
    active: int
    above_rsh_40: int
    # If the replacement is above the 40% of the RSH.
    percent_if_above: int
    compliant_if_above: bool


class WaitlistFamily(BaseModel):
    id: int
    name: str
    in_rsh_40: bool
    savings_ready: bool
    can_enter: bool
    blocker: str | None
    proposed: bool


class ComiteReemplazo(BaseModel):
    slug: str
    name: str
    renunciation: Renunciation | None
    deadline: DeadlineView | None
    requirements: list[Requirement]
    effect: CompositionEffect
    waitlist: list[WaitlistFamily]


class Proposal(BaseModel):
    family_id: int


class ProposalResult(BaseModel):
    family: str
    replaces: str | None
