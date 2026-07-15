# Chat AI — Sequence Diagram

## Authentication & Message Flow

```
┌──────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐        ┌───────────┐
│  Parent  │        │ Frontend │        │Controller│        │  Service │        │ Context  │        │   Gemini  │
│   User   │        │   React  │        │  (Chat)  │        │  (Chat)  │        │ Builder  │        │    API    │
└────┬─────┘        └────┬─────┘        └────┬─────┘        └────┬─────┘        └────┬─────┘        └─────┬─────┘
     │                   │                   │                   │                   │                    │
     │  1. Login         │                   │                   │                   │                    │
     ├──────────────────>│                   │                   │                   │                    │
     │                   │  POST /auth/login │                   │                   │                    │
     │                   ├──────────────────>│                   │                   │                    │
     │                   │                   │  Verify creds     │                   │                    │
     │                   │                   ├──────────────────>│                   │                    │
     │                   │<──────────────────┤                   │                   │                    │
     │                   │  JWT tokens       │                   │                   │                    │
     │<──────────────────┤                   │                   │                   │                    │
     │  Store JWT        │                   │                   │                   │                    │
     │                   │                   │                   │                   │                    │
     │  2. Type message  │                   │                   │                   │                    │
     │  "Show health?"   │                   │                   │                   │                    │
     ├──────────────────>│                   │                   │                   │                    │
     │                   │  3. POST /chat    │                   │                   │                    │
     │                   │  + JWT token      │                   │                   │                    │
     │                   ├──────────────────>│                   │                   │                    │
     │                   │                   │  4. Verify JWT    │                   │                    │
     │                   │                   ├──────────────────>│                   │                    │
     │                   │                   │  (JwtAuthGuard)   │                   │                    │
     │                   │                   │<──────────────────┤                   │                    │
     │                   │                   │  JwtPayload       │                   │                    │
     │                   │                   │                   │                   │                    │
     │                   │                   │  5. Check role    │                   │                    │
     │                   │                   ├──────────────────>│                   │                    │
     │                   │                   │  (RolesGuard)     │                   │                    │
     │                   │                   │<──────────────────┤                   │                    │
     │                   │                   │  ✓ PARENT         │                   │                    │
     │                   │                   │                   │                   │                    │
     │                   │                   │  6. Rate limit OK?│                   │                    │
     │                   │                   ├──────────────────>│                   │                    │
     │                   │                   │  (ThrottleGuard)  │                   │                    │
     │                   │                   │<──────────────────┤                   │                    │
     │                   │                   │  ✓ 25/30 used     │                   │                    │
     │                   │                   │                   │                   │                    │
     │                   │                   │  7. sendMessage() │                   │                    │
     │                   │                   ├──────────────────>│                   │                    │
     │                   │                   │                   │  8. Get parent ID │                    │
     │                   │                   │                   ├─────────────────> │                    │
     │                   │                   │                   │  (from userId)    │                    │
     │                   │                   │                   │<─────────────────┤│                    │
     │                   │                   │                   │  parentId         │                    │
     │                   │                   │                   │                   │                    │
     │                   │                   │                   │  9. retrieveContext()                  │
     │                   │                   │                   ├──────────────────>│                    │
     │                   │                   │                   │                   │  a. Fetch parent   │
     │                   │                   │                   │                   │     profile, KYC   │
     │                   │                   │                   │                   │  b. Fetch child    │
     │                   │                   │                   │                   │     (verify own)   │
     │                   │                   │                   │                   │  c. Fetch health   │
     │                   │                   │                   │                   │  d. Fetch visits   │
     │                   │                   │                   │                   │  e. Fetch adoption │
     │                   │                   │                   │<──────────────────┤                    │
     │                   │                   │                   │  RetrievedContext │                    │
     │                   │                   │                   │                   │                    │
     │                   │                   │                   │  10. generateReply()                   │
     │                   │                   │                   ├───────────────────────────────────────>│
     │                   │                   │                   │  (system prompt + context + message)   │
     │                   │                   │                   │                   │                    │
     │                   │                   │                   │                   │   Gemini processes │
     │                   │                   │                   │                   │   multi-turn chat  │
     │                   │                   │                   │                   │                    │
     │                   │                   │                   │<───────────────────────────────────────┤
     │                   │                   │                   │  AI reply (Markdown)                   │
     │                   │                   │                   │                   │                    │
     │                   │                   │                   │  11. Log conversation                  │
     │                   │                   │                   ├──────────────────>│                    │
     │                   │                   │                   │  (AISession +     │                    │
     │                   │                   │                   │   AIConversationMessage)               │
     │                   │                   │                   │<──────────────────┤                    │
     │                   │                   │<──────────────────┤                   │                    │
     │                   │                   │  reply            │                   │                    │
     │                   │<──────────────────┤                   │                   │                    │
     │                   │  { reply: "..." } │                   │                   │                    │
     │<──────────────────┤                   │                   │                   │                    │
     │  Display Markdown │                   │                   │                   │                    │
     │                   │                   │                   │                   │                    │
```

