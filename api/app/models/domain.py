"""Domain of a DS49 colectivo: an EP sponsors comités, a comité groups families, a family keeps a carpeta."""

from datetime import date, datetime
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import Enum, ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _enum(enum_class: type[StrEnum]) -> Enum:
    # Store the enum value (e.g. "dj49_1"), not its Python name.
    return Enum(enum_class, values_callable=lambda members: [m.value for m in members], native_enum=False, length=32)


class Stage(StrEnum):
    """The six stages of a comité, in order (F3 'El camino del grupo')."""

    ORGANIZACION = "organizacion"
    PROYECTO = "proyecto"
    REVISION_SERVIU = "revision_serviu"
    CALIFICADO = "calificado"
    SUBSIDIO_ASIGNADO = "subsidio_asignado"
    ENTREGA = "entrega"


class DocumentKind(StrEnum):
    RSH = "rsh"
    CEDULA = "cedula"
    DJ49_1 = "dj49_1"
    DJ49_2 = "dj49_2"
    DJ49_3 = "dj49_3"
    AHORRO = "ahorro"
    COMUNIDAD = "comunidad"


class DocumentStatus(StrEnum):
    LISTO = "listo"
    FALTA = "falta"
    VENCE = "vence"
    NO_APLICA = "no_aplica"


class DeadlineKind(StrEnum):
    OBSERVACIONES = "observaciones"
    PROYECTO = "proyecto"
    CALIFICACION = "calificacion"
    REEMPLAZO = "reemplazo"
    OBRAS = "obras"
    AHORRO = "ahorro"
    ASAMBLEA = "asamblea"


class ObservationCategory(StrEnum):
    TECNICA = "tecnica"
    PRESUPUESTO = "presupuesto"
    FAMILIAS = "familias"


class EntidadPatrocinante(Base):
    __tablename__ = "entidades_patrocinantes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)

    comites: Mapped[list["Comite"]] = relationship(back_populates="ep", order_by="Comite.id")


class Comite(Base):
    __tablename__ = "comites"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(60), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    ep_id: Mapped[int] = mapped_column(ForeignKey("entidades_patrocinantes.id"))
    stage: Mapped[Stage] = mapped_column(_enum(Stage))
    organized_on: Mapped[date]

    ep: Mapped[EntidadPatrocinante] = relationship(back_populates="comites")
    families: Mapped[list["Family"]] = relationship(back_populates="comite", order_by="Family.id")
    deadlines: Mapped[list["Deadline"]] = relationship(back_populates="comite", order_by="Deadline.due_on")
    observations: Mapped[list["Observation"]] = relationship(back_populates="comite", order_by="Observation.number")
    activities: Mapped[list["Activity"]] = relationship(back_populates="comite", order_by="Activity.occurred_at.desc()")


class Family(Base):
    """A family in a comité. Active means not renounced and not on the waiting list."""

    __tablename__ = "families"

    id: Mapped[int] = mapped_column(primary_key=True)
    comite_id: Mapped[int] = mapped_column(ForeignKey("comites.id"))
    surname: Mapped[str] = mapped_column(String(80))
    contact_name: Mapped[str | None] = mapped_column(String(120))
    # True when the family is in the most vulnerable 40% of the RSH (composition rule, art. 1).
    in_rsh_40: Mapped[bool] = mapped_column(default=True)
    savings_uf: Mapped[Decimal] = mapped_column(Numeric(5, 1), default=Decimal(0))
    companion_name: Mapped[str | None] = mapped_column(String(80))
    # F0 consent toggles (Ley 21.719): who sees the carpeta.
    shares_with_comite: Mapped[bool] = mapped_column(default=True)
    shares_with_ep: Mapped[bool] = mapped_column(default=True)
    shares_sensitive: Mapped[bool] = mapped_column(default=False)
    renounced_at: Mapped[datetime | None]
    waitlisted_at: Mapped[datetime | None]

    comite: Mapped[Comite] = relationship(back_populates="families")
    members: Mapped[list["Member"]] = relationship(back_populates="family", order_by="Member.id")
    documents: Mapped[list["Document"]] = relationship(back_populates="family", order_by="Document.id")

    @property
    def display_name(self) -> str:
        return f"Familia {self.surname}"


