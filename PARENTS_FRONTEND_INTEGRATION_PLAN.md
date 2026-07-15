# Parents Module - Frontend Integration Plan

## Overview
This document outlines the frontend-backend integration for the Parents module. The backend APIs are fully functional, and this plan details how to integrate each frontend page with the corresponding endpoints.

## Completed Integration

### ✅ 1. ParentDashboard.jsx
**Status**: INTEGRATED

**Changes Made**:
- Added `useState` and `useEffect` for data fetching
- Integrated `parentsService.getDashboard()` API call
- Added loading state with spinner
- Added error handling with toast notifications
- Mapped backend response to UI components:
  - `dashboard.parentName` → Welcome message
  - `dashboard.kycStatus` → KYC badge
  - `dashboard.verificationStatus` → Verification badge
  - `dashboard.trustScore` → Trust score display
  - `dashboard.profileCompletion` → Profile completion percentage
  - `dashboard.linkedChild` → Linked child card
  - `dashboard.adoptionStep` → Adoption journey timeline

**API Endpoint**: `GET /parents/dashboard`

**Backend Response Structure**:
```json
{
  "parentId": "uuid",
  "parentName": "string",
  "kycStatus": "PENDING|IN_REVIEW|APPROVED|REJECTED",
  "verificationStatus": "PENDING|IN_REVIEW|APPROVED|REJECTED",
  "trustScore": 0-100,
  "profileCompletion": 0-100,
  "adoptionStep": 1-5,
  "linkedChild": {
    "id": "uuid",
    "name": "string",
    "age": number,
    "orphanage": "string"
  },
  "policeVerificationStatus": "PENDING|IN_PROGRESS|COMPLETED|REJECTED"
}
```

---

## Pending Integrations

### 🔄 2. ParentKYC.jsx
**Status**: READY FOR INTEGRATION

**Required Changes**:

1. **Replace dummy data** with API calls:
   ```javascript
   // Add imports
   import { parentsService } from "../services/parentsService";
   import { useToast } from "../hooks/useToast";
   
   // In component
   const [kycData, setKycData] = useState(null);
   const [loading, setLoading] = useState(true);
   const { success, error: showError } = useToast();
   
   useEffect(() => {
     loadKycStatus();
   }, []);
   
   async function loadKycStatus() {
     try {
       setLoading(true);
       const data = await parentsService.getKycStatus();
       setKycData(data);
     } catch (err) {
       showError(err.message || 'Failed to load KYC status');
     } finally {
       setLoading(false);
     }
   }
   ```

2. **Map backend response** to UI:
   - `kycData.kycStatus` → KYC status badge
   - `kycData.lastKycDate` → Last KYC date
   - `kycData.nextKycDue` → Next KYC due date
   - `kycData.complianceStatus` → Compliance badge
   - `kycData.documents` → Documents list

3. **Handle form submissions**:
   ```javascript
   async function handleKycSubmit(formData) {
     try {
       // Call document upload service
       // Then update parent profile
       await parentsService.updateParent(parentId, { kycSubmittedAt: new Date() });
       success('KYC submitted successfully');
       loadKycStatus(); // Refresh data
     } catch (err) {
       showError(err.message || 'KYC submission failed');
     }
   }
   ```

**API Endpoints**:
- `GET /parents/kyc` - Get KYC status
- `PATCH /parents/:id` - Update parent profile

**Backend Response Structure**:
```json
{
  "kycStatus": "PENDING|IN_REVIEW|APPROVED|REJECTED",
  "lastKycDate": "ISO date",
  "nextKycDue": "ISO date",
  "complianceStatus": "Compliant|Partially Compliant|Non-Compliant",
  "verificationHistory": [],
  "documents": [
    {
      "id": "uuid",
      "type": "string",
      "status": "string",
      "uploadedAt": "ISO date"
    }
  ]
}
```

---

### 🔄 3. ParentProfile.jsx
**Status**: NEEDS MAJOR REFACTORING

**Current Issue**: This page displays parent details linked to a child (guardian view). Need to clarify if this should be:
- Parent viewing their OWN profile
- Admin/Orphanage viewing a parent's profile

**Recommended Approach**:

