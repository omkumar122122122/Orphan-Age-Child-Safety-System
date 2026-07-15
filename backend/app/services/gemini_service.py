"""
Gemini AI service layer.

Wraps the Google Generative AI SDK to:
  - Build the multi-turn conversation history in Gemini's expected format
  - Inject the system prompt and optional context summary
  - Call the Gemini API and return the text reply
  - Handle errors gracefully

Future: swap the placeholder data-fetch functions at the bottom of this
file to real database queries (MongoDB / MySQL / PostgreSQL).
"""

import logging
from typing import Optional

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from app.config import settings
from app.models.chat import ConversationTurn
from app.prompts import SYSTEM_PROMPT, build_context_summary

logger = logging.getLogger(__name__)


# ── Initialise SDK once at import time ────────────────────────────────────────
def _init_gemini() -> None:
    """Configure the Gemini SDK with the API key from settings."""
    if not settings.GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to backend/.env"
        )
    genai.configure(api_key=settings.GEMINI_API_KEY)


_init_gemini()


# ── Safety settings (adjust thresholds as required) ───────────────────────────
_SAFETY_SETTINGS = {
    HarmCategory.HARM_CATEGORY_HARASSMENT:        HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH:       HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

_GENERATION_CONFIG = genai.GenerationConfig(
    max_output_tokens=settings.MAX_OUTPUT_TOKENS,
    temperature=settings.TEMPERATURE,
)


# ── Public service function ────────────────────────────────────────────────────
async def get_ai_reply(
    user_message: str,
    conversation: list[ConversationTurn],
    parent_id: Optional[str] = None,
    child_id: Optional[str] = None,
) -> str:
    """
    Send a message to Gemini and return the assistant's reply.

    Args:
        user_message:  The latest message from the user.
        conversation:  Prior turns [{role, content}, ...].
        parent_id:     Optional — used to fetch personalised parent data.
        child_id:      Optional — used to fetch personalised child data.

    Returns:
        The AI-generated reply string (may contain Markdown).

    Raises:
        RuntimeError: On API failures or blocked content.
    """
    # 1. Fetch context data from DB placeholders
    parent_info = await fetch_parent_profile(parent_id) if parent_id else None
    child_info  = await fetch_child_profile(child_id)   if child_id  else None
    context_summary = build_context_summary(parent_info, child_info)

    # 2. Build the full system instruction (system prompt + context)
    full_system_instruction = SYSTEM_PROMPT
    if context_summary:
        full_system_instruction += f"\n\n{context_summary}"

    # 3. Initialise model with system instruction
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_MODEL,
        system_instruction=full_system_instruction,
        safety_settings=_SAFETY_SETTINGS,
        generation_config=_GENERATION_CONFIG,
    )

    # 4. Build conversation history in Gemini format
    #    Gemini uses "user" / "model" roles (not "assistant")
    history: list[dict] = []
    for turn in conversation:
        gemini_role = "model" if turn.role in ("model", "assistant") else "user"
        history.append({"role": gemini_role, "parts": [turn.content]})

    # 5. Start a chat session and send the latest message
    chat = model.start_chat(history=history)

    try:
        response = chat.send_message(user_message)
    except Exception as exc:
        logger.error("Gemini API error: %s", exc, exc_info=True)
        raise RuntimeError(f"Gemini API error: {exc}") from exc

    # 6. Extract and return text
    if not response.candidates:
        raise RuntimeError("Gemini returned no candidates — content may have been blocked.")

    candidate = response.candidates[0]

    # Check finish reason for safety blocks
    finish_reason = getattr(candidate, "finish_reason", None)
    if finish_reason and finish_reason.name == "SAFETY":
        raise RuntimeError(
            "The response was blocked by Gemini's safety filters. "
            "Please rephrase your question."
        )

    reply_text: str = response.text.strip()
    return reply_text


# ══════════════════════════════════════════════════════════════════════════════
#  DATABASE PLACEHOLDER FUNCTIONS
#  Replace these with real DB queries when connecting to MongoDB / MySQL / PG
# ══════════════════════════════════════════════════════════════════════════════

async def fetch_parent_profile(parent_id: str) -> dict | None:
    """
    Fetch parent profile data from the database.

    TODO: Replace with real DB query.
          e.g. `await db.parents.find_one({"id": parent_id})`

    Returns a dict of key-value pairs shown to the AI as context,
    or None if not found.
    """
    # Placeholder — returns mock data shaped like real DB output
    _mock_profiles = {
        "PAR-2026-0148": {
            "Parent Name":         "Meera Nair",
            "Parent ID":           "PAR-2026-0148",
            "KYC Status":          "Verified",
            "Last KYC Date":       "10 Jan 2026",
            "Next KYC Due":        "10 Jul 2026",
            "Trust Score":         "95 / 100",
            "Linked Child":        "Anaya Das (CH-1034)",
            "Adoption Date":       "18 Feb 2025",
            "Compliance Status":   "Partially Compliant",
            "Health Report Status":"Pending (due Dec 2026)",
        }
    }
    return _mock_profiles.get(parent_id)


async def fetch_child_profile(child_id: str) -> dict | None:
    """
    Fetch child profile data from the database.

    TODO: Replace with real DB query.
          e.g. `await db.children.find_one({"id": child_id})`

    Returns a dict of key-value pairs shown to the AI as context,
    or None if not found.
    """
    _mock_children = {
        "CH-1034": {
            "Child Name":          "Anaya Das",
            "Child ID":            "CH-1034",
            "Age":                 "12 years",
            "Health Status":       "Under Observation (mild anaemia)",
            "Attendance":          "89%",
            "Education Level":     "Class 7",
            "Vaccination Status":  "Typhoid booster overdue; Td booster pending",
            "Last Checkup":        "18 Mar 2026",
            "Next Checkup":        "18 Jun 2026",
            "Emergency Contact":   "+91 98765 11034 (Hope Nest Welfare Desk)",
            "Assigned Case Worker":"Priya Menon",
        }
    }
    return _mock_children.get(child_id)


async def fetch_vaccination_schedule(child_id: str) -> dict | None:
    """
    Fetch vaccination schedule for a child.

    TODO: Replace with real DB query.
    """
    # Placeholder
    return None


async def fetch_health_reports(child_id: str) -> list[dict]:
    """
    Fetch historical health reports for a child.

    TODO: Replace with real DB query.
    """
    # Placeholder
    return []


async def fetch_kyc_status(parent_id: str) -> dict | None:
    """
    Fetch KYC verification status and history for a parent.

    TODO: Replace with real DB query.
    """
    # Placeholder
    return None


async def fetch_appointments(parent_id: str) -> list[dict]:
    """
    Fetch upcoming appointments (visits, checkups, etc.) for a parent.

    TODO: Replace with real DB query.
    """
    # Placeholder
    return []
