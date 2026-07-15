# 🧪 DASHBOARD MODULE TESTING GUIDE

**Module**: Dashboard (Admin, Parent, Orphanage)  
**Status**: Ready for Testing  
**Purpose**: Guide for verifying dashboard functionality

---

## 🎯 TESTING CHECKLIST

### Prerequisites
- ✅ Backend server running on `http://localhost:3000`
- ✅ Frontend server running on `http://localhost:5173`
- ✅ PostgreSQL database running with seeded data
- ✅ JWT authentication working

---

## 1️⃣ ADMIN DASHBOARD TESTING

### Login as Admin
```
Email: admin@safety.gov
Password: admin123
```

### Navigate to Admin Dashboard
**URL**: `http://localhost:5173/admin`

### ✅ Visual Verification Checklist

#### Welcome Banner
- [ ] Displays admin name: "Welcome back, [FirstName]"
- [ ] Shows current date in Indian format
- [ ] Shows "System: Operational" badge (green)
- [ ] Shows "AI Model: Active" badge (violet)

#### AI Insights Strip (4 KPIs)
- [ ] AI Safety Score: Shows percentage (e.g., "94%")
- [ ] Compliance Rate: Shows percentage (e.g., "92%")
- [ ] Risk-flagged Children: Shows percentage (calculated from database)
- [ ] Avg Attendance: Shows percentage (e.g., "89.8%")
- [ ] All KPIs show trend arrows (up/down)

#### Stat Cards (4 Cards)
- [ ] Registered Children: Shows real count from database
- [ ] Safe Zones Online: Shows calculated value
- [ ] Active Orphanages: Shows real count from database
- [ ] Critical Alerts: Shows count (currently 7)
- [ ] All cards show trend values

#### Quick Actions (4 Buttons)
- [ ] Register Child button → links to `/admin/register-child`
- [ ] Register Orphanage button → links to `/admin/register-orphanage`
- [ ] View Orphanages button → links to `/admin/orphanages`
- [ ] Review Alerts button → links to `/admin/alerts`

#### Charts
- [ ] Monthly Safety & Compliance Score (Line Chart)
  - Shows 3 lines: Safety Score, Compliance Score, Health Index
  - X-axis shows months: Jan, Feb, Mar, Apr, May, Jun
  - Chart renders without errors
  - Tooltip appears on hover

- [ ] AI Risk Distribution (Doughnut Chart)
  - Shows 3 segments: Low (green), Medium (amber), High (red)
  - Displays real counts from database
  - Percentage shown on hover
  - Legend displays correctly

#### Recent Child Records Table
- [ ] Shows 5 most recently registered children
- [ ] Columns: Child ID, Name, Orphanage, Risk, Attendance
- [ ] Data populated from database (not dummy data)
- [ ] "View all" link → links to `/admin/children`
- [ ] Badge shows count: "5 recent"

#### Notification Panel
- [ ] Displays recent notifications
- [ ] Unread count badge visible if unread notifications exist
- [ ] "Mark all read" button functional
- [ ] Fetches from `/notifications` API

### 🔍 Browser Console Checks
- [ ] No errors in console
- [ ] API calls successful:
  - `GET /dashboard/admin/stats` → Status 200
  - `GET /dashboard/admin/charts` → Status 200
  - `GET /dashboard/admin/recent-children` → Status 200
  - `GET /notifications` → Status 200

### 🔄 Loading State
- [ ] Shows spinner on initial load
- [ ] "Loading dashboard..." message displayed
- [ ] Transitions smoothly to content

---

## 2️⃣ PARENT DASHBOARD TESTING

### Login as Parent
```
Email: parent@example.com
Password: parent123
```

### Navigate to Parent Dashboard
**URL**: `http://localhost:5173/parent`

### ✅ Visual Verification Checklist

#### Welcome Banner
- [ ] Displays parent name: "Welcome back, [FirstName]"
- [ ] Shows user avatar/initials
- [ ] Subtitle: "Track your adoption process..."

#### Trust Badge Strip (4 Metrics)
- [ ] KYC: Shows verification status
- [ ] Face Match: Shows percentage (e.g., "99%")
- [ ] Trust Score: Shows score out of 100
- [ ] Risk Level: Shows level (Low/Medium/High)
- [ ] AI-verified profile badge visible

