from datetime import date, datetime
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Comite, EntidadPatrocinante, Family
from app.models.domain import Document, DocumentKind, DocumentStatus, Stage
from app.schemas.familia import StepStatus
from app.seed import LOS_AROMOS, ComiteSpec, seed, seed_comite, seed_rojas
from app.services import familia
from app.services.dates import business_days_left, days_left, elapsed

TODAY = date(2026, 11, 21)
NOW = datetime(2026, 11, 21, 10, 0)


@pytest.fixture
def rojas(session: Session) -> Family:
    """A fresh copy of the Rojas family in its own comité, so tests do not depend on the dev data."""
    ep = EntidadPatrocinante(name="EP de prueba")
    spec = ComiteSpec(
        slug="comite-de-prueba",
        name="Comité de prueba",
        stage=Stage.REVISION_SERVIU,
        organized_on=date(2023, 7, 21),
        size=3,
        above_rsh_40=1,
        named=[LOS_AROMOS.named[0]],
    )
    session.add(ep)
    comite = seed_comite(session, ep, spec, NOW)
    family = comite.families[0]
    seed_rojas(family, NOW)
    session.flush()
    return family


def test_seed_builds_the_figma_numbers(session: Session) -> None:
    seed(session)
    comites = {c.slug: c for c in session.scalars(select(Comite))}
    progress = {
        slug: familia.comite_progress(c) for slug, c in comites.items() if slug in {"los-aromos", "villa-nueva"}
    }
    assert (progress["los-aromos"].complete, progress["los-aromos"].total) == (34, 40)
    assert (progress["villa-nueva"].complete, progress["villa-nueva"].total) == (18, 32)


def test_carpeta_counts_documents_and_asks_for_pedros_signature(rojas: Family) -> None:
    response = familia.carpeta(rojas, TODAY)
    assert (response.progress.ready, response.progress.total) == (5, 7)
    assert (response.progress.listos, response.progress.por_vencer, response.progress.faltan) == (5, 1, 1)
    assert response.pending_action is not None and response.pending_action.member_name == "Pedro"
    labels = {d.kind: d.status_label for d in response.documents}
    assert labels[DocumentKind.DJ49_1] == "Falta firma"
    assert labels[DocumentKind.AHORRO] == "Faltan 0,5 UF"
    assert [p.initials for p in response.family_access] == ["MR", "PR", "SR"]
    assert (response.comite_progress.complete, response.comite_progress.total) == (2, 3)


def test_signing_completes_the_dj49_1(session: Session, rojas: Family) -> None:
    response = familia.sign(session, rojas, NOW)
    assert response.already_signed
    dj49_1 = next(d for d in rojas.documents if d.kind == DocumentKind.DJ49_1)
    assert dj49_1.status == DocumentStatus.LISTO
    assert familia.carpeta(rojas, TODAY).pending_action is None
    with pytest.raises(familia.NothingToSignError):
        familia.sign(session, rojas, NOW)
    undone = familia.unsign(session, rojas)
    assert not undone.already_signed
    assert dj49_1.status == DocumentStatus.FALTA
    assert dj49_1.detail == "Firmada por 2 de 3 adultos"


def test_firma_names_who_already_signed(rojas: Family) -> None:
    response = familia.firma(rojas)
    assert response.signer_name == "Pedro Rojas"
    assert response.lives_with == ["Marta", "Sofía", "Tomás"]
    assert [(s.first_name, s.signed) for s in response.signers] == [("Marta", True), ("Sofía", True), ("Pedro", False)]


def test_grupo_shows_stage_three_of_six_and_waiting_time(rojas: Family) -> None:
    response = familia.grupo(rojas, TODAY)
    assert (response.stage_number, response.stage_total) == (3, 6)
    assert [s.status for s in response.steps] == [
        StepStatus.LISTO,
        StepStatus.LISTO,
        StepStatus.AHORA,
        StepStatus.PENDIENTE,
        StepStatus.SEGUIMIENTO,
        StepStatus.SEGUIMIENTO,
    ]
    assert (response.wait_years, response.wait_months) == (3, 4)


def test_status_label_for_savings_without_shortfall() -> None:
    family = Family(savings_uf=Decimal(10))
    document = Document(kind=DocumentKind.AHORRO, status=DocumentStatus.VENCE, family=family)
    assert familia.status_label(document) == "Por vencer"


def test_date_helpers() -> None:
    assert days_left(TODAY, date(2026, 12, 28)) == 37
    assert days_left(TODAY, date(2026, 1, 1)) == 0
    # Mon 23-11 to Fri 27-11 is five business days; the weekend after adds none.
    assert business_days_left(TODAY, date(2026, 11, 29)) == 5
    # 08-12 is a holiday.
    assert business_days_left(date(2026, 12, 7), date(2026, 12, 8)) == 0
    assert elapsed(date(2023, 7, 21), TODAY).years == 3
    assert elapsed(date(2023, 7, 22), TODAY).months == 3


def test_privacy_endpoint_updates_the_toggles(client: TestClient, session: Session) -> None:
    seed(session)
    response = client.put(
        "/familia/privacidad",
        json={"shares_with_comite": True, "shares_with_ep": True, "shares_sensitive": True},
    )
    assert response.status_code == 200
    assert response.json()["settings"]["shares_sensitive"] is True
    assert client.get("/familia/carpeta").json()["family_name"] == "Familia Rojas"
