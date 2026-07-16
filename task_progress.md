# Parent Module Fix Checklist

## Frontend Analysis & Fixes
- [x] Read all Parent pages, components, routes, services
- [x] Read AuthContext, ProtectedRoute, Sidebar, Navbar
- [x] Read backend structure for parents, visit-requests, notifications

## Issues Found & Fixes Needed

### 1. ParentLayout.jsx - Uses dummyData for nav items
- [ ] Replace `import { parentNav } from "../data/dummyData"` with proper nav definition

### 2. AppRoutes.jsx - Missing Parent routes
- [ ] Add missing routes: ChildWelfareFollowUpSession, ChildAdoptionManagement
- [ ] Fix sidebar nav items to match actual routes

### 3. ParentDashboard.jsx - Module-level mutable variables
- [ ] Replace `let linkedChild`, `let adoptionTimeline`, `let trustBadges` with useState

### 4. VisitRequest.jsx - Hardcoded dummy data
- [ ] Replace hardcoded `aiAnalysis` array with backend data
- [ ] Replace hardcoded `documents` array with backend data
- [ ] Add cancel button onClick handler

### 5. SahayakAI.jsx - Hardcoded parent/child IDs
- [ ] Replace hardcoded IDs with authenticated user data

### 6. Alerts.jsx - Used as Notifications page for parent
- [ ] Remove hardcoded `seedAlertQueue`
- [ ] Ensure proper notification display for parent role

### 7. NotificationPanel.jsx - API response handling
- [ ] Fix fragile response unwrapping

### 8. ParentVerificationCenter.jsx - Verify it's reachable
- [ ] Check if page exists and is properly routed

### 9. Backend Integration Verification
- [ ] Verify all frontend API calls match backend endpoints
- [ ] Verify visit-request endpoints exist
- [ ] Verify notification endpoints exist
- [ ] Verify parent endpoints exist

### 10. Final Verification
- [ ] No dummy data remains
- [ ] All routes work
- [ ] All navigation works
- [ ] Backend fully integrated