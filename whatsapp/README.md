# Bot de WhatsApp (Kapso + Claude)

Base del canal de WhatsApp de Audem. Hoy recibe un texto, ofrece tres botones (Resumen, Punteo de ideas, Tareas) y responde con Claude. Es el punto de partida para el webhook entrante, la descarga de audio y las respuestas de la ronda 2.

## Cómo funciona

1. La persona le escribe al número de Kapso.
2. Kapso llama a `POST /webhooks/kapso`. El servidor verifica la firma HMAC y responde 200 de inmediato (Kapso exige respuesta en menos de 10 s).
3. En segundo plano, si llegó un texto, lo guarda y manda los tres botones; si llegó un botón, procesa el último texto de esa persona con Claude y responde.

Todo está en `main.py`: las opciones y sus instrucciones para Claude en `MODES`, la llamada a Claude en `process`, los botones en `send_mode_buttons` y la decisión de qué responder en `answer`.

## Correrlo local

Requisitos: `uv`, `cloudflared` (`brew install cloudflared`) y la CLI de Kapso (`npm install -g @kapso/cli`).

```bash
cp .env.example .env              # completar KAPSO_API_KEY, KAPSO_PHONE_NUMBER_ID y ANTHROPIC_API_KEY
cloudflared tunnel --url http://localhost:8000   # anota la URL https://….trycloudflare.com
./crear_webhook.sh https://….trycloudflare.com   # registra el webhook y genera KAPSO_WEBHOOK_SECRET
./correr.sh                        # servidor en el puerto 8000
```

`GET /health` dice qué variables están cargadas. Cada vez que el túnel cambia de URL hay que volver a correr `crear_webhook.sh`.

## Número

Usamos el sandbox de Kapso (+56 9 2040 3095). Solo responde a celulares registrados: en app.kapso.ai, Phone numbers → Sandbox WhatsApp → Add session, y mandar el código de 6 caracteres desde ese celular. El número gratuito de EE.UU. quedó pendiente porque Meta bloqueó el portafolio comercial nuevo.

## Tests

```bash
uv run pytest -q
```

## Atajos conocidos

- El último texto de cada persona y las claves de idempotencia viven en memoria: se pierden al reiniciar.
- WhatsApp permite máximo 3 botones por mensaje; para más opciones hay que pasar a un mensaje de lista.
