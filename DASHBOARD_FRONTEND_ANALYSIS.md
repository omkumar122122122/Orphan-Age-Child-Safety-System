# DASHBOARD MODULE - COMPLETE FRONTEND ANALYSIS

**Date**: Analysis Phase  
**Purpose**: Document exact frontend requirements before backend implementation  
**Source of Truth**: React + Vite Frontend

---

## 📊 ADMIN DASHBOARD ANALYSIS

**File**: `src/pages/AdminDashboard.jsx`

### Components & Data Requirements

#### 1. Welcome Banner
- **User Name**: `user.firstName` or `user.name.split(" ")[0]`
- **Current Date**: JavaScript `Date()`
- **System Status Badges**:
  - System: "Operational" (Green)
  - AI Model: "Active" (Violet)

#### 2. AI Insights Strip (4 KPIs)
```javascript
const aiInsights = [
  { label: "AI Safety Score",       value: "94%",   up: true,  icon: FiShield },
  { label: "Compliance Rate",       value: "92%",   up: true,  icon: FiActivity },
  { label: "Risk-flagged Children", value: "8%",    up: false, icon: FiAlertTriangle },
  { label: "Avg Attendance",        value: "89.8%", up: true,  icon: FiTrendingUp },
];
```

**Required API Data**:
- Overall AI safety score percentage
- System compliance rate
- Count/percentage of high-risk children
- Average attendance across all children

#### 3. Stat Cards (4 Main Metrics)
```javascript
export const stats = [
  { label: "Registered Children", value: "1,248", trend: "+8.2%", icon: FiUsers, tone: "blue" },
  { label: "Safe Zones Online",   value: "42",    trend: "+3",    icon: FiShield, tone: "green" },
  { label: "Active Orphanages",   value: "18",    trend: "+2",    icon: FiHome, tone: "amber" },
  { label: "Critical Alerts",     value: "7",     trend: "-4",    icon: FiAlertTriangle, tone: "red" }
];
```

**Required API Data**:
- Total registered children count + growth trend
- Active safe zones/monitoring points count
- Active orphanages count
- Critical alerts count + trend

#### 4. Quick Actions (Navigation Links)
- Register Child → `/admin/register-child`
- Register Orphanage → `/admin/register-orphanage`
- View Orphanages → `/admin/orphanages`
- Review Alerts → `/admin/alerts`

*No API data needed - static UI*

#### 5. Charts

**Monthly Safety & Compliance Score (Line Chart)**:
```javascript
export const monthlySafety = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { label: "Safety Score",     data: [88, 89, 91, 89, 92, 93], borderColor: "#3B82F6" },
    { label: "Compliance Score", data: [85, 86, 87, 88, 89, 91], borderColor: "#10B981" },
    { label: "Health Index",     data: [90, 88, 89, 91, 90, 92], borderColor: "#F59E0B" },
  ]
};
```

**AI Risk Distribution (Doughnut Chart)**:
```javascript
export const riskDistribution = {
  labels: ["Low", "Medium", "High"],
  datasets: [{
    data: [1150, 78, 20],
    backgroundColor: ["#10B981", "#F59E0B", "#EF4444"]
  }]
};
```

**Required API Data**:
- Monthly time-series data for safety, compliance, health scores (last 6-12 months)
- Risk level distribution counts (Low/Medium/High)

#### 6. Recent Child Records Table
```javascript
columns: [
  { key: "id",         label: "Child ID" },
  { key: "name",       label: "Name" },
  { key: "orphanage",  label: "Orphanage" },
  { key: "risk",       label: "Risk" },
  { key: "attendance", label: "Attendance" },
]
rows: children.slice(0, 5)  // Top 5 recent children
```

**Required API Data**:
- 5 most recently registered children with:
  - Child ID
  - Name
  - Orphanage name
  - Risk level (Low/Medium/High)
  - Attendance percentage

#### 7. Notification Panel
Uses `<NotificationPanel items={notifications} />` component
Already integrated with real API (notifications module complete)

---

## 👨‍👩‍👧 PARENT DASHBOARD ANALYSIS

**File**: `src/pages/ParentDashboard.jsx`

### Components & Data Requirements

#### 1. Welcome Banner
- **User Name**: `user.name.split(" ")[0]`
- **Avatar**: `user.avatar` (initials)

