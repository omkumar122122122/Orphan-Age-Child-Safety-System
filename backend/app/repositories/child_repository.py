"""
repositories/child_repository.py
───────────────────────────────────────────────────────────────────────────────
Data access layer for child records.

CURRENT STATE: Placeholder — returns hardcoded demo data.

TO CONNECT A REAL DATABASE:
  - Replace each function body with a real DB query.
  - See parent_repository.py for database examples.
"""

from typing import Optional


async def get_child_by_id(child_id: str) -> Optional[dict]:
    """
    Fetch child profile by ID.
    Returns a flat dict or None if not found.
    TODO: Replace with real DB query.
    """
    _demo: dict[str, dict] = {
        "CH-1034": {
            "Child Name":          "Anaya Das",
            "Child ID":            "CH-1034",
            "Age":                 "12 years",
            "Gender":              "Female",
            "Blood Group":         "O+",
            "Orphanage":           "Hope Nest, Jaipur",
            "Health Status":       "Under Observation (mild anaemia)",
            "Attendance":          "89%",
            "Education Level":     "Class 7",
            "Vaccination Status":  "Typhoid booster overdue; Td booster pending",
            "Last Checkup":        "18 Mar 2026",
            "Next Checkup":        "18 Jun 2026",
            "Assigned Case Worker":"Priya Menon",
            "Emergency Contact":   "+91 98765 11034 (Hope Nest Welfare Desk)",
            "Adoption Date":       "18 Feb 2025",
        }
    }
    return _demo.get(child_id)
