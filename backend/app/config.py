"""
Application configuration.
Reads environment variables from .env via python-dotenv.
"""
import os
from dotenv import load_dotenv

# Load .env from the backend root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))


class Settings:
    # ── Gemini ────────────────────────────────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    # ── CORS ─────────────────────────────────────────────────
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",   # Vite default
        "http://localhost:3000",   # CRA / alternative
        "http://127.0.0.1:5173",
    ]

    # ── App ───────────────────────────────────────────────────
    APP_TITLE: str = "Child Safety AI Assistant API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # ── Gemini generation parameters ─────────────────────────
    MAX_OUTPUT_TOKENS: int = 1024
    TEMPERATURE: float = 0.7


settings = Settings()
