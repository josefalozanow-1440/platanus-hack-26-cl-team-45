from fastapi import FastAPI

from app.routers import comite, copilot, ep, familia, health, kapso, repo_status

app = FastAPI(title="Comité API")
app.include_router(health.router)
app.include_router(kapso.router)
app.include_router(ep.router)
app.include_router(copilot.router)
app.include_router(familia.router)
app.include_router(repo_status.router)
app.include_router(comite.router)
