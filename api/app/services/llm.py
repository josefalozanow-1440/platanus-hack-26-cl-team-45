"""The only place that calls a language model. Everything else goes through complete()."""

from functools import cache

import anthropic
from anthropic.types import Message, MessageParam, ToolParam

from app.config import ANTHROPIC_API_KEY

MODEL = "claude-sonnet-5-5"
MAX_TOKENS = 16000
# Chat replies are short; low effort keeps latency down for WhatsApp-like turns.
EFFORT = "low"


class LlmUnavailableError(Exception):
    """No API key configured, or the API failed: callers fall back to scripted answers."""


def is_configured() -> bool:
    return bool(ANTHROPIC_API_KEY)


@cache
def _client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


def complete(system: str, messages: list[MessageParam], tools: list[ToolParam]) -> Message:
    if not is_configured():
        raise LlmUnavailableError("ANTHROPIC_API_KEY is empty")
    try:
        return _client().messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=system,
            messages=messages,
            tools=tools,
            output_config={"effort": EFFORT},
        )
    except anthropic.APIStatusError as error:
        raise LlmUnavailableError(f"Anthropic API returned {error.status_code}") from error
    except anthropic.APIConnectionError as error:
        raise LlmUnavailableError("Anthropic API unreachable") from error
