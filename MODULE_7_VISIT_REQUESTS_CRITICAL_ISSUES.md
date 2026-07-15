# MODULE 7: VISIT REQUESTS - CRITICAL ISSUES FOUND ⚠️

**Date:** July 15, 2026  
**Status:** ❌ **CRITICAL ISSUES - REQUIRES IMMEDIATE FIXES**  
**Priority:** HIGH - BLOCKING MODULE COMPLETION

---

## 🎯 EXECUTIVE SUMMARY

Module 7 (Visit Requests) has **CRITICAL INTEGRATION ISSUES**. Frontend pages use **100% hardcoded dummy data** with ZERO backend integration.

Backend is fully implemented but **NOT CONNECTED** to frontend.

**ACTION REQUIRED:** Create frontend service and integrate all pages with backend APIs.

---

## ❌ CRITICAL ISSUES FOUND

### **Issue 1: Complete Lack of Backend Integration**

**Severity:** CRITICAL  
**Impact:** Frontend displays fake data, no real functionality

**Pages Affected:**
1. ✅ Backend implemented, ❌ Frontend NOT integrated
2. `VisitRequest.jsx` — Parent request form (100% hardcoded)
3. `ManageVisitRequests.jsx` — Orphanage management (100% hardcoded)

**Evidence:**
```javascript
// VisitRequest.jsx - Lines 21-106
const parentProfile = { /* hardcoded data */ };
const orphanageOptions = [ /* hardcoded array */ ];
const documents = [ /* hardcoded array */ ];
const aiAnalysis = [ /* hardcoded array */ ];
const requestHistory = [ /* hardcoded array */ ];

// ManageVisitRequests.jsx - Lines 47-130
const requestSeed = [ /* hardcoded 6 fake requests */ ];
const notifications = [ /* hardcoded notifications */ ];
```


### **Issue 2: Missing Frontend Service**

**Severity:** CRITICAL  
**Impact:** No way to call backend APIs

**Missing:** `src/services/visitRequestService.js`

**Required Methods:**
- `create(requestData)` → POST /visit-requests
- `getAll(params)` → GET /visit-requests (Orphanage/Admin)
- `getMyRequests(params)` → GET /visit-requests/my-requests (Parent)
- `getTodayVisits()` → GET /visit-requests/today
- `getById(id)` → GET /visit-requests/:id
- `approve(id, approveData)` → PATCH /visit-requests/:id/approve
- `reject(id, rejectData)` → PATCH /visit-requests/:id/reject
- `reschedule(id, rescheduleData)` → PATCH /visit-requests/:id/reschedule
- `requestDocuments(id, docsData)` → PATCH /visit-requests/:id/request-documents
- `complete(id, feedbackData)` → PATCH /visit-requests/:id/complete
- `cancel(id, reason)` → PATCH /visit-requests/:id/cancel

---

### **Issue 3: Form Submission Goes Nowhere**

**Severity:** CRITICAL  
**Impact:** Parent form submission only shows toast, no data saved

**Location:** `VisitRequest.jsx` - Line 148-151

```javascript
function onSubmit() {
  setToastVisible(true);
  window.setTimeout(() => setToastVisible(false), 3200);
  // ❌ NO BACKEND CALL - Data is lost!
}
```


### **Issue 4: Management Actions Are Fake**

**Severity:** CRITICAL  
**Impact:** Approve/Reject/Reschedule only updates local state

**Location:** `ManageVisitRequests.jsx` - Lines 696-721

```javascript
const handleApprove = () => {
  updateRequest(selectedRequest.requestId, { /* local state update */ });
  setActiveModal(null);
  // ❌ NO BACKEND CALL - Changes not persisted!
};

const handleReject = () => {
  updateRequest(selectedRequest.requestId, { /* local state update */ });
  setActiveModal(null);
  // ❌ NO BACKEND CALL
};

const handleReschedule = () => {
  updateRequest(selectedRequest.requestId, { /* local state update */ });
  setActiveModal(null);
  // ❌ NO BACKEND CALL
};
```

---

## 📊 DETAILED ANALYSIS

### **1. VisitRequest.jsx** ❌ ZERO INTEGRATION

**Purpose:** Parent-facing visit request form


**Hardcoded Data:**
1. **Parent Profile** (Line 21-35) — Should load from auth context/parent service
2. **Orphanage Options** (Line 37-63) — Should fetch from orphanage service
3. **Documents Status** (Line 65-72) — Should load parent KYC status
4. **AI Analysis** (Line 74-81) — Should fetch parent trust score/verification
5. **Request History** (Line 83-106) — Should call `visitRequestService.getMyRequests()`

**Required Integration:**
```javascript
// Load parent profile from auth context
const { user } = useAuth();
const parentProfile = await parentsService.getProfile();

// Load orphanages
const orphanages = await orphanagesService.getAll({ 
  status: 'APPROVED', 
  availability: true 
});

// Load parent's request history
const requestHistory = await visitRequestService.getMyRequests();

// Submit form
const onSubmit = async (formData) => {
  await visitRequestService.create(formData);
  showSuccess('Visit request submitted successfully');
};
```


