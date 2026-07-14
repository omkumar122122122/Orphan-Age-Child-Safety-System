<div align="center">

# 🛡️ Orphan Age Child Safety System

### *Protecting children. Empowering caregivers. Bridging futures.*

[![NestJS](https://img.shields.io/badge/Backend-NestJS_10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

---

> A full-stack, AI-assisted child welfare management platform that unifies orphanage operations,
> parent verification, adoption tracking, health monitoring, and child safety surveillance
> under one secure, role-driven system.

</div>

---

## What is This?

The **Orphan Age Child Safety System** is a production-grade platform built to modernise child welfare operations across orphanages, government bodies, and adoption agencies. It brings together disparate workflows — from registering a child's health record to verifying adoptive parents via KYC — into a single, audited, and AI-augmented management hub.

At its core, the system is driven by a mission: **every child in institutional care deserves visibility, safety, and a path to a loving home**. The platform makes that happen by giving each stakeholder — admins, orphanage managers, social workers, and parents — exactly the tools they need, guarded by role-based access, and powered by real-time data.

### What Makes It Special

- **SahayakAI** — an embedded AI assistant that helps caseworkers surface insights, draft welfare reports, and flag at-risk children
- **AI-Powered Attendance** — automated attendance tracking using facial recognition patterns
- **Parent KYC & Verification Centre** — structured identity verification pipeline for prospective parents before any adoption is initiated
- **End-to-end Adoption Management** — from initial inquiry to court-ready documentation, tracked at every stage
- **Health Monitoring** — vaccination, medical history, and wellness tracking per child
- **Child Welfare Follow-Up Sessions** — scheduled caseworker sessions with notes, outcomes, and escalation paths
- **Real-time Alerts** — critical event notifications (missing child, medical emergency, legal deadline) sent to relevant stakeholders
- **Complete Audit Trail** — every auth event and data change is logged for compliance

---

## Project Structure

```
Orphan Age Child Safety System/
│
├── 📁 src/                          # React frontend (Vite)
│   ├── components/                  # Reusable UI components
│   ├── pages/                       # Route-level page components
│   ├── layouts/                     # Role-specific dashboard layouts
│   ├── context/                     # Auth + Theme React contexts
│   ├── hooks/                       # Custom React hooks
│   ├── services/                    # API call layer
│   ├── data/                        # Mock data (pre-backend integration)
│   ├── utils/                       # Helper utilities
│   └── styles.css                   # Global styles
│
├── 📁 backend/                      # NestJS backend (API + Auth)
│   ├── prisma/
│   │   ├── schema.prisma            # DB schema: User, RefreshToken, OtpToken, AuditLog
│   │   └── seed.ts                  # Seeds admin + orphanage accounts
│   ├── src/
│   │   ├── auth/                    # Full auth module (JWT, OTP, email, RBAC)
│   │   ├── users/                   # User management module
│   │   ├── prisma/                  # Global Prisma service
│   │   ├── common/                  # Guards, decorators, filters, interceptors
│   │   ├── config/                  # App, JWT, email configuration
│   │   ├── main.ts                  # Server bootstrap + Swagger setup
│   │   └── app.module.ts            # Root module
│   ├── .env.example                 # Environment variable template
│   ├── AUTH_API_DOCS.md             # Detailed auth API reference
│   └── package.json
│
├── index.html
├── package.json                     # Frontend package config
├── postcss.config.js
└── README.md                        # This file
```

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 7 |
| Forms | React Hook Form 7 |
| Charts | Chart.js 4 + React-Chartjs-2 |
| Animations | Framer Motion 11 |
| Icons | Lucide React + React Icons |

### Backend
| Layer | Technology |
|---|---|
| Framework | NestJS 10 (TypeScript) |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Auth | JWT (access + refresh), Passport.js |
| Password hashing | bcryptjs (12 rounds) |
| Email | Nodemailer (SMTP) |
| Validation | class-validator + class-transformer |
| API Docs | Swagger / OpenAPI 3 |
| Rate limiting | @nestjs/throttler |
| Config | @nestjs/config |

---

## Prerequisites

Make sure the following are installed on your machine:

| Tool | Min Version | Download |
|---|---|---|
| Node.js | 18.x LTS | https://nodejs.org |
| npm | 9.x | Included with Node |
| PostgreSQL | 14.x | https://postgresql.org/download |
| Git | Latest | https://git-scm.com |

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Orphan Age Child Safety System"
```

---

## Backend Setup

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
# Database — replace with your PostgreSQL credentials
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/child_safety_db?schema=public

# JWT — generate strong random strings (min 32 chars each)
JWT_ACCESS_SECRET=your-super-secret-access-key-at-least-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-chars

# Email — use Gmail App Password or any SMTP provider
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

### 5. Create the PostgreSQL database

Open your PostgreSQL client (psql, pgAdmin, or TablePlus) and run:

```sql
CREATE DATABASE child_safety_db;
```

### 6. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables: `users`, `refresh_tokens`, `otp_tokens`, `audit_logs`.

### 7. Generate the Prisma client

```bash
npx prisma generate
```

### 8. Seed default accounts

```bash
npx ts-node prisma/seed.ts
```

This creates two ready-to-use accounts:

| Email | Password | Role |
|---|---|---|
| `admin@childsafety.org` | `Admin@1234!` | ADMIN |
| `orphanage@childsafety.org` | `Orphanage@1234!` | ORPHANAGE |

### 9. Start the backend server

```bash
# Development (hot reload)
npm run start:dev

# Production
npm run build && npm run start:prod
```

The API will be available at:
- **REST API:** `http://localhost:3000/api/v1`
- **Swagger UI:** `http://localhost:3000/docs`

---

## Frontend Setup

### 10. Open a new terminal and go back to the root

```bash
# From the backend directory
cd ..
```

### 11. Install frontend dependencies

```bash
npm install
```

### 12. Start the frontend dev server

```bash
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

> **Note:** The frontend currently uses mock data from `src/data/dummyData.js`.
> To connect it to the live backend, update `src/services/authService.js` to call
> `http://localhost:3000/api/v1/auth/login` instead of the fake login function.

### 13. Build the frontend for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Running Both Simultaneously

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/docs |
| Prisma Studio | `npx prisma studio` → http://localhost:5555 |

---

## Authentication Module — Feature Deep Dive

The backend authentication module is fully production-ready. Here's what it handles:

### Endpoints at a Glance

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create account + send verification email |
| `POST` | `/auth/login` | Public | Login → returns access + refresh tokens |
| `POST` | `/auth/logout` | Auth | Revoke current session |
| `POST` | `/auth/logout-all` | Auth | Revoke all sessions (all devices) |
| `POST` | `/auth/refresh` | Refresh token | Rotate tokens — get a new pair |
| `POST` | `/auth/verify-email` | Public | Confirm email with token from email |
| `POST` | `/auth/resend-verification` | Auth | Resend verification email |
| `POST` | `/auth/forgot-password` | Public | Send password reset link |
| `POST` | `/auth/reset-password` | Public | Set new password via reset token |
| `PATCH` | `/auth/change-password` | Auth | Change password (current + new) |
| `POST` | `/auth/otp/send` | Auth | Generate + email a 6-digit OTP |
| `POST` | `/auth/otp/verify` | Auth | Verify OTP (with attempt tracking) |
| `GET` | `/auth/me` | Auth | Get current user's profile |
| `GET` | `/auth/admin/test` | ADMIN | Test admin-only access |

### Security Highlights

```
JWT Access Token  →  15-minute TTL  →  Bearer header
JWT Refresh Token →  7-day TTL      →  X-Refresh-Token header / body
                                        Stored as bcrypt hash in PostgreSQL
                                        Rotated on every refresh (old token revoked)
                                        Reuse detection → all sessions wiped

Password          →  bcrypt, 12 rounds
Email tokens      →  crypto.randomBytes(32) → SHA-256 hash in DB
OTP codes         →  6-digit, crypto-random → bcrypt hash in DB → 10 min TTL
Account lockout   →  5 failed attempts → 30-minute lock
Rate limits       →  Per-route throttle guards (3–10 req/min on auth routes)
Audit log         →  Every auth event stored in audit_logs table
```

### Role-Based Access Control

```
ADMIN         → Full access, bypasses all role checks
ORPHANAGE     → Manage orphanage data, view children and users
SOCIAL_WORKER → Case management, user lookups, follow-up sessions
PARENT        → Parent portal, visit requests, KYC submission
GUEST         → Default role, limited read access
```

---

## Frontend Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email + password auth |
| Admin Dashboard | `/admin` | System-wide stats, user management |
| Orphanage Dashboard | `/orphanage` | Orphanage-level operations |
| Parent Dashboard | `/parent` | Parent portal home |
| Children | `/children` | Full child registry |
| Child Profile | `/children/:id` | Individual child details |
| Register Child | `/children/register` | Add a new child to the system |
| Orphanages | `/orphanages` | Orphanage directory |
| Orphanage Detail | `/orphanages/:id` | Orphanage profile |
| Register Orphanage | `/orphanages/register` | Register a new institution |
| Child Adoption Management | `/adoption` | Adoption pipeline |
| Parent KYC | `/parent/kyc` | KYC document submission |
| Parent Verification Centre | `/verification` | Admin KYC review queue |
| Visit Request | `/visit-request` | Parent visit scheduling |
| Manage Visit Requests | `/visits` | Admin visit management |
| AI Attendance | `/attendance` | AI-powered attendance tracking |
| Health Monitoring | `/health` | Child health records |
| Child Welfare Follow-Up | `/welfare` | Caseworker session management |
| SahayakAI | `/ai` | Embedded AI assistant |
| Alerts | `/alerts` | Real-time safety alerts |
| Reports | `/reports` | Analytics and reporting |
| Profile | `/profile` | User account settings |

---

## Useful Development Commands

### Backend

```bash
# Start in watch mode
npm run start:dev

# Run database migrations
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset the database (careful — wipes all data)
npx prisma migrate reset

# Re-seed after reset
npx ts-node prisma/seed.ts

# View TypeScript compilation errors
npm run build

# Format code
npm run format

# Lint
npm run lint
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Connecting Frontend to Backend

The frontend currently uses `src/data/dummyData.js` for mock auth.
To connect to the live NestJS backend, replace `src/services/authService.js` with real API calls:

```js
// src/services/authService.js

const API_BASE = 'http://localhost:3000/api/v1';

export async function login({ email, password, rememberMe = false }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');

  // Persist tokens
  localStorage.setItem('accessToken', data.data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

  return data.data.user;
}

export async function logout() {
  const accessToken = localStorage.getItem('accessToken');
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'X-Refresh-Token': refreshToken },
  });

  const data = await res.json();
  if (!res.ok) throw new Error('Session expired');

  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);

  return data.data.accessToken;
}
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
DATABASE_URL=postgresql://user:password@localhost:5432/child_safety_db
JWT_ACCESS_SECRET=<min-32-char-random-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=<different-min-32-char-random-string>
JWT_REFRESH_EXPIRY=7d
EMAIL_VERIFICATION_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Child Safety System
EMAIL_FROM_ADDRESS=noreply@childsafety.org
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=30
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=5
CORS_ORIGINS=http://localhost:5173
```

---

## Common Issues & Fixes

**`Cannot connect to PostgreSQL`**
- Confirm PostgreSQL is running: `pg_ctl status` or check Services on Windows
- Verify `DATABASE_URL` credentials match your Postgres setup
- Make sure the database `child_safety_db` exists

**`JWT secret must be defined`**
- Copy `.env.example` to `.env` and set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`

