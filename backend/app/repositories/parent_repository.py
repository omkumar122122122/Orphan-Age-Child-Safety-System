"""
repositories/parent_repository.py
───────────────────────────────────────────────────────────────────────────────
Data access layer for parent records.

CURRENT STATE: Placeholder — returns hardcoded demo data.

TO CONNECT A REAL DATABASE:
  - Replace the body of each function with an actual DB query.
  - Examples:
      MongoDB:    await db.parents.find_one({"_id": parent_id})
      PostgreSQL: await db.fetch_one("SELECT * FROM parents WHERE id = $1", parent_id)
      MySQL:      cursor.execute("SELECT * FROM parents WHERE id = %s", (parent_id,))

  - The calling code (retrieval_service.py) does NOT need to change —
    just update the function bodies here.

VECTOR SEARCH (RAG):
  - Optionally embed parent profile text and store in ChromaDB / FAISS / Pinecone.
  - Replace the return value with a similarity-search result.
"""

from typing import Optional


async def get_parent_by_id(parent_id: str) -> Optional[dict]:
    """
    Fetch parent profile by ID.

    Returns a flat dict of label → value pairs that will be injected
    into the Gemini context block. Return None if not found.
    """
    # ── TODO: Replace with real DB query ──────────────────────
    _demo: dict[str, dict] = {
        "PAR-2026-0148": {
            "Parent Name":          "Meera Nair",
            "Parent ID":            "PAR-2026-0148",
            "KYC Status":           "Verified",
            "Last KYC Date":        "10 Jan 2026",
            "Next KYC Due":         "10 Jul 2026",
            "Trust Score":          "95 / 100",
            "Face Match Score":     "99%",
            "Risk Level":           "Low",
            "Background Check":     "Passed",
            "Linked Child":         "Anaya Das (CH-1034)",
            "Adoption Date":        "18 Feb 2025",
            "Health Report Status": "Pending (due Dec 2026)",
            "Compliance Status":    "Partially Compliant",
            "Contact":              "+91 98765 21048",
            "Email":                "parent@example.com",
        }
    }
    return _demo.get(parent_id)


async def get_kyc_status(parent_id: str) -> Optional[dict]:
    """
    Fetch KYC verification status for a parent.
    TODO: Replace with real DB query.
    """
    # Placeholder — derive from parent profile for now
    profile = await get_parent_by_id(parent_id)
    if not profile:
        return None
    return {
        "KYC Status":    profile.get("KYC Status"),
        "Last KYC Date": profile.get("Last KYC Date"),
        "Next KYC Due":  profile.get("Next KYC Due"),
    }
