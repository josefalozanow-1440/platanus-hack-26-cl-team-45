# Every model is imported here so Alembic autogenerate sees it.
from app.database import Base
from app.models.domain import (
    Activity,
    Comite,
    Deadline,
    Document,
    EntidadPatrocinante,
    Family,
    Member,
    Observation,
    Signature,
)

__all__ = [
    "Activity",
    "Base",
    "Comite",
    "Deadline",
    "Document",
    "EntidadPatrocinante",
    "Family",
    "Member",
    "Observation",
    "Signature",
]