---

### **2. ManageVisitRequests.jsx** ❌ ZERO INTEGRATION

**Purpose:** Orphanage staff management dashboard for visit requests

**Hardcoded Data:**
1. **Request Queue** (Line 47-130) — 6 fake hardcoded requests
2. **Notifications** (Line 132-137) — Fake notification array
3. **Calendar Events** — Generated from hardcoded requests
4. **Today's Visits** — Filtered from hardcoded data
5. **Statistics** — Calculated from fake data

**Required Integration:**
```javascript
// Load all visit requests
const loadRequests = async () => {
  const response = await visitRequestService.getAll({
    search: searchQuery,
    status: statusFilter,
    riskLevel: riskFilter,
    visitDate: dateFilter,
    page,
    limit: 20
  });
  setRequests(response.data);
  setPagination(response.pagination);
  setSummary(response.summary);
};

// Load today's visits
const todayVisits = await visitRequestService.getTodayVisits();

// Approve visit
const handleApprove = async () => {
  await visitRequestService.approve(selectedRequest.id, approveForm);
  showSuccess('Visit approved successfully');
  loadRequests();
};

// Reject visit
const handleReject = async () => {
  await visitRequestService.reject(selectedRequest.id, rejectForm);
  showSuccess('Visit rejected successfully');
  loadRequests();
};
```


---

## 🔍 BACKEND VERIFICATION

### **Backend Status:** ✅ FULLY IMPLEMENTED

**Module:** `backend/src/visit-requests/`

