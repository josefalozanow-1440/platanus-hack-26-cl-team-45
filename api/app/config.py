import os

# The only module that reads environment variables.
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg://comite:comite@localhost:5432/comite")
