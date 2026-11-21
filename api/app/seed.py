"""Fictitious demo data from the Figma "MVP v2". Idempotent: does nothing if the EP already exists.

Run with `uv run python -m app.seed` (the API container runs it after migrating).
"""

import logging
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Activity, Comite, Deadline, Document, EntidadPatrocinante, Family, Member, Observation, Signature
from app.models.domain import DeadlineKind, DocumentKind, DocumentStatus, ObservationCategory, Stage

logger = logging.getLogger(__name__)

EP_NAME = "Entidad Patrocinante Sur"
MIN_SAVINGS_UF = Decimal(10)
OBSERVATIONS_RECEIVED_ON = date(2026, 11, 12)

DEFAULT_DETAILS: dict[DocumentKind, str] = {
    DocumentKind.RSH: "Vigente · 12 meses de ingresos",
    DocumentKind.CEDULA: "Vigente",
    DocumentKind.DJ49_1: "Firmada por todos los adultos",
    DocumentKind.DJ49_2: "Firmada",
    DocumentKind.DJ49_3: "Banco con convenio MINVU",
    DocumentKind.AHORRO: "10 UF depositadas",
    DocumentKind.COMUNIDAD: "No aplica",
}

SURNAMES = (
    "Muñoz González Díaz Soto Contreras Silva Martínez Sepúlveda Morales Rodríguez López Fuentes Hernández "
    "Torres Araya Flores Espinoza Valenzuela Castillo Tapia Reyes Gutiérrez Castro Pizarro Álvarez Vásquez "
    "Sánchez Fernández Ramírez Carrasco Gómez Cortés Herrera Núñez Jara Vergara Rivera Figueroa Riquelme "
    "García Miranda Bravo Vera Molina Vega Campos Sandoval Orellana Zúñiga Olivares Alarcón Gallardo Ortiz "
    "Garrido Salazar Guzmán Henríquez Saavedra Navarro Aguilera Parra Romero Aravena Pérez Vidal Godoy León "
    "Paredes Cáceres Ibarra Rubio Toro Mella Lagos Peña Ulloa Medina Bustos"
).split()


@dataclass
class FamilySpec:
    surname: str
    docs: dict[DocumentKind, tuple[DocumentStatus, str | None]] = field(default_factory=dict)
    savings_uf: Decimal = Decimal("10.5")
    in_rsh_40: bool = True
    companion_name: str | None = None
    contact_name: str | None = None
    renounced: bool = False
    waitlisted: bool = False


@dataclass
class ComiteSpec:
    slug: str
    name: str
    stage: Stage
    organized_on: date
    size: int
    above_rsh_40: int
    named: list[FamilySpec]
    # Families generated after the named ones that are not complete (one missing document each).
    incomplete_generated: int = 0


F = DocumentStatus.FALTA
V = DocumentStatus.VENCE
L = DocumentStatus.LISTO

LOS_AROMOS = ComiteSpec(
    slug="los-aromos",
    name="Comité Los Aromos",
    stage=Stage.REVISION_SERVIU,
    organized_on=date(2023, 7, 21),
    size=40,
    above_rsh_40=11,
    named=[
        FamilySpec(
            "Rojas",
            docs={
                DocumentKind.CEDULA: (L, "Vence 03-02-2027"),
                DocumentKind.DJ49_1: (F, "Firmada por 2 de 3 adultos"),
                DocumentKind.DJ49_2: (L, "Firmada 10-11-2026"),
                DocumentKind.AHORRO: (V, "Hoy 9,5 UF · corte 31-12"),
                DocumentKind.COMUNIDAD: (L, "Certificado de derechos en comunidad"),
            },
            savings_uf=Decimal("9.5"),
            companion_name="Valentina",
            contact_name="Marta Rojas",
        ),
        FamilySpec("Pérez", docs={DocumentKind.DJ49_3: (F, "Falta mandato de ahorro")}, contact_name="Luis Pérez"),
        FamilySpec(
            "Herrera",
            docs={
                DocumentKind.RSH: (F, "Sin RSH vigente"),
                DocumentKind.DJ49_1: (F, "Sin firmar"),
                DocumentKind.DJ49_2: (F, "Sin firmar"),
            },
            companion_name="Jorge",
        ),
        FamilySpec(
            "Castro",
            docs={DocumentKind.RSH: (F, "RSH sin actualizar"), DocumentKind.CEDULA: (V, "Vence 15-12-2026")},
            companion_name="Ana",
        ),
        FamilySpec("Soto", docs={DocumentKind.CEDULA: (V, "Vence 20-12-2026")}),
        FamilySpec("Díaz", docs={DocumentKind.AHORRO: (V, "Hoy 8 UF · corte 31-12")}, savings_uf=Decimal(8)),
        FamilySpec("Muñoz", contact_name="Ana Muñoz"),
        FamilySpec("Vera", in_rsh_40=False, renounced=True),
        FamilySpec(
            "Fuentes",
            docs={DocumentKind.AHORRO: (F, "Ahorro 7 UF")},
            savings_uf=Decimal(7),
            waitlisted=True,
        ),
        FamilySpec("Tapia", savings_uf=Decimal(10), waitlisted=True),
    ],
)