class Member(Base):
    __tablename__ = "members"

    id: Mapped[int] = mapped_column(primary_key=True)
    family_id: Mapped[int] = mapped_column(ForeignKey("families.id"))
    first_name: Mapped[str] = mapped_column(String(80))
    age: Mapped[int]

    family: Mapped[Family] = relationship(back_populates="members")


class Document(Base):
    __tablename__ = "documents"
    __table_args__ = (UniqueConstraint("family_id", "kind"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    family_id: Mapped[int] = mapped_column(ForeignKey("families.id"))
    kind: Mapped[DocumentKind] = mapped_column(_enum(DocumentKind))
    status: Mapped[DocumentStatus] = mapped_column(_enum(DocumentStatus))
    # Short line under the document name, e.g. "Vence 03-02-2027" or "Banco con convenio MINVU".
    detail: Mapped[str | None] = mapped_column(String(200))

    family: Mapped[Family] = relationship(back_populates="documents")
    signatures: Mapped[list["Signature"]] = relationship(back_populates="document", order_by="Signature.id")


class Signature(Base):
    """An adult that must sign a document (DJ49-1). Pending while signed_at is null."""

    __tablename__ = "signatures"
    __table_args__ = (UniqueConstraint("document_id", "member_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id"))
    member_id: Mapped[int] = mapped_column(ForeignKey("members.id"))
    signed_at: Mapped[datetime | None]

    document: Mapped[Document] = relationship(back_populates="signatures")
    member: Mapped[Member] = relationship()


class Deadline(Base):
    __tablename__ = "deadlines"

    id: Mapped[int] = mapped_column(primary_key=True)
    comite_id: Mapped[int] = mapped_column(ForeignKey("comites.id"))
    kind: Mapped[DeadlineKind] = mapped_column(_enum(DeadlineKind))
    title: Mapped[str] = mapped_column(String(160))
    # When the term started; with due_on it gives "quedan X de Y días".
    starts_on: Mapped[date | None]
    due_on: Mapped[date]
    business_days: Mapped[bool] = mapped_column(default=False)
    article: Mapped[str | None] = mapped_column(String(60))
    note: Mapped[str | None] = mapped_column(String(300))

    comite: Mapped[Comite] = relationship(back_populates="deadlines")


class Observation(Base):
    """An observation from the SERVIU on a comité's project. Pending while answered_at is null."""

    __tablename__ = "observations"
    __table_args__ = (UniqueConstraint("comite_id", "round", "number"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    comite_id: Mapped[int] = mapped_column(ForeignKey("comites.id"))
    round: Mapped[int] = mapped_column(default=1)
    number: Mapped[int]
    category: Mapped[ObservationCategory] = mapped_column(_enum(ObservationCategory))
    description: Mapped[str] = mapped_column(String(300))
    received_on: Mapped[date]
    assignee_role: Mapped[str | None] = mapped_column(String(80))
    assignee_name: Mapped[str | None] = mapped_column(String(120))
    family_id: Mapped[int | None] = mapped_column(ForeignKey("families.id"))
    draft_answer: Mapped[str | None] = mapped_column(String(600))
    draft_accepted_by: Mapped[str | None] = mapped_column(String(120))
    note: Mapped[str | None] = mapped_column(String(300))
    answered_at: Mapped[datetime | None]

    comite: Mapped[Comite] = relationship(back_populates="observations")
    family: Mapped[Family | None] = relationship()


class Activity(Base):
    """One line of the comité's activity feed (F3)."""

    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True)
    comite_id: Mapped[int] = mapped_column(ForeignKey("comites.id"))
    actor: Mapped[str] = mapped_column(String(80))
    text: Mapped[str] = mapped_column(String(300))
    occurred_at: Mapped[datetime]

    comite: Mapped[Comite] = relationship(back_populates="activities")