**Option A: Parent's Own Profile**
```javascript
import { parentsService } from "../services/parentsService";

const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [editing, setEditing] = useState(false);

useEffect(() => {
  loadProfile();
}, []);

async function loadProfile() {
  try {
    setLoading(true);
    const data = await parentsService.getDashboard(); // Gets logged-in parent data
    setProfile(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

async function handleUpdate(updates) {
  try {
    await parentsService.updateParent(profile.parentId, updates);
    success('Profile updated successfully');
    loadProfile(); // Refresh
  } catch (err) {
    showError(err.message);
  }
}
```

**Option B: Admin/Orphanage Viewing Parent**
```javascript
import { parentsService } from "../services/parentsService";
import { useParams } from "react-router-dom";

const { parentId } = useParams();
const [parent, setParent] = useState(null);

useEffect(() => {
  loadParent();
}, [parentId]);

async function loadParent() {
  try {
    const data = await parentsService.getParentById(parentId);
    setParent(data);
  } catch (err) {
    showError(err.message);
  }
}
```

**API Endpoints**:
- `GET /parents/dashboard` - For parent's own profile
- `GET /parents/:id` - For viewing another parent (Admin/Orphanage)
- `PATCH /parents/:id` - Update profile

**Backend Response Structure**:
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "ISO date",
  "gender": "MALE|FEMALE|OTHER",
  "nationality": "string",
  "maritalStatus": "SINGLE|MARRIED|DIVORCED|WIDOWED",
  "occupation": "string",
  "annualIncome": number,
  "houseOwnership": "OWNED|RENTED|OTHER",
  "verificationStatus": "string",
  "trustScore": number,
  "kycStatus": "string",
  "addresses": [...],
  "documents": [...],
  "familyMembers": [...],
  "policeVerification": {...}
}
```

---

### 🔄 4. ParentVerificationCenter.jsx
**Status**: ADMIN ONLY - READY FOR INTEGRATION

**Required Changes**:

1. **Replace dummy parentApplications** with API call:
   ```javascript
   import { parentsService } from "../services/parentsService";
   
   const [parents, setParents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({ page: 1, limit: 20 });
   const [filters, setFilters] = useState({ search: '', filter: 'All', sort: 'Newest' });
   
   useEffect(() => {
     loadVerificationQueue();
   }, [pagination.page, filters]);
   
   async function loadVerificationQueue() {
     try {
       setLoading(true);
       const params = {
         page: pagination.page,
         limit: pagination.limit,
         search: filters.search,
         verificationStatus: filters.filter !== 'All' ? filters.filter : undefined,
       };
       
       const response = await parentsService.getVerificationQueue(params);
       setParents(response.data);
       setPagination(prev => ({ ...prev, total: response.pagination.total }));
       setStats(response.stats);
     } catch (err) {
       showError(err.message || 'Failed to load verification queue');
     } finally {
       setLoading(false);
     }
   }
   ```

2. **Integrate approval/rejection**:
   ```javascript
   async function handleApprove(parentId) {
     try {
       await parentsService.approveParent(parentId);
       success('Parent approved successfully');
       loadVerificationQueue(); // Refresh list
     } catch (err) {
       showError(err.message || 'Approval failed');
     }
   }
   
   async function handleReject(parentId, reason) {
     try {
       await parentsService.rejectParent(parentId, reason);
       success('Parent rejected successfully');
       loadVerificationQueue(); // Refresh list
     } catch (err) {
       showError(err.message || 'Rejection failed');
     }
   }
   ```

3. **Fetch parent details for modal**:
   ```javascript
   async function openDetails(parentId) {
     try {
       const parent = await parentsService.getVerificationDetails(parentId);
       setSelectedParent(parent);
       setDetailOpen(true);
     } catch (err) {
       showError(err.message);
     }
   }
   ```

**API Endpoints**:
- `GET /admin/parents/verification/queue` - Get verification queue
- `GET /admin/parents/:id/verification-details` - Get full details
- `POST /parents/:id/approve` - Approve parent
- `POST /parents/:id/reject` - Reject parent
- `PATCH /parents/:id/verification-status` - Update status

**Backend Response Structure**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "registeredAt": "ISO date",
      "verificationStatus": "PENDING|IN_REVIEW|APPROVED|REJECTED",
      "kycStatus": "string",
      "trustScore": number,
      "occupation": "string",
      "annualIncome": number
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  },
  "stats": {
    "pending": number,
    "verified": number,
    "rejected": number,
    "highRisk": number,
    "openIssues": number,
    "today": number
  }
}
```

---

## Integration Priority

### Phase 1: Core Parent Features (High Priority)
1. ✅ **ParentDashboard** - COMPLETED
2. 🔄 **ParentKYC** - In Progress
3. 🔄 **ParentProfile** - Needs clarification

### Phase 2: Admin Verification (Medium Priority)
4. 🔄 **ParentVerificationCenter** - Ready for integration

---

## Common Integration Patterns

### 1. Error Handling
```javascript
try {
  const data = await parentsService.someMethod();
  // Handle success
  success('Operation successful');
} catch (err) {
  console.error('Operation failed:', err);
  showError(err.message || 'Operation failed. Please try again.');
}
```

### 2. Loading States
```javascript
const [loading, setLoading] = useState(true);

if (loading) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-civic-200 border-t-civic-600" />
        <p className="text-sm font-semibold text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
```

### 3. Empty States
```javascript
if (!data) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-card">
      <FiAlertCircle className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-bold text-slate-900">No Data Available</h3>
      <p className="mt-2 text-sm text-slate-600">Please try again later</p>
    </div>
  );
}
```

### 4. Refresh After Mutations
```javascript
async function handleCreate(formData) {
  try {
    await parentsService.createParent(formData);
    success('Created successfully');
    await loadData(); // Refresh the list
    setModalOpen(false);
  } catch (err) {
    showError(err.message);
  }
}
```

---

## Authentication Flow

All API calls automatically include the JWT token via `apiClient.getAuthToken()`:

```javascript
// src/services/apiClient.js
getAuthToken() {
  return localStorage.getItem('child_safety_token') || 
         sessionStorage.getItem('child_safety_token');
}

async request(endpoint, options = {}) {
  const token = this.getAuthToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  // ... rest of request logic
}
```

**No additional authentication handling needed in components.**

---

## File Upload Pattern

For document uploads (KYC, health reports):

```javascript
async function handleFileUpload(file, documentType) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    formData.append('parentId', parentId);
    
    // Use apiClient for form data
    const response = await apiClient.post('/parents/documents/upload', formData);
    
    success('Document uploaded successfully');
    return response;
  } catch (err) {
    showError(err.message || 'Upload failed');
  }
}
```

---

## Testing Checklist

### For Each Integrated Page:

- [ ] Loading state displays correctly
- [ ] Error handling shows user-friendly messages
- [ ] Success messages appear after mutations
- [ ] Data refreshes automatically after create/update/delete
- [ ] Empty states display when no data
- [ ] Search/filter/pagination works
- [ ] Authorization checks prevent unauthorized access
- [ ] JWT token is sent with all requests
- [ ] 401 errors redirect to login
- [ ] Form validation matches backend rules
- [ ] Date formats display correctly
- [ ] Enums map correctly (PENDING → Pending, etc.)

---

## Next Steps

1. **Integrate ParentKYC.jsx** (Estimated: 2 hours)
   - Replace dummy data with `parentsService.getKycStatus()`
   - Add form submission handlers
   - Handle document uploads
   
2. **Clarify ParentProfile.jsx scope** (Estimated: 1 hour discussion + 2 hours implementation)
   - Determine if it's "view own profile" or "view any parent"
   - Implement appropriate API calls
   
3. **Integrate ParentVerificationCenter.jsx** (Estimated: 3 hours)
   - Replace dummy applications array
   - Add approve/reject handlers
   - Integrate search and filters

4. **End-to-End Testing** (Estimated: 2 hours)
   - Test complete parent registration flow
   - Test admin verification flow
   - Test parent dashboard and KYC

**Total Estimated Time**: 10-12 hours

---

## API Base URL Configuration

Ensure `.env` file has correct backend URL:

```env
VITE_API_URL=http://localhost:3000
```

For production:
```env
VITE_API_URL=https://api.your-domain.com
```

---

## Contact for Questions

- **Backend API Documentation**: `backend/src/parents/` - Check DTOs for exact field names
- **Swagger Documentation**: `http://localhost:3000/api-docs` (when backend is running)
- **Prisma Schema**: `backend/prisma/schema.prisma` - Parent model definition

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-14  
**Status**: ParentDashboard integrated, others pending
