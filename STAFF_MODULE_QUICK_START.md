# 🚀 STAFF MODULE - QUICK START GUIDE

**For Developers** | **Version 1.0** | **July 15, 2026**

---

## ⚡ QUICK ACCESS

### Backend Files
```
backend/src/staff/
├── dto/
│   ├── create-staff.dto.ts       # Create staff validation
│   ├── update-staff.dto.ts       # Update staff validation
│   ├── query-staff.dto.ts        # Query/filter parameters
│   ├── staff-response.dto.ts     # Response types
│   └── index.ts                  # Barrel exports
├── staff.controller.ts            # HTTP endpoints
├── staff.service.ts               # Business logic
└── staff.module.ts                # NestJS module
```

### Documentation Files
```
backend/STAFF_API_DOCS.md                    # Complete API reference
STAFF_MODULE_BACKEND_COMPLETE.md             # Implementation report
ORPHANAGE_STAFF_FRONTEND_ANALYSIS.md         # Frontend specs
STAFF_MODULE_QUICK_START.md                  # This file
```

---

## 📡 API ENDPOINTS (7 TOTAL)

### Base URL: `/api/v1/staff`

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/staff` | Create staff | ADMIN, ORPHANAGE |
| GET | `/staff` | List staff (filtered) | ADMIN, ORPHANAGE |
| GET | `/staff/:id` | Get staff profile | ADMIN, ORPHANAGE |
| PATCH | `/staff/:id` | Update staff | ADMIN, ORPHANAGE |
| PATCH | `/staff/:id/deactivate` | Deactivate staff | ADMIN, ORPHANAGE |
| PATCH | `/staff/:id/reactivate` | Reactivate staff | ADMIN, ORPHANAGE |
| GET | `/staff/available/:orphanageId` | Get active staff | ADMIN, ORPHANAGE |

---

## 🔑 KEY CONCEPTS

### 1. Staff Roles (Enum)
```typescript
ADMINISTRATOR | CARETAKER | TEACHER | MEDICAL_STAFF | SECURITY_GUARD
COUNSELOR | SOCIAL_WORKER | VOLUNTEER | ACCOUNTANT | COOK | OTHER
```

### 2. Active Status
- `isActive: true` - Staff member is currently employed
- `isActive: false` - Staff member has been deactivated (soft delete)

### 3. Date Logic
- `joiningDate` - Cannot be in future
- `endDate` - Must be after joining date (set automatically on deactivate)

### 4. Access Control
- **ADMIN**: Can manage all staff across all orphanages
- **ORPHANAGE**: Can only manage staff in their own orphanage (auto-scoped)

---

## 💻 CODE EXAMPLES

### Backend (NestJS)

#### Create Staff
```typescript
const staff = await this.staffService.create(
  {
    userId: "user-uuid",
    orphanageId: "orphanage-uuid",
    role: "CARETAKER",
    designation: "Senior Caretaker",
    employeeId: "EMP-001",
    joiningDate: "2024-01-15T00:00:00Z",
    notes: "Experienced caretaker"
  },
  requestUserId,
  requestUserRole
);
```

#### Get Staff List (with filters)
```typescript
const result = await this.staffService.findAll(
  {
    search: "Meera",
    role: "CARETAKER",
    isActive: true,
    page: 1,
    limit: 10,
    sortBy: "joiningDate",
    sortOrder: "desc"
  },
  requestUserId,
  requestUserRole
);

// Returns: { data: [...], pagination: {...}, summary: {...} }
```

#### Update Staff
```typescript
await this.staffService.update(
  staffId,
  {
    role: "TEACHER",
    designation: "Lead Teacher",
    notes: "Promoted"
  },
  requestUserId,
  requestUserRole
);
```

#### Deactivate Staff
```typescript
await this.staffService.deactivate(staffId, requestUserId, requestUserRole);
// Sets isActive=false, endDate=now
```

### Frontend (React)

#### Service Layer
```typescript
// src/services/staffService.js
import apiClient from './apiClient';
import { unwrap } from '../utils/unwrap';

