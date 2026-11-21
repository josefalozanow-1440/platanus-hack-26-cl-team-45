from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_session
from app.schemas.copilot import CopilotRequest, CopilotResponse
from app.services import copilot

router = APIRouter(prefix="/copilot", tags=["copilot"])


# Sync def: FastAPI runs it in a thread pool, so the blocking Claude call does not stall the event loop.
@router.post("/messages")
def send_message(body: CopilotRequest, session: Annotated[Session, Depends(get_session)]) -> CopilotResponse:
    try:
        return copilot.reply(copilot.DbCarpetaSource(session, date.today()), body)
    except copilot.FamilyNotFoundError as error:
        raise HTTPException(404, "No existe esa familia") from error
