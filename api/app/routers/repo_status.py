from fastapi import APIRouter

from app.schemas.repo_status import RepoStatus
from app.services.repo_status import get_repo_status

router = APIRouter()


@router.get("/repo-status")
def repo_status() -> RepoStatus:
    return get_repo_status()
