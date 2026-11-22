import hashlib
import hmac
import json

import pytest
from fastapi.testclient import TestClient

import main

SECRET = "test-secret"
PAYLOAD = {
    "message": {"id": "wamid.1", "type": "text", "from": "56911111111", "text": {"body": "Un texto largo."}},
    "conversation": {"phone_number": "56911111111"},
}


def sign(body: bytes) -> str:
    return hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()


@pytest.fixture
def answered(monkeypatch):
    monkeypatch.setattr(main, "KAPSO_WEBHOOK_SECRET", SECRET)
    main.seen_idempotency_keys.clear()
    calls = []

    async def fake_answer(to, text, button_id):
        calls.append((to, text, button_id))

    monkeypatch.setattr(main, "answer", fake_answer)
    return calls


def post(body: bytes, **headers):
    base = {"X-Webhook-Event": "whatsapp.message.received", "X-Webhook-Signature": sign(body)}
    return TestClient(main.app).post("/webhooks/kapso", content=body, headers={**base, **headers})


def test_rejects_bad_signature(answered):
    body = json.dumps(PAYLOAD).encode()
    response = post(body, **{"X-Webhook-Signature": "nope"})
    assert response.status_code == 401
    assert answered == []


def test_answers_single_message(answered):
    response = post(json.dumps(PAYLOAD).encode())
    assert response.json() == {"status": "accepted", "messages": 1}
    assert answered == [("56911111111", "Un texto largo.", None)]


def test_passes_button_reply(answered):
    button_payload = {
        "message": {
            "id": "wamid.2",
            "type": "interactive",
            "from": "56911111111",
            "interactive": {"type": "button_reply", "button_reply": {"id": "ideas", "title": "Punteo de ideas"}},
        }
    }
    post(json.dumps(button_payload).encode())
    assert answered == [("56911111111", None, "ideas")]


@pytest.fixture
def outbox(monkeypatch):
    main.last_text_by_sender.clear()
    sent = []

    async def fake_send(to, content):
        sent.append(content)

    async def fake_process(mode, text):
        return f"{mode}: {text}"

    monkeypatch.setattr(main, "_send", fake_send)
    monkeypatch.setattr(main, "process", fake_process)
    return sent


async def test_text_offers_the_three_modes(outbox):
    await main.answer("569", "Un texto largo.", None)
    buttons = outbox[0]["interactive"]["action"]["buttons"]
    assert [b["reply"]["id"] for b in buttons] == ["resumen", "ideas", "tareas"]
    assert all(len(b["reply"]["title"]) <= 20 for b in buttons)


async def test_button_processes_the_last_text(outbox):
    await main.answer("569", "Primero.", None)
    await main.answer("569", "Segundo.", None)
    await main.answer("569", None, "ideas")
    assert outbox[-1] == {"type": "text", "text": {"body": "ideas: Segundo."}}


async def test_button_without_text_asks_for_one(outbox):
    await main.answer("569", None, "resumen")
    assert outbox == [{"type": "text", "text": {"body": main.NO_TEXT_REPLY}}]


def test_answers_batched_messages(answered):
    body = json.dumps({"type": "whatsapp.message.received", "batch": True, "data": [PAYLOAD, PAYLOAD]}).encode()
    response = post(body, **{"X-Webhook-Batch": "true"})
    assert response.json()["messages"] == 2
    assert len(answered) == 2


def test_ignores_retried_delivery(answered):
    body = json.dumps(PAYLOAD).encode()
    post(body, **{"X-Idempotency-Key": "k1"})
    response = post(body, **{"X-Idempotency-Key": "k1"})
    assert response.json() == {"status": "duplicate"}
    assert len(answered) == 1
