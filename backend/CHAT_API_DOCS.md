# Chat AI API Documentation

## Overview

The Chat AI module provides a production-ready AI assistant (YourSathi) for parent users. It integrates Google Gemini AI with the existing NestJS backend, Prisma ORM, and PostgreSQL database.

---

## Endpoint

### POST /chat

Send a message to the AI assistant with automatic context retrieval.

**Authentication:** Required (JWT Bearer token)  
**Authorization:** PARENT role only  
**Rate Limit:** 30 requests per hour per user

---

## Request

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "message": "What is my child's vaccination status?",
  "conversation": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help you?" }
  ],
  "childId": "clx7w9z8b0001xyzabc123456"
}
```

**Fields:**

| Field          | Type     | Required | Description                                             |
| -------------- | -------- | -------- | ------------------------------------------------------- |
| `message`      | string   | ✅       | User's message (max 4000 chars)                         |
| `conversation` | array    | ❌       | Previous turns for context (max 50 turns)               |
| `childId`      | string   | ❌       | Child ID for personalized context (ownership verified)  |

---

## Response

### Success (200 OK)

```json
{
  "reply": "Based on the records for **Anaya Das** (CH-1034):\n\n**Completed Vaccinations:**\n- BCG, Hepatitis B, MMR, OPV\n\n**⚠️ Overdue:**\n- **Typhoid booster** — due 14 Sep 2025\n\nI recommend scheduling the booster as soon as possible."
}
```

### Error Responses

| Status | Error                           | Description                                    |
| ------ | ------------------------------- | ---------------------------------------------- |
| 401    | Unauthorized                    | Invalid or expired JWT token                   |
| 403    | Forbidden                       | Not a PARENT user, or profile not found        |
| 429    | Too Many Requests               | Rate limit exceeded (30/hour)                  |
| 500    | Internal Server Error           | AI service unavailable                         |

---

## Architecture

```
POST /chat
    ↓
ChatController (@Roles(PARENT), JWT auth, rate limit)
    ↓
ChatService
    ├── 1. Verify parent profile exists
    ├── 2. ContextBuilderService.retrieveContext()
    │       ├── Parent profile, KYC status
    │       ├── Child profile (if childId provided + ownership verified)
    │       ├── Health reports, vaccinations
    │       ├── Visit requests, adoption status
    │       └── Upcoming appointments
    ├── 3. AIProviderService.generateReply()
    │       ├── Build context string (Markdown)
    │       ├── Combine with system prompt
    │       ├── Call Google Gemini API
    │       └── Return AI reply
    └── 4. Log conversation to AISession + AIConversationMessage tables
```

---

## Database Schema

### AISession

Stores chat sessions for analytics and audit.

```prisma
model AISession {
  id            String          @id @default(uuid())
  sessionType   AISessionType   // SAHAYAK_QUERY
  status        AISessionStatus // IN_PROGRESS, COMPLETED
  provider      AIProvider      // GOOGLE_GEMINI
  childId       String?
  initiatedById String?
  startedAt     DateTime?
  completedAt   DateTime?
  messages      AIConversationMessage[]
}
```

### AIConversationMessage

Stores individual messages within a session.

```prisma
model AIConversationMessage {
  id        String    @id @default(uuid())
  sessionId String
  role      MessageRole // USER, ASSISTANT
  content   String    @db.Text
  sequence  Int
  createdAt DateTime  @default(now())
}
```

---

## Environment Variables

Add to `.env`:

```env
# Google Gemini API
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# AI Configuration
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1024
```

Get a FREE Gemini API key: https://aistudio.google.com/app/apikey

---

## Security

✅ **JWT Authentication** — Only authenticated users can access  
✅ **Role-based Authorization** — PARENT role only  
✅ **Rate Limiting** — 30 requests/hour per user  
✅ **Child Ownership Verification** — Parent must be linked to child via AdoptionRecord  
✅ **Data Isolation** — Context includes only the authenticated parent's data  
✅ **API Key Protection** — Gemini API key never exposed to frontend  
✅ **Prompt Injection Prevention** — System prompt instructs AI to ignore embedded instructions  

---

## Testing

Run unit tests:

```bash
npm run test -- chat
```

Run e2e tests:

```bash
npm run test:e2e
```

---

## Example cURL Request

```bash
curl -X POST http://localhost:3000/chat \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is my child'\''s health status?",
    "conversation": [],
    "childId": "clx7w9z8b0001xyzabc123456"
  }'
```

---

## Future Enhancements

- [ ] Streaming responses (SSE)
- [ ] Conversation history retrieval endpoint
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Vector search (RAG with ChromaDB/Pinecone)
- [ ] OpenAI provider support
- [ ] Conversation analytics dashboard
- [ ] Export conversation to PDF

---

## Support

For issues or questions, contact: support@orphanagesafety.gov.in