**Endpoints Available:**

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/visit-requests` | POST | Create visit request | ✅ Implemented |
| `/visit-requests` | GET | Get all requests (Orphanage/Admin) | ✅ Implemented |
| `/visit-requests/my-requests` | GET | Get parent's requests | ✅ Implemented |
| `/visit-requests/today` | GET | Get today's visits | ✅ Implemented |
| `/visit-requests/:id` | GET | Get request details | ✅ Implemented |
| `/visit-requests/:id/approve` | PATCH | Approve visit | ✅ Implemented |
| `/visit-requests/:id/reject` | PATCH | Reject visit | ✅ Implemented |
| `/visit-requests/:id/reschedule` | PATCH | Reschedule visit | ✅ Implemented |
| `/visit-requests/:id/request-documents` | PATCH | Request more documents | ✅ Implemented |
| `/visit-requests/:id/complete` | PATCH | Complete visit with feedback | ✅ Implemented |
| `/visit-requests/:id/cancel` | PATCH | Cancel request (Parent) | ✅ Implemented |

**Security:** ✅ JWT Authentication + Role Guards  
**Validation:** ✅ DTOs with class-validator  
**Swagger:** ✅ Complete API documentation  
**Authorization:** ✅ Role-based access (PARENT, ORPHANAGE, ADMIN)


---

## 📋 REQUIRED FIXES

### **Fix 1: Create Frontend Service** ⚠️ CRITICAL

**File:** `src/services/visitRequestService.js`

**Requirements:**
- Create service with all 11 methods
- Use apiClient for HTTP requests
- Implement unwrap() for response envelope
- Add proper error handling
- Return clean data structures

### **Fix 2: Integrate VisitRequest.jsx** ⚠️ CRITICAL

**Changes Required:**
1. Remove all hardcoded data (5 constants)
2. Load parent profile from auth/service
3. Fetch orphanages from orphanage service
4. Load request history from visit request service
5. Implement real form submission
6. Add loading states
7. Add error handling
8. Show success/error toasts

### **Fix 3: Integrate ManageVisitRequests.jsx** ⚠️ CRITICAL

**Changes Required:**
1. Remove hardcoded request seed (130 lines)
2. Implement loadRequests() with backend API
3. Connect approve/reject/reschedule actions to backend
4. Implement real-time today's visits loading
5. Fix calendar to use real data
6. Add loading/error states
7. Implement pagination
8. Add filters and search
9. Connect feedback form to backend


---

## ✅ VERIFICATION CHECKLIST

### **Module Completion Criteria:**

- ❌ **Frontend matches backend** — Currently 0% match
- ✅ **Backend fulfills requirements** — 100% implemented
- ❌ **Frontend is integrated** — ZERO integration
- ❌ **Database is used** — Using fake arrays
- ❌ **No dummyData.js usage** — All data is hardcoded inline
- ❌ **No hardcoded data** — 100% hardcoded
- ❌ **CRUD works** — Only local state updates
- ✅ **Authentication works** — Backend ready
- ✅ **Authorization works** — Backend has role guards
- ✅ **Prisma works** — Backend uses Prisma
- ✅ **Swagger complete** — Backend documented
- ❌ **No integration issues** — Complete disconnect
- ❌ **Production-ready** — NOT FUNCTIONAL

**Overall Status:** ❌ **FAILS ALL FRONTEND CRITERIA**

---

## 📊 INTEGRATION QUALITY METRICS

| Metric | Score | Status |
|--------|-------|--------|
| Backend API Coverage | 100% | ✅ Perfect |
| Frontend Integration | 0% | ❌ None |
| Dummy Data Elimination | 0% | ❌ 100% hardcoded |
| Loading States | 0% | ❌ Missing |
| Error Handling | 0% | ❌ Missing |
| Form Submission | 0% | ❌ Fake |
| Management Actions | 0% | ❌ Fake |
| Search/Filters | 0% | ❌ Local only |
| Security (Frontend) | 0% | ❌ No API calls |
| Swagger Usage | 0% | ❌ Not consumed |

**Overall Module Grade:** **F (Failed - No Integration)**


---

## 🚨 IMPACT ANALYSIS

### **Business Impact:**

- ❌ Parents cannot submit real visit requests
- ❌ Orphanage staff see fake data, cannot manage visits
- ❌ No approval workflow functional
- ❌ No visit tracking or history
- ❌ Calendar shows fake events
- ❌ Notifications are static
- ❌ Reports/analytics use fake numbers
- ❌ Complete adoption workflow broken

### **Technical Debt:**

- 235 lines of hardcoded dummy data
- Zero backend API integration
- Missing service layer entirely
- All CRUD operations fake
- No database persistence
- No error handling
- No loading states

---

## 📝 FILES REQUIRING FIXES

### **TO CREATE:**
1. ❌ `src/services/visitRequestService.js` — Service layer (MISSING)

### **TO FIX:**
2. ❌ `src/pages/VisitRequest.jsx` — Remove 5 hardcoded constants, integrate backend
3. ❌ `src/pages/ManageVisitRequests.jsx` — Remove 130+ lines hardcoded data, integrate backend

### **ALREADY COMPLETE:**
- ✅ `backend/src/visit-requests/visit-requests.controller.ts`
- ✅ `backend/src/visit-requests/visit-requests.service.ts`
- ✅ `backend/src/visit-requests/dto/*.dto.ts`
- ✅ `backend/src/visit-requests/visit-requests.module.ts`


---

## 🎯 RECOMMENDED ACTION PLAN

### **Phase 1: Create Service Layer** (30 minutes)
1. Create `src/services/visitRequestService.js`
2. Implement all 11 methods
3. Add response envelope unwrapping
4. Test service with Postman/Backend

### **Phase 2: Fix VisitRequest.jsx** (60 minutes)
1. Remove 5 hardcoded data constants
2. Add useEffect hooks to load data
3. Integrate form submission with backend
4. Add loading/error states
5. Connect request history to backend
6. Test parent flow end-to-end

### **Phase 3: Fix ManageVisitRequests.jsx** (90 minutes)
1. Remove 130+ lines of hardcoded data
2. Implement loadRequests() with pagination
3. Connect approve/reject/reschedule to backend
4. Integrate today's visits
5. Fix calendar data source
6. Add real-time updates
7. Test orphanage flow end-to-end

### **Phase 4: Verification** (30 minutes)
1. Test parent request submission
2. Test orphanage approval workflow
3. Test reject/reschedule/documents
4. Verify calendar updates
5. Check today's visits
6. Confirm notifications
7. Validate all CRUD operations

**Total Estimated Time:** 3.5 hours


---

## 📊 MODULE COMPARISON

| Module | Critical Issues | Dummy Data | Integration Quality | Grade |
|--------|----------------|------------|---------------------|-------|
| 4. Parents | 3 (Fixed) | Yes → None | Fixed → A+ | A+ |
| 5. Orphanages | 0 | None | Perfect | A+ |
| 6. Staff | 0 | None | Perfect | A+ |
| 7. Visit Requests | 4 | 100% Hardcoded | ZERO | F |

---

## 🔜 NEXT STEPS

**IMMEDIATE ACTION REQUIRED:**

Module 7 (Visit Requests) is **BLOCKED** and requires **COMPLETE FRONTEND INTEGRATION**.

**Options:**

1. **FIX NOW:** Implement all 3 required fixes (3.5 hours estimated)
2. **SKIP & DOCUMENT:** Move to Module 8, return later (NOT RECOMMENDED)
3. **PARTIAL FIX:** Fix critical path only (request submission + approval)

**RECOMMENDATION:** Fix all issues NOW before proceeding to Module 8.

---

**COMPLETION STATUS:** ❌ **CRITICAL FAILURE - REQUIRES FIXES**  
**MODULE GRADE:** F (Zero Integration)  
**BLOCKING ISSUES:** 4 Critical  
**ESTIMATED FIX TIME:** 3.5 hours

**This module demonstrates a complete disconnect between fully-implemented backend and non-integrated frontend using 100% hardcoded dummy data.**

