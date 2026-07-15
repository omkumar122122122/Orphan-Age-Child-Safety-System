"""
repositories/appointment_repository.py
───────────────────────────────────────────────────────────────────────────────
Data access layer for appointments and visit requests.

CURRENT STATE: Placeholder — returns demo data.

TO CONNECT A REAL DATABASE:
  Replace each function body with a real DB query.
"""

from typing import Optional
from datetime import date


async def get_upcoming_appointments(parent_id: str) -> list[dict]:
    """
    Fetch upcoming appointments for a parent (visits, checkups, etc.).
    TODO: Replace with real DB query.
    """
    _demo: dict[str, list] = {
        "PAR-2026-0148": [
            {
                "type":     "Orphanage Visit",
                "date":     "2026-07-12",
                "time":     "10:30 AM",
                "location": "Hope Children's Home, Jaipur",
                "status":   "Pending Approval",
                "notes":    "Adoption inquiry — bring identity documents",
            },
            {
                "type":     "KYC Renewal",
                "date":     "2026-07-10",
                "time":     "N/A",
                "location": "Online / Welfare Office",
                "status":   "Due",
                "notes":    "6-month KYC renewal — Aadhaar, selfie, address proof required",
            },
        ]
    }
    return _demo.get(parent_id, [])


async def get_visit_history(parent_id: str) -> list[dict]:
    """
    Fetch previous visit records for a parent.
    TODO: Replace with real DB query.
    """
    _demo: dict[str, list] = {
        "PAR-2026-0148": [
            {"id": "VR-23974", "orphanage": "Hope Children's Home", "date": "2026-06-20", "status": "Approved",  "purpose": "Counselling"},
            {"id": "VR-23888", "orphanage": "Bright Future Home",   "date": "2026-06-03", "status": "Completed", "purpose": "Document Verification"},
        ]
    }
    return _demo.get(parent_id, [])
