# Chat AI — Deployment Guide

## Production Deployment Checklist

### 1. Environment Configuration

Create `.env.production`:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-db-host:5432/orphanage_db
JWT_ACCESS_SECRET=super-secret-key-here-min-32-chars
JWT_REFRESH_SECRET=different-secret-key-here-min-32-chars

# Google Gemini
GEMINI_API_KEY=your_production_api_key
GEMINI_MODEL=gemini-2.0-flash-exp
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1024

# Rate Limiting
THROTTLE_LONG_TTL=3600000
THROTTLE_LONG_LIMIT=30
```

---

### 2. Database Setup

Run Prisma migrations:

```bash
npm run prisma:migrate deploy
```

Verify tables exist:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_sessions', 'ai_conversation_messages', 'parents', 'children');
```

---

### 3. Install Dependencies

```bash
npm ci --production
npm install @google/generative-ai
```

---

### 4. Build Application

```bash
npm run build
```

Check build output:

```bash
ls -lah dist/
```

---

### 5. Security Hardening

#### Rate Limiting
Already configured: 30 requests/hour per user

#### CORS
Update `src/app.module.ts` if needed:

```typescript
// Only allow production frontend domain
const corsOptions = {
  origin: 'https://yourproductiondomain.com',
  credentials: true,
};
```

#### Helmet
Already enabled via middleware

#### API Key Rotation
- Store Gemini API key in AWS Secrets Manager / Azure Key Vault
- Rotate every 90 days

---

### 6. Monitoring Setup

#### Application Logs

Use Winston or Pino for structured logging:

```typescript
// app.module.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

WinstonModule.forRoot({
  transports: [
    new winston.transports.File({ filename: 'chat-ai.log' }),
  ],
});
```

#### Metrics to Track

- Total chat messages per day
- Average response latency
- AI provider error rate
- Rate limit hits per hour
- Token usage (from Gemini API)

#### Set up Alerts

- Email alert if AI provider returns 50x errors for 5+ minutes
- Slack alert if rate limit hits exceed 100/hour
- PagerDuty if database connection fails

---

### 7. Load Testing

Use Artillery or k6:

```yaml
# artillery-chat.yml
config:
  target: 'https://api.yourapp.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: Send chat message
    flow:
      - post:
          url: '/chat'
          headers:
            Authorization: 'Bearer {{token}}'
          json:
            message: 'What is my child health status?'
            conversation: []
```

Run:

```bash
artillery run artillery-chat.yml
```

---

### 8. Database Indexes

Verify these indexes exist:

```sql
-- Parent lookup by userId
CREATE INDEX IF NOT EXISTS idx_parent_user_id ON parents(user_id);

-- AI session lookup
CREATE INDEX IF NOT EXISTS idx_ai_session_parent ON ai_sessions(initiated_by_id, session_type, status);

-- Conversation messages
CREATE INDEX IF NOT EXISTS idx_ai_messages_session ON ai_conversation_messages(session_id, sequence);
```

---

### 9. Backup Strategy

#### Database Backups

```bash
# Daily automated backup
pg_dump -h prod-db-host -U user -d orphanage_db > backup_$(date +%Y%m%d).sql
```

#### Conversation Data Retention

- Keep AISession + AIConversationMessage records for 90 days
- Archive older records to cold storage (S3/Azure Blob)

```sql
-- Archive old sessions
INSERT INTO ai_sessions_archive 
SELECT * FROM ai_sessions 
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM ai_sessions 
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

### 10. Disaster Recovery

#### Rollback Plan

If deployment fails:

```bash
git revert <commit-hash>
npm run build
pm2 restart orphanage-backend
```

#### Gemini API Fallback

If Gemini API is down, implement fallback:

```typescript
// ai-provider.service.ts
async generateReply(...) {
  try {
    return await this.callGemini();
  } catch (error) {
    if (error.status >= 500) {
      // Fallback to pre-defined responses
      return this.fallbackResponse(userMessage);
    }
    throw error;
  }
}
```

---

### 11. Cost Optimization

#### Gemini API Pricing

- **Free tier**: 15 requests/minute, 1500 requests/day
- **Paid tier**: $0.000125 per 1000 input tokens, $0.000375 per 1000 output tokens

#### Caching Strategy

Cache frequently asked questions:

```typescript
// Implement Redis cache
const cacheKey = `chat:${hash(message)}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;

const reply = await aiProvider.generateReply(...);
await redis.setex(cacheKey, 3600, reply); // 1 hour TTL
```

---

### 12. Compliance & Audit

#### GDPR Compliance

- Users can request chat history deletion
- Implement `DELETE /chat/history/:sessionId`

#### Audit Logging

All AI interactions are logged to:
- `ai_sessions` (session metadata)
- `ai_conversation_messages` (full message content)
- `audit_logs` (API access logs)

#### Data Anonymization

Before archiving, anonymize PII:

```sql
UPDATE ai_conversation_messages 
SET content = regexp_replace(content, '\d{10,}', 'REDACTED', 'g')
WHERE session_id IN (SELECT id FROM ai_sessions WHERE created_at < NOW() - INTERVAL '90 days');
```

---

### 13. Health Check Endpoint

Add health check for monitoring:

```typescript
// chat.controller.ts
@Get('health')
async healthCheck() {
  const geminiOk = await this.aiProvider.testConnection();
  const dbOk = await this.prisma.$queryRaw`SELECT 1`;
  
  return {
    status: geminiOk && dbOk ? 'healthy' : 'degraded',
    gemini: geminiOk ? 'ok' : 'error',
    database: dbOk ? 'ok' : 'error',
  };
}
```

---

### 14. Deployment Commands

#### Using PM2

```bash
pm2 start npm --name "orphanage-backend" -- run start:prod
pm2 save
pm2 startup
```

#### Using Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

Build & run:

```bash
docker build -t orphanage-backend .
docker run -d -p 3000:3000 --env-file .env.production orphanage-backend
```

---

### 15. Post-Deployment Verification

- [ ] Health check endpoint returns 200
- [ ] Send test message as PARENT user → receives AI reply
- [ ] Check logs for errors: `tail -f chat-ai.log`
- [ ] Verify database writes: `SELECT COUNT(*) FROM ai_sessions WHERE created_at > NOW() - INTERVAL '1 hour';`
- [ ] Monitor Gemini API usage in Google Cloud Console

---

## Support Contacts

- **Backend Team**: backend@yourcompany.com
- **DevOps**: devops@yourcompany.com
- **Google Gemini Support**: https://ai.google.dev/support

---

**Deployment Sign-off**

**Deployed By**: ___________________  
**Date**: ___________________  
**Version**: ___________________  
**Environment**: [ ] Staging [ ] Production  

**All Checks Passed**: [ ] Yes [ ] No
