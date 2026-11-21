#!/usr/bin/env bash
# Every check CI runs, in the same order. Run it before each push.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== stack"
docker compose up -d --build --wait

echo "== api: lint, format, tests"
(cd api && uv sync -q --frozen && uv run ruff check . && uv run ruff format --check . && uv run pytest -q)

echo "== web: lint, types, build"
(cd web && npm ci -s && npm run -s lint && npm run -s typecheck && npm run -s build)

echo "== duplicated code"
npx -y jscpd@4 -c .jscpd.json

echo "== web: e2e against the stack"
(cd web && npx playwright install --with-deps chromium >/dev/null && npm run -s e2e)