**`Prisma client not found`**
- Run `npx prisma generate` after installing or updating the Prisma schema

**`Email not sending`**
- For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your regular password
- Make sure 2-Step Verification is enabled on the Google account
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`

**`Port 3000 already in use`**
- Change `PORT=3001` in `backend/.env` and update `CORS_ORIGINS` on the frontend

**`CORS errors in browser`**
- Add your frontend origin to `CORS_ORIGINS` in `backend/.env`
- Example: `CORS_ORIGINS=http://localhost:5173,http://localhost:3001`

---

## API Documentation

Two levels of API docs are included:

### 1. Interactive Swagger UI
Start the backend, then open:
```
http://localhost:3000/docs
```
Every endpoint is documented with request schemas, response examples, auth requirements, and a live "Try it out" button.

### 2. Markdown API Reference
See [`backend/AUTH_API_DOCS.md`](./backend/AUTH_API_DOCS.md) for:
- Complete endpoint reference with request/response examples
- Authentication flow diagrams
- Token architecture and rotation logic
- Security feature breakdown
- Error code reference
- Environment variable table
- Database schema overview

---

## Roadmap

- [ ] Connect React frontend to live NestJS backend (replace mock data)
- [ ] Add Google OAuth 2.0 sign-in
- [ ] SMS OTP delivery via Twilio
- [ ] Real-time notifications (WebSockets / Socket.io)
- [ ] TOTP-based 2FA (Google Authenticator / Authy)
- [ ] File upload service (child documents, KYC photos)
- [ ] Scheduled cron job for token cleanup
- [ ] Docker Compose setup for one-command local dev
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] E2E test suite (Playwright)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style — TypeScript strict mode on the backend, functional components on the frontend.

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built with purpose.**  
*Every line of code serves a child who deserves safety, care, and a future.*

---

Made by **Om Kumar Gupta**

</div>