VILLA_NUEVA = ComiteSpec(
    slug="villa-nueva",
    name="Comité Villa Nueva",
    stage=Stage.ORGANIZACION,
    organized_on=date(2024, 10, 21),
    size=32,
    above_rsh_40=9,
    named=[
        FamilySpec("Araya"),
        FamilySpec("Bravo", docs={DocumentKind.CEDULA: (V, None), DocumentKind.DJ49_1: (F, None)}),
        FamilySpec(
            "Castro",
            docs={DocumentKind.RSH: (F, None), DocumentKind.DJ49_3: (F, None), DocumentKind.AHORRO: (V, None)},
        ),
        FamilySpec("Godoy", docs={DocumentKind.COMUNIDAD: (L, "Certificado de derechos en comunidad")}),
        FamilySpec(
            "Herrera",
            docs={
                DocumentKind.DJ49_1: (F, None),
                DocumentKind.DJ49_2: (F, None),
                DocumentKind.DJ49_3: (F, None),
                DocumentKind.AHORRO: (F, None),
            },
        ),
        FamilySpec("Jara", docs={DocumentKind.RSH: (V, None)}),
        FamilySpec("León", docs={DocumentKind.AHORRO: (V, None)}),
    ],
    incomplete_generated=9,
)

LAS_PALMAS = ComiteSpec(
    slug="las-palmas",
    name="Comité Las Palmas",
    stage=Stage.CALIFICADO,
    organized_on=date(2022, 4, 21),
    size=40,
    above_rsh_40=12,
    named=[],
)

LOS_ROBLES = ComiteSpec(
    slug="los-robles",
    name="Comité Los Robles",
    stage=Stage.SUBSIDIO_ASIGNADO,
    organized_on=date(2021, 9, 21),
    size=36,
    above_rsh_40=10,
    named=[],
)

COMITES = [LOS_AROMOS, VILLA_NUEVA, LAS_PALMAS, LOS_ROBLES]

# Kinds that rotate as the missing document of generated incomplete families.
ROTATING_MISSING = [DocumentKind.RSH, DocumentKind.DJ49_1, DocumentKind.DJ49_3, DocumentKind.AHORRO]


def _generated_specs(spec: ComiteSpec) -> list[FamilySpec]:
    taken = {f.surname for f in spec.named}
    active_named = sum(1 for f in spec.named if not (f.renounced or f.waitlisted))
    pool = [s for s in SURNAMES if s not in taken]
    generated = []
    for index, surname in enumerate(pool[: spec.size - active_named]):
        missing = ROTATING_MISSING[index % len(ROTATING_MISSING)]
        docs = {missing: (F, None)} if index < spec.incomplete_generated else {}
        generated.append(FamilySpec(surname, docs=docs, savings_uf=Decimal(10 + index % 3)))
    return generated


def build_family(comite: Comite, spec: FamilySpec, now: datetime) -> Family:
    family = Family(
        surname=spec.surname,
        contact_name=spec.contact_name,
        in_rsh_40=spec.in_rsh_40,
        savings_uf=spec.savings_uf,
        companion_name=spec.companion_name,
        renounced_at=now - timedelta(days=2) if spec.renounced else None,
        waitlisted_at=now - timedelta(days=60) if spec.waitlisted else None,
    )
    for kind in DocumentKind:
        default_status = DocumentStatus.NO_APLICA if kind == DocumentKind.COMUNIDAD else DocumentStatus.LISTO
        status, detail = spec.docs.get(kind, (default_status, None))
        family.documents.append(Document(kind=kind, status=status, detail=detail or DEFAULT_DETAILS[kind]))
    comite.families.append(family)
    return family


