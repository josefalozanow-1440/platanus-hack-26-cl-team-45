from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel


class CiStatus(StrEnum):
    SUCCESS = "success"
    FAILURE = "failure"
    IN_PROGRESS = "in_progress"
    UNKNOWN = "unknown"


class CiRun(BaseModel):
    status: CiStatus
    url: str | None = None
    commit_sha: str | None = None
    updated_at: datetime | None = None


class CommitSummary(BaseModel):
    sha: str
    message: str
    author: str
    date: datetime
    url: str


class StateItem(BaseModel):
    id: str
    summary: str
    status: str


class RepoStatus(BaseModel):
    repo_url: str
    ci: CiRun
    commits: list[CommitSummary]
    product_items: list[StateItem]
    engineering_items: list[StateItem]
    fetched_at: datetime
    errors: list[str]
