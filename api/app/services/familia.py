"""The family's view of its carpeta and its comité (screens F0 to F4)."""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Comite, Document, Family, Member, Signature
from app.models.domain import DeadlineKind, DocumentKind, DocumentStatus, Stage
from app.schemas.familia import (
    ActivityItem,
    CarpetaProgress,
    CarpetaResponse,
    ComiteProgress,
    DocumentItem,
    FamilyHeader,
    FirmaResponse,
    GrupoResponse,
    PendingAction,
    Person,
    PrivacyResponse,
    PrivacySettings,
    SavingsCutoff,
    SignerItem,
    StepItem,
    StepStatus,
)
from app.services.dates import business_days_left, days_left, elapsed

# shortcut: there is no login yet, so "the family" is always the Rojas family of Los Aromos.
DEMO_COMITE_SLUG = "los-aromos"
DEMO_FAMILY_SURNAME = "Rojas"
ADULT_AGE = 18
REQUIRED_SAVINGS_UF = Decimal(10)
DOCUMENTS_PER_CARPETA = len(DocumentKind)

DOCUMENT_NAMES: dict[DocumentKind, tuple[str, str]] = {
    DocumentKind.RSH: ("RSH", "Registro Social de Hogares"),
    DocumentKind.CEDULA: ("CI", "Cédula de identidad"),
    DocumentKind.DJ49_1: ("DJ1", "Núcleo familiar (DJ49-1)"),
    DocumentKind.DJ49_2: ("DJ2", "Declaración de postulación"),
    DocumentKind.DJ49_3: ("DJ3", "Mandato de ahorro"),
    DocumentKind.AHORRO: ("UF", "Ahorro mínimo 10 UF"),
    DocumentKind.COMUNIDAD: ("COM", "Derechos en comunidad"),
}

STEP_NAMES: dict[Stage, str] = {
    Stage.ORGANIZACION: "Organización y carpetas",
    Stage.PROYECTO: "Proyecto y terreno",
    Stage.REVISION_SERVIU: "Revisión del SERVIU",
    Stage.CALIFICADO: "Llamado y selección",
    Stage.SUBSIDIO_ASIGNADO: "Obra y recepción",
    Stage.ENTREGA: "Escritura y entrega",
}
# Stages run by the constructora, the municipality and the SERVIU: the family only follows them.
FOLLOWED_STAGES = {Stage.SUBSIDIO_ASIGNADO, Stage.ENTREGA}

STATUS_LABELS: dict[DocumentStatus, str] = {
    DocumentStatus.LISTO: "Lista",
    DocumentStatus.FALTA: "Falta",
    DocumentStatus.VENCE: "Por vencer",
    DocumentStatus.NO_APLICA: "No aplica",
}


class FamilyNotFoundError(Exception):
    pass


class NothingToSignError(Exception):
    pass


def demo_family(session: Session) -> Family:
    family = session.scalar(
        select(Family)
        .join(Comite)
        .where(Comite.slug == DEMO_COMITE_SLUG, Family.surname == DEMO_FAMILY_SURNAME, Family.renounced_at.is_(None))
    )
    if family is None:
        raise FamilyNotFoundError
    return family


def initials(name: str) -> str:
    return "".join(word[0] for word in name.split()[:2]).upper()


def is_active(family: Family) -> bool:
    return family.renounced_at is None and family.waitlisted_at is None


def is_complete(family: Family) -> bool:
    return all(d.status in {DocumentStatus.LISTO, DocumentStatus.NO_APLICA} for d in family.documents)


def carpeta_progress(documents: list[Document]) -> CarpetaProgress:
    statuses = [d.status for d in documents]
    listos = statuses.count(DocumentStatus.LISTO)
    return CarpetaProgress(
        ready=listos + statuses.count(DocumentStatus.NO_APLICA),
        total=DOCUMENTS_PER_CARPETA,
        listos=listos,
        por_vencer=statuses.count(DocumentStatus.VENCE),
        faltan=statuses.count(DocumentStatus.FALTA),
    )


