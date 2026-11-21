from enum import StrEnum

from pydantic import BaseModel


class ComponentStatus(StrEnum):
    OK = "ok"
    DOWN = "down"


class HealthResponse(BaseModel):
    api: ComponentStatus
    db: ComponentStatus
