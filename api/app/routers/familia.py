from datetime import date, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import Family
from app.schemas.familia import CarpetaResponse, FirmaResponse, GrupoResponse, PrivacyResponse, PrivacySettings
from app.services import familia

router = APIRouter(prefix="/familia", tags=["familia"])


def current_family(session: Annotated[Session, Depends(get_session)]) -> Family:
    try:
        return familia.demo_family(session)
    except familia.FamilyNotFoundError as error:
        raise HTTPException(404, "No hay datos de demo: corre el seed") from error


SessionDep = Annotated[Session, Depends(get_session)]
FamilyDep = Annotated[Family, Depends(current_family)]


@router.get("/carpeta")
def get_carpeta(family: FamilyDep) -> CarpetaResponse:
    return familia.carpeta(family, date.today())


@router.get("/privacidad")
def get_privacy(family: FamilyDep) -> PrivacyResponse:
    return familia.privacy(family)


@router.put("/privacidad")
def put_privacy(settings: PrivacySettings, family: FamilyDep, session: SessionDep) -> PrivacyResponse:
    response = familia.update_privacy(session, family, settings)
    session.commit()
    return response


@router.get("/grupo")
def get_grupo(family: FamilyDep) -> GrupoResponse:
    return familia.grupo(family, date.today())


@router.get("/firma")
def get_firma(family: FamilyDep) -> FirmaResponse:
    try:
        return familia.firma(family)
    except familia.NothingToSignError as error:
        raise HTTPException(404, "No hay firmas en esta carpeta") from error


@router.post("/firma")
def post_firma(family: FamilyDep, session: SessionDep) -> FirmaResponse:
    try:
        response = familia.sign(session, family, datetime.now())
    except familia.NothingToSignError as error:
        raise HTTPException(409, "No hay firmas pendientes") from error
    session.commit()
    return response


@router.delete("/firma")
def delete_firma(family: FamilyDep, session: SessionDep) -> FirmaResponse:
    try:
        response = familia.unsign(session, family)
    except familia.NothingToSignError as error:
        raise HTTPException(409, "No hay firmas para deshacer") from error
    session.commit()
    return response
