FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:0.8 /uv /bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app
ENV PATH="/app/.venv/bin:$PATH" PORT=8000
EXPOSE 8000
# Migrate before serving (ADR-0030); Render passes the port in $PORT.
CMD ["sh", "-c", "alembic upgrade head && python -m app.seed && fastapi run app/main.py --host 0.0.0.0 --port $PORT"]
