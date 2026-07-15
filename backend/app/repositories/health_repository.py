"""
repositories/health_repository.py
───────────────────────────────────────────────────────────────────────────────
Data access layer for child health records and reports.

CURRENT STATE: Placeholder — returns None / empty list.

TO CONNECT A REAL DATABASE:
  Replace each function body with a real DB query, e.g.:
    results = await db.health_reports.find({"child_id": child_id}).to_list(10)
"""

from typing import Optional


async def get_latest_health_report(child_id: str) -> Optional[dict]:
    """
    Fetch the most recent health report for a child.
    TODO: Replace with real DB query.
    """
    _demo: dict[str, dict] = {
        "CH-1034": {
            "Report Date":    "18 Mar 2026",
            "Doctor":         "Dr. Priya Menon",
            "Diagnosis":      "Mild anaemia — iron therapy ongoing",
            "Treatment":      "Ferrous sulphate tablet daily, multivitamin",
            "Notes":          "Haemoglobin improving: 10.2 g/dL (was 9.4). Next review in 3 months.",
            "Next Checkup":   "18 Jun 2026",
        }
    }
    return _demo.get(child_id)


async def get_health_history(child_id: str) -> list[dict]:
    """
    Fetch historical health records for a child (newest first).
    TODO: Replace with real DB query.
    """
    _demo: dict[str, list] = {
        "CH-1034": [
            {"date": "2026-03-18", "diagnosis": "Anaemia follow-up",   "doctor": "Dr. Priya Menon",  "treatment": "Iron therapy continued"},
            {"date": "2025-12-05", "diagnosis": "Routine checkup",     "doctor": "Dr. Priya Menon",  "treatment": "Iron supplement started"},
            {"date": "2025-07-20", "diagnosis": "Routine checkup",     "doctor": "Dr. Rajan Mehta",  "treatment": "General assessment"},
        ]
    }
    return _demo.get(child_id, [])
