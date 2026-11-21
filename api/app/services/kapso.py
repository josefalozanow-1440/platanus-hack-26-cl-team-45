"""Kapso transport: send WhatsApp messages and read Kapso webhooks. No domain logic here."""

import hashlib
import hmac
import logging

import httpx

from app import config
from app.schemas.kapso import (
    InboundMessage,
    MessageReceivedBatch,
    MessageReceivedPayload,
    ReplyButton,
)

logger = logging.getLogger(__name__)

# https://docs.kapso.ai/api/introduction.md (WhatsApp API, mirrors Meta's Graph API)
KAPSO_WHATSAPP_BASE_URL = "https://api.kapso.ai/meta/whatsapp/v24.0"
SEND_TIMEOUT_SECONDS = 8.0


class KapsoSendError(Exception):
    """Kapso rejected or could not receive an outbound message."""


def is_valid_signature(raw_body: bytes, signature: str | None) -> bool:
    """HMAC-SHA256 hex of the raw body, per https://docs.kapso.ai/docs/platform/webhooks/security.md."""
    if not config.KAPSO_WEBHOOK_SECRET or not signature:
        return False
    expected = hmac.new(config.KAPSO_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def parse_message_received(raw_body: bytes, is_batch: bool) -> list[InboundMessage]:
    """Parse a whatsapp.message.received body, single or batched, into inbound messages."""
    if is_batch:
        payloads = MessageReceivedBatch.model_validate_json(raw_body).data
    else:
        payloads = [MessageReceivedPayload.model_validate_json(raw_body)]
    return [message for payload in payloads if (message := _to_inbound(payload)) is not None]


def _to_inbound(payload: MessageReceivedPayload) -> InboundMessage | None:
    message = payload.message
    sender = message.sender or (payload.conversation.phone_number if payload.conversation else None)
    if sender is None:
        # shortcut: BSUID-only contacts (no phone) are skipped, reply via `recipient` when Meta rolls BSUIDs out.
        logger.warning("Skipping Kapso message %s without a phone number", message.id)
        return None
    button = message.interactive.button_reply if message.interactive else None
    return InboundMessage(
        message_id=message.id,
        sender=sender,
        text=message.text.body if message.text else None,
        button_id=button.id if button else None,
    )


async def send_text(to: str, body: str, transport: httpx.AsyncBaseTransport | None = None) -> str | None:
    """Send a text message. Returns the WhatsApp message id, or None when Kapso is not configured."""
    return await _send(to, {"type": "text", "text": {"body": body}}, transport)


async def send_buttons(
    to: str, body: str, buttons: list[ReplyButton], transport: httpx.AsyncBaseTransport | None = None
) -> str | None:
    """Send an interactive message with up to three reply buttons."""
    interactive = {
        "type": "button",
        "body": {"text": body},
        "action": {"buttons": [{"type": "reply", "reply": {"id": b.id, "title": b.title}} for b in buttons]},
    }
    return await _send(to, {"type": "interactive", "interactive": interactive}, transport)


async def _send(to: str, content: dict[str, object], transport: httpx.AsyncBaseTransport | None) -> str | None:
    if not config.KAPSO_API_KEY:
        logger.info("Kapso not configured, not sending to %s: %s", to, content)
        return None
    url = f"{KAPSO_WHATSAPP_BASE_URL}/{config.KAPSO_PHONE_NUMBER_ID}/messages"
    payload = {"messaging_product": "whatsapp", "to": to, **content}
    async with httpx.AsyncClient(transport=transport, timeout=SEND_TIMEOUT_SECONDS) as client:
        try:
            response = await client.post(url, json=payload, headers={"X-API-Key": config.KAPSO_API_KEY})
            response.raise_for_status()
        except httpx.HTTPError as error:
            raise KapsoSendError(str(error)) from error
    return response.json()["messages"][0]["id"]
