# 📘 STAFF MODULE QUICK REFERENCE

**Module:** Orphanage Staff Management  
**Version:** 1.0.0  
**Last Updated:** July 15, 2026

---

## 🚀 GETTING STARTED

### Start the Application
```bash
# Frontend (Terminal 1)
cd /path/to/Orphan-Age-Child-Safety-System
npm run dev
# Opens at: http://localhost:5173

# Backend (Terminal 2 - if using NestJS)
cd backend
npm run start:dev
# Runs at: http://localhost:3000/api/v1
```

### Access Staff Module
- **Admin:** http://localhost:5173/admin/staff
- **Orphanage:** http://localhost:5173/orphanage/staff
- **API Docs:** http://localhost:3000/api/v1/docs

---

## 📁 FILE LOCATIONS

### Frontend Files
```
src/
├── services/staffService.js          # API service layer
├── pages/
│   ├── StaffManagement.jsx           # List page
│   └── StaffProfile.jsx              # Profile page
├── components/
│   ├── StaffRoleBadge.jsx            # Role badges
│   └── StaffFilters.jsx              # Filter controls
├── utils/staffHelpers.js             # Helper functions
└── constants/staffConstants.js       # Enums & constants
```

### Backend Files
```
backend/src/staff/
├── staff.module.ts                   # NestJS module
├── staff.controller.ts               # 7 endpoints
├── staff.service.ts                  # Business logic
└── dto/
    ├── create-staff.dto.ts           # Creation
    ├── update-staff.dto.ts           # Update
    ├── query-staff.dto.ts            # Query params
    ├── staff-response.dto.ts         # Response
    └── staff-basic.dto.ts            # List item
```

---

## 🔌 API ENDPOINTS

### Base URL
```
http://localhost:3000/api/v1/staff
```

### Endpoints

#### 1. Create Staff Member
```http
POST /api/v1/staff
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "uuid",
  "orphanageId": "uuid",
  "role": "CARETAKER",
  "designation": "Senior Caretaker",
  "employeeId": "EMP001",
  "joiningDate": "2024-01-15",
  "notes": "Optional notes"
}

Response: 201 Created
{
  "success": true,
  "data": { /* staff object */ }
}
```

#### 2. List Staff (with filters)
```http
GET /api/v1/staff?search=John&role=CARETAKER&isActive=true&page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [{ /* staff objects */ }],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "summary": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "caretakers": 20
  }
}
```

#### 3. Get Staff Profile
```http
GET /api/v1/staff/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { /* detailed staff object */ }
}
```

#### 4. Get Available Staff
```http
GET /api/v1/staff/available/:orphanageId
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [{ /* active staff only */ }]
}
```

#### 5. Update Staff
```http
PATCH /api/v1/staff/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "ADMINISTRATOR",
  "designation": "Head Caretaker",
  "notes": "Updated notes"
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated staff */ }
}
```

#### 6. Deactivate Staff
```http
PATCH /api/v1/staff/:id/deactivate
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { /* deactivated staff */ }
}
```

#### 7. Reactivate Staff
```http
PATCH /api/v1/staff/:id/reactivate
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { /* reactivated staff */ }
}
```

---

## 💻 FRONTEND USAGE

### Import Service
```javascript
import { staffService } from '../services/staffService';
```

### List All Staff
```javascript
const loadStaff = async () => {
  try {
    const response = await staffService.getAll({
      search: 'John',
      role: 'CARETAKER',
      isActive: true,
      orphanageId: 'uuid',  // ADMIN only
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      limit: 10
    });
    
    setStaff(response.data);
    setMeta(response.meta);
    setSummary(response.summary);
  } catch (error) {
    showError(error.message);
  }
};
```

### Get Staff Profile
```javascript
const loadStaffProfile = async (staffId) => {
  try {
    const staff = await staffService.getById(staffId);
    setStaff(staff);
  } catch (error) {
    showError('Failed to load staff profile');
  }
};
```

### Create Staff (when modal ready)
```javascript
const handleCreate = async (formData) => {
  try {
    await staffService.create({
      userId: formData.userId,
      orphanageId: formData.orphanageId,
      role: formData.role,
      designation: formData.designation,
      employeeId: formData.employeeId,
      joiningDate: formData.joiningDate,
      notes: formData.notes
    });
    
    showSuccess('Staff member added successfully!');
    loadStaff(); // Refresh list
  } catch (error) {
    showError(error.message);
  }
};
```

