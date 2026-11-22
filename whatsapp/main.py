"""Bot de prueba: recibe un texto por WhatsApp (Kapso), ofrece qué hacer con él y responde con Claude.

Flujo: la persona manda un texto, el bot responde con botones (resumen, punteo de ideas, tareas)
y, al apretar uno, procesa el último texto que mandó esa persona.

Adaptado del webhook de Kapso que tuvo el repo del team-45 (commit 72be550).
"""

import hashlib
import hmac
import logging
import os
from dataclasses import dataclass
from enum import StrEnum

import anthropic
import httpx
from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, ValidationError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kapso-resumen")

KAPSO_API_KEY = os.environ.get("KAPSO_API_KEY", "")
KAPSO_PHONE_NUMBER_ID = os.environ.get("KAPSO_PHONE_NUMBER_ID", "")
KAPSO_WEBHOOK_SECRET = os.environ.get("KAPSO_WEBHOOK_SECRET", "")

# https://docs.kapso.ai/api/introduction.md (WhatsApp API, mirrors Meta's Graph API)
KAPSO_WHATSAPP_BASE_URL = "https://api.kapso.ai/meta/whatsapp/v24.0"
MESSAGE_RECEIVED_EVENT = "whatsapp.message.received"
# WhatsApp caps a text message body at 4096 characters.
MAX_WHATSAPP_TEXT = 4096

MODEL = "claude-opus-5-5"
WHATSAPP_FORMAT = (
    "La respuesta se lee en WhatsApp: sin títulos ni markdown (nada de #, ** ni tablas), solo texto plano. "
    "Si el texto es muy corto o no da para esto, dilo en una línea y pide uno más largo."
)


class Mode(StrEnum):
    SUMMARY = "resumen"
    IDEAS = "ideas"
    TASKS = "tareas"


@dataclass(frozen=True)
class ModeSpec:
    button_title: str  # WhatsApp caps reply button titles at 20 characters.
    system: str


MODES = {
    Mode.SUMMARY: ModeSpec(
        button_title="Resumen",
        system="Resume en español simple el texto que te manda la persona, en 3 a 5 líneas. ",
    ),
    Mode.IDEAS: ModeSpec(
        button_title="Punteo de ideas",
        system=(
            "Arma un punteo en español simple con las ideas principales del texto que te manda la persona. "
            "Una idea por línea, cada una partiendo con '• ', frases cortas, máximo 8 ideas, "
            "en el orden en que aparecen. No agregues ideas que no estén en el texto. "
        ),
    ),
    Mode.TASKS: ModeSpec(
        button_title="Tareas",
        system=(
            "Extrae del texto que te manda la persona las acciones concretas que alguien tiene que hacer. "
            "Una por línea, partiendo con '☐ ', con quién la hace y para cuándo si el texto lo dice. "
            "No inventes responsables ni fechas. Si el texto no tiene acciones, dilo en una línea. "
        ),
    ),
}
CHOOSE_PROMPT = "¿Qué hago con tu texto?"
NO_TEXT_REPLY = "Mándame un texto y te ofrezco resumirlo, puntear sus ideas o sacar sus tareas."

app = FastAPI()
# shortcut: in-memory state, lost on restart. Enough for a local test.
seen_idempotency_keys: set[str] = set()
last_text_by_sender: dict[str, str] = {}


class KapsoText(BaseModel):
    body: str


class KapsoButtonReply(BaseModel):
    id: str
    title: str


class KapsoInteractive(BaseModel):
    type: str
    button_reply: KapsoButtonReply | None = None


class KapsoMessage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    type: str
    sender: str | None = Field(default=None, alias="from")
    text: KapsoText | None = None
    interactive: KapsoInteractive | None = None


class KapsoConversation(BaseModel):
    phone_number: str | None = None


class MessageReceivedPayload(BaseModel):
    message: KapsoMessage
    conversation: KapsoConversation | None = None


class MessageReceivedBatch(BaseModel):
    data: list[MessageReceivedPayload]


