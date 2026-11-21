from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request, status
from pydantic import ValidationError

from app.schemas.kapso import MESSAGE_RECEIVED_EVENT, WebhookAck, WebhookStatus
from app.services import kapso, whatsapp_inbound

router = APIRouter()


@router.post("/webhooks/kapso")
async def kapso_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_webhook_signature: Annotated[str | None, Header()] = None,
    x_webhook_event: Annotated[str | None, Header()] = None,
    x_webhook_batch: Annotated[str | None, Header()] = None,
) -> WebhookAck:
    # Kapso signs the exact bytes it sent, so verify before parsing.
    raw_body = await request.body()
    if not kapso.is_valid_signature(raw_body, x_webhook_signature):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid signature")
    if x_webhook_event != MESSAGE_RECEIVED_EVENT:
        return WebhookAck(status=WebhookStatus.IGNORED, messages=0)
    try:
        messages = kapso.parse_message_received(raw_body, is_batch=x_webhook_batch == "true")
    except ValidationError as error:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "Unexpected Kapso payload") from error
    # Kapso wants a 200 within 10 seconds, so replies go out after the response.
    # shortcut: no dedup by X-Idempotency-Key, a retried delivery gets answered twice; store keys if it shows up.
    for message in messages:
        background_tasks.add_task(whatsapp_inbound.handle, message)
    return WebhookAck(status=WebhookStatus.ACCEPTED, messages=len(messages))
