import os

# The only module that reads environment variables.
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg://comite:comite@localhost:5432/comite")

# Kapso (WhatsApp). Empty API key means outbound messages are only logged.
KAPSO_API_KEY = os.environ.get("KAPSO_API_KEY", "")
KAPSO_PHONE_NUMBER_ID = os.environ.get("KAPSO_PHONE_NUMBER_ID", "")
KAPSO_WEBHOOK_SECRET = os.environ.get("KAPSO_WEBHOOK_SECRET", "")

# Claude for the copiloto. Empty means the copiloto answers with its scripted fallback.
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Optional GitHub token for /repo-status. Empty works for the public repo (60 requests/hour).
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