## Error Handling Flow

```
┌──────────┐        ┌──────────┐        ┌──────────┐
│ Frontend │        │Controller│        │  Service │
└────┬─────┘        └────┬─────┘        └────┬─────┘
     │                   │                   │
     │  POST /chat       │                   │
     │  (expired JWT)    │                   │
     ├──────────────────>│                   │
     │                   │  JWT expired?     │
     │                   ├──────────────────>│
     │<──────────────────┤                   │
     │  401 Unauthorized │                   │
     │                   │                   │
     │  POST /chat       │                   │
     │  (ADMIN role)     │                   │
     ├──────────────────>│                   │
     │                   │  Check role       │
     │                   ├──────────────────>│
     │<──────────────────┤                   │
     │  403 Forbidden    │                   │
     │                   │                   │
     │  POST /chat       │                   │
     │  (31st request)   │                   │
     ├──────────────────>│                   │
     │                   │  Rate limit?      │
     │                   ├──────────────────>│
     │<──────────────────┤                   │
     │  429 Too Many     │                   │
     │      Requests     │                   │
     │                   │                   │
     │  POST /chat       │                   │
     │  (Gemini down)    │                   │
     ├──────────────────>│                   │
     │                   ├──────────────────>│
     │                   │                   │  Gemini error
     │                   │                   ├──────────X
     │<──────────────────┤<──────────────────┤
     │  500 Internal     │                   │
     │      Error        │                   │
```

## Database Interaction

```
┌──────────────┐        ┌───────────┐
│   Context    │        │ PostgreSQL│
│   Builder    │        │  Database │
└──────┬───────┘        └─────┬─────┘
       │                      │
       │  1. Get parent       │
       │  profile + KYC       │
       ├─────────────────────>│
       │  SELECT * FROM       │
       │  parents WHERE       │
       │  id = ?              │
       │<─────────────────────┤
       │  parent data         │
       │                      │
       │  2. Verify child     │
       │  ownership           │
       ├─────────────────────>│
       │  SELECT * FROM       │
       │  adoption_records    │
       │  WHERE ...           │
       │<─────────────────────┤
       │  adoption record     │
       │                      │
       │  3. Fetch child      │
       │  + orphanage         │
       ├─────────────────────>│
       │  SELECT c.*, o.*     │
       │  FROM children c     │
       │  JOIN orphanages o   │
       │  WHERE c.id = ?      │
       │<─────────────────────┤
       │  child + orphanage   │
       │                      │
       │  4. Fetch health     │
       │  reports             │
       ├─────────────────────>│
       │  SELECT * FROM       │
       │  health_reports      │
       │  WHERE child_id = ?  │
       │  ORDER BY date DESC  │
       │  LIMIT 3             │
       │<─────────────────────┤
       │  health reports      │
       │                      │
       │  5. Fetch visit      │
       │  requests            │
       ├─────────────────────>│
       │  SELECT * FROM       │
       │  visit_requests      │
       │  WHERE parent_id = ? │
       │<─────────────────────┤
       │  visit requests      │
       │                      │
       │  Return aggregated   │
       │  context             │
       └──────────────────────┘
```
