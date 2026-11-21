from datetime import date, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.database import get_session
from app.schemas.ep import AcceptDraft, Carpeta, ObservationsPage, ObservationView, Panel, ReminderResult
from app.services import ep

router = APIRouter(prefix="/ep", tags=["ep"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/panel")
def panel(session: SessionDep) -> Panel:
    return ep.get_panel(session, date.today())


@router.get("/comites/{slug}/observaciones")
def observations(slug: str, session: SessionDep) -> ObservationsPage:
    try:
        return ep.get_observations(session, slug, date.today())
    except ep.ComiteNotFoundError as error:
        raise HTTPException(404, "No existe ese comité") from error


@router.post("/observaciones/{observation_id}/aceptar")
def accept(observation_id: int, body: AcceptDraft, session: SessionDep) -> ObservationView:
    try:
        return ep.accept_draft(session, observation_id, body.accepted_by, datetime.now())
    except ep.ObservationNotFoundError as error:
        raise HTTPException(404, "No existe esa observación") from error
    except ep.NoDraftError as error:
        raise HTTPException(409, "Esta observación no tiene borrador del copiloto") from error


@router.get("/comites/{slug}/respuesta", response_class=PlainTextResponse)
def single_answer(slug: str, session: SessionDep) -> PlainTextResponse:
    try:
        text = ep.single_answer_text(session, slug)
    except ep.ComiteNotFoundError as error:
        raise HTTPException(404, "No existe ese comité") from error
    headers = {"Content-Disposition": f'attachment; filename="respuesta-{slug}.txt"'}
    return PlainTextResponse(text, headers=headers)


@router.get("/comites/{slug}/carpeta")
def carpeta(slug: str, session: SessionDep) -> Carpeta:
    try:
        return ep.get_carpeta(session, slug, date.today())
    except ep.ComiteNotFoundError as error:
        raise HTTPException(404, "No existe ese comité") from error


@router.post("/comites/{slug}/recordatorios")
def reminders(slug: str, session: SessionDep) -> ReminderResult:
    try:
        return ep.request_reminders(session, slug, datetime.now())
    except ep.ComiteNotFoundError as error:
        raise HTTPException(404, "No existe ese comité") from error
