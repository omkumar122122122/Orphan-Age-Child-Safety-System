# 📋 STAFF MODULE - API DOCUMENTATION

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** ✅ PRODUCTION READY

---

## 📚 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Usage Examples](#usage-examples)

---

## 🎯 OVERVIEW

The Staff Module provides comprehensive API endpoints for managing orphanage staff members. It supports:

- ✅ Staff registration and assignment
- ✅ Role-based staff management
- ✅ Active/inactive status tracking
- ✅ Staff filtering and search
- ✅ Staff profile management
- ✅ Permission-based access control

**Database Model:** `OrphanageStaff`  
**Relationships:** Links `User` ↔ `Orphanage`

---

## 🌐 BASE URL

```
http://localhost:3000/api/v1/staff
```

---

## 🔐 AUTHENTICATION

All endpoints require JWT authentication via Bearer token.

### Headers Required:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Allowed Roles:
- **ADMIN**: Full access to all staff across all orphanages
- **ORPHANAGE**: Access only to their own orphanage staff

---

## 📡 API ENDPOINTS

### 1. Create Staff Member

**POST** `/staff`

Creates a new staff member by linking a user to an orphanage.

#### Request Body:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "orphanageId": "550e8400-e29b-41d4-a716-446655440001",
  "role": "CARETAKER",
  "designation": "Senior Caretaker",
  "employeeId": "EMP-001",
  "joiningDate": "2024-01-15T00:00:00Z",
  "notes": "Experienced in child care for 5+ years"
}
```

#### Response (201):
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "employeeId": "EMP-001",
    "name": "Meera Nair",
    "role": "CARETAKER",
    "orphanageName": "Sunrise Care Home",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Validations:
- ✅ `userId` must exist in User table
- ✅ `orphanageId` must exist in Orphanage table
- ✅ Orphanage must be active
- ✅ User cannot be already assigned to the same orphanage
- ✅ `joiningDate` cannot be in the future
- ✅ `endDate` (if provided) must be after `joiningDate`
- ✅ ORPHANAGE role can only add staff to their own orphanage

#### Error Responses:
- **400** - Invalid input data, joining date in future, or end date before joining date
- **401** - Unauthorized (no token or invalid token)
- **403** - Forbidden (trying to add staff to another orphanage)
- **404** - User or Orphanage not found
- **409** - Conflict (user already assigned to this orphanage)

---

### 2. Get All Staff (with Filters)

**GET** `/staff`

Retrieves paginated list of staff members with optional filters.

#### Query Parameters:
```
?search=Meera
&orphanageId=550e8400-e29b-41d4-a716-446655440001
&role=CARETAKER
&isActive=true
&sortBy=joiningDate
&sortOrder=desc
&page=1
&limit=10
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name, employee ID, or email |
| `orphanageId` | UUID | No | - | Filter by orphanage (auto-applied for ORPHANAGE role) |
| `role` | enum | No | - | Filter by staff role |
| `isActive` | boolean | No | - | Filter by active status |
| `sortBy` | string | No | joiningDate | Sort field: name, joiningDate, role, employeeId |
| `sortOrder` | string | No | desc | Sort order: asc or desc |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 10 | Items per page (1-100) |

#### Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "employeeId": "EMP-001",
        "name": "Meera Nair",
        "role": "CARETAKER",
        "designation": "Senior Caretaker",
        "joiningDate": "2024-01-15T00:00:00Z",
        "isActive": true,
        "orphanageName": "Sunrise Care Home",
        "userEmail": "meera@example.com",
        "userPhone": "+91 98765 43210"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 46,
      "totalPages": 5
    },
    "summary": {
      "total": 46,
      "active": 43,
      "inactive": 3,
      "administrators": 2,
      "caretakers": 20,
      "teachers": 8,
      "medicalStaff": 5,
      "securityGuards": 6,
      "other": 5
    }
  }
}
```

#### Access Control:
- **ADMIN**: Can see all staff across all orphanages
- **ORPHANAGE**: Automatically filtered to show only their own staff

---

### 3. Get Staff Profile

**GET** `/staff/:id`

Retrieves detailed profile of a specific staff member.

#### URL Parameters:
- `id` (UUID): Staff member ID

#### Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "employeeId": "EMP-001",
    "role": "CARETAKER",
    "designation": "Senior Caretaker",
    "joiningDate": "2024-01-15T00:00:00Z",
    "endDate": null,
    "isActive": true,
    "notes": "Experienced in child care for 5+ years",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "meera@example.com",
      "firstName": "Meera",
      "lastName": "Nair",
      "phone": "+91 98765 43210",
      "avatar": "/uploads/avatars/meera.jpg"
    },
    "orphanage": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Sunrise Care Home",
      "city": "Mumbai",
      "state": "Maharashtra"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Responses:
- **401** - Unauthorized
- **403** - Forbidden (ORPHANAGE role trying to access another orphanage's staff)
- **404** - Staff member not found

---

### 4. Update Staff Member

**PATCH** `/staff/:id`

Updates staff member information (role, designation, employee ID, notes).

#### URL Parameters:
- `id` (UUID): Staff member ID

#### Request Body:
```json
{
  "role": "TEACHER",
  "designation": "Lead Teacher",
  "employeeId": "EMP-002",
  "endDate": "2025-12-31T00:00:00Z",
  "notes": "Promoted to Lead Teacher position"
}
```

**Note:** All fields are optional. Cannot change `userId` or `orphanageId`.

#### Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff member updated successfully"
}
```

