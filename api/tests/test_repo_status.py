from collections.abc import Iterator
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.repo_status import CiStatus
from app.services import repo_status

ROOT = Path(__file__).parent.parent.parent

PRODUCT_MD = """# Estado
## Decisiones y límites en una línea

Texto previo.

| ID | En una línea | Estado |
| --- | --- | --- |
| D-01 | Alcance: **DS49** colectivo. | Decisión de trabajo |
| L-02 | Ver [`limites.md`](product-state/limites.md). | Decidido* |
| A-01 | Actor que no va. | Decidido |

## Otra sección
| D-99 | No debe aparecer | X |
"""

ENGINEERING_MD = """## Decisiones y propuestas de ingeniería

| ID | Ítem | Estado | Detalle |
| --- | --- | --- | --- |
| E-01 | Stack en `api/`. | Decidido (Golazo, 2026-11-21) | Orden |

| Rango | Qué cubre | Archivo |
| R-01 a R-07 | Riesgos | `kapso.md` |
"""

RUN = {
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/x/actions/runs/1",
    "head_sha": "abcdef1234567",
    "updated_at": "2026-11-21T10:00:00Z",
}

COMMIT = {
    "sha": "869f3761234567",
    "html_url": "https://github.com/x/commit/869f376",
    "author": {"login": "golazo"},
    "commit": {"message": "fix: algo\n\ncuerpo", "author": {"name": "Gonzalo", "date": "2026-11-21T09:00:00Z"}},
}


def _github(request: httpx.Request) -> httpx.Response:
    path = request.url.path
    if path.endswith("/actions/runs"):
        return httpx.Response(200, json={"workflow_runs": [RUN]})
    if path.endswith("/commits"):
        return httpx.Response(200, json=[COMMIT])
    if path.endswith("product-state.md"):
        return httpx.Response(200, text=PRODUCT_MD)
    if path.endswith("engineering-state.md"):
        return httpx.Response(200, text=ENGINEERING_MD)
    return httpx.Response(404)


def _github_down_except_markdown(request: httpx.Request) -> httpx.Response:
    if request.url.host == "api.github.com":
        return httpx.Response(403, json={"message": "rate limited"})
    return _github(request)


@pytest.fixture(autouse=True)
def fresh_cache() -> Iterator[None]:
    repo_status.clear_cache()
    yield
    repo_status.clear_cache()


def test_parse_product_table_keeps_only_that_table_and_strips_markdown() -> None:
    items = repo_status.parse_state_table(PRODUCT_MD, repo_status.PRODUCT_TABLE_HEADING)
    assert [(i.id, i.summary, i.status) for i in items] == [
        ("D-01", "Alcance: DS49 colectivo.", "Decisión de trabajo"),
        ("L-02", "Ver limites.md.", "Decidido*"),
        ("A-01", "Actor que no va.", "Decidido"),
    ]


def test_parse_engineering_table_stops_at_blank_line() -> None:
    items = repo_status.parse_state_table(ENGINEERING_MD, repo_status.ENGINEERING_TABLE_HEADING)
    assert [(i.id, i.summary, i.status) for i in items] == [("E-01", "Stack en api/.", "Decidido (Golazo, 2026-11-21)")]


def test_parse_missing_heading_raises() -> None:
    with pytest.raises(ValueError, match="heading not found"):
        repo_status.parse_state_table("# nada", repo_status.PRODUCT_TABLE_HEADING)


def test_parse_real_state_files() -> None:
    product = repo_status.parse_state_table((ROOT / "product-state.md").read_text(), repo_status.PRODUCT_TABLE_HEADING)
    engineering = repo_status.parse_state_table(
        (ROOT / "engineering-state.md").read_text(), repo_status.ENGINEERING_TABLE_HEADING
    )
    assert product[0].id == "D-01"
    assert engineering[0].id == "E-01"
    assert all(item.summary and item.status for item in product + engineering)


@pytest.mark.parametrize(
    ("status", "conclusion", "expected"),
    [
        ("completed", "success", CiStatus.SUCCESS),
        ("completed", "failure", CiStatus.FAILURE),
        ("completed", "cancelled", CiStatus.UNKNOWN),
        ("in_progress", None, CiStatus.IN_PROGRESS),
        ("queued", None, CiStatus.IN_PROGRESS),
        (None, None, CiStatus.UNKNOWN),
    ],
)
def test_ci_status_mapping(status: str | None, conclusion: str | None, expected: CiStatus) -> None:
    assert repo_status.ci_status_from_run(status, conclusion) == expected


def test_get_repo_status_with_all_sources() -> None:
    status = repo_status.get_repo_status(httpx.MockTransport(_github))
    assert status.errors == []
    assert status.ci.status == CiStatus.SUCCESS
    assert status.ci.commit_sha == "abcdef1"
    assert status.commits[0].sha == "869f376"
    assert status.commits[0].message == "fix: algo"
    assert status.commits[0].author == "golazo"
    assert [i.id for i in status.product_items] == ["D-01", "L-02"]
    assert [i.id for i in status.engineering_items] == ["E-01"]


def test_failed_source_adds_error_and_keeps_the_rest() -> None:
    status = repo_status.get_repo_status(httpx.MockTransport(_github_down_except_markdown))
    assert status.ci.status == CiStatus.UNKNOWN
    assert status.commits == []
    assert len(status.errors) == 2
    assert [i.id for i in status.product_items] == ["D-01", "L-02"]


def test_response_is_cached() -> None:
    first = repo_status.get_repo_status(httpx.MockTransport(_github))
    second = repo_status.get_repo_status(httpx.MockTransport(_github_down_except_markdown))
    assert second is first


def test_endpoint_returns_contract() -> None:
    repo_status.get_repo_status(httpx.MockTransport(_github))  # warm the cache so the endpoint does not hit GitHub
    body = TestClient(app).get("/repo-status").json()
    assert set(body) == {
        "repo_url",
        "ci",
        "commits",
        "product_items",
        "engineering_items",
        "fetched_at",
        "errors",
    }
    assert body["ci"]["status"] == "success"
