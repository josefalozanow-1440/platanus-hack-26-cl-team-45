"""Read models for the Entidad Patrocinante screens (E1 panel, E2 observaciones, E3 carpeta)."""

from datetime import date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Activity, Comite, EntidadPatrocinante, Family, Observation
from app.models.domain import DeadlineKind, DocumentStatus
from app.schemas.ep import (
    Carpeta,
    Composition,
    DeadlineView,
    FamilyFolder,
    FolderCounts,
    ObservationCounts,
    ObservationsPage,
    ObservationView,
    Panel,
    PanelRow,
    ReminderResult,
)
from app.services.ep_deadlines import deadline_view

MONTHS_PER_YEAR = 12
PERCENT = 100
# Art. 1: at most 30% of the group may be above the most vulnerable 40% of the RSH.
MAX_SHARE_ABOVE_RSH_40 = 0.30
PANEL_DEADLINES = 2
# Legal terms the panel shows, most urgent kind first. Assemblies are meetings, not terms: E3 shows them.
PANEL_DEADLINE_ORDER = [
    DeadlineKind.OBSERVACIONES,
    DeadlineKind.PROYECTO,
    DeadlineKind.CALIFICACION,
    DeadlineKind.OBRAS,
    DeadlineKind.AHORRO,
    DeadlineKind.REEMPLAZO,
]
EP_ACTOR = "Equipo EP"


class ComiteNotFoundError(Exception):
    pass


class ObservationNotFoundError(Exception):
    pass


class NoDraftError(Exception):
    """The observation has no copilot draft to accept."""


def months_between(start: date, end: date) -> int:
    months = (end.year - start.year) * MONTHS_PER_YEAR + end.month - start.month
    return months - 1 if end.day < start.day else months


def active_families(comite: Comite) -> list[Family]:
    return [f for f in comite.families if f.renounced_at is None and f.waitlisted_at is None]


def statuses(family: Family) -> set[DocumentStatus]:
    return {document.status for document in family.documents}


def is_complete(family: Family) -> bool:
    return statuses(family) <= {DocumentStatus.LISTO, DocumentStatus.NO_APLICA}


def folder_counts(families: list[Family]) -> FolderCounts:
    sets = [statuses(family) for family in families]
    missing = sum(1 for s in sets if DocumentStatus.FALTA in s)
    expiring = sum(1 for s in sets if DocumentStatus.VENCE in s and DocumentStatus.FALTA not in s)
    complete = sum(1 for family in families if is_complete(family))
    return FolderCounts(complete=complete, missing=missing, expiring=expiring, total=len(families))


def latest_round(comite: Comite) -> list[Observation]:
    if not comite.observations:
        return []
    last = max(o.round for o in comite.observations)
    return [o for o in comite.observations if o.round == last]


def upcoming_deadlines(comite: Comite, today: date) -> list[DeadlineView]:
    return [deadline_view(d, today) for d in comite.deadlines if d.due_on >= today]


def panel_deadlines(comite: Comite, today: date) -> list[DeadlineView]:
    legal = [d for d in upcoming_deadlines(comite, today) if d.kind in PANEL_DEADLINE_ORDER]
    return sorted(legal, key=lambda d: PANEL_DEADLINE_ORDER.index(d.kind))


def assignee_label(observation: Observation) -> str | None:
    if observation.family is not None:
        return observation.family.display_name
    return observation.assignee_name


def panel_row(comite: Comite, today: date) -> PanelRow:
    observations = latest_round(comite)
    pending = [o for o in observations if o.answered_at is None]
    return PanelRow(
        slug=comite.slug,
        name=comite.name,
        stage=comite.stage,
        folders=folder_counts(active_families(comite)),
        deadlines=panel_deadlines(comite, today)[:PANEL_DEADLINES],
        observations=ObservationCounts(
            answered=len(observations) - len(pending),
            total=len(observations),
            pending_assignee=assignee_label(pending[0]) if pending else None,
            last_answered=observations[-1].description if observations and not pending else None,
        ),
        wait_months=months_between(comite.organized_on, today),
    )


def get_panel(session: Session, today: date) -> Panel:
    # shortcut: the demo has one EP and no login, so the panel shows the first one.
    ep = session.scalars(select(EntidadPatrocinante).order_by(EntidadPatrocinante.id)).first()
    comites = ep.comites if ep else []
    rows = [panel_row(comite, today) for comite in comites]
    return Panel(
        ep_name=ep.name if ep else "",
        comite_count=len(rows),
        family_count=sum(row.folders.total for row in rows),
        families_complete=sum(row.folders.complete for row in rows),
        critical_deadlines=sum(1 for comite in comites for d in panel_deadlines(comite, today) if d.critical),
        observations_answered=sum(row.observations.answered for row in rows),
        observations_total=sum(row.observations.total for row in rows),
        average_wait_months=round(sum(row.wait_months for row in rows) / len(rows)) if rows else 0,
        comites=rows,
    )