def comite_progress(comite: Comite) -> ComiteProgress:
    active = [f for f in comite.families if is_active(f)]
    return ComiteProgress(complete=sum(is_complete(f) for f in active), total=len(active))


def format_uf(amount: Decimal) -> str:
    return f"{amount.normalize():f}".replace(".", ",")


def status_label(document: Document) -> str:
    if document.status == DocumentStatus.LISTO:
        return STATUS_LABELS[DocumentStatus.LISTO]
    if any(s.signed_at is None for s in document.signatures):
        return "Falta firma"
    if document.kind == DocumentKind.AHORRO:
        missing = REQUIRED_SAVINGS_UF - document.family.savings_uf
        if missing > 0:
            return f"Faltan {format_uf(missing)} UF"
    return STATUS_LABELS[document.status]


def pending_signature(family: Family) -> Signature | None:
    return next((s for d in family.documents for s in d.signatures if s.signed_at is None), None)


def _header(family: Family) -> FamilyHeader:
    return FamilyHeader(
        family_name=family.display_name,
        contact_name=family.contact_name,
        comite_name=family.comite.name,
        member_count=len(family.members),
    )


def _signers(family: Family) -> list[SignerItem]:
    dj49_1 = next((d for d in family.documents if d.kind == DocumentKind.DJ49_1), None)
    signatures = dj49_1.signatures if dj49_1 else []
    return [SignerItem(first_name=s.member.first_name, signed=s.signed_at is not None) for s in signatures]


def _savings_cutoff(family: Family, today: date) -> SavingsCutoff | None:
    deadline = next((d for d in family.comite.deadlines if d.kind == DeadlineKind.AHORRO), None)
    if deadline is None:
        return None
    return SavingsCutoff(
        due_on=deadline.due_on,
        days_left=days_left(today, deadline.due_on),
        savings_uf=family.savings_uf,
        required_uf=REQUIRED_SAVINGS_UF,
    )


def _pending_action(family: Family) -> PendingAction | None:
    signature = pending_signature(family)
    if signature is None:
        return None
    name = signature.member.first_name
    return PendingAction(
        title=f"Falta la firma de {name} en la declaración de núcleo familiar",
        body=f"{name} puede firmar con su ClaveÚnica desde el enlace, sin imprimir nada.",
        member_name=name,
    )


def carpeta(family: Family, today: date) -> CarpetaResponse:
    adults = [m for m in family.members if m.age >= ADULT_AGE]
    others = [Person(name="Entidad Patrocinante", initials="EP"), Person(name="Copiloto", initials="C")]
    if family.companion_name:
        others.insert(0, Person(name=family.companion_name, initials=initials(family.companion_name)))
    return CarpetaResponse(
        **_header(family).model_dump(),
        progress=carpeta_progress(family.documents),
        pending_action=_pending_action(family),
        documents=[
            DocumentItem(
                kind=d.kind,
                code=DOCUMENT_NAMES[d.kind][0],
                name=DOCUMENT_NAMES[d.kind][1],
                detail=d.detail,
                status=d.status,
                status_label=status_label(d),
            )
            for d in family.documents
            if d.status != DocumentStatus.NO_APLICA
        ],
        family_access=[
            Person(name=m.first_name, initials=initials(f"{m.first_name} {family.surname}")) for m in adults
        ],
        others_access=others,
        dj49_1_signers=_signers(family),
        savings_cutoff=_savings_cutoff(family, today),
        comite_progress=comite_progress(family.comite),
    )


def privacy(family: Family) -> PrivacyResponse:
    return PrivacyResponse(
        **_header(family).model_dump(),
        ep_name=family.comite.ep.name,
        progress=carpeta_progress(family.documents),
        settings=PrivacySettings(
            shares_with_comite=family.shares_with_comite,
            shares_with_ep=family.shares_with_ep,
            shares_sensitive=family.shares_sensitive,
        ),
    )


