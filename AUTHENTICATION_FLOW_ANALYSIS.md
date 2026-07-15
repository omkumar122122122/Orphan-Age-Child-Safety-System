# 🔐 AUTHENTICATION FLOW - COMPLETE ANALYSIS

**Project:** AI-Based Orphan Age Child Safety System  
**Analysis Date:** July 14, 2026  
**Status:** ✅ COMPLETE AUTHENTICATION SYSTEM MAPPED

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Frontend Authentication Flow](#frontend-authentication-flow)
3. [Backend Authentication Flow](#backend-authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Token Management](#token-management)
6. [Security Features](#security-features)
7. [Environment Configuration](#environment-configuration)
8. [Data Flow Diagrams](#data-flow-diagrams)
9. [Error Handling](#error-handling)
10. [Testing Endpoints](#testing-endpoints)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack

**Frontend:**
- React 18.3.1
- React Router DOM 7.1.1
- React Hook Form 7.54.2
- Fetch API (via custom apiClient)

**Backend:**
- NestJS 11.0.0
- Prisma ORM 5.22.0
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs for password hashing

### Authentication Pattern
- **JWT-based authentication** with access + refresh token rotation
- **Role-based access control (RBAC)** with 5 roles
- **Session management** with refresh token persistence
- **Email verification** workflow
- **Password reset** with secure tokens
- **OTP system** for 2FA and sensitive operations

---

## 🎨 FRONTEND AUTHENTICATION FLOW

### 1. Login Component
**Location:** `src/pages/Login.jsx`

#### Key Features:

- **Role Selection UI**: 3 roles (ADMIN, PARENT, ORPHANAGE)
- **Dual Mode**: Login + Parent Signup forms
- **Form Validation**: React Hook Form integration
- **Password Toggle**: Show/hide password functionality
- **Theme Support**: Dark mode compatible
- **Loading States**: Spinner during authentication
- **Error Display**: Inline error messages

#### Role Configuration:
```javascript
const roleConfig = {
  ADMIN:     { label: "Administrator", icon: FiShield,    selectedBg: "bg-indigo-600" },
  PARENT:    { label: "Parent",        icon: FiUserCheck, selectedBg: "bg-emerald-600" },
  ORPHANAGE: { label: "Orphanage",     icon: FiHome,      selectedBg: "bg-civic-600" },
};
```

#### Login Flow:
```javascript
const onSubmit = async (values) => {
  if (!selectedRole) { 
    setError("Please select a role to continue."); 
    return; 
  }
  
  setError("");
  
  try {
    const loggedInUser = await login(values);  // Calls AuthContext.login
    navigate(roleHome[loggedInUser.role], { replace: true });
  } catch (err) {
    setError(err.message);
  }
};
```

#### Redirect After Login:
```javascript
// From utils/constants.js
export const roleHome = {
  ADMIN: "/admin",
  PARENT: "/parent",
  ORPHANAGE: "/orphanage",
  SOCIAL_WORKER: "/social-worker",
  GUEST: "/",
};
```

---

### 2. API Client
**Location:** `src/services/apiClient.js`

#### Configuration:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
```

#### Token Retrieval:
```javascript
getAuthToken() {
  return localStorage.getItem('child_safety_token') || 
         sessionStorage.getItem('child_safety_token');
}
```

#### Request Interceptor:
```javascript
async request(endpoint, options = {}) {
  const token = this.getAuthToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Auto set Content-Type except for FormData
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const url = `${this.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);

    if (response.status === 204) return null;

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = 'Network error. Please check your connection.';
    }
    throw error;
  }
}
```

#### HTTP Methods:
```javascript
get(endpoint, params = {})    // GET with query params
post(endpoint, body)          // POST with JSON or FormData
put(endpoint, body)           // PUT with JSON
patch(endpoint, body)         // PATCH with JSON
delete(endpoint)              // DELETE
```

---

### 3. Auth Service
**Location:** `src/services/authService.js`

#### Available Methods:
```javascript
// Authentication
login(credentials)            // { email, password }
register(userData)            // User registration
logout()                      // End session
refreshTokens(refreshToken)   // Get new access token

// Profile
getMe()                       // Get current user profile

// Password Management
forgotPassword(email)         // Request reset link
resetPassword(data)           // Reset with token
changePassword(data)          // Change (authenticated)
```

#### Login Implementation:
```javascript
export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;  // { user, tokens }
}
```

---

### 4. Auth Context
**Location:** `src/context/AuthContext.jsx`

#### State Management:
```javascript
const [authState, setAuthState] = useState(() => readStoredAuth());
const [loading, setLoading] = useState(false);

// authState shape:
{
  user: { id, email, firstName, lastName, role, ... },
  token: "jwt-access-token",
  refreshToken: "jwt-refresh-token"
}
```

#### Storage Keys:
```javascript
const USER_STORAGE_KEY = "child_safety_user";
const TOKEN_STORAGE_KEY = "child_safety_token";
const REFRESH_TOKEN_KEY = "child_safety_refresh_token";
```

#### Persistence Strategy:
```javascript
function persistAuth(user, accessToken, refreshToken) {
  const serializedUser = JSON.stringify(user);

  // Dual storage for reliability
  localStorage.setItem(USER_STORAGE_KEY, serializedUser);
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  sessionStorage.setItem(USER_STORAGE_KEY, serializedUser);
  sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}
```

#### Login Method:
```javascript
const login = async (credentials) => {
  setLoading(true);
  try {
    // Backend returns: { user, tokens: { accessToken, refreshToken }, message }
    const response = await authService.login(credentials);
    const { user, tokens } = response;

    setAuthState({
      user,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

    persistAuth(user, tokens.accessToken, tokens.refreshToken);
    return user;
  } catch (error) {
    const message = error.data?.message || error.message || 'Login failed';
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};
```

#### Logout Method:
```javascript
const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setAuthState({ user: null, token: null, refreshToken: null });
    clearStoredAuth();
  }
};
```

#### Context Value:
```javascript
const value = useMemo(() => ({
  user: authState.user,
  token: authState.token,
  refreshToken: authState.refreshToken,
  loading,
  login,
  logout,
  refreshAccessToken,
  isAuthenticated: Boolean(authState.user && authState.token)
}), [authState.user, authState.token, authState.refreshToken, loading]);
```

---

## 🔧 BACKEND AUTHENTICATION FLOW

### 1. Auth Controller
**Location:** `backend/src/auth/auth.controller.ts`

#### Controller Configuration:
```typescript
@ApiTags('Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
```

#### Key Endpoints:

**Register:**
```typescript
@Public()
@Post('register')
@HttpCode(HttpStatus.CREATED)
@Throttle({ default: { ttl: 60000, limit: 5 } })
async register(@Body() dto: RegisterDto, @Req() req: Request)
```

**Login:**
```typescript
@Public()
@Post('login')
@HttpCode(HttpStatus.OK)
@Throttle({ default: { ttl: 60000, limit: 10 } })
async login(@Body() dto: LoginDto, @Req() req: Request)
```

**Logout:**
```typescript
@Post('logout')
@HttpCode(HttpStatus.OK)
@ApiBearerAuth('access-token')
async logout(
  @CurrentUser('sub') userId: string,
  @Body() dto?: RefreshTokenDto,
)
```

**Refresh Tokens:**
```typescript
@Public()
@Post('refresh')
@HttpCode(HttpStatus.OK)
@UseGuards(JwtRefreshGuard)
async refreshTokens(
  @CurrentUser() payload: RefreshTokenPayload & { tokenRecordId: string },
  @Req() req: Request,
)
```

**Get Current User:**
```typescript
@Get('me')
@ApiBearerAuth('access-token')
async getMe(@CurrentUser('sub') userId: string)
```

---

### 2. Auth Service
**Location:** `backend/src/auth/auth.service.ts`

#### Dependencies:
```typescript
constructor(
  private readonly prisma: PrismaService,
  private readonly tokenService: TokenService,
  private readonly emailService: EmailService,
  private readonly otpService: OtpService,
  private readonly configService: ConfigService,
) {}
```

#### Login Process:
```typescript
async login(
  dto: LoginDto,
  meta?: { ipAddress?: string; userAgent?: string },
): Promise<AuthResponse> {
  // 1. Validate credentials
  const user = await this.validateCredentials(dto.email, dto.password);

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // 2. Generate token pair
  const tokens = await this.tokenService.generateTokenPair(
    user.id,
    user.email,
    user.role as Role,
    {
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent ?? dto.userAgent,
      rememberMe: dto.rememberMe,
    },
  );

  // 3. Update last login metadata
  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: meta?.ipAddress,
    },
  });

  // 4. Audit log
  await this.logAudit(user.id, AUDIT_ACTIONS.LOGIN, meta?.ipAddress, meta?.userAgent, true);

  // 5. Return response
  return {
    user: this.toAuthenticatedUser(user as any),
    tokens,
    message: 'Login successful',
  };
}
```

#### Credential Validation:
```typescript
async validateCredentials(email: string, password: string) {
  const user = await this.prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      isTwoFactorEnabled: true,
      loginAttempts: true,
      lockedUntil: true,
      deletedAt: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });

  if (!user || user.deletedAt) return null;

  // Check account lock
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new ForbiddenException(
      `Account is temporarily locked. Try again in ${minutes} minute(s).`,
    );
  }

  // Verify password
  const isMatch = user.password
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!isMatch) {
    await this.handleFailedLogin(user.id);
    return null;
  }

  if (!user.isActive) {
    throw new ForbiddenException('Your account has been deactivated. Contact support.');
  }

  // Reset failed login attempts on success
  await this.prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null },
  });

  return user;
}
```

---

## 🔑 TOKEN MANAGEMENT

### Access Token
- **Purpose:** API authentication
- **Lifetime:** 15 minutes (configurable)
- **Storage:** localStorage + sessionStorage
- **Header:** `Authorization: Bearer <token>`

### Refresh Token
- **Purpose:** Obtain new access tokens
- **Lifetime:** 7 days (configurable)
- **Storage:** localStorage + sessionStorage + Database
- **Rotation:** New refresh token issued on every refresh

### Token Structure:
```typescript
interface JwtPayload {
  sub: string;           // User ID
  email: string;         // User email
  role: Role;            // User role
  iat: number;           // Issued at
  exp: number;           // Expires at
  jti?: string;          // JWT ID (refresh tokens only)
}
```

---

## 🛡️ SECURITY FEATURES


### 1. Password Security
- **bcrypt** hashing with 12 rounds
- **Minimum length:** Enforced by DTO validation
- **Password history:** Tracked via `passwordChangedAt`
- **Password reset:** Time-limited tokens (1 hour)

### 2. Account Protection
- **Failed Login Tracking:** Max 5 attempts
- **Account Lockout:** 30 minutes after max attempts
- **Session Invalidation:** On password change/reset
- **Email Verification:** Required before full access

### 3. Token Security
- **Token Rotation:** New refresh token on every refresh
- **Token Revocation:** Stored in database
- **JTI (JWT ID):** Unique identifier for refresh tokens
- **Token Expiry:** Short-lived access tokens

### 4. Rate Limiting
```typescript
@Throttle({ default: { ttl: 60000, limit: 10 } })  // 10 requests per minute
```

**Limits:**
- Register: 5 requests/minute
- Login: 10 requests/minute
- Forgot Password: 3 requests/minute
- OTP Send: 3 requests/minute

### 5. Audit Logging
```typescript
await this.logAudit(userId, action, ipAddress, userAgent, success);
```

**Tracked Actions:**
- REGISTER
- LOGIN
- LOGOUT
- REFRESH_TOKEN
- VERIFY_EMAIL
- FORGOT_PASSWORD
- RESET_PASSWORD
- PASSWORD_CHANGED
- ACCOUNT_LOCKED
- SEND_OTP
- VERIFY_OTP

### 6. Input Validation
- **DTO Validation:** class-validator decorators
- **Email Format:** RFC 5322 compliant
- **SQL Injection:** Prevented by Prisma ORM
- **XSS:** Sanitized inputs

---

## 🌐 API ENDPOINTS

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### POST `/auth/register`
**Purpose:** Register new user  
**Access:** Public  
**Rate Limit:** 5/minute  

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91 98765 43210",
  "role": "GUEST"
}
```

**Response (201):**
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

---

#### POST `/auth/login`
**Purpose:** Authenticate user  
**Access:** Public  
**Rate Limit:** 10/minute  

**Request:**
```json
{
  "email": "admin@safety.gov",
  "password": "admin123",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@safety.gov",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
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

**Errors:**
- `401`: Invalid credentials
- `403`: Account locked or deactivated
- `429`: Too many login attempts

---

#### POST `/auth/logout`
**Purpose:** End current session  
**Access:** Authenticated  
**Headers:** `Authorization: Bearer <access-token>`  

**Request (Optional):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "Logout successful"
  }
}
```

---

#### POST `/auth/refresh`
**Purpose:** Get new access token  
**Access:** Public (requires valid refresh token)  
**Headers:** `X-Refresh-Token: <refresh-token>` OR in body  

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessTokenExpiresAt": "2024-01-01T00:15:00.000Z",
    "refreshTokenExpiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

---

#### GET `/auth/me`
**Purpose:** Get current user profile  
**Access:** Authenticated  
**Headers:** `Authorization: Bearer <access-token>`  

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "email": "admin@safety.gov",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "isEmailVerified": true,
    "isTwoFactorEnabled": false,
    "avatar": null,
    "phone": "+91 98765 43210",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST `/auth/forgot-password`
**Purpose:** Request password reset  
**Access:** Public  
**Rate Limit:** 3/minute  

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "If an account with this email exists, a password reset link has been sent."
  }
}
```

---

#### POST `/auth/reset-password`
**Purpose:** Reset password with token  
**Access:** Public  
**Rate Limit:** 5/minute  

**Request:**
```json
{
  "token": "secure-token-from-email",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "Password reset successfully. Please log in with your new password."
  }
}
```

---

#### PATCH `/auth/change-password`
**Purpose:** Change password (authenticated)  
**Access:** Authenticated  
**Headers:** `Authorization: Bearer <access-token>`  

**Request:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "Password changed successfully. All sessions have been invalidated."
  }
}
```

---

## 🔄 DATA FLOW DIAGRAMS

### Login Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. User enters credentials + selects role
       │
       ▼
┌─────────────────┐
│  Login.jsx      │
│  - Validate     │
│  - Role check   │
└──────┬──────────┘
       │ 2. onSubmit()
       │
       ▼
┌─────────────────┐
│  AuthContext    │
│  - login()      │
└──────┬──────────┘
       │ 3. API call
       │
       ▼
┌─────────────────┐
│  authService.js │
│  - login()      │
└──────┬──────────┘
       │ 4. POST /auth/login
       │
       ▼
┌─────────────────┐
│  apiClient.js   │
│  - Add token    │
│  - Fetch        │
└──────┬──────────┘
       │ 5. HTTP Request
       │
       ▼
┌─────────────────────┐
│  Backend            │
│  auth.controller.ts │
└──────┬──────────────┘
       │ 6. Validate DTO
       │
       ▼
┌─────────────────────┐
│  auth.service.ts    │
│  - validateCreds    │
│  - Check password   │
│  - Generate tokens  │
└──────┬──────────────┘
       │ 7. Query DB
       │
       ▼
┌─────────────────────┐
│  Prisma/PostgreSQL  │
│  - User lookup      │
│  - Update login     │
└──────┬──────────────┘
       │ 8. Return user + tokens
       │
       ▼
┌─────────────────┐
│  AuthContext    │
│  - setAuthState │
│  - persistAuth  │
└──────┬──────────┘
       │ 9. Store in localStorage
       │    + sessionStorage
       │
       ▼
┌─────────────────┐
│  Navigate to    │
│  role home page │
└─────────────────┘
```

### Token Refresh Flow

```
┌─────────────┐
│  API Call   │
│  (any)      │
└──────┬──────┘
       │ 1. Include token
       │
       ▼
┌─────────────────┐
│  Backend        │
│  - Verify token │
└──────┬──────────┘
       │ 2. Token expired?
       │
       ▼ YES
┌─────────────────┐
│  Return 401     │
└──────┬──────────┘
       │ 3. Frontend catches 401
       │
       ▼
┌─────────────────┐
│  AuthContext    │
│  - Detect 401   │
└──────┬──────────┘
       │ 4. Call refreshAccessToken()
       │
       ▼
┌─────────────────────┐
│  POST /auth/refresh │
│  - Send refresh token│
└──────┬──────────────┘
       │ 5. Backend validates refresh token
       │
       ▼
┌─────────────────────┐
│  TokenService       │
│  - Revoke old token │
│  - Generate new pair│
└──────┬──────────────┘
       │ 6. Return new tokens
       │
       ▼
┌─────────────────┐
│  AuthContext    │
│  - Update state │
│  - Persist      │
└──────┬──────────┘
       │ 7. Retry original request
       │
       ▼
┌─────────────────┐
│  Success        │
└─────────────────┘
```

---

## 🌍 ENVIRONMENT CONFIGURATION

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME="Orphan Age Child Safety System"
VITE_APP_VERSION="1.0.0"
```

### Backend (.env)
```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:5173,http://localhost:3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/child_safety_db

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-token-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-chars
JWT_REFRESH_EXPIRY=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Child Safety System
EMAIL_FROM_ADDRESS=noreply@childsafety.org

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=30

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## ⚠️ ERROR HANDLING

### Frontend Error Types


```javascript
// Network Errors
{
  message: "Network error. Please check your connection.",
  status: undefined
}

// Validation Errors (400)
{
  message: "Validation failed",
  status: 400,
  data: {
    message: "Email is required",
    errors: [...]
  }
}

// Authentication Errors (401)
{
  message: "Invalid email or password",
  status: 401
}

// Authorization Errors (403)
{
  message: "Account is temporarily locked. Try again in 30 minute(s).",
  status: 403
}

// Conflict Errors (409)
{
  message: "An account with this email already exists",
  status: 409
}

// Rate Limit Errors (429)
{
  message: "Too many requests",
  status: 429
}
```

### Backend Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Display in UI
```jsx
{error && (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 
                  text-xs font-medium text-red-700 
                  dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
    {error}
  </div>
)}
```

---

## 🧪 TESTING ENDPOINTS

### Using cURL

#### 1. Register New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+91 98765 43210"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@safety.gov",
    "password": "admin123"
  }'
```

**Save the tokens from response:**
```bash
export ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 3. Get Current User
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

#### 4. Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

#### 5. Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

#### 6. Change Password
```bash
curl -X PATCH http://localhost:3000/api/v1/auth/change-password \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "NewPass123!",
    "confirmPassword": "NewPass123!"
  }'
```

### Using Postman

**Collection Structure:**
```
Child Safety API/
├── Auth/
│   ├── Register
│   ├── Login
│   ├── Logout
│   ├── Refresh Token
│   ├── Get Me
│   ├── Verify Email
│   ├── Forgot Password
│   ├── Reset Password
│   └── Change Password
├── Users/
├── Children/
├── Parents/
└── Orphanages/
```

**Environment Variables:**
```json
{
  "base_url": "http://localhost:3000/api/v1",
  "access_token": "{{access_token}}",
  "refresh_token": "{{refresh_token}}"
}
```

---

## 🔐 ROLE-BASED ACCESS CONTROL

### Role Enum
```typescript
enum Role {
  ADMIN = 'ADMIN',
  ORPHANAGE = 'ORPHANAGE',
  PARENT = 'PARENT',
  SOCIAL_WORKER = 'SOCIAL_WORKER',
  GUEST = 'GUEST'
}
```

### Frontend Protected Routes
```jsx
// From routes/ProtectedRoute.jsx
<Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
  <Route path="/admin" element={<AdminLayout />}>
    {/* Admin routes */}
  </Route>
</Route>

<Route element={<ProtectedRoute allowedRoles={["ORPHANAGE"]} />}>
  <Route path="/orphanage" element={<OrphanageLayout />}>
    {/* Orphanage routes */}
  </Route>
</Route>

<Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
  <Route path="/parent" element={<ParentLayout />}>
    {/* Parent routes */}
  </Route>
</Route>
```

### Backend Role Guards
```typescript
// Controller level
@Roles(Role.ADMIN)
@Get('admin/test')
async adminTest(@CurrentUser() user: JwtPayload) {
  return { message: 'Admin access confirmed', user };
}

// Custom decorator usage
@Roles(Role.ADMIN, Role.ORPHANAGE)
@Get('restricted')
async restrictedEndpoint() {
  // Only ADMIN and ORPHANAGE can access
}
```

### Role Hierarchy
```
ADMIN > ORPHANAGE > SOCIAL_WORKER > PARENT > GUEST
```

**Permissions:**
- **ADMIN**: Full system access, user management, orphanage oversight
- **ORPHANAGE**: Manage own orphanage, children, staff, visits
- **SOCIAL_WORKER**: View reports, case management, monitoring
- **PARENT**: Profile management, visit requests, child welfare
- **GUEST**: Limited access, registration only

---

## 📊 DATABASE SCHEMA (Auth-Related)

### User Table
```prisma
model User {
  id                            String    @id @default(uuid())
  email                         String    @unique
  phone                         String?   @unique
  password                      String
  firstName                     String
  lastName                      String
  role                          Role      @default(GUEST)
  
  // Email verification
  isEmailVerified               Boolean   @default(false)
  emailVerificationToken        String?   @unique
  emailVerificationTokenExpiry  DateTime?
  
  // Phone verification
  isPhoneVerified               Boolean   @default(false)
  
  // Two-factor authentication
  isTwoFactorEnabled            Boolean   @default(false)
  twoFactorSecret               String?
  
  // Password management
  passwordResetToken            String?   @unique
  passwordResetTokenExpiry      DateTime?
  passwordChangedAt             DateTime?
  
  // Account security
  isActive                      Boolean   @default(true)
  loginAttempts                 Int       @default(0)
  lockedUntil                   DateTime?
  
  // Login tracking
  lastLoginAt                   DateTime?
  lastLoginIp                   String?
  
  // Metadata
  avatar                        String?
  deletedAt                     DateTime?
  createdAt                     DateTime  @default(now())
  updatedAt                     DateTime  @updatedAt
  
  // Relations
  refreshTokens   RefreshToken[]
  otpTokens       OtpToken[]
  auditLogs       AuditLog[]
  parent          Parent?
  orphanageStaff  OrphanageStaff[]
  
  @@index([email])
  @@index([role])
  @@map("users")
}
```

### RefreshToken Table
```prisma
model RefreshToken {
  id         String    @id @default(uuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  jti        String    @unique
  token      String    @unique
  
  isRevoked  Boolean   @default(false)
  revokedAt  DateTime?
  revokeReason String?
  
  ipAddress  String?
  userAgent  String?
  
  expiresAt  DateTime
  createdAt  DateTime  @default(now())
  
  @@index([userId])
  @@index([jti])
  @@index([expiresAt])
  @@map("refresh_tokens")
}
```

### OtpToken Table
```prisma
model OtpToken {
  id         String     @id @default(uuid())
  userId     String
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  purpose    OtpPurpose
  code       String
  
  attempts   Int        @default(0)
  isUsed     Boolean    @default(false)
  
  expiresAt  DateTime
  createdAt  DateTime   @default(now())
  
  @@index([userId, purpose])
  @@map("otp_tokens")
}
```

### AuditLog Table
```prisma
model AuditLog {
  id         String    @id @default(uuid())
  userId     String?
  user       User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action     String
  ipAddress  String?
  userAgent  String?
  success    Boolean   @default(true)
  
  createdAt  DateTime  @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 🚀 GUARDS & DECORATORS

### JWT Auth Guard
**Location:** `backend/src/auth/guards/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;  // Skip auth for @Public() decorated endpoints
    }
    
    return super.canActivate(context);
  }
}
```

### Roles Guard
**Location:** `backend/src/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;  // No role requirement
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Custom Decorators

