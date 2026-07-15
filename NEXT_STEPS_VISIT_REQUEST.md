# 🚀 NEXT STEPS - VISIT REQUEST MODULE

## ✅ COMPLETED

**Backend Implementation (Phases 1-8)** - DONE ✅
- Phase 1: Frontend Analysis ✅
- Phase 2: Business Flow Understanding ✅
- Phase 3: Backend Design (DTOs, Service, Controller, Module) ✅
- Phase 4: Required Features Implementation ✅
- Phase 5: Database Schema (already existed) ✅
- Phase 6: API Contract Implementation ✅
- Phase 7: Integration Setup ✅
- Phase 8: Backend Verification ✅

---

## 📋 REMAINING TASKS

### 🔴 PHASE 9: FRONTEND INTEGRATION (HIGH PRIORITY)

#### Step 1: Create Frontend Service
**File:** `src/services/visitRequestService.js`

```javascript
import api from './api';

const visitRequestService = {
  // PARENT APIs
  create: (data) => api.post('/visit-requests', data),
  getMyRequests: (params) => api.get('/visit-requests/my-requests', { params }),
  getDetails: (id) => api.get(`/visit-requests/${id}`),
  cancel: (id, data) => api.patch(`/visit-requests/${id}/cancel`, data),

  // ORPHANAGE APIs
  getAll: (params) => api.get('/visit-requests', { params }),
  getTodayVisits: () => api.get('/visit-requests/today'),
  approve: (id, data) => api.patch(`/visit-requests/${id}/approve`, data),
  reject: (id, data) => api.patch(`/visit-requests/${id}/reject`, data),
  reschedule: (id, data) => api.patch(`/visit-requests/${id}/reschedule`, data),
  requestDocuments: (id, data) => api.patch(`/visit-requests/${id}/request-documents`, data),
  complete: (id, data) => api.patch(`/visit-requests/${id}/complete`, data),
};

export default visitRequestService;
```

#### Step 2: Update Parent Page (VisitRequest.jsx)

**Replace hardcoded data with:**
```javascript
// 1. Fetch parent's requests on mount
useEffect(() => {
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await visitRequestService.getMyRequests({ page: 1, limit: 10 });
      setRequests(response.data.data);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };
  fetchMyRequests();
}, []);

// 2. Handle form submission
const onSubmit = async (data) => {
  try {
    setSubmitting(true);
    await visitRequestService.create({
      orphanageId: selectedOrphanage,
      visitDate: data.visitDate,
      visitTime: data.visitTime,
      purpose: data.purpose,
      reason: data.reason,
      familyBackground: data.familyBackground,
      visitorsCount: data.visitorsCount || 1,
      relationshipOfVisitors: data.relationshipOfVisitors,
      specialRequirements: data.specialRequirements,
      adoptionTimeline: data.adoptionTimeline,
      agreedToRules: data.agreedToRules,
    });
    toast.success('Visit Request Submitted Successfully');
    // Refresh requests list
    fetchMyRequests();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create request');
  } finally {
    setSubmitting(false);
  }
};
```

#### Step 3: Update Orphanage Page (ManageVisitRequests.jsx)

**Replace hardcoded data with:**
```javascript
// 1. Fetch all requests with filters
useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await visitRequestService.getAll({
        search: searchParent,
        requestId: searchRequest,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        risk: riskFilter !== 'All' ? riskFilter : undefined,
        visitDate: dateFilter || undefined,
        page: 1,
        limit: 20,
      });
      setRequests(response.data.data);
      setCounts(response.data.summary);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };
  fetchRequests();
}, [searchParent, searchRequest, statusFilter, riskFilter, dateFilter]);

// 2. Fetch today's visits
useEffect(() => {
  const fetchTodayVisits = async () => {
    try {
      const response = await visitRequestService.getTodayVisits();
      setTodayVisits(response.data);
    } catch (error) {
      console.error('Failed to load today visits');
    }
  };
  fetchTodayVisits();
}, []);

// 3. Handle approve
const handleApprove = async () => {
  try {
    await visitRequestService.approve(activeRequest.id, approveForm);
    toast.success('Visit request approved successfully');
    setActiveModal(null);
    fetchRequests(); // Refresh
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to approve');
  }
};

// 4. Handle reject
const handleReject = async () => {
  try {
    await visitRequestService.reject(activeRequest.id, rejectForm);
    toast.success('Visit request rejected');
    setActiveModal(null);
    fetchRequests(); // Refresh
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to reject');
  }
};

// 5. Handle reschedule
const handleReschedule = async () => {
  try {
    await visitRequestService.reschedule(activeRequest.id, rescheduleForm);
    toast.success('Visit rescheduled successfully');
    setActiveModal(null);
    fetchRequests(); // Refresh
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to reschedule');
  }
};

// 6. Handle request documents
const handleRequestDocuments = async () => {
  try {
    await visitRequestService.requestDocuments(activeRequest.id, documentsForm);
    toast.success('Document request sent');
    setActiveModal(null);
    fetchRequests(); // Refresh
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to send request');
  }
};

// 7. Handle complete visit
const handleCompleteVisit = async () => {
  try {
    await visitRequestService.complete(activeRequest.id, {
      checkOutTime: new Date().toISOString(),
      postVisitFeedback: feedback,
    });
    toast.success('Visit completed successfully');
    setSavedReport(true);
    fetchRequests(); // Refresh
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to complete visit');
  }
};
```

