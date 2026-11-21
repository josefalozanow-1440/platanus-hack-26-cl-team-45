from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.schemas.health import ComponentStatus


def database_status(session: Session) -> ComponentStatus:
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return ComponentStatus.DOWN
    return ComponentStatus.OK
