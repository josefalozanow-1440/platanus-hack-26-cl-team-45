from datetime import date, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_session
from app.schemas.comite import (
    ComiteCarpetas,
    ComiteReemplazo,
    Companion,
    MissingFolder,
    Proposal,
    ProposalResult,
    ReminderSent,
)
from app.services import comite
from app.services.ep import ComiteNotFoundError

router = APIRouter(prefix="/comite", tags=["comite"])
SessionDep = Annotated[Session, Depends(get_session)]
NOT_FOUND = {ComiteNotFoundError: "No existe ese comité", comite.FamilyNotFoundError: "No existe esa familia"}


def not_found(error: Exception) -> HTTPException:
    return HTTPException(404, NOT_FOUND[type(error)])


@router.get("/{slug}/carpetas")
def carpetas(slug: str, session: SessionDep) -> ComiteCarpetas:
    try:
        return comite.get_carpetas(session, slug, date.today())
    except ComiteNotFoundError as error:
        raise not_found(error) from error


@router.post("/{slug}/familias/{family_id}/acompanante")
def accompany(slug: str, family_id: int, body: Companion, session: SessionDep) -> MissingFolder:
    try:
        return comite.accompany(session, slug, family_id, body.companion_name, datetime.now())
    except (ComiteNotFoundError, comite.FamilyNotFoundError) as error:
        raise not_found(error) from error
    except comite.AlreadyAccompaniedError as error:
        raise HTTPException(409, "Esa familia ya tiene acompañante") from error


@router.post("/{slug}/familias/{family_id}/recordatorio")
def remind(slug: str, family_id: int, session: SessionDep) -> ReminderSent:
    try:
        return comite.remind(session, slug, family_id, datetime.now())
    except (ComiteNotFoundError, comite.FamilyNotFoundError) as error:
        raise not_found(error) from error


@router.get("/{slug}/reemplazo")
def reemplazo(slug: str, session: SessionDep) -> ComiteReemplazo:
    try:
        return comite.get_reemplazo(session, slug, date.today())
    except ComiteNotFoundError as error:
        raise not_found(error) from error


@router.post("/{slug}/reemplazo/propuesta")
def propose(slug: str, body: Proposal, session: SessionDep) -> ProposalResult:
    try:
        return comite.propose(session, slug, body.family_id, datetime.now())
    except (ComiteNotFoundError, comite.FamilyNotFoundError) as error:
        raise not_found(error) from error
    except comite.CannotEnterError as error:
        raise HTTPException(409, "Esa familia no está en lista de espera o todavía no cumple para entrar") from error