def get_comite(session: Session, slug: str) -> Comite:
    comite = session.scalars(select(Comite).where(Comite.slug == slug)).first()
    if comite is None:
        raise ComiteNotFoundError(slug)
    return comite


def observation_view(observation: Observation) -> ObservationView:
    return ObservationView(
        id=observation.id,
        number=observation.number,
        category=observation.category,
        description=observation.description,
        assignee_role=observation.assignee_role,
        assignee_name=observation.assignee_name,
        draft_answer=observation.draft_answer,
        draft_accepted_by=observation.draft_accepted_by,
        note=observation.note,
        answered=observation.answered_at is not None,
    )


def family_message(count: int, deadline: DeadlineView | None) -> str:
    noun = "observación" if count == 1 else "observaciones"
    until = f" La entidad tiene hasta el {deadline.due_on:%d-%m-%Y} para responder." if deadline else ""
    return f"El SERVIU envió {count} {noun}.{until}"


def get_observations(session: Session, slug: str, today: date) -> ObservationsPage:
    comite = get_comite(session, slug)
    observations = latest_round(comite)
    deadline = next(
        (deadline_view(d, today) for d in comite.deadlines if d.kind == DeadlineKind.OBSERVACIONES),
        None,
    )
    return ObservationsPage(
        slug=comite.slug,
        name=comite.name,
        round=observations[0].round if observations else 1,
        received_on=min((o.received_on for o in observations), default=None),
        deadline=deadline,
        observations=[observation_view(o) for o in observations],
        answered=sum(1 for o in observations if o.answered_at is not None),
        family_message=family_message(len(observations), deadline),
    )


def accept_draft(session: Session, observation_id: int, accepted_by: str, now: datetime) -> ObservationView:
    """A person accepts the copilot draft by hand; nothing is accepted by silence (L-05)."""
    observation = session.get(Observation, observation_id)
    if observation is None:
        raise ObservationNotFoundError(observation_id)
    if not observation.draft_answer:
        raise NoDraftError(observation_id)
    observation.draft_accepted_by = accepted_by
    observation.answered_at = now
    session.commit()
    return observation_view(observation)


def single_answer_text(session: Session, slug: str) -> str:
    """The answer package the EP files itself in the MINVU system. Comité never sends it to the SERVIU."""
    comite = get_comite(session, slug)
    lines = [f"Respuesta a observaciones del SERVIU · {comite.name}", ""]
    for o in latest_round(comite):
        lines.append(f"Observación {o.number}: {o.description}")
        lines.append(f"Respuesta: {o.draft_answer or 'pendiente'}")
        lines.append(f"Aceptada por: {o.draft_accepted_by}" if o.draft_accepted_by else "Aceptada por: nadie todavía")
        lines.append("")
    return "\n".join(lines)


def composition(families: list[Family]) -> Composition:
    in_rsh_40 = sum(1 for f in families if f.in_rsh_40)
    total = len(families)
    above = (total - in_rsh_40) / total if total else 0
    return Composition(
        in_rsh_40=in_rsh_40,
        total=total,
        share_percent=round(in_rsh_40 * PERCENT / total) if total else 0,
        compliant=above <= MAX_SHARE_ABOVE_RSH_40,
    )


def get_carpeta(session: Session, slug: str, today: date) -> Carpeta:
    comite = get_comite(session, slug)
    families = active_families(comite)
    upcoming = upcoming_deadlines(comite, today)
    # Incomplete carpetas go first: that is what the EP has to chase.
    ordered = sorted(families, key=is_complete)
    folders = [
        FamilyFolder(id=f.id, name=f.display_name, documents={d.kind: d.status for d in f.documents}) for f in ordered
    ]
    return Carpeta(
        slug=comite.slug,
        name=comite.name,
        stage=comite.stage,
        family_count=len(families),
        missing=sum(1 for f in families if not is_complete(f)),
        deadline=next((d for d in upcoming if d.kind != DeadlineKind.ASAMBLEA), None),
        families=folders,
        composition=composition(families),
        next_assembly=next((d for d in upcoming if d.kind == DeadlineKind.ASAMBLEA), None),
    )


def request_reminders(session: Session, slug: str, now: datetime) -> ReminderResult:
    """Log that the EP asked the copilot to remind families with missing documents. Sending is the channel's job."""
    comite = get_comite(session, slug)
    missing = [f for f in active_families(comite) if not is_complete(f)]
    if missing:
        session.add(
            Activity(
                comite_id=comite.id,
                actor=EP_ACTOR,
                text=f"Pidió recordar sus documentos faltantes a {len(missing)} familias.",
                occurred_at=now,
            )
        )
        session.commit()
    return ReminderResult(families=len(missing))
