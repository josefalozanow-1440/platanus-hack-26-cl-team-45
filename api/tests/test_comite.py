from datetime import date, datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Comite, Family
from app.seed import seed
from app.services import comite

TODAY = date(2026, 11, 21)
NOW = datetime(2026, 11, 21, 10, 0)
SLUG = "los-aromos"


@pytest.fixture
def seeded(session: Session) -> Session:
    seed(session)
    return session


def family_id(session: Session, surname: str) -> int:
    return session.scalars(select(Family.id).join(Comite).where(Comite.slug == SLUG, Family.surname == surname)).one()


def test_carpetas_counts_status_not_content(seeded: Session) -> None:
    page = comite.get_carpetas(seeded, SLUG, TODAY)
    assert (page.counts.complete, page.counts.missing, page.counts.expiring) == (34, 4, 2)
    assert page.savings_cutoff is not None
    assert page.savings_cutoff.deadline.due_on == date(2026, 12, 31)
    assert page.savings_cutoff.below_minimum == 2
    labels = {folder.name: (folder.done, folder.missing_label, folder.companion_name) for folder in page.missing}
    assert labels["Familia Rojas"] == (5, "Falta la firma de 1 adulto (DJ49-1)", "Valentina")
    assert labels["Familia Pérez"] == (6, "Falta el mandato de ahorro (DJ49-3)", None)
    assert labels["Familia Herrera"][1] == "Faltan 3 documentos"
    # Nobody accompanies Pérez, so it goes first.
    assert page.missing[0].name == "Familia Pérez"


def test_carpetas_hide_families_that_did_not_share(seeded: Session) -> None:
    rojas = seeded.get(Family, family_id(seeded, "Rojas"))
    rojas.shares_with_comite = False
    page = comite.get_carpetas(seeded, SLUG, TODAY)
    assert "Familia Rojas" not in {folder.name for folder in page.missing}
    assert page.hidden == 1


def test_accompany_once_and_remind_once_a_day(seeded: Session) -> None:
    perez = family_id(seeded, "Pérez")
    assert comite.accompany(seeded, SLUG, perez, "Valentina", NOW).companion_name == "Valentina"
    with pytest.raises(comite.AlreadyAccompaniedError):
        comite.accompany(seeded, SLUG, perez, "Jorge", NOW)
    assert comite.remind(seeded, SLUG, perez, NOW).sent
    assert not comite.remind(seeded, SLUG, perez, NOW).sent


def test_reemplazo_shows_deadline_effect_and_waitlist(seeded: Session) -> None:
    page = comite.get_reemplazo(seeded, SLUG, TODAY)
    assert page.renunciation is not None
    assert page.renunciation.name == "Familia Vera"
    assert page.deadline is not None
    assert page.deadline.due_on == date(2027, 3, 13)
    assert page.effect.compliant_if_above
    waitlist = {w.name: (w.can_enter, w.blocker) for w in page.waitlist}
    assert waitlist == {"Familia Fuentes": (False, "Falta ahorro"), "Familia Tapia": (True, None)}


def test_propose_only_a_family_that_can_enter(seeded: Session) -> None:
    with pytest.raises(comite.CannotEnterError):
        comite.propose(seeded, SLUG, family_id(seeded, "Fuentes"), NOW)
    result = comite.propose(seeded, SLUG, family_id(seeded, "Tapia"), NOW)
    assert (result.family, result.replaces) == ("Familia Tapia", "Familia Vera")
    tapia = next(w for w in comite.get_reemplazo(seeded, SLUG, TODAY).waitlist if w.name == "Familia Tapia")
    assert tapia.proposed


def test_composition_effect_flags_breaking_the_30_percent() -> None:
    families = [Family(surname=str(i), in_rsh_40=i >= 3) for i in range(10)]
    effect = comite.composition_effect(families)
    assert (effect.above_rsh_40, effect.percent_if_above, effect.compliant_if_above) == (3, 36, False)


def test_endpoints(client: TestClient, seeded: Session) -> None:
    assert client.get(f"/comite/{SLUG}/carpetas").status_code == 200
    assert client.get(f"/comite/{SLUG}/reemplazo").status_code == 200
    assert client.get("/comite/no-existe/carpetas").status_code == 404
    response = client.post(f"/comite/{SLUG}/reemplazo/propuesta", json={"family_id": family_id(seeded, "Fuentes")})
    assert response.status_code == 409
    response = client.post(f"/comite/{SLUG}/familias/999999/recordatorio")
    assert response.status_code == 404
