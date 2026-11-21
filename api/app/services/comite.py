"""Read models and actions for the comité screens (C1 carpetas del grupo, C2 renuncia y reemplazo).

The comité sees the status of each carpeta, never its content (L-06): no amounts, no documents.
"""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Activity, Comite, Family
from app.models.domain import DeadlineKind, DocumentKind, DocumentStatus
from app.schemas.comite import (
    ComiteCarpetas,
    ComiteReemplazo,
    CompositionEffect,
    MissingFolder,
    ProposalResult,
    ReminderSent,
    Renunciation,
    Requirement,
    SavingsCutoff,
    WaitlistFamily,
)
from app.services.ep import (
    MAX_SHARE_ABOVE_RSH_40,
    PERCENT,
    active_families,
    composition,
    folder_counts,
    get_comite,
    statuses,
)
from app.services.ep_deadlines import deadline_view

# Minimum savings a family must have deposited to enter the group (D.S. 49).
MIN_SAVINGS_UF = Decimal(10)
ADULT_AGE = 18
DONE_STATUSES = {DocumentStatus.LISTO, DocumentStatus.NO_APLICA}
COPILOT_ACTOR = "Copiloto"
DIRECTIVA_ACTOR = "Directiva"

MISSING_LABELS = {
    DocumentKind.RSH: "Falta el RSH vigente",
    DocumentKind.CEDULA: "Falta la cédula vigente",
    DocumentKind.DJ49_1: "Falta la DJ49-1",
    DocumentKind.DJ49_2: "Falta la DJ49-2",
    DocumentKind.DJ49_3: "Falta el mandato de ahorro (DJ49-3)",
    DocumentKind.AHORRO: "Falta el certificado de ahorro",
    DocumentKind.COMUNIDAD: "Falta el certificado de comunidad",
}

# What a replacement family must bring when it enters (arts. 14 y 20). Savings is the one that usually fails.
REPLACEMENT_REQUIREMENTS = [
    Requirement(label="Registro Social de Hogares vigente", key=False),
    Requirement(label="Ahorro de 10 UF ya depositado", key=True),
    Requirement(label="Declaraciones firmadas", key=False),
    Requirement(label="Sin vivienda ni subsidio previo", key=False),
]


class FamilyNotFoundError(Exception):
    pass


class AlreadyAccompaniedError(Exception):
    pass


class CannotEnterError(Exception):
    """The family is not on the waiting list or does not meet the entry requirements yet."""


def pending_signatures(family: Family) -> int:
    document = next((d for d in family.documents if d.kind == DocumentKind.DJ49_1), None)
    if document is None:
        return 0
    return sum(1 for s in document.signatures if s.signed_at is None and s.member.age >= ADULT_AGE)


def missing_label(family: Family, missing: list[DocumentKind]) -> str:
    if len(missing) > 1:
        return f"Faltan {len(missing)} documentos"
    if missing[0] == DocumentKind.DJ49_1 and (pending := pending_signatures(family)):
        adults = "adulto" if pending == 1 else "adultos"
        return f"Falta la firma de {pending} {adults} (DJ49-1)"
    return MISSING_LABELS[missing[0]]


def missing_folder(family: Family) -> MissingFolder:
    missing = [d.kind for d in family.documents if d.status == DocumentStatus.FALTA]
    return MissingFolder(
        id=family.id,
        name=family.display_name,
        done=sum(1 for d in family.documents if d.status in DONE_STATUSES),
        total=len(family.documents),
        missing_label=missing_label(family, missing),
        companion_name=family.companion_name,
    )


def get_carpetas(session: Session, slug: str, today: date) -> ComiteCarpetas:
    comite = get_comite(session, slug)
    families = active_families(comite)
    with_missing = [f for f in families if DocumentStatus.FALTA in statuses(f)]
    shared = [missing_folder(f) for f in with_missing if f.shares_with_comite]
    # Families nobody accompanies go first: they are the ones the directiva can help.
    shared.sort(key=lambda folder: folder.companion_name is not None)
    cutoff = next((d for d in comite.deadlines if d.kind == DeadlineKind.AHORRO and d.due_on >= today), None)
    return ComiteCarpetas(
        slug=comite.slug,
        name=comite.name,
        counts=folder_counts(families),
        composition=composition(families),
        savings_cutoff=SavingsCutoff(
            deadline=deadline_view(cutoff, today),
            below_minimum=sum(1 for f in families if f.savings_uf < MIN_SAVINGS_UF),
        )
        if cutoff
        else None,
        missing=shared,
        hidden=len(with_missing) - len(shared),
    )


def get_family(session: Session, slug: str, family_id: int) -> tuple[Comite, Family]:
    comite = get_comite(session, slug)
    family = session.get(Family, family_id)
    if family is None or family.comite_id != comite.id:
        raise FamilyNotFoundError(family_id)
    return comite, family


