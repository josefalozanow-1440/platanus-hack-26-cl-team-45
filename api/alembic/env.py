from sqlalchemy import create_engine

from alembic import context
from app.config import DATABASE_URL
from app.models import Base

with create_engine(DATABASE_URL).connect() as connection:
    context.configure(connection=connection, target_metadata=Base.metadata)
    with context.begin_transaction():
        context.run_migrations()