def is_valid_signature(raw_body: bytes, signature: str | None) -> bool:
    """HMAC-SHA256 hex of the raw body, per https://docs.kapso.ai/docs/platform/webhooks/security.md."""
    if not KAPSO_WEBHOOK_SECRET or not signature:
        return False
    expected = hmac.new(KAPSO_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def parse_payloads(raw_body: bytes, is_batch: bool) -> list[MessageReceivedPayload]:
    if is_batch:
        return MessageReceivedBatch.model_validate_json(raw_body).data
    return [MessageReceivedPayload.model_validate_json(raw_body)]


def sender_of(payload: MessageReceivedPayload) -> str | None:
    return payload.message.sender or (payload.conversation.phone_number if payload.conversation else None)


async def process(mode: Mode, text: str) -> str:
    client = anthropic.AsyncAnthropic()
    response = await client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        system=MODES[mode].system + WHATSAPP_FORMAT,
        messages=[{"role": "user", "content": text}],
        output_config={"effort": "low"},
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
    )
    if response.stop_reason == "refusal":
        return "No pude procesar este texto."
    return "".join(block.text for block in response.content if block.type == "text").strip()


async def _send(to: str, content: dict[str, object]) -> None:
    if not KAPSO_API_KEY:
        logger.info("Kapso sin configurar, no envío a %s: %s", to, content)
        return
    url = f"{KAPSO_WHATSAPP_BASE_URL}/{KAPSO_PHONE_NUMBER_ID}/messages"
    payload = {"messaging_product": "whatsapp", "to": to, **content}
    async with httpx.AsyncClient(timeout=8.0) as client:
        response = await client.post(url, json=payload, headers={"X-API-Key": KAPSO_API_KEY})
        response.raise_for_status()


async def send_text(to: str, body: str) -> None:
    await _send(to, {"type": "text", "text": {"body": body[:MAX_WHATSAPP_TEXT]}})


async def send_mode_buttons(to: str) -> None:
    buttons = [{"type": "reply", "reply": {"id": mode, "title": spec.button_title}} for mode, spec in MODES.items()]
    interactive = {"type": "button", "body": {"text": CHOOSE_PROMPT}, "action": {"buttons": buttons}}
    await _send(to, {"type": "interactive", "interactive": interactive})


async def answer(to: str, text: str | None, button_id: str | None) -> None:
    """Runs after the webhook returned 200, so errors are logged instead of raised."""
    try:
        if text:
            last_text_by_sender[to] = text
            await send_mode_buttons(to)
            return
        if button_id in MODES and to in last_text_by_sender:
            await send_text(to, await process(Mode(button_id), last_text_by_sender[to]))
            return
        await send_text(to, NO_TEXT_REPLY)
    except (anthropic.APIError, httpx.HTTPError):
        logger.exception("No pude responder a %s", to)
        try:
            await send_text(to, "Tuve un problema para procesar tu texto. Intenta de nuevo en un rato.")
        except httpx.HTTPError:
            logger.exception("Tampoco pude avisar del error a %s", to)


@app.get("/health")
def health() -> dict[str, bool]:
    return {
        "kapso_api_key": bool(KAPSO_API_KEY),
        "kapso_phone_number_id": bool(KAPSO_PHONE_NUMBER_ID),
        "kapso_webhook_secret": bool(KAPSO_WEBHOOK_SECRET),
        "anthropic_api_key": bool(os.environ.get("ANTHROPIC_API_KEY")),
    }


@app.post("/webhooks/kapso")
async def kapso_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_webhook_signature: str | None = Header(default=None),
    x_webhook_event: str | None = Header(default=None),
    x_webhook_batch: str | None = Header(default=None),
    x_idempotency_key: str | None = Header(default=None),
) -> dict[str, object]:
    raw_body = await request.body()
    if not is_valid_signature(raw_body, x_webhook_signature):
        raise HTTPException(401, "Invalid signature")
    if x_webhook_event != MESSAGE_RECEIVED_EVENT:
        return {"status": "ignored"}
    if x_idempotency_key:
        if x_idempotency_key in seen_idempotency_keys:
            return {"status": "duplicate"}
        seen_idempotency_keys.add(x_idempotency_key)
    try:
        payloads = parse_payloads(raw_body, is_batch=x_webhook_batch == "true")
    except ValidationError as error:
        logger.warning("Payload de Kapso inesperado: %s", raw_body[:500])
        raise HTTPException(422, "Unexpected Kapso payload") from error
    # Kapso wants a 200 within 10 seconds; Claude can take longer, so answer in the background.
    for payload in payloads:
        sender = sender_of(payload)
        if sender is None:
            continue
        message = payload.message
        text = message.text.body if message.text else None
        button = message.interactive.button_reply if message.interactive else None
        background_tasks.add_task(answer, sender, text, button.id if button else None)
    return {"status": "accepted", "messages": len(payloads)}