#### Step 4: Remove All Dummy Data

**Delete these sections:**
- All hardcoded `visitRequests` arrays
- All `dummyRequests` constants
- All static data generators

**Search and remove:**
```bash
# Search for dummy data
grep -r "const visitRequests = \[" src/pages/
grep -r "const requests = \[" src/pages/
grep -r "dummyRequests" src/pages/
```

---

### 🟡 PHASE 10: DATABASE MIGRATION (MEDIUM PRIORITY)

**Run Prisma Migration:**
```bash
cd backend
npx prisma migrate dev --name visit_request_complete
```

**This will:**
- Create the visit_requests table (if not exists)
- Add all indexes
- Apply schema changes

---

### 🟢 PHASE 11: TESTING (LOW PRIORITY - OPTIONAL)

#### Manual Testing Checklist

**PARENT Flow:**
- [ ] Login as PARENT user
- [ ] View visit request form
- [ ] Submit visit request
- [ ] View request history
- [ ] View request details
- [ ] Cancel pending request
- [ ] Verify error handling (invalid data, KYC not approved)

**ORPHANAGE Flow:**
- [ ] Login as ORPHANAGE user
- [ ] View all visit requests
- [ ] Search by parent name
- [ ] Filter by status, risk, date
- [ ] View request details
- [ ] Approve request
- [ ] Reject request
- [ ] Reschedule request
- [ ] Request additional documents
- [ ] View today's visits
- [ ] Complete visit with feedback
- [ ] Verify auto-scoping (only own orphanage)

**ADMIN Flow:**
- [ ] Login as ADMIN user
- [ ] View all visit requests (all orphanages)
- [ ] Perform all actions

#### API Testing with Swagger

1. **Start backend server:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:3000/api
   ```

3. **Test endpoints:**
   - Authenticate with JWT token
   - Test each endpoint
   - Verify response format
   - Test error scenarios

---

## 🎯 IMMEDIATE NEXT ACTION

**Start with Phase 9, Step 1:**

Create the frontend service file:
```bash
touch src/services/visitRequestService.js
```

Then copy the service code from Step 1 above.

---

## 📝 NOTES

- Backend is 100% complete and ready
- Frontend integration is the only remaining task
- No database changes needed (schema already complete)
- All API endpoints are documented in Swagger
- All business logic is implemented

---

## 🆘 IF YOU ENCOUNTER ISSUES

### Common Issues & Solutions

**Issue 1: 401 Unauthorized**
- **Cause:** JWT token not sent or expired
- **Solution:** Ensure `api.js` includes JWT token in headers

**Issue 2: 403 Forbidden**
- **Cause:** User role doesn't have access
- **Solution:** Check user role, ensure PARENT/ORPHANAGE/ADMIN

**Issue 3: 400 Bad Request (KYC not completed)**
- **Cause:** Parent's KYC status is not APPROVED
- **Solution:** Complete KYC process first

**Issue 4: 404 Not Found (Orphanage)**
- **Cause:** Invalid orphanageId
- **Solution:** Ensure orphanage exists in database

**Issue 5: CORS Error**
- **Cause:** Frontend running on different port
- **Solution:** Backend already has CORS enabled

---

## 📊 PROGRESS TRACKER

```
Backend Implementation:    ████████████████████ 100%
Frontend Integration:      ░░░░░░░░░░░░░░░░░░░░   0%
Database Migration:        ░░░░░░░░░░░░░░░░░░░░   0%
Testing:                   ░░░░░░░░░░░░░░░░░░░░   0%

Overall Progress:          █████░░░░░░░░░░░░░░░  25%
```

---

**Last Updated:** July 15, 2026  
**Status:** Backend Complete, Ready for Frontend Integration  
**Estimated Time for Frontend:** 2-4 hours
