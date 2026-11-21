from datetime import date, datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Activity, Comite, Observation
from app.models.domain import DeadlineKind, DocumentStatus
from app.seed import seed
from app.services import ep
from app.services.ep_deadlines import days_between, is_business_day

TODAY = date(2026, 11, 21)
NOW = datetime(2026, 11, 21, 10, 0)


@pytest.fixture
def seeded(session: Session) -> Session:
    seed(session)
    return session


def test_business_days_skip_weekends_and_holidays() -> None:
    assert not is_business_day(date(2026, 11, 21))  # Saturday
    assert not is_business_day(date(2026, 12, 8))  # Inmaculada Concepción
    assert is_business_day(date(2026, 12, 9))
    # Friday to Monday is one business day; across Christmas and New Year two days drop.
    assert days_between(date(2026, 11, 20), date(2026, 11, 23), business=True) == 1
    assert days_between(date(2026, 12, 21), date(2027, 1, 4), business=True) == 8


def test_calendar_days_and_past_dates() -> None:
    assert days_between(date(2026, 7, 1), date(2026, 12, 28), business=False) == 180
    assert days_between(TODAY, date(2026, 11, 1), business=False) == 0


def test_months_between_counts_whole_months() -> None:
    assert ep.months_between(date(2023, 7, 21), TODAY) == 40
    assert ep.months_between(date(2023, 7, 22), TODAY) == 39


def test_panel_matches_the_figma(seeded: Session) -> None:
    panel = ep.get_panel(seeded, TODAY)
    assert (panel.family_count, panel.families_complete) == (148, 128)
    assert (panel.observations_answered, panel.observations_total) == (3, 4)
    assert panel.critical_deadlines == 1
    rows = {row.slug: row for row in panel.comites}
    aromos = rows["los-aromos"]
    assert (aromos.folders.complete, aromos.folders.total, aromos.folders.expiring) == (34, 40, 2)
    assert aromos.deadlines[0].kind == DeadlineKind.OBSERVACIONES
    assert aromos.observations.pending_assignee == "Familia Rojas"
    villa = rows["villa-nueva"].deadlines[0]
    assert (villa.remaining_days, villa.total_days, villa.critical) == (37, 180, True)
    robles = rows["los-robles"].deadlines[0]
    assert (robles.remaining_days, robles.total_days) == (31, 90)


def test_observations_and_accepting_a_draft(seeded: Session) -> None:
    page = ep.get_observations(seeded, "los-aromos", TODAY)
    assert page.deadline is not None and page.deadline.business_days
    assert page.deadline.due_on == date(2027, 2, 5)
    assert [o.answered for o in page.observations] == [True, True, False]

    pending = page.observations[2]
    accepted = ep.accept_draft(seeded, pending.id, "Equipo EP", NOW)
    assert (accepted.answered, accepted.draft_accepted_by) == (True, "Equipo EP")
    assert "Aceptada por: Equipo EP" in ep.single_answer_text(seeded, "los-aromos")


def test_accepting_without_a_draft_fails(seeded: Session) -> None:
    observation = seeded.scalars(select(Observation)).first()
    assert observation is not None
    observation.draft_answer = None
    with pytest.raises(ep.NoDraftError):
        ep.accept_draft(seeded, observation.id, "Equipo EP", NOW)


def test_carpeta_of_villa_nueva(seeded: Session) -> None:
    carpeta = ep.get_carpeta(seeded, "villa-nueva", TODAY)
    assert (carpeta.family_count, carpeta.missing) == (32, 14)
    assert carpeta.deadline is not None and carpeta.deadline.remaining_days == 37
    assert (carpeta.composition.share_percent, carpeta.composition.compliant) == (72, True)
    assert carpeta.next_assembly is not None
    assert set(carpeta.families[0].documents.values()) & {DocumentStatus.FALTA, DocumentStatus.VENCE}


def test_reminders_log_an_activity(seeded: Session) -> None:
    assert ep.request_reminders(seeded, "villa-nueva", NOW).families == 14
    villa = seeded.scalars(select(Comite).where(Comite.slug == "villa-nueva")).one()
    texts = seeded.scalars(select(Activity.text).where(Activity.comite_id == villa.id)).all()
    assert any("14 familias" in text for text in texts)


def test_routes(client: TestClient, seeded: Session) -> None:
    assert client.get("/ep/panel").status_code == 200
    assert client.get("/ep/comites/no-existe/carpeta").status_code == 404
    response = client.get("/ep/comites/los-aromos/respuesta")
    assert response.headers["content-type"].startswith("text/plain")
    assert client.post("/ep/observaciones/0/aceptar", json={"accepted_by": "Equipo EP"}).status_code == 404