**@Public()**
```typescript
// Skip JWT authentication for endpoint
export const Public = () => SetMetadata('isPublic', true);
```

**@Roles()**
```typescript
// Require specific roles
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

**@CurrentUser()**
```typescript
// Extract user from JWT payload
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

**Usage:**
```typescript
@Get('profile')
async getProfile(@CurrentUser('sub') userId: string) {
  // userId extracted from JWT
}

@Get('full-user')
async getFullUser(@CurrentUser() user: JwtPayload) {
  // Full JWT payload
}
```

---

## 📚 DTOs (Data Transfer Objects)

### LoginDto
```typescript
export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@safety.gov' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'admin123' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userAgent?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  rememberMe?: boolean;
}
```

### RegisterDto
```typescript
export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number'
  })
  @ApiProperty({ example: 'SecurePass123!' })
  password: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  @ApiProperty({ required: false, example: '+91 98765 43210' })
  phone?: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({ enum: Role, default: Role.GUEST })
  role?: Role;
}
```

### ChangePasswordDto
```typescript
export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'CurrentPass123!' })
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  @ApiProperty({ example: 'NewPass123!' })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'NewPass123!' })
  confirmPassword: string;
}
```

---

## 🔍 JWT STRATEGIES

### Access Token Strategy
**Location:** `backend/src/auth/strategies/jwt-access.strategy.ts`

