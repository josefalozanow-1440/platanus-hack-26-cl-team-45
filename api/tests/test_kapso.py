import asyncio
import hashlib
import hmac
import json
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi.testclient import TestClient

from app import config
from app.schemas.kapso import InboundMessage, ReplyButton
from app.services import kapso, whatsapp_inbound

SECRET = "test-secret"

# Copied from https://docs.kapso.ai/docs/platform/webhooks/message-events.md (whatsapp.message.received).
TEXT_PAYLOAD = {
    "message": {
        "id": "wamid.123",
        "timestamp": "1730092800",
        "type": "text",
        "from": "16315551181",
        "text": {"body": "Hello"},
        "kapso": {"direction": "inbound", "status": "received", "content": "Hello"},
    },
    "conversation": {"id": "conv_123", "phone_number": "16315551181", "phone_number_id": "123456789012345"},
    "is_new_conversation": True,
    "phone_number_id": "123456789012345",
}

# Interactive shape from the same page; batch items have no `from`, only conversation.phone_number.
BUTTON_PAYLOAD = {
    "message": {
        "id": "wamid.456",
        "timestamp": "1730092900",
        "type": "interactive",
        "interactive": {"type": "button_reply", "button_reply": {"id": "mi_grupo", "title": "Cómo va mi grupo"}},
    },
    "conversation": {"id": "conv_123", "phone_number": "+15551234567"},
    "phone_number_id": "123456789012345",
}


@pytest.fixture(autouse=True)
def kapso_config(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(config, "KAPSO_WEBHOOK_SECRET", SECRET)
    monkeypatch.setattr(config, "KAPSO_API_KEY", "")
    monkeypatch.setattr(config, "KAPSO_PHONE_NUMBER_ID", "647015955153740")


def _sign(body: bytes) -> str:
    return hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()


def test_signature_valid_and_invalid() -> None:
    body = json.dumps(TEXT_PAYLOAD).encode()
    assert kapso.is_valid_signature(body, _sign(body))
    assert not kapso.is_valid_signature(body + b" ", _sign(body))
    assert not kapso.is_valid_signature(body, None)


def test_signature_rejected_without_secret(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(config, "KAPSO_WEBHOOK_SECRET", "")
    body = b"{}"
    assert not kapso.is_valid_signature(body, hmac.new(b"", body, hashlib.sha256).hexdigest())


def test_parse_text_message() -> None:
    [message] = kapso.parse_message_received(json.dumps(TEXT_PAYLOAD).encode(), is_batch=False)
    assert message == InboundMessage(message_id="wamid.123", sender="16315551181", text="Hello")


def test_parse_batched_button_reply() -> None:
    body = json.dumps({"type": "whatsapp.message.received", "batch": True, "data": [BUTTON_PAYLOAD]}).encode()
    [message] = kapso.parse_message_received(body, is_batch=True)
    assert message == InboundMessage(message_id="wamid.456", sender="+15551234567", button_id="mi_grupo")


def test_reply_for_menu_and_buttons() -> None:
    menu = whatsapp_inbound.reply_for(InboundMessage(message_id="m", sender="1", text="hola"))
    assert [b.id for b in menu.buttons] == ["mi_carpeta", "mi_grupo", "hablar_persona"]
    group = whatsapp_inbound.reply_for(InboundMessage(message_id="m", sender="1", button_id="mi_grupo"))
    assert group.buttons == []


def test_webhook_answers_text_with_menu(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    send_buttons = AsyncMock()
    monkeypatch.setattr(kapso, "send_buttons", send_buttons)
    body = json.dumps(TEXT_PAYLOAD).encode()
    response = client.post(
        "/webhooks/kapso",
        content=body,
        headers={"X-Webhook-Signature": _sign(body), "X-Webhook-Event": "whatsapp.message.received"},
    )
    assert response.status_code == 200
    assert response.json() == {"status": "accepted", "messages": 1}
    send_buttons.assert_awaited_once_with("16315551181", whatsapp_inbound.MENU.body, whatsapp_inbound.MENU.buttons)


def test_webhook_rejects_bad_signature(client: TestClient) -> None:
    response = client.post("/webhooks/kapso", content=b"{}", headers={"X-Webhook-Signature": "nope"})
    assert response.status_code == 401


def test_webhook_ignores_other_events(client: TestClient) -> None:
    body = b"{}"
    response = client.post(
        "/webhooks/kapso",
        content=body,
        headers={"X-Webhook-Signature": _sign(body), "X-Webhook-Event": "whatsapp.message.delivered"},
    )
    assert response.json() == {"status": "ignored", "messages": 0}


def _capture(requests: list[httpx.Request]) -> httpx.MockTransport:
    return httpx.MockTransport(
        lambda request: requests.append(request) or httpx.Response(200, json={"messages": [{"id": "wamid.out"}]})
    )


def test_send_buttons_builds_kapso_request(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(config, "KAPSO_API_KEY", "key")
    requests: list[httpx.Request] = []
    buttons = [ReplyButton(id="si", title="Sí")]
    message_id = asyncio.run(kapso.send_buttons("56911111111", "¿Aceptas?", buttons, transport=_capture(requests)))
    assert message_id == "wamid.out"
    [request] = requests
    assert str(request.url) == "https://api.kapso.ai/meta/whatsapp/v24.0/647015955153740/messages"
    assert request.headers["X-API-Key"] == "key"
    assert json.loads(request.content) == {
        "messaging_product": "whatsapp",
        "to": "56911111111",
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": "¿Aceptas?"},
            "action": {"buttons": [{"type": "reply", "reply": {"id": "si", "title": "Sí"}}]},
        },
    }


def test_send_text_builds_kapso_request(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(config, "KAPSO_API_KEY", "key")
    requests: list[httpx.Request] = []
    asyncio.run(kapso.send_text("56911111111", "Hola", transport=_capture(requests)))
    assert json.loads(requests[0].content) == {
        "messaging_product": "whatsapp",
        "to": "56911111111",
        "type": "text",
        "text": {"body": "Hola"},
    }


def test_send_without_api_key_only_logs() -> None:
    requests: list[httpx.Request] = []
    assert asyncio.run(kapso.send_text("56911111111", "Hola", transport=_capture(requests))) is None
    assert requests == []


def test_send_error_becomes_domain_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(config, "KAPSO_API_KEY", "key")
    failing = httpx.MockTransport(lambda request: httpx.Response(400, json={"error": "outside 24h window"}))
    with pytest.raises(kapso.KapsoSendError):
        asyncio.run(kapso.send_text("56911111111", "Hola", transport=failing))
