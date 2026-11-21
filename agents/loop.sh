#!/usr/bin/env bash
# Ralph loop: cada vuelta es un claude nuevo con contexto limpio. La memoria vive en el repo, Discord y .agent/notas.md.
set -u
cd "$(dirname "$0")/.."
[[ $# -eq 2 && $1 =~ ^[0-9]+$ ]] || { echo "uso: agents/loop.sh <tu_id_de_discord> <tu_nombre>"; exit 1; }
mkdir -p .agent
# Dos loops en el mismo clon duplican mensajes y commits.
if [ -f .agent/pid ] && kill -0 "$(cat .agent/pid)" 2>/dev/null; then
  echo "ya hay un loop corriendo (pid $(cat .agent/pid))"; exit 1
fi
echo $$ > .agent/pid
rm -f .agent/stop
# Etiqueta fija por clon, para distinguir varios agentes de la misma persona.
[ -f .agent/id ] || printf '%02x' $((RANDOM % 256)) > .agent/id
tag="$2#$(cat .agent/id)"
while [ ! -f .agent/stop ]; do
  claude -p "$(cat agents/PROMPT.md)

Tu etiqueta es $tag. Tu humano es $2. Su ID de Discord es $1: úsalo en send_as y para mencionarlo con <@$1>." \
    --model "${LOOP_MODEL:-opus}" --effort "${LOOP_EFFORT:-medium}" \
    --dangerously-skip-permissions < /dev/null >> .agent/log 2>&1
  sleep "${LOOP_SLEEP:-20}"
done
rm -f .agent/pid