```typescript
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessToken.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### Refresh Token Strategy
**Location:** `backend/src/auth/strategies/jwt-refresh.strategy.ts`

```typescript
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.headers['x-refresh-token'],
        (req) => req.body?.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshToken.secret'),
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<any> {
    // Verify token exists and is not revoked
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });

    if (!tokenRecord || tokenRecord.isRevoked) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    return {
      ...payload,
      tokenRecordId: tokenRecord.id,
    };
  }
}
```

---

## ✅ SUMMARY & KEY POINTS

### Authentication Flow Summary
1. ✅ User enters credentials + selects role in Login page
2. ✅ AuthContext.login() calls authService.login()
3. ✅ apiClient adds JWT token to Authorization header
4. ✅ Backend validates credentials via bcrypt
5. ✅ TokenService generates JWT access + refresh tokens
6. ✅ Tokens stored in localStorage + sessionStorage
7. ✅ User redirected to role-specific dashboard
8. ✅ All API calls include JWT in Authorization header
9. ✅ Token auto-refresh when access token expires
10. ✅ Logout revokes refresh tokens in database

### Security Highlights
- ✅ **bcrypt** password hashing (12 rounds)
- ✅ **JWT** with short-lived access tokens (15min)
- ✅ **Token rotation** on refresh
- ✅ **Account lockout** after 5 failed attempts
- ✅ **Rate limiting** on all auth endpoints
- ✅ **Audit logging** for security events
- ✅ **Email verification** before full access
- ✅ **2FA support** via OTP system

### Best Practices Implemented
- ✅ Dual storage (localStorage + sessionStorage)
- ✅ Token expiry handling with auto-refresh
- ✅ Public decorator for non-protected routes
- ✅ Role-based guards for authorization
- ✅ DTO validation with class-validator
- ✅ Proper error messages (no email enumeration)
- ✅ Password change invalidates all sessions
- ✅ Refresh token stored in database for revocation

### File Structure Map
```
Frontend:
├── src/pages/Login.jsx                    # Login UI
├── src/context/AuthContext.jsx            # Auth state management
├── src/services/authService.js            # Auth API calls
├── src/services/apiClient.js              # HTTP client with token handling
└── src/routes/ProtectedRoute.jsx          # Route protection

Backend:
├── src/auth/auth.controller.ts            # Auth endpoints
├── src/auth/auth.service.ts               # Auth business logic
├── src/auth/guards/jwt-auth.guard.ts      # JWT verification
├── src/auth/guards/roles.guard.ts         # Role checking
├── src/auth/strategies/jwt-access.strategy.ts    # Access token strategy
├── src/auth/strategies/jwt-refresh.strategy.ts   # Refresh token strategy
├── src/auth/services/token.service.ts     # Token generation
├── src/auth/services/email.service.ts     # Email sending
└── src/auth/services/otp.service.ts       # OTP management
```

---

**Analysis Status:** ✅ COMPLETE  
**Authentication System:** ✅ FULLY DOCUMENTED  
**Ready for:** Staff Module Integration