def seed_comite(session: Session, ep: EntidadPatrocinante, spec: ComiteSpec, now: datetime) -> Comite:
    comite = Comite(ep=ep, slug=spec.slug, name=spec.name, stage=spec.stage, organized_on=spec.organized_on)
    session.add(comite)
    for spec_family in spec.named + _generated_specs(spec):
        build_family(comite, spec_family, now)
    # Mark the last generated families as above the 40% of the RSH to reach the composition.
    active = [f for f in comite.families if f.renounced_at is None and f.waitlisted_at is None]
    already_above = sum(1 for f in active if not f.in_rsh_40)
    for family in active[len(active) - (spec.above_rsh_40 - already_above) :]:
        family.in_rsh_40 = False
    return comite


def seed_rojas(rojas: Family, now: datetime) -> None:
    marta, pedro, sofia, tomas = (
        Member(first_name="Marta", age=44),
        Member(first_name="Pedro", age=19),
        Member(first_name="Sofía", age=22),
        Member(first_name="Tomás", age=9),
    )
    rojas.members.extend([marta, pedro, sofia, tomas])
    dj49_1 = next(d for d in rojas.documents if d.kind == DocumentKind.DJ49_1)
    dj49_1.signatures.extend(
        [
            Signature(member=marta, signed_at=now - timedelta(days=11)),
            Signature(member=sofia, signed_at=now - timedelta(days=10)),
            Signature(member=pedro, signed_at=None),
        ]
    )


def _seed_aromos_extras(session: Session, aromos: Comite, now: datetime) -> None:
    rojas = next(f for f in aromos.families if f.surname == "Rojas")
    seed_rojas(rojas, now)
    session.add_all(
        [
            Deadline(
                comite=aromos,
                kind=DeadlineKind.OBSERVACIONES,
                title="Responder observaciones del SERVIU",
                starts_on=OBSERVATIONS_RECEIVED_ON,
                due_on=date(2027, 2, 5),
                business_days=True,
                article="art. 13 inc. 3",
                note="Se responden todas juntas, en un solo acto.",
            ),
            Deadline(
                comite=aromos,
                kind=DeadlineKind.AHORRO,
                title="Corte del ahorro",
                due_on=date(2026, 12, 31),
                article="art. 39",
                note="Ese día el banco certifica el ahorro. Cada familia necesita 10 UF.",
            ),
            Deadline(
                comite=aromos,
                kind=DeadlineKind.REEMPLAZO,
                title="Último día para reemplazar",
                due_on=date(2027, 3, 13),
                article="arts. 14 y 20",
                note=(
                    "Día hábil anterior a la fecha máxima de calificación del llamado. "
                    "Durante la selección no se puede reemplazar."
                ),
            ),
            Observation(
                comite=aromos,
                number=1,
                category=ObservationCategory.TECNICA,
                description="Plano de loteo: falta cota de nivel en el lote 12.",
                received_on=OBSERVATIONS_RECEIVED_ON,
                assignee_role="Arquitecta",
                assignee_name="Carla Ibáñez",
                draft_answer="Se adjunta plano de loteo corregido con la cota de nivel del lote 12.",
                draft_accepted_by="Carla Ibáñez",
                answered_at=now - timedelta(days=3),
            ),
            Observation(
                comite=aromos,
                number=2,
                category=ObservationCategory.PRESUPUESTO,
                description="Partida de urbanización sin respaldo de cotización.",
                received_on=OBSERVATIONS_RECEIVED_ON,
                assignee_role="Equipo EP",
                assignee_name="Jorge Lagos",
                draft_answer="Se adjuntan tres cotizaciones para la partida de urbanización.",
                draft_accepted_by="Jorge Lagos",
                answered_at=now - timedelta(days=1),
            ),
            Observation(
                comite=aromos,
                number=3,
                category=ObservationCategory.FAMILIAS,
                description="Familia Rojas: DJ49-1 sin la firma de un integrante mayor de 18 años.",
                received_on=OBSERVATIONS_RECEIVED_ON,
                assignee_role="Familia Rojas",
                assignee_name="Marta Rojas",
                family=rojas,
                draft_answer=(
                    "Se adjunta DJ49-1 firmada por los 3 integrantes mayores de 18 años del núcleo familiar, "
                    "validada con ClaveÚnica."
                ),
                note=(
                    "Recordatorio enviado por chat a la familia hoy 10:12. Pedro puede firmar con ClaveÚnica. "
                    "Valentina (comité) se ofreció a acompañarla el jueves."
                ),
            ),
            Activity(
                comite=aromos,
                actor="Copiloto",
                text="Copiloto avisó a 6 familias que el ahorro se certifica el 31-12 (art. 39)",
                occurred_at=now - timedelta(minutes=5),
            ),
            Activity(
                comite=aromos,
                actor="Ana Muñoz",
                text="Ana Muñoz completó su carpeta",
                occurred_at=now - timedelta(minutes=20),
            ),
            Activity(
                comite=aromos,
                actor="Entidad Patrocinante",
                text="La entidad respondió la observación 2",
                occurred_at=now - timedelta(days=1),
            ),
            Activity(
                comite=aromos,
                actor="Valentina Soto",
                text="Valentina se ofreció a acompañar a la familia Pérez",
                occurred_at=now - timedelta(days=1, hours=2),
            ),
        ]
    )


