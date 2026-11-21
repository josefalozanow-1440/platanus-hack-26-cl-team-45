from collections.abc import Iterator

import pytest
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from alembic import command
from app.database import engine, get_session
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def migrated_database() -> None:
    command.upgrade(Config("alembic.ini"), "head")


@pytest.fixture
def session() -> Iterator[Session]:
    # Every test runs inside one transaction that is rolled back, so tests never clean up.
    with engine.connect() as connection, connection.begin() as transaction:
        db_session = Session(bind=connection, join_transaction_mode="create_savepoint")
        yield db_session
        db_session.close()
        transaction.rollback()


@pytest.fixture
def client(session: Session) -> Iterator[TestClient]:
    app.dependency_overrides[get_session] = lambda: session
    yield TestClient(app)
    app.dependency_overrides.clear()
