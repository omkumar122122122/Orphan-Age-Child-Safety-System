# Authentication Module — API Documentation

> **Orphan Age Child Safety System** | NestJS + Prisma + PostgreSQL  
> Base URL: `http://localhost:3000/api/v1`  
> Interactive Docs: `http://localhost:3000/docs`

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Folder Structure](#folder-structure)
4. [Authentication Flow](#authentication-flow)
5. [Roles & Permissions](#roles--permissions)
6. [API Reference](#api-reference)
   - [Auth Endpoints](#auth-endpoints)
   - [Users Endpoints](#users-endpoints)
7. [Request / Response Format](#request--response-format)
8. [Error Handling](#error-handling)
9. [Security Features](#security-features)
10. [Environment Variables](#environment-variables)
11. [Database Schema](#database-schema)

---

## Overview

The authentication module provides a complete, production-grade identity layer:

| Feature | Implementation |
|---|---|
| Access tokens | JWT (HS256), 15-minute TTL |
| Refresh tokens | JWT (HS256), 7-day TTL, bcrypt-hashed in DB |
| Token rotation | Old refresh token revoked on every refresh |
| Token family detection | Reused revoked token triggers full session wipe |
| Password hashing | bcrypt, configurable rounds (default 12) |
| Email verification | SHA-256 hashed token, 24-hour expiry |
| Password reset | SHA-256 hashed token, 1-hour expiry |
| OTP | 6-digit numeric, bcrypt-hashed, 10-minute expiry |
| Brute-force protection | Account lockout after 5 failed logins (30 min) |
| Rate limiting | Per-route throttle guards (NestJS Throttler) |
| RBAC | Decorator-driven role checks, ADMIN bypass |
| Audit log | Every auth action written to `audit_logs` table |
| Soft delete | Users never hard-deleted; `deletedAt` timestamp |

---

## Quick Start

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Copy and fill environment variables
cp .env.example .env

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database (creates admin + orphanage accounts)
npx ts-node prisma/seed.ts

# 7. Start the server
npm run start:dev
```

**Default seed accounts:**

| Email | Password | Role |
|---|---|---|
| `admin@childsafety.org` | `Admin@1234!` | ADMIN |
| `orphanage@childsafety.org` | `Orphanage@1234!` | ORPHANAGE |

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # DB schema: User, RefreshToken, OtpToken, AuditLog
│   └── seed.ts                # Default admin + orphanage accounts
│
├── src/
│   ├── main.ts                # Bootstrap: Swagger, global pipes/filters/interceptors
│   ├── app.module.ts          # Root module: ConfigModule, ThrottlerModule, middleware
│   │
│   ├── config/
│   │   ├── app.config.ts      # App, security, OTP, throttle settings
│   │   ├── jwt.config.ts      # Access/refresh token secrets & expiry
│   │   └── email.config.ts    # SMTP settings
│   │
│   ├── auth/
│   │   ├── auth.module.ts     # Wires all auth providers
│   │   ├── auth.service.ts    # Business logic: register, login, logout, etc.
│   │   ├── auth.controller.ts # 14 HTTP endpoints with Swagger
│   │   │
│   │   ├── dto/               # Input validation (class-validator)
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   ├── forgot-password.dto.ts
│   │   │   ├── reset-password.dto.ts
│   │   │   ├── verify-email.dto.ts
│   │   │   ├── verify-otp.dto.ts
│   │   │   ├── send-otp.dto.ts
│   │   │   ├── refresh-token.dto.ts
│   │   │   └── change-password.dto.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts    # Validates access token; honours @Public()
│   │   │   ├── jwt-refresh.guard.ts # Validates refresh token
│   │   │   ├── local-auth.guard.ts  # Email+password (Passport local)
│   │   │   └── roles.guard.ts       # RBAC; ADMIN bypasses all checks
│   │   │
│   │   ├── strategies/
│   │   │   ├── jwt-access.strategy.ts   # Validates JWT + user active + pwd change
│   │   │   ├── jwt-refresh.strategy.ts  # Token rotation + family compromise detection
│   │   │   └── local.strategy.ts        # Passport local strategy
│   │   │
│   │   ├── interfaces/
│   │   │   ├── jwt-payload.interface.ts   # JwtPayload, RefreshTokenPayload
│   │   │   └── auth-response.interface.ts # AuthResponse, TokenPair, AuthenticatedUser
│   │   │
│   │   └── services/
│   │       ├── token.service.ts  # JWT sign/verify, token rotation, SHA-256 helpers
│   │       ├── email.service.ts  # Nodemailer + branded HTML templates
│   │       └── otp.service.ts    # OTP generate, bcrypt hash, verify, attempt tracking
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts    # CRUD, role/status updates, stats
│   │   ├── users.controller.ts # 8 endpoints with Swagger
│   │   └── dto/
│   │       └── update-user.dto.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts  # Global module
│   │   └── prisma.service.ts # PrismaClient + lifecycle + cleanup helpers
│   │
│   └── common/
│       ├── constants/auth.constants.ts   # Keys, strategy names, audit actions
│       ├── enums/role.enum.ts             # Role, OtpPurpose, AuthProvider
│       ├── decorators/
│       │   ├── public.decorator.ts        # @Public() — skip JWT guard
│       │   ├── roles.decorator.ts         # @Roles(...roles)
│       │   ├── current-user.decorator.ts  # @CurrentUser() / @CurrentUser('sub')
│       │   └── skip-throttle.decorator.ts # @SkipThrottle()
│       ├── filters/http-exception.filter.ts    # Maps Prisma + HTTP errors → JSON
│       ├── interceptors/
│       │   ├── logging.interceptor.ts     # Per-request structured logging
│       │   └── transform.interceptor.ts   # Wraps responses in { success, data, ... }
│       └── middleware/
│           ├── request-id.middleware.ts       # X-Request-ID tracing header
│           └── security-headers.middleware.ts # X-Frame-Options, CSP, etc.
│
├── .env.example    # All required environment variables documented
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

---

## Authentication Flow

### Standard Login Flow

```
Client                          Server
  │                               │
  ├─ POST /auth/register ────────>│ 1. Validate + hash password
  │                               │ 2. Generate email verification token
  │<─ 201 { message } ───────────┤ 3. Send verification email
  │                               │
  ├─ GET /auth/verify-email ─────>│ 4. Verify token → mark isEmailVerified=true
  │<─ 200 { message } ───────────┤ 5. Send welcome email
  │                               │
  ├─ POST /auth/login ───────────>│ 6. Validate credentials
  │                               │ 7. Check lockout / active status
  │                               │ 8. Generate access + refresh token pair
  │<─ 200 { user, tokens } ──────┤ 9. Persist hashed refresh token
  │                               │
  ├─ GET /api/protected ─────────>│ 10. JwtAuthGuard validates access token
  │  Authorization: Bearer <AT>   │ 11. JwtPayload injected into request
  │<─ 200 { data } ──────────────┤
  │                               │
  ├─ POST /auth/refresh ─────────>│ 12. JwtRefreshGuard validates refresh token
  │  X-Refresh-Token: <RT>        │ 13. Check DB: not revoked, not expired
  │                               │ 14. Verify bcrypt hash
  │                               │ 15. Revoke old token (ROTATION)
  │<─ 200 { tokens } ────────────┤ 16. Issue new access + refresh pair
  │                               │
  ├─ POST /auth/logout ──────────>│ 17. Revoke current refresh token
  │<─ 200 { message } ───────────┤
```

### Token Reuse / Compromise Detection

If a **revoked** refresh token is used again, the server detects a potential token theft:

1. All active refresh tokens for that user are immediately revoked
2. All sessions across all devices are terminated
3. Client receives `401 Unauthorized` with a security message

### Password Reset Flow

```
POST /auth/forgot-password  →  Email sent with SHA-256 hashed token link
POST /auth/reset-password   →  Token verified, password hashed, all sessions revoked
```

### OTP Flow

```
POST /auth/otp/send    →  6-digit code generated, bcrypt-hashed in DB, emailed to user
POST /auth/otp/verify  →  Code verified against hash, attempt counter incremented
                           → 5 failed attempts = OTP invalidated, new one required
```

---

## Roles & Permissions

| Role | Level | Description |
|---|---|---|
| `ADMIN` | 5 | Full system access — bypasses all role checks |
| `ORPHANAGE` | 4 | Orphanage management, user lists |
| `SOCIAL_WORKER` | 3 | Case management, user lookups |
| `PARENT` | 2 | Parent/guardian portal access |
| `GUEST` | 1 | Default role — limited read-only access |

### Guard Behaviour

- **`@Public()`** — skips `JwtAuthGuard` entirely (no token needed)
- **`@Roles(Role.ADMIN)`** — allows only the listed roles; ADMIN always passes
- No decorator — any authenticated user can access

### Using in Code

```typescript
// Public route — no token required
@Public()
@Get('health')
healthCheck() { return { status: 'ok' }; }

// Any authenticated user
@Get('profile')
getProfile(@CurrentUser() user: JwtPayload) { ... }

// Specific roles only
@Roles(Role.ADMIN, Role.ORPHANAGE)
@Get('children')
getChildren() { ... }

// Get only the user ID from token
@Get('me')
getMe(@CurrentUser('sub') userId: string) { ... }
```

---

## API Reference

### Auth Endpoints

All auth endpoints are prefixed with `/api/v1/auth`.

---

#### `POST /auth/register`

Register a new user account.

**Access:** Public | **Rate limit:** 5 requests / minute

**Request body:**
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecureP@ssw0rd!",
  "phone": "+919876543210",
  "role": "GUEST"
}
```

**Password rules:** min 8 chars, uppercase + lowercase + number + special char (`@$!%*?&`)

**Response `201`:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Registration successful. Please check your email to verify your account."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Errors:** `400` validation | `409` email/phone already exists | `429` rate limit

---

#### `POST /auth/login`

Authenticate with email and password.

**Access:** Public | **Rate limit:** 10 requests / minute

**Request body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd!",
  "rememberMe": false
}
```

`rememberMe: true` extends refresh token TTL from 7 days to 30 days.

**Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "GUEST",
      "isEmailVerified": true,
      "isTwoFactorEnabled": false,
      "avatar": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "accessTokenExpiresAt": "2024-01-01T00:15:00.000Z",
      "refreshTokenExpiresAt": "2024-01-08T00:00:00.000Z"
    },
    "message": "Login successful"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Errors:** `401` invalid credentials | `403` account locked or deactivated | `429` rate limit

---

#### `POST /auth/logout`

Revoke current session's refresh token.

**Access:** Authenticated (`Authorization: Bearer <accessToken>`)

**Request body (optional):**
```json
{ "refreshToken": "eyJhbGci..." }
```

**Response `200`:** `{ "message": "Logout successful" }`

---

#### `POST /auth/logout-all`

Revoke all refresh tokens — logs out from every device.

**Access:** Authenticated

**Response `200`:** `{ "message": "Logout successful" }`

---

#### `POST /auth/refresh`

Exchange a valid refresh token for a new token pair. Old refresh token is revoked.

**Access:** Public (uses refresh token) | Send token via:
- Header: `X-Refresh-Token: <refreshToken>`
- Body: `{ "refreshToken": "..." }`

**Response `200`:**
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "accessTokenExpiresAt": "2024-01-01T00:15:00.000Z",
    "refreshTokenExpiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

**Errors:** `401` invalid/expired/revoked token

---

#### `POST /auth/verify-email`

Verify email address using the token from the verification email.

**Access:** Public | **Rate limit:** default

**Request body:**
```json
{ "token": "a1b2c3d4e5f6..." }
```

**Response `200`:** `{ "message": "Email verified successfully. Welcome aboard!" }`

**Errors:** `400` invalid or expired token

---

#### `POST /auth/resend-verification`

Resend email verification link.

**Access:** Authenticated | **Rate limit:** 3 requests / minute

**Response `200`:** `{ "message": "Verification email sent. Please check your inbox." }`

---

#### `POST /auth/forgot-password`

Request a password reset link.

**Access:** Public | **Rate limit:** 3 requests / minute

**Request body:**
```json
{ "email": "john.doe@example.com" }
```

**Response `200`:** Always returns success to prevent email enumeration.
```json
{ "message": "If an account with this email exists, a password reset link has been sent." }
```

---

#### `POST /auth/reset-password`

Reset password using the token from the reset email.

**Access:** Public | **Rate limit:** 5 requests / minute

**Request body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "newPassword": "NewSecureP@ssw0rd!",
  "confirmPassword": "NewSecureP@ssw0rd!"
}
```

**Response `200`:** `{ "message": "Password reset successfully. Please log in with your new password." }`

All active sessions are invalidated on success.

**Errors:** `400` token invalid/expired | `400` passwords do not match

---

#### `PATCH /auth/change-password`

Change password while authenticated.

**Access:** Authenticated

**Request body:**
```json
{
  "currentPassword": "OldP@ssw0rd!",
  "newPassword": "NewSecureP@ssw0rd!",
  "confirmPassword": "NewSecureP@ssw0rd!"
}
```

**Response `200`:** `{ "message": "Password changed successfully. All sessions have been invalidated." }`

**Errors:** `400` current password wrong | `400` passwords do not match

---

#### `POST /auth/otp/send`

Generate and email a one-time password.

**Access:** Authenticated | **Rate limit:** 3 requests / minute

**Request body:**
```json
{
  "purpose": "TWO_FACTOR_AUTH"
}
```

**OTP purposes:** `EMAIL_VERIFICATION` | `PHONE_VERIFICATION` | `TWO_FACTOR_AUTH` | `PASSWORD_RESET` | `SENSITIVE_ACTION`

**Response `200`:**
```json
{
  "data": {
    "message": "OTP sent to john@example.com",
    "expiresAt": "2024-01-01T00:10:00.000Z"
  }
}
```

---

#### `POST /auth/otp/verify`

Verify an OTP code.

**Access:** Authenticated

**Request body:**
```json
{
  "code": "123456",
  "purpose": "TWO_FACTOR_AUTH"
}
```

**Response `200`:** `{ "message": "OTP verified successfully" }`

**Errors:** `400` invalid code (with remaining attempts count) | `429` max attempts exceeded

---

#### `GET /auth/me`

Get the currently authenticated user's profile.

**Access:** Authenticated

**Response `200`:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ADMIN",
    "isEmailVerified": true,
    "isTwoFactorEnabled": false,
    "avatar": null
  }
}
```

---

#### `GET /auth/admin/test`

Test ADMIN-only access.

**Access:** Authenticated + `ADMIN` role

**Response `200`:** `{ "message": "Admin access confirmed", "user": { ... } }`

**Errors:** `403` insufficient role

---

### Users Endpoints

All user endpoints are prefixed with `/api/v1/users`.  
All require a valid `Authorization: Bearer <accessToken>` header.

---

#### `GET /users`

List all users (paginated + filtered).

**Access:** ADMIN | ORPHANAGE | SOCIAL_WORKER

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `role` | Role enum | — | Filter by role |
| `search` | string | — | Search email / name |
| `isActive` | boolean | — | Filter by active status |

**Response `200`:**
```json
{
  "data": {
    "users": [ { "id": "...", "email": "...", "role": "ADMIN", ... } ],
    "meta": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### `GET /users/stats`

Get user statistics.

**Access:** ADMIN only

**Response `200`:**
```json
{
  "data": {
    "total": 150,
    "active": 142,
    "inactive": 8,
    "byRole": { "ADMIN": 2, "ORPHANAGE": 15, "PARENT": 80, "GUEST": 53 },
    "recentRegistrations": 12
  }
}
```

---

#### `GET /users/:id`

Get a user by UUID.

**Access:** ADMIN | ORPHANAGE | SOCIAL_WORKER

**Response `200`:** Full user profile object.

**Errors:** `400` invalid UUID | `404` user not found

---

#### `PATCH /users/me`

Update the authenticated user's own profile.

**Access:** Any authenticated user

**Request body (all fields optional):**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+919876543210",
  "avatar": "https://cdn.example.com/avatar.jpg"
}
```

**Errors:** `409` phone already in use

---

#### `PATCH /users/:id/role`

Assign a new role to a user.

**Access:** ADMIN only

**Request body:**
```json
{ "role": "ORPHANAGE" }
```

**Errors:** `403` cannot change own role

---

#### `PATCH /users/:id/status`

Activate or deactivate a user account.

**Access:** ADMIN only

**Request body:**
```json
{ "isActive": false }
```

---

#### `DELETE /users/:id`

Soft-delete a user account (sets `deletedAt`, marks inactive).

**Access:** ADMIN only

**Response `200`:** `{ "message": "User account deleted successfully" }`

**Errors:** `403` cannot delete own account

---

## Request / Response Format

### Authentication Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refresh Token Header (alternative to body)

```
X-Refresh-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response Envelope

Every successful response is wrapped by `TransformInterceptor`:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response Format

All errors are normalised by `HttpExceptionFilter`:

```json
{
  "statusCode": 401,
  "message": "Access token has expired. Please refresh your token.",
  "error": "Unauthorized",
  "path": "/api/v1/auth/me",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

`message` may be a `string` or `string[]` (for validation errors):
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request",
  "path": "/api/v1/auth/register",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Validation error or bad input |
| `401` | Unauthenticated — missing or invalid token |
| `403` | Forbidden — authenticated but insufficient role |
| `404` | Resource not found |
| `409` | Conflict — duplicate email/phone |
| `429` | Too many requests (rate limit hit) |
| `500` | Internal server error |

---

## Error Handling

### Prisma Error Mapping

| Prisma Code | HTTP Status | Message |
|---|---|---|
| `P2002` | `409 Conflict` | Duplicate value for field: `<field>` |
| `P2025` | `404 Not Found` | Record not found |
| `P2003` | `400 Bad Request` | Foreign key constraint violation |

### Account Lockout

After **5 consecutive failed login attempts**, the account is locked for **30 minutes**.

```json
{
  "statusCode": 403,
  "message": "Account is temporarily locked. Try again in 28 minute(s).",
  "error": "Forbidden"
}
```

### Token Errors

| Scenario | Status | Message |
|---|---|---|
| Missing access token | `401` | Authentication required |
| Expired access token | `401` | Access token has expired. Please refresh your token. |
| Invalid access token | `401` | Invalid access token |
| Expired refresh token | `401` | Refresh token has expired. Please log in again. |
| Revoked refresh token (reuse) | `401` | Refresh token reuse detected. All sessions have been invalidated. |
| Wrong token type (refresh used as access) | `401` | Invalid token type |

---

## Security Features

### Token Architecture

```
Access Token (JWT)
  ├─ TTL: 15 minutes (configurable)
  ├─ Contains: sub, email, role, type="access", jti
  ├─ Validated: signature + expiry + user still active + password not changed after issuance
  └─ Sent via: Authorization: Bearer header

Refresh Token (JWT)
  ├─ TTL: 7 days (30 days with rememberMe)
  ├─ Contains: sub, email, role, type="refresh", jti, parentJti
  ├─ Stored in DB: bcrypt-hashed (rounds=10)
  ├─ Validated: signature + expiry + DB record not revoked + bcrypt compare
  └─ Sent via: X-Refresh-Token header or request body
```

### Token Rotation

On every `/auth/refresh` call:
1. Old refresh token is marked `isRevoked=true`, `revokedReason="ROTATION"`
2. A new access + refresh pair is issued with `parentJti` pointing to the old token
3. If the old token is already revoked when presented → **all sessions wiped** (compromise detected)

### Password Security

- Hashed with **bcrypt** (default 12 rounds, configurable via `BCRYPT_ROUNDS`)
- **Email verification tokens** and **password reset tokens** are:
  - Generated with `crypto.randomBytes(32)` (256-bit entropy)
  - SHA-256 hashed before DB storage; raw token sent in email
- Attempting to reuse the same password as current is blocked during change

### Rate Limiting (Throttler)

Three tiers applied globally:

| Tier | Window | Max Requests |
|---|---|---|
| short | 1 second | 3 |
| medium | 10 seconds | 20 |
| long | 60 seconds | 100 |

Auth-sensitive endpoints override with tighter limits:

| Endpoint | Window | Limit |
|---|---|---|
| `/auth/register` | 60s | 5 |
| `/auth/login` | 60s | 10 |
| `/auth/forgot-password` | 60s | 3 |
| `/auth/otp/send` | 60s | 3 |
| `/auth/resend-verification` | 60s | 3 |

### Security Middleware (applied to all routes)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Powered-By: (removed)
X-Request-ID: <uuid> (tracing)
```

### Audit Log

Every auth event is written to the `audit_logs` table:

| Action | Trigger |
|---|---|
| `REGISTER` | Successful registration |
| `LOGIN` | Successful login |
| `LOGOUT` | Logout |
| `REFRESH_TOKEN` | Token rotation |
| `FORGOT_PASSWORD` | Password reset requested |
| `RESET_PASSWORD` | Password reset completed |
| `VERIFY_EMAIL` | Email verified |
| `VERIFY_OTP` | OTP verified |
| `SEND_OTP` | OTP sent |
| `ACCOUNT_LOCKED` | Max failed login attempts reached |
| `PASSWORD_CHANGED` | Authenticated password change |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development` or `production` |
| `PORT` | No | `3000` | Server port |
| `API_PREFIX` | No | `api/v1` | URL prefix for all routes |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | **Yes** | — | Min 32 chars, high-entropy string |
| `JWT_ACCESS_EXPIRY` | No | `15m` | Access token TTL (`15m`, `1h`, etc.) |
| `JWT_REFRESH_SECRET` | **Yes** | — | Min 32 chars, different from access secret |
| `JWT_REFRESH_EXPIRY` | No | `7d` | Refresh token TTL |
| `EMAIL_VERIFICATION_EXPIRY_HOURS` | No | `24` | Hours until verification link expires |
| `PASSWORD_RESET_EXPIRY_HOURS` | No | `1` | Hours until reset link expires |
| `EMAIL_HOST` | **Yes** | — | SMTP host |
| `EMAIL_PORT` | No | `587` | SMTP port |
| `EMAIL_SECURE` | No | `false` | Use TLS (`true` for port 465) |
| `EMAIL_USER` | **Yes** | — | SMTP username |
| `EMAIL_PASS` | **Yes** | — | SMTP password / app password |
| `EMAIL_FROM_NAME` | No | `Child Safety System` | Sender display name |
| `EMAIL_FROM_ADDRESS` | No | `noreply@childsafety.org` | Sender address |
| `FRONTEND_URL` | No | `http://localhost:5173` | Used in email link generation |
| `BCRYPT_ROUNDS` | No | `12` | bcrypt cost factor |
| `MAX_LOGIN_ATTEMPTS` | No | `5` | Failed attempts before lockout |
| `LOCKOUT_DURATION_MINUTES` | No | `30` | Lockout duration |
| `OTP_EXPIRY_MINUTES` | No | `10` | OTP TTL |
| `OTP_LENGTH` | No | `6` | OTP digit count |
| `OTP_MAX_ATTEMPTS` | No | `5` | Max wrong OTP attempts |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated allowed origins |

---

## Database Schema

### Key relationships

```
User  1──*  RefreshToken    (userId FK, cascade delete)
User  1──*  OtpToken        (userId FK, cascade delete)
```

### User model highlights

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `email` | String unique | Lowercased at service layer |
| `password` | String nullable | Null for OAuth users |
| `role` | Role enum | Default: GUEST |
| `isEmailVerified` | Boolean | Default: false |
| `emailVerificationToken` | String unique nullable | SHA-256 hash |
| `passwordResetToken` | String unique nullable | SHA-256 hash |
| `loginAttempts` | Int | Incremented on bad password |
| `lockedUntil` | DateTime nullable | Set after max failed attempts |
| `passwordChangedAt` | DateTime nullable | Used to invalidate old tokens |
| `deletedAt` | DateTime nullable | Soft delete field |

### Cleanup

Call `prisma.cleanExpiredTokens()` on a schedule (e.g. daily cron) to purge expired and revoked tokens:

```typescript
const result = await prismaService.cleanExpiredTokens();
// { refreshTokens: 42, otpTokens: 17 }
```

---

*Generated for Orphan Age Child Safety System — NestJS v10 + Prisma v5 + PostgreSQL*
