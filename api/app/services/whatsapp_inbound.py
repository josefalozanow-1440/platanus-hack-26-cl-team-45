"""What Comité answers on WhatsApp. The domain plugs in at `reply_for`.

Only statuses travel over WhatsApp, never RSH, amounts or cédulas (L-06).
"""

import logging
from enum import StrEnum

from app.schemas.kapso import InboundMessage, OutboundReply, ReplyButton
from app.services import kapso

logger = logging.getLogger(__name__)


class MenuOption(StrEnum):
    MY_FOLDER = "mi_carpeta"
    MY_GROUP = "mi_grupo"
    TALK_TO_PERSON = "hablar_persona"


MENU = OutboundReply(
    body="Hola, te escribe Comité. ¿Qué quieres revisar?",
    buttons=[
        ReplyButton(id=MenuOption.MY_FOLDER, title="Mi carpeta"),
        ReplyButton(id=MenuOption.MY_GROUP, title="Cómo va mi grupo"),
        # WhatsApp caps button titles at 20 characters, so not "Hablar con una persona".
        ReplyButton(id=MenuOption.TALK_TO_PERSON, title="Hablar con alguien"),
    ],
)

FIXED_REPLIES = {
    MenuOption.MY_FOLDER: OutboundReply(
        body="Muy pronto vas a poder ver por aquí en qué va tu carpeta. Por ahora, pregúntale a tu dirigencia."
    ),
    MenuOption.MY_GROUP: OutboundReply(
        body="Muy pronto vas a poder ver por aquí cómo avanza tu grupo y qué paso viene."
    ),
    # shortcut: no real handoff yet (L-10), wire it to Kapso's inbox or the dirigencia when the domain exists.
    MenuOption.TALK_TO_PERSON: OutboundReply(body="Listo, le vamos a pedir a una persona del comité que te escriba."),
}


def reply_for(message: InboundMessage) -> OutboundReply:
    """Decide the answer to one inbound message. Replace the fixed replies with domain lookups here."""
    if message.button_id in FIXED_REPLIES:
        return FIXED_REPLIES[MenuOption(message.button_id)]
    return MENU


async def handle(message: InboundMessage) -> None:
    """Answer one inbound message. Send failures are logged, not raised, so Kapso does not retry."""
    reply = reply_for(message)
    try:
        if reply.buttons:
            await kapso.send_buttons(message.sender, reply.body, reply.buttons)
        else:
            await kapso.send_text(message.sender, reply.body)
    except kapso.KapsoSendError:
        logger.exception("Could not answer WhatsApp message %s", message.message_id)
