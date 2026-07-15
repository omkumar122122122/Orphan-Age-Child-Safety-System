# MODULE 7: VISIT REQUESTS - FIXES IN PROGRESS

**Date:** July 15, 2026  
**Status:** 🔧 FIXING CRITICAL ISSUES

---

## ✅ COMPLETED FIXES

### **Fix 1: Frontend Service Layer** ✅ COMPLETE

**File:** `src/services/visitRequestsService.js`

**Changes Made:**
- ✅ Fixed HTTP methods (POST → PATCH for approve/reject/reschedule/complete/cancel)
- ✅ Added `/my-requests` endpoint (was `/my`)
- ✅ Added `getTodayVisits()` method
- ✅ Added `requestDocuments()` method
- ✅ Updated `complete()` to accept feedbackData instead of just notes

**Result:** Service layer now matches backend API 100%

---

## 🔧 IN PROGRESS

### **Fix 2: VisitRequest.jsx** — Parent Form Integration

**Target:** Remove 5 hardcoded data constants, integrate with backend

**Required Changes:**
1. Load parent profile from `parentsService.getDashboard()`
2. Load orphanages from `orphanagesService.getAll({ status: 'APPROVED' })`
3. Load request history from `visitRequestsService.getMyRequests()`
4. Implement real form submission to `visitRequestsService.create()`
5. Add loading states
6. Add error handling

**Lines to Remove/Replace:**
- Lines 21-35: `parentProfile` hardcoded object
- Lines 37-63: `orphanageOptions` hardcoded array
- Lines 74-81: `aiAnalysis` hardcoded array (optional - can keep as UI demo)
- Lines 83-106: `requestHistory` hardcoded array
- Lines 148-151: `onSubmit` fake implementation