#### 2. Trust Badge Strip (4 Verification Metrics)
```javascript
const trustBadges = [
  { label: "KYC",         value: "Verified",  color: "green" },
  { label: "Face Match",  value: "99%",       color: "civic" },
  { label: "Trust Score", value: "95 / 100",  color: "indigo" },
  { label: "Risk Level",  value: "Low",       color: "green" },
];
```

**Required API Data**:
- Parent KYC status (Verified/Pending/Rejected)
- Face match AI confidence score
- Trust score (0-100)
- Risk assessment level

#### 3. Quick Links (Navigation)
- Visit Request → `/parent/visit-request`
- My Profile → `/parent/profile`
- Notifications → `/parent/notifications`

*No API data needed - static UI*

#### 4. Linked Child Overview Card
**Current Implementation**: Fetches from `parentsService.getDashboard()`

```javascript
linkedChild = {
  name: "Anaya Das",
  age: 12,
  orphanage: "Hope Nest",  // Actually orphanageName from backend
  health: "Stable",         // healthStatus from backend
  attendance: "—",
  educationLevel: "Not provided",
  risk: "Not available"
};
```

**Required API Data** (Already implemented!):
- Linked child name
- Child age
- Orphanage name
- Health status
- Attendance percentage (needs backend field)
- Education level (needs backend field)
- Risk level (needs backend field)

#### 5. Adoption Journey Timeline
**Current Implementation**: Fetches from `parentsService.getDashboard()`

```javascript
adoptionTimeline = [
  { step: "Application Submitted",    done: true,  current: false },
  { step: "KYC Verification",         done: true,  current: false },
  { step: "Home Study",               done: false, current: true },
  { step: "Child Matching",           done: false, current: false },
  { step: "Legal Proceedings",        done: false, current: false },
  { step: "Adoption Finalized",       done: false, current: false },
];
```

**Required API Data** (Already implemented!):
- Array of adoption steps with:
  - Step name
  - Completion status (boolean)
  - Current step indicator (boolean)

#### 6. Notification Panel
Uses `<NotificationPanel items={notifications} />` component
Already integrated with real API

#### 7. Sahayak AI Chat
Uses `useChat` hook with `parentId` and `childId`
**Not in scope for Dashboard Module** (separate AI/Chat module)

---

## 🏠 ORPHANAGE DASHBOARD ANALYSIS

**File**: `src/pages/OrphanageDashboard.jsx`

### Components & Data Requirements

#### 1. Welcome Banner
- **User Avatar**: `user.avatar`
- **Department/Orphanage Name**: `user.department` (e.g., "Sunrise Care Home")
- **Summary Badges**:
  - In Care: Total children count
  - At Risk: High-risk children count
  - AI Status: "Active" / "Offline"

**Current Implementation**: Fetches from `orphanagesService.getDashboardStats()`

```javascript
const dashboardData = {
  inCare: 42,
  atRisk: 8,
  aiStatus: 'Active',
  registeredChildren: 42,
  safeZonesOnline: 3,
  activeOrphanages: 1,  // Always 1 for orphanage role
  criticalAlerts: 2,
};
```

**Already Implemented!** ✅

#### 2. Stat Cards (4 Metrics)
```javascript
const stats = [
  { label: "Registered Children", value: 42,  icon: FiUsers, color: "blue", trend: "+12% this month" },
  { label: "Safe Zones Online",   value: 3,   icon: FiShield, color: "green", trend: "All monitored" },
  { label: "Active Orphanages",   value: 1,   icon: FiHeart, color: "amber", trend: "System-wide" },
  { label: "Critical Alerts",     value: 2,   icon: FiActivity, color: "red", trend: "Require attention" },
];
```

**Current Implementation**: Already fetches from backend ✅

#### 3. Quick Actions (Navigation)
- AI Attendance → `/orphanage/ai-attendance`
- Visit Requests → `/orphanage/visit-requests`
- Register Child → `/orphanage/register-child`
- View Reports → `/orphanage/reports`

*No API data needed - static UI*

#### 4. Safety Performance Chart (Line Chart)
**Current Implementation**: Fetches from `orphanagesService.getSafetyChart()`

```javascript
chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { label: "Safety Score", data: [...], borderColor: "#3B82F6" },
    { label: "Attendance",   data: [...], borderColor: "#10B981" },
  ]
};
```

**Already Implemented!** ✅

#### 5. Children in Your Care Table
**Current Implementation**: Fetches from `orphanagesService.getMyChildren(10)`

