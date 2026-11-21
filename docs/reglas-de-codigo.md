# Reglas de código

Reglas tomadas de los ADRs de revi-mono. Las que tienen check fallan en `scripts/check.sh` y en CI; las otras se cumplen a mano.

| Regla | Origen | Check |
| --- | --- | --- |
| Identificadores, comentarios y logs en inglés. Lo que lee el usuario o el modelo, en español. Términos sin buena traducción (`expediente`, `acta`, `comité`) quedan en español. | ADR-0024 | A mano |
| Solo `api/app/config.py` lee variables de entorno. | ADR-0015 | `tests/test_architecture.py` |
| `services/` no importa `fastapi`: lanza errores de dominio y el router los traduce a HTTP. Los modelos de request y response viven en `schemas/`. | ADR-0011 | `tests/test_architecture.py` |
| Nada de funciones dentro de funciones ni imports dentro de funciones. | ADR-0013 | `tests/test_architecture.py`, ruff `PLC0415` |
| Ninguna función devuelve un `dict` suelto: devuelve un modelo Pydantic, dataclass o `TypedDict`. Un conjunto cerrado de strings es un `StrEnum`. Sin parámetros `Any`. | ADR-0007, 0009, 0014 | `tests/test_architecture.py`, ruff `ANN401` |
| Un número con significado es una constante con nombre. | ADR-0010 | A mano |
| Todo modelo con `__tablename__` se importa en `app/models/__init__.py`, o Alembic no lo ve. | ADR-0017 | A mano |
| Un estado que se entra y se sale es un timestamp `*_at` nullable; los borrados restaurables son soft delete. | ADR-0023 | A mano |
| La API migra la base al partir (`alembic upgrade head`). Cada cambio de esquema es una migración de Alembic. | ADR-0030 | Dockerfile de `api/` |
| Los tests del backend corren contra Postgres real y cada test hace rollback de su transacción: no limpian y no dependen del orden. | ADR-0026 | `tests/conftest.py` |
| Reglas de ruff de logs, complejidad, anidamiento, nombres, prints y código comentado. | ADR-0021 | ruff |
| Código duplicado falla el build. | ADR-0022 | jscpd |
| Lógica nueva lleva su test: pytest en `api/tests/`, Playwright en `web/e2e/` para lo que debe cumplirse en la UI. | CLAUDE.md | pytest, Playwright |
