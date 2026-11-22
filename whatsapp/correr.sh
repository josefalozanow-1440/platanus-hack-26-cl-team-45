#!/usr/bin/env bash
# Levanta el servidor en el puerto 8000 con las variables de .env.
set -euo pipefail
cd "$(dirname "$0")"
set -a; source .env; set +a
exec uv run uvicorn main:app --port 8000