def update_privacy(session: Session, family: Family, settings: PrivacySettings) -> PrivacyResponse:
    family.shares_with_comite = settings.shares_with_comite
    family.shares_with_ep = settings.shares_with_ep
    family.shares_sensitive = settings.shares_sensitive
    session.flush()
    return privacy(family)


def step_status(stage: Stage, current: Stage) -> StepStatus:
    order = list(Stage)
    if order.index(stage) < order.index(current):
        return StepStatus.LISTO
    if stage == current:
        return StepStatus.AHORA
    return StepStatus.SEGUIMIENTO if stage in FOLLOWED_STAGES else StepStatus.PENDIENTE


def grupo(family: Family, today: date) -> GrupoResponse:
    comite = family.comite
    pending = [o for o in comite.observations if o.answered_at is None]
    deadline = next((d for d in comite.deadlines if d.kind == DeadlineKind.OBSERVACIONES), None)
    wait = elapsed(comite.organized_on, today)
    return GrupoResponse(
        comite_name=comite.name,
        family_count=sum(is_active(f) for f in comite.families),
        stage_number=list(Stage).index(comite.stage) + 1,
        stage_total=len(Stage),
        stage_name=STEP_NAMES[comite.stage],
        observations_total=len(comite.observations),
        observations_for_family=sum(o.family_id == family.id for o in pending),
        business_days_left=business_days_left(today, deadline.due_on) if deadline else None,
        steps=[StepItem(stage=s, name=STEP_NAMES[s], status=step_status(s, comite.stage)) for s in Stage],
        wait_years=wait.years,
        wait_months=wait.months,
        activities=[
            ActivityItem(actor=a.actor, initials=initials(a.actor), text=a.text, occurred_at=a.occurred_at)
            for a in comite.activities
        ],
    )


def _signature_member(family: Family) -> Member:
    signature = pending_signature(family)
    if signature is not None:
        return signature.member
    signed = [s for d in family.documents for s in d.signatures]
    if not signed:
        raise NothingToSignError
    # Everyone signed: keep showing the last signer so the screen still makes sense.
    return max(signed, key=lambda s: s.signed_at or datetime.min).member


def firma(family: Family) -> FirmaResponse:
    member = _signature_member(family)
    observation = next((o for o in family.comite.observations if o.family_id == family.id), None)
    return FirmaResponse(
        signer_name=f"{member.first_name} {family.surname}",
        signer_age=member.age,
        requested_by=family.contact_name or family.display_name,
        comite_name=family.comite.name,
        lives_with=[m.first_name for m in family.members if m.id != member.id],
        signers=_signers(family),
        already_signed=pending_signature(family) is None,
        observation_number=observation.number if observation else None,
        family_count=sum(is_active(f) for f in family.comite.families),
    )


def sign(session: Session, family: Family, now: datetime) -> FirmaResponse:
    """Record the pending signature; the document is ready once every adult signed."""
    signature = pending_signature(family)
    if signature is None:
        raise NothingToSignError
    signature.signed_at = now
    document = signature.document
    if all(s.signed_at is not None for s in document.signatures):
        document.status = DocumentStatus.LISTO
        document.detail = f"Firmada por {len(document.signatures)} de {len(document.signatures)} adultos"
    session.flush()
    return firma(family)


def unsign(session: Session, family: Family) -> FirmaResponse:
    """Demo only: undo the latest signature so the pitch can show the signing again."""
    signed = [s for d in family.documents for s in d.signatures if s.signed_at is not None]
    if not signed:
        raise NothingToSignError
    signature = max(signed, key=lambda s: s.signed_at or datetime.min)
    signature.signed_at = None
    document = signature.document
    done = sum(s.signed_at is not None for s in document.signatures)
    document.status = DocumentStatus.FALTA
    document.detail = f"Firmada por {done} de {len(document.signatures)} adultos"
    session.flush()
    return firma(family)
