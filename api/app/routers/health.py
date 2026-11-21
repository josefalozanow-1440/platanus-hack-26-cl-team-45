from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_session
from app.schemas.health import ComponentStatus, HealthResponse
from app.services.health import database_status

router = APIRouter()


@router.get("/health")
def health(session: Annotated[Session, Depends(get_session)]) -> HealthResponse:
    return HealthResponse(api=ComponentStatus.OK, db=database_status(session))