#### Quick Links (3 Cards)
- [ ] Visit Request → links to `/parent/visit-request`
- [ ] My Profile → links to `/parent/profile`
- [ ] Notifications → links to `/parent/notifications`

#### Linked Child Overview Card
- [ ] Shows linked child name (if adopted child exists)
- [ ] Shows child age and orphanage name
- [ ] Shows health status badge
- [ ] Shows attendance, education level, risk level
- [ ] If no linked child: "Your adopted child will appear here..."

#### Adoption Journey Timeline
- [ ] Shows adoption steps in order
- [ ] Completed steps have green checkmark
- [ ] Current step highlighted with "In Progress" badge
- [ ] Pending steps shown in gray

#### Notification Panel
- [ ] Displays recent notifications
- [ ] Fetches from API (not dummy data)

#### Sahayak AI Section
- [ ] Expandable/collapsible section
- [ ] Shows "Online" badge
- [ ] Shows "Gemini AI" badge
- [ ] Capability chips displayed
- [ ] Can expand to show chat interface

### 🔍 Browser Console Checks
- [ ] No errors in console
- [ ] API call successful:
  - `GET /parents/dashboard` → Status 200
  - `GET /notifications` → Status 200

### 🔄 Loading State
- [ ] Data loads on mount
- [ ] No flash of dummy content

---

## 3️⃣ ORPHANAGE DASHBOARD TESTING

### Login as Orphanage
```
Email: orphanage@example.com
Password: orphanage123
```

### Navigate to Orphanage Dashboard
**URL**: `http://localhost:5173/orphanage`

### ✅ Visual Verification Checklist

#### Welcome Banner
- [ ] Shows orphanage name (e.g., "Sunrise Care Home")
- [ ] Shows user avatar
- [ ] Subtitle: "Manage attendance, welfare monitoring..."

#### Summary Badges (3 Metrics)
- [ ] In Care: Shows total children count
- [ ] At Risk: Shows high-risk children count
- [ ] AI Status: Shows "Active" with green dot

#### Stat Cards (4 Cards)
- [ ] Registered Children: Shows count from database
- [ ] Safe Zones Online: Shows count
- [ ] Active Orphanages: Shows 1 (own orphanage)
- [ ] Critical Alerts: Shows alert count

#### Quick Actions (4 Buttons)
- [ ] AI Attendance → links to `/orphanage/ai-attendance`
- [ ] Visit Requests → links to `/orphanage/visit-requests`
- [ ] Register Child → links to `/orphanage/register-child`
- [ ] View Reports → links to `/orphanage/reports`

#### Safety Performance Chart (Line Chart)
- [ ] Shows safety metrics over time
- [ ] Chart renders correctly
- [ ] Data fetched from API

#### Children in Your Care Table
- [ ] Shows children belonging to this orphanage
- [ ] Columns: Child ID, Name, Age, Risk, Health
- [ ] Data scoped to this orphanage only
- [ ] "View all" link → links to `/orphanage/children`
- [ ] Badge shows count

#### Notification Panel
- [ ] Displays notifications
- [ ] Fetches from API

### 🔍 Browser Console Checks
- [ ] No errors in console
- [ ] API calls successful:
  - `GET /orphanages/dashboard/stats` → Status 200
  - `GET /orphanages/children?limit=10` → Status 200
  - `GET /orphanages/safety-chart` → Status 200
  - `GET /notifications` → Status 200

### 🔄 Loading State
- [ ] Shows spinner on initial load
- [ ] "Loading dashboard..." message
- [ ] Smooth transition

---

## 🔐 SECURITY TESTING

### Role-Based Access Control
1. **Admin trying to access Parent dashboard**
   - [ ] Navigate to `/parent` while logged in as admin
   - [ ] Expected: Redirected or Forbidden error

2. **Parent trying to access Admin dashboard**
   - [ ] Navigate to `/admin` while logged in as parent
   - [ ] Expected: Redirected or Forbidden error

3. **Orphanage trying to access Admin dashboard**
   - [ ] Navigate to `/admin` while logged in as orphanage
   - [ ] Expected: Redirected or Forbidden error

### API Authorization
1. **Test direct API access without proper role**
   - [ ] Try accessing `/dashboard/admin/stats` with PARENT token
   - [ ] Expected: 403 Forbidden

2. **Test without authentication**
   - [ ] Try accessing `/dashboard/admin/stats` without JWT
   - [ ] Expected: 401 Unauthorized

