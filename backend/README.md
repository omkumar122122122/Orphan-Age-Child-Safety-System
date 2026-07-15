# AI Chat Backend — FastAPI + Gemini

## Quick Start

```bash
# 1. Navigate to backend folder
cd backend

# 2. Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Add your Gemini API key to .env
# Edit .env and replace 'your_gemini_api_key_here' with your real key
# Get one free from: https://aistudio.google.com/app/apikey

# 5. Run the server
uvicorn app.main:app --reload --port 8000
```

The API will be live at: http://localhost:8000

Interactive docs: http://localhost:8000/docs

## Endpoints

| Method | Path        | Description                   |
|--------|-------------|-------------------------------|
| POST   | /api/chat   | Send message, get AI reply    |
| GET    | /health     | Liveness check                |

## Request Body — POST /api/chat

```json
{
  "message": "What is my child's vaccination status?",
  "conversation": [],
  "parentId": "PAR-2026-0148",
  "childId": "CH-1034"
}
```

## Response

```json
{
  "reply": "Based on the records for **Anaya Das** (CH-1034)..."
}
```

## Connecting to a Real Database

Replace the placeholder functions in `app/services/gemini_service.py`:

- `fetch_parent_profile(parent_id)` → query your parents collection/table
- `fetch_child_profile(child_id)` → query your children collection/table
- `fetch_vaccination_schedule(child_id)` → query vaccinations
- `fetch_health_reports(child_id)` → query health reports
- `fetch_kyc_status(parent_id)` → query KYC records
- `fetch_appointments(parent_id)` → query upcoming appointments
