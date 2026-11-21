# Extensión de git-conventions para este repo

Estas reglas complementan la skill `git-conventions` y mandan sobre ella en este repositorio.

- El equipo ya autorizó commitear y hacer push sin pedir confirmación. Cuando termines un cambio, commitea y sube sin mostrar antes el mensaje ni preguntar.
- Se trabaja en `main`, sin ramas ni PRs. No crees ramas `docs/`, `feat/` u otras salvo que un humano lo pida.
- Haz `git pull --rebase --autostash` antes de partir y antes de cada push.
- Antes del push corre los checks que existan (tests, tipos, build). Si fallan por tu cambio, arréglalo antes de subir.
- El formato del mensaje sigue la skill: `<tipo>: <descripción>` en español, con líneas de 100 caracteres como máximo.
- Siguen prohibidos sin orden de un humano: `git push --force`, reescribir la historia de `main`, `--no-verify` y commitear `.env`, tokens o claves. Ver "Lo que no se hace sin orden de un humano" en `CLAUDE.md`.