### Update Staff (when modal ready)
```javascript
const handleUpdate = async (staffId, updates) => {
  try {
    await staffService.update(staffId, updates);
    showSuccess('Staff updated successfully!');
    loadStaffProfile(staffId); // Refresh profile
  } catch (error) {
    showError(error.message);
  }
};
```

### Deactivate Staff
```javascript
const handleDeactivate = async (staffId) => {
  try {
    await staffService.deactivate(staffId);
    showSuccess('Staff member deactivated');
    loadStaffProfile(staffId); // Refresh
  } catch (error) {
    showError(error.message);
  }
};
```

### Reactivate Staff
```javascript
const handleReactivate = async (staffId) => {
  try {
    await staffService.reactivate(staffId);
    showSuccess('Staff member reactivated');
    loadStaffProfile(staffId); // Refresh
  } catch (error) {
    showError(error.message);
  }
};
```

### Get Available Staff (for dropdowns)
```javascript
const loadAvailableStaff = async (orphanageId) => {
  try {
    const staff = await staffService.getAvailable(orphanageId);
    setAvailableStaff(staff);
  } catch (error) {
    console.error('Failed to load staff');
  }
};
```

---

## 🛠️ HELPER FUNCTIONS

### Import Helpers
```javascript
import {
  getRoleLabel,
  getRoleColor,
  formatStaffName,
  formatJoiningDate,
  getStaffInitials,
  isStaffActive,
  getStaffRoleOptions,
  validateStaffForm,
  formatStaffForTable,
  calculateTenure
} from '../utils/staffHelpers';
```

### Usage Examples
```javascript
// Get role display name
const roleName = getRoleLabel('CARETAKER');
// Returns: "Caretaker"

// Get role color
const color = getRoleColor('MEDICAL_STAFF');
// Returns: "red"

// Format staff name
const name = formatStaffName(staff);
// Returns: "John Doe"

// Format joining date
const date = formatJoiningDate(staff.joiningDate);
// Returns: "January 15, 2024"

// Get initials for avatar
const initials = getStaffInitials(staff);
// Returns: "JD"

// Check if active
const active = isStaffActive(staff);
// Returns: true/false

// Get role options for dropdown
const options = getStaffRoleOptions();
// Returns: [{ value: 'ADMINISTRATOR', label: 'Administrator' }, ...]

// Validate form data
const errors = validateStaffForm(formData);
// Returns: { field: 'error message' } or empty object

// Format for table display
const tableRow = formatStaffForTable(staff);
// Returns: formatted object for DataTable

// Calculate tenure
const tenure = calculateTenure(staff.joiningDate);
// Returns: "2 years 3 months"
```

---

## 🎨 COMPONENTS

### StaffRoleBadge
```jsx
import StaffRoleBadge from '../components/StaffRoleBadge';

<StaffRoleBadge role="CARETAKER" size="md" />

// Props:
// - role: OrphanageStaffRole (required)
// - size: 'sm' | 'md' | 'lg' (default: 'md')
```

### StaffFilters
```jsx
import StaffFilters from '../components/StaffFilters';

<StaffFilters
  filters={filters}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
  showOrphanageFilter={user.role === 'ADMIN'}
/>

// Props:
// - filters: object with role, isActive, sortBy, sortOrder
// - onFilterChange: (key, value) => void
// - onClearFilters: () => void
// - showOrphanageFilter: boolean (optional)
```

---

## 📊 CONSTANTS

### Import Constants
```javascript
import {
  STAFF_ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  DEFAULT_FILTERS,
  DEFAULT_PAGINATION
} from '../constants/staffConstants';
```

### Staff Roles
```javascript
STAFF_ROLES = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  CARETAKER: 'CARETAKER',
  MEDICAL_STAFF: 'MEDICAL_STAFF',
  COUNSELOR: 'COUNSELOR',
  TEACHER: 'TEACHER',
  SOCIAL_WORKER: 'SOCIAL_WORKER',
  SECURITY: 'SECURITY',
  COOK: 'COOK',
  MAINTENANCE: 'MAINTENANCE',
  VOLUNTEER: 'VOLUNTEER',
  OTHER: 'OTHER'
}
```