def _seed_other_deadlines(session: Session, villa: Comite, palmas: Comite, robles: Comite, now: datetime) -> None:
    session.add_all(
        [
            Deadline(
                comite=villa,
                kind=DeadlineKind.PROYECTO,
                title="Ingresar el proyecto al Banco de Proyectos",
                starts_on=date(2026, 7, 1),
                due_on=date(2026, 12, 28),
                article="art. 12",
                note="Si el proyecto no se ingresa antes del 28-12-2026, el sistema borra los antecedentes.",
            ),
            Deadline(
                comite=villa,
                kind=DeadlineKind.ASAMBLEA,
                title="Asamblea: aprobación del plan social",
                due_on=date(2026, 11, 28),
                article="Res. 1.875",
                note="Asistencia mínima: 70% con acta firmada.",
            ),
            Deadline(
                comite=palmas,
                kind=DeadlineKind.CALIFICACION,
                title="Llamado: calificación",
                due_on=date(2027, 3, 14),
                article="art. 14",
            ),
            Deadline(
                comite=palmas,
                kind=DeadlineKind.REEMPLAZO,
                title="Último reemplazo",
                due_on=date(2027, 3, 13),
                article="arts. 14 y 20",
            ),
            Deadline(
                comite=robles,
                kind=DeadlineKind.OBRAS,
                title="Inicio de obras",
                starts_on=date(2026, 9, 23),
                due_on=date(2026, 12, 22),
                article="art. 57",
                note="Permiso DOM en trámite: el agente lo sigue y avisa, no lo resuelve.",
            ),
            Observation(
                comite=robles,
                number=1,
                category=ObservationCategory.FAMILIAS,
                description="Reemplazo de 1 familia (máx. 20%, art. 57).",
                received_on=date(2026, 10, 2),
                assignee_role="Equipo EP",
                assignee_name="Jorge Lagos",
                answered_at=now - timedelta(days=20),
            ),
        ]
    )


def seed(session: Session) -> bool:
    """Load the demo data. Returns False when it was already there."""
    if session.scalar(select(EntidadPatrocinante).where(EntidadPatrocinante.name == EP_NAME)):
        return False
    now = datetime.now()
    ep = EntidadPatrocinante(name=EP_NAME)
    session.add(ep)
    aromos, villa, palmas, robles = (seed_comite(session, ep, spec, now) for spec in COMITES)
    _seed_aromos_extras(session, aromos, now)
    _seed_other_deadlines(session, villa, palmas, robles, now)
    session.flush()
    return True


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    with SessionLocal() as db_session:
        created = seed(db_session)
        db_session.commit()
    logger.info("Seed %s", "loaded" if created else "already present")
