"""Project status read from GitHub (CI, commits and the state indexes), so it works without the repo on disk."""

import logging
import re
import time
from dataclasses import dataclass
from datetime import UTC, datetime

import httpx

from app import config
from app.schemas.repo_status import CiRun, CiStatus, CommitSummary, RepoStatus, StateItem

logger = logging.getLogger(__name__)

REPO = "platanus-hack/platanus-hack-26-cl-team-45"
REPO_URL = f"https://github.com/{REPO}"
API_BASE_URL = f"https://api.github.com/repos/{REPO}"
RAW_BASE_URL = f"https://raw.githubusercontent.com/{REPO}/main"
COMMIT_COUNT = 15
SHORT_SHA_LENGTH = 7
REQUEST_TIMEOUT_SECONDS = 8.0
# shortcut: per-process memory cache (anonymous GitHub allows 60 req/h), use a shared cache if we scale out.
CACHE_SECONDS = 60.0
PRODUCT_TABLE_HEADING = "Decisiones y límites en una línea"
ENGINEERING_TABLE_HEADING = "Decisiones y propuestas de ingeniería"
PRODUCT_ID_PREFIXES = ("D-", "L-")
TABLE_MIN_COLUMNS = 3

_LINK = re.compile(r"\[([^\]]*)\]\([^)]*\)")
_ITEM_ID = re.compile(r"^[A-Z]+-\d+$")


@dataclass
class _Cache:
    value: RepoStatus | None = None
    stored_at: float = 0.0


_cache = _Cache()


def strip_markdown(text: str) -> str:
    """Plain text from a table cell: links keep their label, bold and code marks go away."""
    return _LINK.sub(r"\1", text).replace("**", "").replace("`", "").strip()


def parse_state_table(markdown: str, heading: str) -> list[StateItem]:
    """Rows (id, text, status) of the first table under `## {heading}`. Non-id rows are skipped."""
    lines = markdown.splitlines()
    try:
        start = next(i for i, line in enumerate(lines) if line.strip() == f"## {heading}")
    except StopIteration as error:
        raise ValueError(f"heading not found: {heading}") from error
    items: list[StateItem] = []
    in_table = False
    for line in lines[start + 1 :]:
        stripped = line.strip()
        if stripped.startswith("## ") or (in_table and not stripped.startswith("|")):
            break
        if not stripped.startswith("|"):
            continue
        in_table = True
        cells = [strip_markdown(cell) for cell in stripped.strip("|").split("|")]
        if len(cells) >= TABLE_MIN_COLUMNS and _ITEM_ID.match(cells[0]):
            items.append(StateItem(id=cells[0], summary=cells[1], status=cells[2]))
    return items


def ci_status_from_run(status: str | None, conclusion: str | None) -> CiStatus:
    """Map a GitHub Actions run (status, conclusion) to our CI status."""
    if status != "completed":
        return CiStatus.IN_PROGRESS if status else CiStatus.UNKNOWN
    if conclusion == "success":
        return CiStatus.SUCCESS
    if conclusion in {"failure", "timed_out", "startup_failure"}:
        return CiStatus.FAILURE
    return CiStatus.UNKNOWN


def _fetch_ci(client: httpx.Client) -> CiRun:
    response = client.get(f"{API_BASE_URL}/actions/runs", params={"branch": "main", "per_page": 1})
    response.raise_for_status()
    runs = response.json()["workflow_runs"]
    if not runs:
        return CiRun(status=CiStatus.UNKNOWN)
    run = runs[0]
    return CiRun(
        status=ci_status_from_run(run.get("status"), run.get("conclusion")),
        url=run.get("html_url"),
        commit_sha=(run.get("head_sha") or "")[:SHORT_SHA_LENGTH] or None,
        updated_at=run.get("updated_at"),
    )


def _fetch_commits(client: httpx.Client) -> list[CommitSummary]:
    response = client.get(f"{API_BASE_URL}/commits", params={"sha": "main", "per_page": COMMIT_COUNT})
    response.raise_for_status()
    return [
        CommitSummary(
            sha=item["sha"][:SHORT_SHA_LENGTH],
            message=item["commit"]["message"].splitlines()[0] if item["commit"]["message"] else "",
            author=(item.get("author") or {}).get("login") or item["commit"]["author"]["name"],
            date=item["commit"]["author"]["date"],
            url=item["html_url"],
        )
        for item in response.json()
    ]


def _fetch_table(client: httpx.Client, path: str, heading: str) -> list[StateItem]:
    response = client.get(f"{RAW_BASE_URL}/{path}")
    response.raise_for_status()
    return parse_state_table(response.text, heading)


def _build_status(client: httpx.Client) -> RepoStatus:
    errors: list[str] = []
    ci = CiRun(status=CiStatus.UNKNOWN)
    commits: list[CommitSummary] = []
    product_items: list[StateItem] = []
    engineering_items: list[StateItem] = []
    # Each source fails alone: the page still shows what loaded.
    try:
        ci = _fetch_ci(client)
    except (httpx.HTTPError, ValueError, KeyError) as error:
        logger.warning("CI status failed: %s", error)
        errors.append("No se pudo leer el estado del CI.")
    try:
        commits = _fetch_commits(client)
    except (httpx.HTTPError, ValueError, KeyError) as error:
        logger.warning("Commits failed: %s", error)
        errors.append("No se pudieron leer los commits.")
    try:
        product_items = [
            item
            for item in _fetch_table(client, "product-state.md", PRODUCT_TABLE_HEADING)
            if item.id.startswith(PRODUCT_ID_PREFIXES)
        ]
    except (httpx.HTTPError, ValueError) as error:
        logger.warning("product-state.md failed: %s", error)
        errors.append("No se pudo leer product-state.md.")
    try:
        engineering_items = _fetch_table(client, "engineering-state.md", ENGINEERING_TABLE_HEADING)
    except (httpx.HTTPError, ValueError) as error:
        logger.warning("engineering-state.md failed: %s", error)
        errors.append("No se pudo leer engineering-state.md.")
    return RepoStatus(
        repo_url=REPO_URL,
        ci=ci,
        commits=commits,
        product_items=product_items,
        engineering_items=engineering_items,
        fetched_at=datetime.now(UTC),
        errors=errors,
    )


def get_repo_status(transport: httpx.BaseTransport | None = None) -> RepoStatus:
    """Repo status, cached for CACHE_SECONDS. `transport` is injected by tests."""
    if _cache.value is not None and time.monotonic() - _cache.stored_at < CACHE_SECONDS:
        return _cache.value
    headers = {"Accept": "application/vnd.github+json"}
    if config.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {config.GITHUB_TOKEN}"
    with httpx.Client(transport=transport, headers=headers, timeout=REQUEST_TIMEOUT_SECONDS) as client:
        status = _build_status(client)
    _cache.value, _cache.stored_at = status, time.monotonic()
    return status


def clear_cache() -> None:
    _cache.value = None