### Role Labels
```javascript
ROLE_LABELS = {
  ADMINISTRATOR: 'Administrator',
  CARETAKER: 'Caretaker',
  MEDICAL_STAFF: 'Medical Staff',
  // ... etc
}
```

### Role Colors
```javascript
ROLE_COLORS = {
  ADMINISTRATOR: 'purple',
  CARETAKER: 'blue',
  MEDICAL_STAFF: 'red',
  // ... etc
}
```

### Status Options
```javascript
STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' }
]
```

### Sort Options
```javascript
SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'joiningDate', label: 'Joining Date' },
  { value: 'role', label: 'Role' },
  { value: 'employeeId', label: 'Employee ID' }
]
```

### Default Filters
```javascript
DEFAULT_FILTERS = {
  search: '',
  role: '',
  isActive: '',
  sortBy: 'name',
  sortOrder: 'asc'
}
```

---

## 🔐 AUTHORIZATION

### Role Access Matrix

| Feature | ADMIN | ORPHANAGE | PARENT |
|---------|-------|-----------|--------|
| View Staff List | ✅ All | ✅ Own | ❌ |
| View Staff Profile | ✅ All | ✅ Own | ❌ |
| Create Staff | ✅ | ✅ Own | ❌ |
| Update Staff | ✅ All | ✅ Own | ❌ |
| Deactivate Staff | ✅ All | ✅ Own | ❌ |
| Reactivate Staff | ✅ All | ✅ Own | ❌ |
| Filter by Orphanage | ✅ | ❌ Auto-scoped | ❌ |

### Data Scoping
- **ADMIN:** Sees all staff from all orphanages
- **ORPHANAGE:** Sees only staff from their own orphanage (auto-scoped in backend)
- **PARENT:** No access to staff module

---

## 🧪 TESTING

### Test Login Credentials (if using seed data)
```javascript
// ADMIN
email: admin@example.com
password: admin123

// ORPHANAGE
email: orphanage@example.com
password: orphanage123

// PARENT
email: parent@example.com
password: parent123
```

### Manual Test Flow
```bash
1. Login as ADMIN
2. Navigate to /admin/staff
3. Verify staff list loads
4. Type "John" in search
5. Select "Caretaker" role filter
6. Click "Active" status filter
7. Change sort to "Joining Date"
8. Click next page
9. Click a staff row
10. View profile page
11. Click "Deactivate"
12. Verify toast notification
13. Click "Reactivate"
14. Click "Back to Staff List"
```

---

## 🐛 TROUBLESHOOTING

### Frontend Issues

**Problem:** Staff list not loading
```javascript
// Check:
1. Is backend running? (http://localhost:3000/api/v1/health)
2. Is JWT token valid? (check localStorage)
3. Check browser console for errors
4. Check Network tab for failed requests
5. Verify CORS settings
```

**Problem:** Search not working
```javascript
// Check:
1. Is debounce working? (wait 300ms after typing)
2. Check searchTerm state value
3. Verify API is receiving search param
4. Check backend logs for query
```

**Problem:** Filters not applying
```javascript
// Check:
1. Verify filter state is updating
2. Check API request includes filter params
3. Verify backend is processing filters
4. Check response data
```

### Backend Issues

**Problem:** 401 Unauthorized
```javascript
// Solution:
1. Check JWT token is being sent in Authorization header
2. Verify token is not expired
3. Check JwtAuthGuard is configured correctly
4. Verify JWT secret matches
```

**Problem:** 403 Forbidden
```javascript
// Solution:
1. Check user role (must be ADMIN or ORPHANAGE)
2. Verify RolesGuard is working
3. Check data scoping logic
4. Verify orphanageId in token matches request
```

**Problem:** 404 Not Found
```javascript
// Solution:
1. Verify staff ID exists in database
2. Check UUID format is correct
3. Verify StaffModule is registered in app.module.ts
4. Check route path is correct
```

**Problem:** 400 Bad Request
```javascript
// Solution:
1. Check request payload format
2. Verify all required fields present
3. Check field types match DTOs
4. Review validation errors in response
```

