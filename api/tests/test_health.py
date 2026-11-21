from unittest.mock import MagicMock

from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from app.schemas.health import ComponentStatus
from app.services.health import database_status


def test_health_reports_api_and_db_ok(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"api": "ok", "db": "ok"}


def test_database_status_is_down_when_the_query_fails() -> None:
    session = MagicMock()
    session.execute.side_effect = OperationalError("SELECT 1", {}, Exception("no db"))
    assert database_status(session) == ComponentStatus.DOWN
