# 🚀 AUTHENTICATION QUICK REFERENCE

**Quick access guide for developers working with the authentication system**

---

## 🔑 DEFAULT CREDENTIALS

```javascript
// ADMIN
email: "admin@safety.gov"
password: "admin123"
role: "ADMIN"

// ORPHANAGE
email: "orphanage@example.com"
password: "orphanage123"
role: "ORPHANAGE"

// PARENT
email: "parent@example.com"
password: "parent123"
role: "PARENT"
```

---

## 📡 KEY ENDPOINTS

```bash
BASE_URL=http://localhost:3000/api/v1

POST   /auth/register          # Register new user
POST   /auth/login             # Login
POST   /auth/logout            # Logout
POST   /auth/refresh           # Refresh access token
GET    /auth/me                # Get current user
PATCH  /auth/change-password   # Change password
POST   /auth/forgot-password   # Request reset
POST   /auth/reset-password    # Reset with token
```

---

## 💻 FRONTEND USAGE

### 1. Using Auth Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  
  // Check if user is logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Access user data
  console.log(user.role);  // "ADMIN", "PARENT", etc.
  console.log(user.email);
  
  // Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
}
```

### 2. Making Authenticated API Calls
```javascript
import { apiClient } from '../services/apiClient';

// Token is automatically added to headers
const data = await apiClient.get('/children');
const child = await apiClient.post('/children', childData);
const updated = await apiClient.patch(`/children/${id}`, updates);
```

### 3. Role-Based Rendering
```jsx
function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div>
      {user.role === 'ADMIN' && <AdminPanel />}
      {user.role === 'ORPHANAGE' && <OrphanagePanel />}
      {user.role === 'PARENT' && <ParentPanel />}
    </div>
  );
}
```

### 4. Protected Routes
```jsx
<Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
  <Route path="/admin/*" element={<AdminLayout />} />
</Route>
```

---

## 🔧 BACKEND USAGE

### 1. Protect Endpoint (Authenticated Users)
```typescript
@Get('profile')
@ApiBearerAuth('access-token')
async getProfile(@CurrentUser('sub') userId: string) {
  return this.service.getProfile(userId);
}
```

### 2. Public Endpoint (No Auth Required)
```typescript
@Public()
@Post('register')
async register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}
```

### 3. Role-Based Protection
```typescript
@Roles(Role.ADMIN)
@Get('admin/users')
async getAllUsers() {
  return this.service.getAllUsers();
}

@Roles(Role.ADMIN, Role.ORPHANAGE)
@Get('staff')
async getStaff() {
  // Both ADMIN and ORPHANAGE can access
}
```

### 4. Get Current User Info
```typescript
@Get('dashboard')
async getDashboard(@CurrentUser() user: JwtPayload) {
  console.log(user.sub);   // User ID
  console.log(user.email); // Email
  console.log(user.role);  // Role
  
  return this.service.getDashboard(user.sub);
}
```

---

## 🔐 STORAGE KEYS

```javascript
// Frontend storage keys
USER: "child_safety_user"
ACCESS_TOKEN: "child_safety_token"
REFRESH_TOKEN: "child_safety_refresh_token"

// How to access
const user = JSON.parse(localStorage.getItem('child_safety_user'));
const token = localStorage.getItem('child_safety_token');
```

---

## 📝 COMMON PATTERNS

### Check if User is Admin
```javascript
const { user } = useAuth();
const isAdmin = user?.role === 'ADMIN';

if (isAdmin) {
  // Admin-only functionality
}
```

### Conditional Button
```jsx
{user.role === 'ADMIN' && (
  <Button onClick={handleDelete}>Delete</Button>
)}
```

### Multiple Role Check
```javascript
const canEdit = ['ADMIN', 'ORPHANAGE'].includes(user?.role);
```

### Logout User
```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User automatically cleared from state and storage
};
```

---

## ⚠️ ERROR CODES

```
401 - Unauthorized (invalid/expired token)
403 - Forbidden (insufficient permissions or account locked)
409 - Conflict (email already exists)
429 - Too Many Requests (rate limit exceeded)
```

### Handle 401 (Auto Token Refresh)
```javascript
// AuthContext automatically handles this
// When API returns 401:
// 1. Calls refreshAccessToken()
// 2. Gets new token
// 3. Retries original request
```

---

## 🧪 TEST WITH cURL

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@safety.gov","password":"admin123"}'
```

### Use Token
```bash
TOKEN="your-access-token-here"

curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 RESPONSE FORMAT

### Success
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎯 QUICK CHECKLIST

When implementing new features:

- [ ] Does endpoint need authentication? Add `@ApiBearerAuth()`
- [ ] Need role restriction? Add `@Roles(Role.ADMIN)`
- [ ] Public endpoint? Add `@Public()`
- [ ] Need user ID? Use `@CurrentUser('sub')`
- [ ] Frontend: Check `isAuthenticated` before rendering
- [ ] Use `apiClient` for all API calls (auto-adds token)
- [ ] Handle loading states with `loading` from useAuth

---

**For complete documentation, see:** `AUTHENTICATION_FLOW_ANALYSIS.md`

