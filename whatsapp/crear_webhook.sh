#!/usr/bin/env bash
# Registra en Kapso el webhook que apunta a este servidor.
# Uso: ./crear_webhook.sh https://<tu-tunel>.trycloudflare.com
set -euo pipefail
cd "$(dirname "$0")"

TUNNEL_URL="${1:?Pasa la URL pública del túnel}"
set -a; source .env; set +a
: "${KAPSO_API_KEY:?Falta KAPSO_API_KEY en .env}"
: "${KAPSO_PHONE_NUMBER_ID:?Falta KAPSO_PHONE_NUMBER_ID en .env}"

# El secret lo elige quien crea el webhook; se genera una vez y se guarda en .env.
if [ -z "${KAPSO_WEBHOOK_SECRET:-}" ]; then
  KAPSO_WEBHOOK_SECRET="$(openssl rand -hex 24)"
  sed -i '' "s/^KAPSO_WEBHOOK_SECRET=.*/KAPSO_WEBHOOK_SECRET=${KAPSO_WEBHOOK_SECRET}/" .env
fi

# https://docs.kapso.ai/api/platform/v1/webhooks/create-webhook.md
curl -sS --fail-with-body -X POST \
  "https://api.kapso.ai/platform/v1/whatsapp/phone_numbers/${KAPSO_PHONE_NUMBER_ID}/webhooks" \
  -H "X-API-Key: ${KAPSO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"whatsapp_webhook\": {
        \"url\": \"${TUNNEL_URL%/}/webhooks/kapso\",
        \"secret_key\": \"${KAPSO_WEBHOOK_SECRET}\",
        \"events\": [\"whatsapp.message.received\"],
        \"active\": true,
        \"payload_version\": \"v2\"
      }}" | python3 -c 'import json,sys; d=json.load(sys.stdin)["data"]; print("Webhook creado:", d["id"], "->", d["url"])'

echo "Reinicia el servidor para que lea el secret nuevo."
