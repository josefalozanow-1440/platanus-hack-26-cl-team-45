"""Kapso webhook payloads (v2) and our transport-level message models.

Payload shapes: https://docs.kapso.ai/docs/platform/webhooks/message-events.md
"""

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

# Meta limits for reply buttons: https://docs.kapso.ai/api/meta/whatsapp/messages/send-a-message.md
MAX_REPLY_BUTTONS = 3
MAX_BUTTON_TITLE_LENGTH = 20
MESSAGE_RECEIVED_EVENT = "whatsapp.message.received"


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
    phone_number_id: str | None = None


class MessageReceivedBatch(BaseModel):
    """Envelope Kapso uses when buffering is enabled for whatsapp.message.received."""

    data: list[MessageReceivedPayload]


class InboundMessage(BaseModel):
    """One inbound WhatsApp message, already stripped of Kapso's envelope."""

    message_id: str
    sender: str
    text: str | None = None
    button_id: str | None = None


class ReplyButton(BaseModel):
    id: str
    title: str = Field(max_length=MAX_BUTTON_TITLE_LENGTH)


class OutboundReply(BaseModel):
    body: str
    buttons: list[ReplyButton] = Field(default_factory=list, max_length=MAX_REPLY_BUTTONS)


class WebhookStatus(StrEnum):
    ACCEPTED = "accepted"
    IGNORED = "ignored"


class WebhookAck(BaseModel):
    status: WebhookStatus
    messages: int