---

## 📚 ADDITIONAL RESOURCES

### Documentation Files
- **PHASE7_VERIFICATION_COMPLETE.md** - Complete verification report
- **STAFF_MODULE_COMPLETE_SUMMARY.md** - Executive summary
- **STAFF_MODULE_DEPLOYMENT_CHECKLIST.md** - Deployment guide
- **backend/STAFF_API_DOCS.md** - Detailed API documentation
- **STAFF_MODULE_FRONTEND_COMPLETE.md** - Frontend details
- **STAFF_MODULE_BACKEND_COMPLETE.md** - Backend details

### API Documentation
- **Swagger UI:** http://localhost:3000/api/v1/docs
- **OpenAPI JSON:** http://localhost:3000/api/v1/docs-json

### Database
```bash
# View Prisma schema
cat backend/prisma/schema.prisma | grep -A 30 "model OrphanageStaff"

# Run migrations
cd backend && npx prisma migrate dev

# View data in Prisma Studio
cd backend && npx prisma studio
```

---

## 🎯 COMMON TASKS

### Add New Role to Enum
```typescript
// 1. Update backend/prisma/schema.prisma
enum OrphanageStaffRole {
  // ... existing roles
  NEW_ROLE
}

// 2. Create and run migration
npx prisma migrate dev --name add_new_role

// 3. Update frontend constants
// src/constants/staffConstants.js
export const STAFF_ROLES = {
  // ... existing roles
  NEW_ROLE: 'NEW_ROLE'
};

export const ROLE_LABELS = {
  // ... existing labels
  NEW_ROLE: 'Display Name'
};

export const ROLE_COLORS = {
  // ... existing colors
  NEW_ROLE: 'purple'  // Choose color
};
```

### Add New Filter
```javascript
// 1. Update StaffFilters component
// Add new filter UI element

// 2. Update QueryStaffDto (backend)
// Add validation for new filter

// 3. Update staff.service.ts
// Add filter logic in buildWhereClause()

// 4. Update frontend query building
// Include new filter in API call
```

### Change Pagination Default
```javascript
// Frontend: src/constants/staffConstants.js
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20  // Change from 10 to 20
};

// Backend: src/staff/dto/query-staff.dto.ts
@IsOptional()
@IsInt()
@Min(1)
@Max(100)
@Type(() => Number)
limit?: number = 20;  // Change default
```

---

## 💡 TIPS & BEST PRACTICES

### Performance
- ✅ Always use pagination for large datasets
- ✅ Implement search debouncing (300ms+)
- ✅ Use proper database indexes
- ✅ Load only required fields
- ✅ Cache frequently accessed data

### Security
- ✅ Always validate input on backend
- ✅ Never trust frontend validation alone
- ✅ Use parameterized queries (Prisma handles this)
- ✅ Implement proper authorization checks
- ✅ Sanitize user input

### UX
- ✅ Show loading states during API calls
- ✅ Display meaningful error messages
- ✅ Provide empty state guidance
- ✅ Implement optimistic updates where appropriate
- ✅ Make actions reversible when possible

### Code Quality
- ✅ Follow existing code patterns
- ✅ Keep components small and focused
- ✅ Extract reusable logic to helpers
- ✅ Use constants instead of magic strings
- ✅ Add comments for complex logic

---

## 📞 NEED HELP?

### Quick Checks
1. ✅ Backend running? Check http://localhost:3000/api/v1/health
2. ✅ Frontend running? Check http://localhost:5173
3. ✅ Database connected? Check backend logs
4. ✅ JWT token valid? Check localStorage in browser
5. ✅ Correct role? ADMIN or ORPHANAGE required

### Debug Mode
```javascript
// Enable debug logging in staffService.js
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', params);
  console.log('Response:', response);
}
```

### Common Solutions
- **Clear cache:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Restart backend:** Ctrl+C then npm run start:dev
- **Restart frontend:** Ctrl+C then npm run dev
- **Clear localStorage:** localStorage.clear() in console
- **Check logs:** Backend terminal and browser console

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** July 15, 2026  
**Module Status:** ✅ Production Ready

**Happy Coding! 🚀**