#### Validations:
- ✅ Staff member must exist
- ✅ ORPHANAGE role can only update their own staff
- ✅ `endDate` (if provided) must be after `joiningDate`

#### Error Responses:
- **400** - Invalid input data
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Staff member not found

---

### 5. Deactivate Staff Member

**PATCH** `/staff/:id/deactivate`

Soft deletes a staff member by setting `isActive = false`.

#### URL Parameters:
- `id` (UUID): Staff member ID

#### Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff member deactivated successfully"
}
```

#### Behavior:
- Sets `isActive = false`
- Sets `endDate` to current date (if not already set)
- Staff member no longer appears in active staff lists
- Data is preserved for historical records

#### Error Responses:
- **400** - Staff member already deactivated
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Staff member not found

---

### 6. Reactivate Staff Member

**PATCH** `/staff/:id/reactivate`

Reactivates a previously deactivated staff member.

#### URL Parameters:
- `id` (UUID): Staff member ID

#### Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff member reactivated successfully"
}
```

#### Behavior:
- Sets `isActive = true`
- Clears `endDate`
- Staff member becomes available for assignments again

#### Error Responses:
- **400** - Staff member already active
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Staff member not found

---

### 7. Get Available Staff

**GET** `/staff/available/:orphanageId`

Retrieves only active staff members for a specific orphanage (useful for dropdowns/assignments).

#### URL Parameters:
- `orphanageId` (UUID): Orphanage ID

#### Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "employeeId": "EMP-001",
      "name": "Meera Nair",
      "role": "CARETAKER",
      "designation": "Senior Caretaker",
      "joiningDate": "2024-01-15T00:00:00Z",
      "isActive": true,
      "orphanageName": "Sunrise Care Home",
      "userEmail": "meera@example.com",
      "userPhone": "+91 98765 43210"
    }
  ]
}
```

#### Use Cases:
- Dropdown in visit assignment forms
- Staff selection for tasks
- Quick staff lookup

#### Access Control:
- **ADMIN**: Can get available staff for any orphanage
- **ORPHANAGE**: Can only get their own staff

---

## 📊 DATA MODELS

### OrphanageStaffRole Enum

```typescript
enum OrphanageStaffRole {
  ADMINISTRATOR
  CARETAKER
  TEACHER
  MEDICAL_STAFF
  SECURITY_GUARD
  COUNSELOR
  SOCIAL_WORKER
  VOLUNTEER
  ACCOUNTANT
  COOK
  OTHER
}
```

### Staff Profile (Full)

```typescript
{
  id: string;                    // UUID
  employeeId?: string;           // Optional employee ID
  role: OrphanageStaffRole;      // Enum
  designation?: string;          // Job title
  joiningDate: Date;             // ISO date string
  endDate?: Date;                // ISO date string (if inactive)
  isActive: boolean;             // Active status
  notes?: string;                // Additional notes
  user: {                        // Linked user account
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  orphanage: {                   // Linked orphanage
    id: string;
    name: string;
    city: string;
    state: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Staff Basic (List View)

```typescript
{
  id: string;
  employeeId?: string;
  name: string;                  // firstName + lastName
  role: OrphanageStaffRole;
  designation?: string;
  joiningDate: Date;
  isActive: boolean;
  orphanageName: string;
  userEmail: string;
  userPhone?: string;
}
```

### Staff Summary (Statistics)

```typescript
{
  total: number;                 // Total staff count
  active: number;                // Active staff
  inactive: number;              // Inactive staff
  administrators: number;        // Count by role
  caretakers: number;
  teachers: number;
  medicalStaff: number;
  securityGuards: number;
  other: number;                 // All other roles
}
```

---

## ⚠️ ERROR HANDLING

All API responses follow the TransformInterceptor envelope pattern.

### Success Response:
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Joining date cannot be in the future",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes:

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate record (user already assigned) |
| 500 | Internal Server Error | Server-side error |

---

## 💡 USAGE EXAMPLES

### Example 1: Add Staff Member (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/staff \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "orphanageId": "550e8400-e29b-41d4-a716-446655440001",
    "role": "CARETAKER",
    "designation": "Senior Caretaker",
    "employeeId": "EMP-001",
    "joiningDate": "2024-01-15T00:00:00Z",
    "notes": "Experienced caretaker"
  }'
```

### Example 2: Get Active Staff for Visit Assignment (Orphanage)

```bash
curl -X GET "http://localhost:3000/api/v1/staff/available/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer <orphanage_token>"
```

### Example 3: Search Staff by Name (Admin)

```bash
curl -X GET "http://localhost:3000/api/v1/staff?search=Meera&isActive=true&page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

### Example 4: Update Staff Role

```bash
curl -X PATCH http://localhost:3000/api/v1/staff/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "TEACHER",
    "designation": "Lead Teacher"
  }'
```

### Example 5: Deactivate Staff Member

```bash
curl -X PATCH http://localhost:3000/api/v1/staff/550e8400-e29b-41d4-a716-446655440010/deactivate \
  -H "Authorization: Bearer <admin_token>"
```

### Example 6: Get Staff by Orphanage with Filters (Admin)

```bash
curl -X GET "http://localhost:3000/api/v1/staff?orphanageId=550e8400-e29b-41d4-a716-446655440001&role=CARETAKER&sortBy=name&sortOrder=asc" \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🔒 SECURITY CONSIDERATIONS

### Permission Matrix:

| Action | ADMIN | ORPHANAGE | PARENT |
|--------|-------|-----------|--------|
| Create staff | ✅ All | ✅ Own only | ❌ |
| View all staff | ✅ All | ✅ Own only | ❌ |
| View staff profile | ✅ All | ✅ Own only | ❌ |
| Update staff | ✅ All | ✅ Own only | ❌ |
| Deactivate staff | ✅ All | ✅ Own only | ❌ |
| Reactivate staff | ✅ All | ✅ Own only | ❌ |
| Get available staff | ✅ All | ✅ Own only | ❌ |

### Validation Rules:

1. **User Validation:**
   - User must exist in database
   - User can only be assigned once per orphanage (enforced by unique constraint)

2. **Orphanage Validation:**
   - Orphanage must exist and be active
   - ORPHANAGE role users can only manage their own staff

3. **Date Validation:**
   - Joining date cannot be in the future
   - End date must be after joining date
   - System enforces date logic on deactivation/reactivation

4. **Role-Based Access:**
   - All endpoints protected by JWT auth
   - Role guards enforce ADMIN/ORPHANAGE access
   - ORPHANAGE users automatically scoped to their orphanage

---

## 📈 INTEGRATION POINTS

### Frontend Integration:

```typescript
// Example: staffService.js
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

  async reactivate(id) {
    const response = await apiClient.patch(`/staff/${id}/reactivate`);
    return unwrap(response);
  },
};
```

### Visit Request Integration:

The Staff module integrates with Visit Request management for staff assignment:

```typescript
// In visit approval, get available staff:
const availableStaff = await staffService.getAvailable(orphanageId);

// Display in dropdown:
<Select name="assignedStaffId">
  {availableStaff.map(staff => (
    <option key={staff.id} value={staff.id}>
      {staff.name} ({staff.role})
    </option>
  ))}
</Select>
```

---

## 🧪 TESTING

### Test Cases Covered:

1. ✅ Create staff with valid data
2. ✅ Create staff with duplicate user-orphanage pair (409 Conflict)
3. ✅ Create staff with non-existent user (404 Not Found)
4. ✅ Create staff with future joining date (400 Bad Request)
5. ✅ ORPHANAGE user creating staff for another orphanage (403 Forbidden)
6. ✅ Get all staff with pagination
7. ✅ Get all staff with filters (role, isActive, search)
8. ✅ ORPHANAGE user can only see their own staff
9. ✅ Get staff profile by ID
10. ✅ Update staff role and designation
11. ✅ Deactivate staff (sets isActive=false, endDate=now)
12. ✅ Reactivate staff (sets isActive=true, clears endDate)
13. ✅ Get available staff for orphanage

---

## 📝 NOTES

1. **Soft Delete:** Staff records are never hard-deleted. Use `deactivate` to mark as inactive.

2. **Unique Constraint:** The database enforces `@@unique([orphanageId, userId])` to prevent duplicate assignments.

3. **Historical Records:** Even deactivated staff remain in the system for audit trails and reporting.

4. **Role Flexibility:** Staff roles are tracked via enum, allowing role changes over time (promotions, transfers).

5. **Employee ID:** Optional field for internal tracking. Not enforced as unique database-wide (orphanage-specific).

---

## 🔄 CHANGELOG

### Version 1.0 (July 15, 2026)
- ✅ Initial release
- ✅ Full CRUD operations
- ✅ Role-based access control
- ✅ Filtering and search
- ✅ Active/inactive status management
- ✅ Integration with visit assignments

---

## 📞 SUPPORT

For issues or questions:
- Check existing documentation
- Review error messages in API responses
- Consult the frontend analysis document (ORPHANAGE_STAFF_FRONTEND_ANALYSIS.md)
- Review authentication flow (AUTHENTICATION_FLOW_ANALYSIS.md)

---

**END OF DOCUMENTATION**