```javascript
columns: [
  { key: "childCode", label: "Child ID" },
  { key: "name",      label: "Name" },
  { key: "age",       label: "Age" },
  { key: "risk",      label: "Risk" },
  { key: "health",    label: "Health" },
]
rows: children  // Top 10 children
```

**Already Implemented!** ✅

#### 6. Notification Panel
Uses `<NotificationPanel items={notifications} />` component
Already integrated with real API

---

## 🔍 EXISTING BACKEND SERVICES AVAILABLE

Based on directory structure:

✅ **Already Implemented**:
1. `/adoptions` - Adoption records
2. `/auth` - Authentication & authorization
3. `/children` - Children management
4. `/notifications` - Notifications (100% complete)
5. `/orphanages` - Orphanage management
6. `/parents` - Parent profiles
7. `/staff` - Staff management
8. `/users` - User management
9. `/visit-requests` - Visit requests

**Status**:
- **Parent Dashboard**: `parentsService.getDashboard()` already exists and returns data ✅
- **Orphanage Dashboard**: `orphanagesService.getDashboardStats()`, `getDashboardStats()`, `.getMyChildren()`, `.getSafetyChart()` already exist ✅
- **Admin Dashboard**: Needs new aggregation endpoints

---

## 📝 SUMMARY OF REQUIREMENTS

### ADMIN DASHBOARD NEEDS (Backend)

**New Endpoints Required**:
1. `GET /dashboard/admin/stats` - 4 stat cards + AI insights
2. `GET /dashboard/admin/charts` - Monthly safety + risk distribution
3. `GET /dashboard/admin/recent-children` - Recent 5 children

**Data to Aggregate** (from existing services):
- Children count (ChildrenService)
- Orphanages count (OrphanagesService)
- Alerts count (needs AlertsService or fake data)
- Risk distribution (ChildrenService)
- Monthly metrics (needs time-series data or fake)
- Recent children (ChildrenService)

### PARENT DASHBOARD STATUS

✅ **ALREADY COMPLETE**:
- Backend: `parentsService.getDashboard()` exists
- Frontend: Already integrated
- Data: Linked child, adoption journey, trust score

**Minor Enhancements Needed**:
- Add attendance, educationLevel, risk fields to child data

### ORPHANAGE DASHBOARD STATUS

✅ **ALREADY COMPLETE**:
- Backend: All endpoints exist
  - `orphanagesService.getDashboardStats()`
  - `orphanagesService.getMyChildren(10)`
  - `orphanagesService.getSafetyChart()`
- Frontend: Already integrated
- Data: All stats, chart, children table

---

## 🎯 IMPLEMENTATION STRATEGY

### Phase 1: Admin Dashboard Backend (NEW)
Create `/dashboard` module with AdminDashboardController:
- Aggregate data from existing services
- Return exactly what frontend expects
- Use role guards (ADMIN only)

### Phase 2: Frontend Integration
- Replace `dummyData.js` imports with real API calls
- Create `dashboardService.js` for Admin dashboard
- Update AdminDashboard.jsx to fetch from backend

### Phase 3: Data Cleanup
- Remove dashboard-related exports from `dummyData.js`:
  - `stats`
  - `monthlySafety`
  - `riskDistribution`
  - Recent `children` slice

### Phase 4: Verification
- Test all 3 dashboards
- Verify role-based data scoping
- Confirm charts render correctly
- Check all stat cards display real data

---

## ✅ COMPLETION CRITERIA

Dashboard module is COMPLETE when:
- ✅ Admin dashboard shows live data from PostgreSQL
- ✅ Parent dashboard already complete (verify)
- ✅ Orphanage dashboard already complete (verify)
- ✅ All dashboard mock data removed from dummyData.js
- ✅ Charts display real time-series data
- ✅ Stat cards show accurate counts
- ✅ Role-based security enforced
- ✅ Zero compilation errors
- ✅ All components render without errors

---

## 🚦 NEXT STEPS

1. Create `DashboardModule` with AdminDashboardController
2. Inject existing services (Children, Orphanages, Parents, VisitRequests, Notifications)
3. Create aggregation methods
4. Create DTOs for responses
5. Add Swagger documentation
6. Test endpoints
7. Create frontend `dashboardService.js`
8. Update AdminDashboard.jsx
9. Remove mock data
10. Verify complete integration
