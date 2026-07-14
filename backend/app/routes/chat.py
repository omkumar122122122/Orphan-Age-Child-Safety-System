"""
/api/chat route handler.

Receives a chat request, delegates to the Gemini service,
and returns the AI reply.
"""

import logging
from fastapi import APIRouter, HTTPException, status

from app.models.chat import ChatRequest, ChatResponse
from app.services.gemini_service import get_ai_reply

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Send a message to the AI assistant",
    description=(
        "Accepts a user message and conversation history, "
        "calls Google Gemini, and returns the AI reply."
    ),
)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    POST /api/chat

    Body:
        message (str):        The user's latest message.
        conversation (list):  Previous turns for multi-turn context.
        parentId (str|None):  Optional parent ID for personalisation.
        childId (str|None):   Optional child ID for personalisation.

    Returns:
        ChatResponse with a single `reply` field (Markdown string).
    """
    logger.info(
        "Chat request — parentId=%s childId=%s history_turns=%d",
        request.parentId,
        request.childId,
        len(request.conversation),
    )

    try:
        reply = await get_ai_reply(
            user_message=request.message,
            conversation=request.conversation,
            parent_id=request.parentId,
            child_id=request.childId,
        )
    except RuntimeError as exc:
        # Known operational errors (API key missing, safety block, etc.)
        logger.warning("AI reply error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        # Unexpected errors
        logger.error("Unexpected error in chat route: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again.",
        ) from exc

    return ChatResponse(reply=reply)