---

## 📊 DATA VALIDATION TESTING

### Admin Dashboard
1. **Verify Stat Cards Match Database**
   - [ ] Open database: Check `Child` table count
   - [ ] Compare with "Registered Children" stat card
   - [ ] They should match exactly

2. **Verify Risk Distribution Chart**
   - [ ] In database: Count children by `riskLevel`
   - [ ] Compare with doughnut chart segments
   - [ ] Percentages should match

3. **Verify Recent Children**
   - [ ] In database: Query last 5 children ordered by `createdAt DESC`
   - [ ] Compare with table in dashboard
   - [ ] Order and data should match

### Orphanage Dashboard
1. **Verify Children Count**
   - [ ] In database: Count children where `orphanageId` = current orphanage
   - [ ] Compare with dashboard stat cards
   - [ ] Should match exactly

2. **Verify Data Scoping**
   - [ ] Orphanage should only see own children
   - [ ] Children table should not show other orphanages' children
   - [ ] Verify in database vs UI

---

## 🐛 ERROR HANDLING TESTING

### Network Errors
1. **Test with backend offline**
   - [ ] Stop backend server
   - [ ] Refresh dashboard
   - [ ] Expected: Loading state or error message
   - [ ] No crash or white screen

2. **Test with slow network**
   - [ ] Use browser dev tools to throttle network
   - [ ] Refresh dashboard
   - [ ] Expected: Loading state persists, then data loads

### Authentication Errors
1. **Test with expired token**
   - [ ] Manually expire JWT token
   - [ ] Try accessing dashboard
   - [ ] Expected: Redirect to login page

---

## ✅ ACCEPTANCE CRITERIA

Dashboard Module is accepted if:
- [ ] All 3 dashboards load without errors
- [ ] All data comes from PostgreSQL (no dummy data visible)
- [ ] Role-based access control works correctly
- [ ] Charts render properly with real data
- [ ] Stat cards show accurate counts
- [ ] Recent/filtered data tables display correctly
- [ ] Notifications panel works
- [ ] Loading states appear appropriately
- [ ] No console errors
- [ ] Responsive design works on mobile/tablet
- [ ] All links navigate correctly
- [ ] API responses are fast (<500ms for most endpoints)

---

## 📝 TEST RESULTS TEMPLATE

```
DASHBOARD MODULE TEST RESULTS
Date: _____________
Tester: _____________

ADMIN DASHBOARD
✅ / ❌ / ⚠️  Loading State
✅ / ❌ / ⚠️  Welcome Banner
✅ / ❌ / ⚠️  AI Insights Strip
✅ / ❌ / ⚠️  Stat Cards
✅ / ❌ / ⚠️  Quick Actions
✅ / ❌ / ⚠️  Charts
✅ / ❌ / ⚠️  Recent Children Table
✅ / ❌ / ⚠️  Notification Panel

PARENT DASHBOARD
✅ / ❌ / ⚠️  Welcome Banner
✅ / ❌ / ⚠️  Trust Badges
✅ / ❌ / ⚠️  Quick Links
✅ / ❌ / ⚠️  Linked Child Card
✅ / ❌ / ⚠️  Adoption Journey
✅ / ❌ / ⚠️  Notification Panel

ORPHANAGE DASHBOARD
✅ / ❌ / ⚠️  Welcome Banner
✅ / ❌ / ⚠️  Summary Badges
✅ / ❌ / ⚠️  Stat Cards
✅ / ❌ / ⚠️  Quick Actions
✅ / ❌ / ⚠️  Safety Chart
✅ / ❌ / ⚠️  Children Table
✅ / ❌ / ⚠️  Notification Panel

SECURITY
✅ / ❌ / ⚠️  Role-based access
✅ / ❌ / ⚠️  API authorization
✅ / ❌ / ⚠️  Data scoping

PERFORMANCE
✅ / ❌ / ⚠️  Page load time
✅ / ❌ / ⚠️  API response time
✅ / ❌ / ⚠️  Chart rendering

ISSUES FOUND:
1. _________________________
2. _________________________
3. _________________________

OVERALL STATUS: ✅ PASS / ❌ FAIL / ⚠️ NEEDS ATTENTION
```

---

## 🎉 COMPLETION

Once all tests pass, the Dashboard Module is **production-ready** and can be deployed to staging/production environments.