def accompany(session: Session, slug: str, family_id: int, companion_name: str, now: datetime) -> MissingFolder:
    """Someone from the comité takes the family by clicking; nobody is assigned by silence (L-05)."""
    comite, family = get_family(session, slug, family_id)
    if family.companion_name is not None:
        raise AlreadyAccompaniedError(family_id)
    family.companion_name = companion_name
    session.add(
        Activity(
            comite_id=comite.id,
            actor=companion_name,
            text=f"{companion_name} va a acompañar a la familia {family.surname}",
            occurred_at=now,
        )
    )
    session.commit()
    return missing_folder(family)


def remind(session: Session, slug: str, family_id: int, now: datetime) -> ReminderSent:
    """Log a reminder for the copilot to send. At most one per family and day (L-03)."""
    comite, family = get_family(session, slug, family_id)
    text = f"Copiloto le recordó a la familia {family.surname} lo que le falta"
    already = session.scalar(
        select(Activity.id).where(
            Activity.comite_id == comite.id,
            Activity.text == text,
            Activity.occurred_at >= datetime.combine(now.date(), datetime.min.time()),
        )
    )
    if already is None:
        session.add(Activity(comite_id=comite.id, actor=COPILOT_ACTOR, text=text, occurred_at=now))
        session.commit()
    return ReminderSent(family=family.display_name, sent=already is None)


def proposal_text(family: Family) -> str:
    return f"La directiva propuso a la familia {family.surname} en asamblea"


def composition_effect(families: list[Family]) -> CompositionEffect:
    above = sum(1 for f in families if not f.in_rsh_40)
    share_if_above = (above + 1) / (len(families) + 1)
    return CompositionEffect(
        active=len(families),
        above_rsh_40=above,
        percent_if_above=round(share_if_above * PERCENT),
        compliant_if_above=share_if_above <= MAX_SHARE_ABOVE_RSH_40,
    )


def waitlist_family(family: Family, effect: CompositionEffect, proposals: set[str]) -> WaitlistFamily:
    savings_ready = family.savings_uf >= MIN_SAVINGS_UF
    fits = family.in_rsh_40 or effect.compliant_if_above
    blocker = None if savings_ready else "Falta ahorro"
    if blocker is None and not fits:
        blocker = "Pasaría el 30%"
    return WaitlistFamily(
        id=family.id,
        name=family.display_name,
        in_rsh_40=family.in_rsh_40,
        savings_ready=savings_ready,
        can_enter=blocker is None,
        blocker=blocker,
        proposed=proposal_text(family) in proposals,
    )


def last_renounced(comite: Comite) -> Family | None:
    renounced = [f for f in comite.families if f.renounced_at is not None]
    return max(renounced, key=lambda f: f.renounced_at, default=None)


def build_waitlist(comite: Comite) -> list[WaitlistFamily]:
    effect = composition_effect(active_families(comite))
    proposals = {a.text for a in comite.activities if a.actor == DIRECTIVA_ACTOR}
    waiting = sorted((f for f in comite.families if f.waitlisted_at is not None), key=lambda f: f.waitlisted_at)
    return [waitlist_family(f, effect, proposals) for f in waiting]


def get_reemplazo(session: Session, slug: str, today: date) -> ComiteReemplazo:
    comite = get_comite(session, slug)
    renounced = last_renounced(comite)
    deadline = next((d for d in comite.deadlines if d.kind == DeadlineKind.REEMPLAZO), None)
    return ComiteReemplazo(
        slug=comite.slug,
        name=comite.name,
        renunciation=Renunciation(
            family_id=renounced.id, name=renounced.display_name, renounced_on=renounced.renounced_at.date()
        )
        if renounced
        else None,
        deadline=deadline_view(deadline, today) if deadline else None,
        requirements=REPLACEMENT_REQUIREMENTS,
        effect=composition_effect(active_families(comite)),
        waitlist=build_waitlist(comite),
    )


def propose(session: Session, slug: str, family_id: int, now: datetime) -> ProposalResult:
    """Record that the directiva takes this family to the assembly. The assembly approves; the EP files it."""
    comite, family = get_family(session, slug, family_id)
    entry = next((w for w in build_waitlist(comite) if w.id == family.id), None)
    if entry is None or not entry.can_enter:
        raise CannotEnterError(family_id)
    if not entry.proposed:
        session.add(Activity(comite_id=comite.id, actor=DIRECTIVA_ACTOR, text=proposal_text(family), occurred_at=now))
        session.commit()
    renounced = last_renounced(comite)
    return ProposalResult(family=family.display_name, replaces=renounced.display_name if renounced else None)