export const staffService = {
  async getAll(params = {}) {
    const response = await apiClient.get('/staff', params);
    return unwrap(response);
  },

  async getById(id) {
    const response = await apiClient.get(`/staff/${id}`);
    return unwrap(response);
  },

  async getAvailable(orphanageId) {
    const response = await apiClient.get(`/staff/available/${orphanageId}`);
    return unwrap(response);
  },

  async create(staffData) {
    const response = await apiClient.post('/staff', staffData);
    return unwrap(response);
  },

  async update(id, updates) {
    const response = await apiClient.patch(`/staff/${id}`, updates);
    return unwrap(response);
  },

  async deactivate(id) {
    const response = await apiClient.patch(`/staff/${id}/deactivate`);
    return unwrap(response);
  },
};
```

#### Component Usage
```jsx
// Load staff list
const [staff, setStaff] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const loadStaff = async () => {
    setLoading(true);
    try {
      const result = await staffService.getAll({ 
        page: 1, 
        limit: 10,
        isActive: true 
      });
      setStaff(result.data);
    } catch (error) {
      showToast({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };
  loadStaff();
}, []);
```

#### Form Submission
```jsx
// Add staff form
const onSubmit = async (data) => {
  try {
    await staffService.create({
      userId: selectedUser.id,
      orphanageId: user.orphanageId, // from auth context
      role: data.role,
      designation: data.designation,
      employeeId: data.employeeId,
      joiningDate: data.joiningDate,
      notes: data.notes
    });
    
    showToast({ 
      type: 'success', 
      message: 'Staff member added successfully' 
    });
    
    navigate('/orphanage/staff');
  } catch (error) {
    showToast({ 
      type: 'error', 
      message: error.message 
    });
  }
};
```

#### Dropdown for Visit Assignment
```jsx
// Get available staff for dropdown
const [availableStaff, setAvailableStaff] = useState([]);

useEffect(() => {
  const loadStaff = async () => {
    const staff = await staffService.getAvailable(orphanageId);
    setAvailableStaff(staff);
  };
  loadStaff();
}, [orphanageId]);

// Render dropdown
<select name="assignedStaffId">
  <option value="">Select Staff Member</option>
  {availableStaff.map(s => (
    <option key={s.id} value={s.id}>
      {s.name} ({s.role})
    </option>
  ))}
</select>
```

---

## 🔍 COMMON QUERIES

### Get All Active Caretakers
```typescript
GET /api/v1/staff?role=CARETAKER&isActive=true
```

### Search Staff by Name
```typescript
GET /api/v1/staff?search=Meera
```

### Get Staff for Specific Orphanage
```typescript
GET /api/v1/staff?orphanageId=<uuid>&sortBy=name&sortOrder=asc
```

### Get Available Staff (for assignments)
```typescript
GET /api/v1/staff/available/<orphanageId>
```

---

## 🚨 ERROR HANDLING

### Common Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | Bad Request | Invalid input, joining date in future |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | ORPHANAGE user accessing another orphanage |
| 404 | Not Found | User or orphanage doesn't exist |
| 409 | Conflict | User already assigned to this orphanage |

### Frontend Error Handling
```jsx
try {
  await staffService.create(data);
} catch (error) {
  // Error is already unwrapped by apiClient
  showToast({ 
    type: 'error', 
    message: error.message || 'Failed to create staff' 
  });
}
```

---

## ✅ VALIDATION RULES

### Create Staff
- ✅ `userId` must be valid UUID and exist
- ✅ `orphanageId` must be valid UUID and exist
- ✅ Orphanage must be active
- ✅ User cannot be already assigned to same orphanage
- ✅ `role` must be valid enum value
- ✅ `joiningDate` cannot be in future
- ✅ `endDate` (if provided) must be after `joiningDate`

### Update Staff
- ✅ Staff member must exist
- ✅ Cannot change `userId` or `orphanageId`
- ✅ `endDate` (if provided) must be after `joiningDate`

---

## 🎯 INTEGRATION CHECKLIST

### Backend Integration ✅
- [x] Module registered in app.module.ts
- [x] All endpoints functional
- [x] TypeScript compilation passes
- [x] Swagger docs auto-generated

### Frontend Integration (TODO)
- [ ] Create staffService.js
- [ ] Create Staff Management page (/orphanage/staff)
- [ ] Create Add Staff modal/form
- [ ] Create Edit Staff modal/form
- [ ] Create Staff Profile page (/staff/:id)
- [ ] Add Staff link to navigation
- [ ] Integrate with Visit Request forms
- [ ] Add staff counts to dashboard

---

## 📝 TESTING CHECKLIST

### API Testing
```bash
# Get JWT token first
POST /api/v1/auth/login

# Test create staff
POST /api/v1/staff
{
  "userId": "...",
  "orphanageId": "...",
  "role": "CARETAKER",
  "joiningDate": "2024-01-15T00:00:00Z"
}

# Test get all staff
GET /api/v1/staff

# Test get staff profile
GET /api/v1/staff/{id}

# Test update staff
PATCH /api/v1/staff/{id}
{ "designation": "Senior Caretaker" }

# Test deactivate
PATCH /api/v1/staff/{id}/deactivate

# Test reactivate
PATCH /api/v1/staff/{id}/reactivate
```

---

## 🔗 USEFUL LINKS

### Documentation
- Full API Docs: `backend/STAFF_API_DOCS.md`
- Implementation Report: `STAFF_MODULE_BACKEND_COMPLETE.md`
- Frontend Specs: `ORPHANAGE_STAFF_FRONTEND_ANALYSIS.md`

### Code References
- Children Module: `backend/src/children/`
- Parents Module: `backend/src/parents/`
- Auth Module: `backend/src/auth/`

### Database
- Schema: `backend/prisma/schema.prisma` (line 860)
- Model: `OrphanageStaff`

---

## 💡 TIPS & BEST PRACTICES

### Backend
1. Always validate user role in service layer
2. Use Prisma's `include` for efficient queries
3. Log important actions (create, update, deactivate)
4. Return consistent response envelopes

### Frontend
1. Use `unwrap()` helper to extract data from envelopes
2. Show loading states during API calls
3. Display meaningful error messages
4. Refresh lists after create/update/delete
5. Use DataTable component for lists
6. Use Modal component for forms

### Security
1. All endpoints require JWT authentication
2. ORPHANAGE users are auto-scoped to their data
3. Never expose sensitive data in responses
4. Validate permissions on every request

---

## 🚀 DEPLOYMENT NOTES

### Prerequisites
- ✅ Backend already running on port 3000
- ✅ Database includes OrphanageStaff model
- ✅ No migrations needed (model exists)

### Environment Variables
No new environment variables required. Uses existing:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### Restart Backend
```bash
cd backend
npm run start:dev
```

### Verify API
```bash
# Check Swagger docs
http://localhost:3000/api/v1

# Check staff endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/staff
```

---

## 📞 SUPPORT

### Issues?
1. Check TypeScript compilation: `npm run build`
2. Check diagnostics: Use IDE or `tsc --noEmit`
3. Review error messages in API responses
4. Consult STAFF_API_DOCS.md for endpoint details
5. Review similar patterns in Children/Parents modules

### Questions?
- Authentication: See `AUTHENTICATION_FLOW_ANALYSIS.md`
- API Patterns: See `backend/src/children/children.controller.ts`
- Frontend Patterns: See `ORPHANAGE_STAFF_FRONTEND_ANALYSIS.md`

---

**Quick Start Guide v1.0**  
**Last Updated:** July 15, 2026  
**Status:** ✅ Ready for Production

