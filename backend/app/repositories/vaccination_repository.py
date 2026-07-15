"""
repositories/vaccination_repository.py
───────────────────────────────────────────────────────────────────────────────
Data access layer for vaccination records.

CURRENT STATE: Placeholder — returns demo data.

TO CONNECT A REAL DATABASE:
  Replace each function body with a real DB query.
"""

from typing import Optional


async def get_vaccination_schedule(child_id: str) -> Optional[list[dict]]:
    """
    Fetch the full vaccination schedule for a child.
    TODO: Replace with real DB query.
    """
    _demo: dict[str, list] = {
        "CH-1034": [
            {"vaccine": "BCG",        "date_given": "2014-04-12", "next_due": None,         "status": "Completed"},
            {"vaccine": "Hepatitis B","date_given": "2014-04-12", "next_due": None,         "status": "Completed"},
            {"vaccine": "MMR",        "date_given": "2017-10-05", "next_due": None,         "status": "Completed"},
            {"vaccine": "OPV",        "date_given": "2016-07-22", "next_due": None,         "status": "Completed"},
            {"vaccine": "Typhoid",    "date_given": "2023-09-14", "next_due": "2025-09-14", "status": "Overdue"},
            {"vaccine": "Td Booster", "date_given": None,         "next_due": "2026-08-01", "status": "Pending"},
            {"vaccine": "Influenza",  "date_given": "2025-11-20", "next_due": "2026-11-20", "status": "Pending"},
        ]
    }
    return _demo.get(child_id)


async def get_overdue_vaccinations(child_id: str) -> list[dict]:
    """
    Fetch only overdue vaccinations for a child.
    TODO: Replace with real DB query.
    """
    schedule = await get_vaccination_schedule(child_id)
    if not schedule:
        return []
    return [v for v in schedule if v["status"] == "Overdue"]
