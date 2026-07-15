# 📋 ORPHANAGE STAFF MODULE - COMPLETE FRONTEND ANALYSIS

**Document Version:** 1.0  
**Analysis Date:** July 14, 2026  
**Analyzed By:** Kiro AI Assistant  
**Status:** ✅ PHASE 1 COMPLETE - NO CODE GENERATION

---

## 🎯 EXECUTIVE SUMMARY

This document provides a comprehensive analysis of the Orphanage Staff module requirements based on **complete frontend inspection**. The analysis covers every page, component, route, form, modal, table, filter, validation, state management, and user interaction pattern related to staff functionality.

### Key Findings:
- ✅ **OrphanageStaff** database model already exists in Prisma schema
- ⚠️ **NO dedicated staff management UI** currently exists in frontend
- 📊 Staff data is **display-only** in multiple views (summary counts)
- 🔧 Staff assignment functionality exists in **Visit Request Management**
- 📝 Staff counts are captured during **Orphanage Registration**

---

## 📁 CURRENT FRONTEND STRUCTURE

### Pages Analyzed (25 total)

#### Staff-Related Pages:
1. **RegisterOrphanage.jsx** - Captures staff counts during registration
2. **OrphanageFullProfile.jsx** - Displays staff summary (read-only)
3. **Profile.jsx** - Shows staff details for orphanage role
4. **ManageVisitRequests.jsx** - Assigns staff to parent visits
5. **OrphanageDashboard.jsx** - No direct staff display (uses aggregate data)
6. **OrphanageDetail.jsx** - Links to full profile with staff info

#### Pages WITHOUT Staff Functionality:
- Children.jsx
- ChildProfile.jsx
- AdminDashboard.jsx
- AIAttendance.jsx
- ChildAdoptionManagement.jsx
- HealthMonitoring.jsx
- Reports.jsx
- Alerts.jsx
- ParentDashboard.jsx
- ParentProfile.jsx
- Login.jsx

---

## 🛣️ ROUTING ANALYSIS

### Current Routes (from AppRoutes.jsx)


**Admin Routes:**
- `/admin` - AdminDashboard
- `/admin/children` - Children listing
- `/admin/children/:childId` - Child profile
- `/admin/parent-verification` - Parent verification center
- `/admin/register-orphanage` - Orphanage registration
- `/admin/orphanages` - Orphanages listing
- `/admin/orphanages/:orphanageId` - Orphanage detail
- `/admin/orphanages/:orphanageId/profile` - Full orphanage profile
- `/admin/alerts` - Alerts
- `/admin/profile` - User profile

**Orphanage Routes:**
- `/orphanage` - OrphanageDashboard
- `/orphanage/ai-attendance` - AI attendance tracking
- `/orphanage/visit-requests` - Visit request management
- `/orphanage/children` - Children in care
- `/orphanage/children/:childId` - Child profile
- `/orphanage/register-child` - Register new child
- `/orphanage/adoption-management` - Adoption management
- `/orphanage/health-monitoring` - Health monitoring
- `/orphanage/reports` - Reports
- `/orphanage/profile` - Orphanage profile

**Parent Routes:**
- `/parent` - ParentDashboard
- `/parent/sahayak-ai` - AI chatbot
- `/parent/profile` - Parent profile
- `/parent/visit-request` - Visit request form
- `/parent/child-welfare-follow-up-session` - Follow-up sessions
- `/parent/notifications` - Notifications

### ⚠️ MISSING ROUTES FOR STAFF MODULE:

```
ADMIN ROUTES NEEDED:
❌ /admin/staff - Staff management listing (all orphanages)
❌ /admin/orphanages/:orphanageId/staff - Staff list per orphanage
❌ /admin/staff/:staffId - Individual staff profile

ORPHANAGE ROUTES NEEDED:
❌ /orphanage/staff - Staff management for current orphanage
❌ /orphanage/staff/:staffId - Staff member profile/edit
❌ /orphanage/staff/add - Add new staff member
```

---

## 🧩 COMPONENT ANALYSIS

### Existing Reusable Components:


#### ✅ Available for Staff Module:
1. **Breadcrumb.jsx** - Navigation breadcrumbs
2. **Button.jsx** - Action buttons with icons/variants
3. **Card.jsx** - Container cards with styling
4. **ChartCard.jsx** - Line/Doughnut charts for analytics
5. **DataTable.jsx** - Tabular data display with sorting
6. **FormInput.jsx** - Input fields with icons/validation
7. **Loader.jsx** - Loading states
8. **Modal.jsx** - Modal dialogs
9. **Navbar.jsx** - Top navigation bar
10. **NotificationPanel.jsx** - Notification sidebar
11. **Pagination.jsx** - Pagination controls
12. **ProfileCard.jsx** - Profile display cards
13. **ProfileHeader.jsx** - Profile headers
14. **ProfileInfoGrid.jsx** - Grid layouts for profile data
15. **SearchBar.jsx** - Search input with filters
16. **Sidebar.jsx** - Navigation sidebar
17. **ThemeToggle.jsx** - Dark mode toggle
18. **Toast.jsx** - Toast notifications

#### ❌ MISSING Components for Staff:
```
- StaffCard.jsx - Staff member card display
- StaffTable.jsx - Staff-specific table (optional, can use DataTable)
- StaffModal.jsx - Add/Edit staff modal
- StaffForm.jsx - Staff registration form
- StaffFilters.jsx - Staff-specific filter component
- StaffAvatar.jsx - Staff avatar with role badge
- StaffRoleBadge.jsx - Role indicator badges
```

---

## 📊 DATA STRUCTURES ANALYSIS

### 1. Orphanage Staff Summary (Current Implementation)

**Location:** `src/data/dummyData.js` - orphanages array


```javascript
staff: {
  totalStaff: 46,        // Total count
  caretakers: 20,        // Count by role
  teachers: 8,
  medicalStaff: 5,
  securityGuards: 6,
  volunteers: 7
}
```

**Used In:**
- RegisterOrphanage.jsx (form input)
- OrphanageFullProfile.jsx (display)
- Profile.jsx (display)

**Issues:**
- ❌ Only aggregate counts, no individual staff records
- ❌ No staff names, contact info, or employee details
- ❌ Cannot track which staff member is active/inactive
- ❌ No staff assignment or scheduling capability
- ❌ No link to User accounts

### 2. Staff Assignment in Visit Requests

**Location:** `src/pages/ManageVisitRequests.jsx`

```javascript
assignedStaff: "Meera Nair"  // String field, free text
```

**Used For:**
- Assigning staff to parent visit supervision
- Displayed in visit request cards
- Used in approve visit modal

**Issues:**
- ❌ Free-text field, not linked to staff database
- ❌ No validation or dropdown selection
- ❌ Cannot track staff workload or availability
- ❌ Risk of typos and inconsistency

---

## 🗄️ DATABASE SCHEMA ANALYSIS

### OrphanageStaff Model (Prisma Schema)


```prisma
model OrphanageStaff {
  id          String    @id @default(uuid())
  orphanageId String
  orphanage   Orphanage @relation(fields: [orphanageId], references: [id], onDelete: Cascade)

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  role        OrphanageStaffRole @default(OTHER)
  designation String?
  employeeId  String?
  joiningDate DateTime?
  endDate     DateTime?
  isActive    Boolean            @default(true)
  notes       String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([orphanageId, userId])
  @@index([orphanageId])
  @@index([userId])
  @@index([isActive])
  @@map("orphanage_staff")
}

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

**Key Features:**
- ✅ Links staff to User account (userId)
- ✅ Links staff to Orphanage (orphanageId)
- ✅ Role-based classification
- ✅ Employment tracking (joining/end dates)
- ✅ Active/inactive status
- ✅ Unique constraint prevents duplicate user-orphanage pairs
- ✅ Soft delete support via isActive flag

---

## 📝 FORM ANALYSIS

### 1. RegisterOrphanage.jsx - Staff Section


**Section 8: Staff Details**

```jsx
<FormInput label="Total Staff" type="number" icon={FiUsers} {...register("totalStaff")} />
<FormInput label="Caretakers" type="number" icon={FiUsers} {...register("caretakers")} />
<FormInput label="Teachers" type="number" icon={FiUsers} {...register("teachers")} />
<FormInput label="Medical Staff" type="number" icon={FiUsers} {...register("medicalStaff")} />
<FormInput label="Security Guards" type="number" icon={FiShield} {...register("securityGuards")} />
<FormInput label="Volunteers" type="number" icon={FiUsers} {...register("volunteers")} />
```

**Characteristics:**
- ✅ Uses react-hook-form for state management
- ✅ Grid layout (3 columns on large screens)
- ✅ Icon-based visual identification
- ✅ Number input type with validation
- ❌ No validation rules (min/max)
- ❌ Only captures counts, not individual records
- ❌ No way to register actual staff members

**Grid Layout:** `md:grid-cols-2 xl:grid-cols-3`

### 2. ManageVisitRequests.jsx - Approve Visit Modal

**Staff Assignment Field:**

```jsx
<InputField
  label="Assign Staff Member"
  value={approveForm.staffMember}
  onChange={(value) => setApproveForm((current) => ({ ...current, staffMember: value }))}
/>
```

**Characteristics:**
- ✅ Simple text input
- ✅ Controlled component pattern
- ❌ Free text, no dropdown/autocomplete
- ❌ No staff validation
- ❌ No staff availability check

**Expected Backend Behavior:**
- Should accept staff assignment during visit approval
- Should link to actual staff records (not free text)
- Should validate staff belongs to orphanage
- Should check staff availability for the date/time

---

## 🔍 SEARCH & FILTER ANALYSIS


### Current Filter Patterns (from Children/Parents modules)

**Common Filter Patterns:**
```javascript
// Filters typically include:
- Search by name/ID
- Filter by status (active/inactive)
- Filter by role/category
- Sort by date/name
- Pagination (page, limit)
```

### Expected Staff Filters:

```javascript
{
  search: "",              // Name, employee ID, email
  role: "",                // OrphanageStaffRole enum
  isActive: "all",         // "all", "active", "inactive"
  orphanageId: "",         // For admin view
  sortBy: "name",          // "name", "joiningDate", "role"
  sortOrder: "asc",        // "asc", "desc"
  page: 1,
  limit: 10
}
```

**Filter UI Components Needed:**
- Search bar (reuse SearchBar.jsx)
- Role dropdown (all roles from enum)
- Status filter (Active/Inactive/All)
- Sort controls
- Pagination (reuse Pagination.jsx)

---

## 📊 TABLE/LIST DISPLAY ANALYSIS

### Current Table Pattern (DataTable.jsx)

**Used In:** Children.jsx, AdminDashboard.jsx, OrphanageDashboard.jsx

```jsx
<DataTable
  columns={[
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "status", label: "Status" }
  ]}
  rows={data}
/>
```

### Expected Staff Table Columns:

```javascript
columns: [
  { key: "employeeId", label: "Employee ID" },
  { key: "name", label: "Name" },           // From User.name
  { key: "role", label: "Role" },
  { key: "designation", label: "Designation" },
  { key: "phone", label: "Contact" },        // From User.phone
  { key: "joiningDate", label: "Joined" },
  { key: "isActive", label: "Status" },      // Badge: Active/Inactive
  { key: "actions", label: "Actions" }       // Edit, View, Delete buttons
]
```

**Row Actions:**
- 👁️ View - Navigate to staff profile
- ✏️ Edit - Open edit modal
- 🗑️ Delete - Deactivate staff (soft delete)

---

## 🎨 UI/UX PATTERNS ANALYSIS


### Design System Conventions

**Colors & Themes:**
- Primary: Civic blue (`civic-600`)
- Secondary: Indigo (`indigo-600`)
- Success: Emerald (`emerald-600`)
- Warning: Amber (`amber-600`)
- Danger: Red (`red-600`)
- Dark mode support throughout

**Typography:**
- Page title: `text-2xl font-extrabold`
- Section title: `text-lg font-bold`
- Card header: `section-card-title`
- Body text: `text-sm font-medium`

**Cards:**
- Border: `border border-slate-200 dark:border-slate-800`
- Background: `bg-white dark:bg-slate-900`
- Shadow: `shadow-card`
- Padding: `p-5` or `px-6 py-6`
- Rounded: `rounded-2xl`

**Buttons:**
- Primary: `bg-civic-600 hover:bg-civic-700`
- Secondary: `border border-slate-300`
- Icon + Text pattern common
- Variants: primary, secondary, outline

**Icons:**
- From `react-icons/fi` (Feather Icons)
- Size: `h-4 w-4` or `h-3.5 w-3.5`
- Color: Context-dependent

**Badges:**
```jsx
<span className="badge badge-civic">Active</span>
<span className="badge badge-amber">Pending</span>
```

### Layout Patterns

**Dashboard Layout:**
```
[Breadcrumb]
[Header with title + actions]
[Stats Cards Grid - 4 columns]
[Quick Actions Grid]
[Charts Section]
[Table + Sidebar Grid]
```

**Profile Layout:**
```
[Breadcrumb]
[Header with back button]
[Two-column: Main content + Sidebar]
[Multiple Section Cards]
```

**Form Layout:**
```
[Breadcrumb]
[Page Header]
[Section Cards with grouped inputs]
[Submit button at bottom-right]
```

---

## 🔐 VALIDATION PATTERNS


### React Hook Form Validation (RegisterOrphanage.jsx example)

```javascript
{...register("name", { 
  required: "Orphanage name is required" 
})}

error={formState.errors.name?.message}
```

### Expected Staff Form Validation:

```javascript
{
  // User Association
  userId: {
    required: "User account is required",
    validate: (value) => value !== "" || "Please select a user"
  },

  // Role
  role: {
    required: "Staff role is required"
  },

  // Employee ID (optional but unique if provided)
  employeeId: {
    pattern: {
      value: /^[A-Z0-9-]+$/,
      message: "Invalid employee ID format"
    }
  },

  // Joining Date
  joiningDate: {
    required: "Joining date is required",
    validate: (value) => {
      const date = new Date(value);
      return date <= new Date() || "Joining date cannot be in future";
    }
  },

  // End Date (if provided)
  endDate: {
    validate: (value, formValues) => {
      if (!value) return true;
      const joining = new Date(formValues.joiningDate);
      const end = new Date(value);
      return end > joining || "End date must be after joining date";
    }
  }
}
```

---

## 📱 STATE MANAGEMENT ANALYSIS

### Current Patterns

**1. Local State (useState):**
- Form data
- Modal open/close states
- Filter/search values
- Loading states

**2. Context (AuthContext):**
- User authentication
- User role/permissions
- Current orphanage (for orphanage role)

**3. LocalStorage:**
- JWT token
- User preferences
- Draft form data

### Expected Staff State Management:


```javascript
// Staff List Page State
const [staff, setStaff] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filters, setFilters] = useState({
  search: "",
  role: "",
  isActive: "all",
  page: 1,
  limit: 10
});
const [pagination, setPagination] = useState({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
});
const [selectedStaff, setSelectedStaff] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"

// Staff Profile State
const [staffProfile, setStaffProfile] = useState(null);
const [isEditing, setIsEditing] = useState(false);
```

---

## 🔄 API INTEGRATION PATTERNS

### Service Layer Pattern (from childrenService.js)

```javascript
export const staffService = {
  // Get all staff with filters
  async getAll(params = {}) {
    const response = await apiClient.get('/staff', params);
    return unwrap(response);
  },

  // Get staff by ID
  async getById(id) {
    const response = await apiClient.get(`/staff/${id}`);
    return unwrap(response);
  },

  // Get staff by orphanage
  async getByOrphanage(orphanageId, params = {}) {
    const response = await apiClient.get(`/orphanages/${orphanageId}/staff`, params);
    return unwrap(response);
  },

  // Create new staff
  async create(staffData) {
    const response = await apiClient.post('/staff', staffData);
    return unwrap(response);
  },

  // Update staff
  async update(id, updates) {
    const response = await apiClient.patch(`/staff/${id}`, updates);
    return unwrap(response);
  },

  // Deactivate staff (soft delete)
  async deactivate(id) {
    const response = await apiClient.patch(`/staff/${id}/deactivate`);
    return unwrap(response);
  },

  // Reactivate staff
  async reactivate(id) {
    const response = await apiClient.patch(`/staff/${id}/reactivate`);
    return unwrap(response);
  }
};
```

### Expected API Endpoints:


```
GET    /api/v1/staff                      - List all staff (admin)
GET    /api/v1/staff/:id                  - Get staff by ID
POST   /api/v1/staff                      - Create new staff
PATCH  /api/v1/staff/:id                  - Update staff
PATCH  /api/v1/staff/:id/deactivate       - Soft delete staff
PATCH  /api/v1/staff/:id/reactivate       - Reactivate staff

GET    /api/v1/orphanages/:id/staff       - Get staff by orphanage
GET    /api/v1/staff/available             - Get available staff for assignments
```

### Request/Response Patterns

**Create Staff Request:**
```json
{
  "userId": "uuid",
  "orphanageId": "uuid",
  "role": "CARETAKER",
  "designation": "Senior Caretaker",
  "employeeId": "EMP-001",
  "joiningDate": "2024-01-15T00:00:00Z",
  "notes": "Experienced in child care"
}
```

**Staff List Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "staff": [
      {
        "id": "uuid",
        "employeeId": "EMP-001",
        "role": "CARETAKER",
        "designation": "Senior Caretaker",
        "joiningDate": "2024-01-15T00:00:00Z",
        "isActive": true,
        "user": {
          "id": "uuid",
          "name": "Meera Nair",
          "email": "meera@orphanage.com",
          "phone": "+91 98765 43210"
        },
        "orphanage": {
          "id": "uuid",
          "name": "Sunrise Care Home"
        }
      }
    ],
    "pagination": {
      "total": 46,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## 🎭 USER INTERACTION FLOWS

### Flow 1: Admin Views All Staff


```
1. Admin navigates to /admin/staff
2. System loads all staff across all orphanages
3. Admin can:
   - Search by name/employee ID
   - Filter by orphanage
   - Filter by role
   - Filter by active/inactive status
   - Sort by name, joining date, role
4. Admin clicks on staff row
5. System navigates to /admin/staff/:id
6. Admin views full profile
7. Admin can:
   - Edit staff details
   - View associated orphanage
   - View user account details
   - Deactivate/reactivate staff
```

### Flow 2: Orphanage Manages Their Staff

```
1. Orphanage user logs in
2. Navigates to /orphanage/staff
3. System loads staff only for current orphanage
4. User clicks "Add Staff Member"
5. Modal/page opens with form:
   - Select existing user OR create new user
   - Select role
   - Enter employee ID (optional)
   - Enter designation
   - Select joining date
   - Add notes
6. User submits form
7. System validates data
8. Backend creates OrphanageStaff record
9. If new user: Creates User account
10. System shows success notification
11. Staff list updates with new member
```

### Flow 3: Assign Staff to Visit Request

```
1. Orphanage user views visit request
2. Clicks "Approve Visit"
3. Modal opens with approval form
4. User selects staff member from dropdown:
   - Dropdown shows only active staff
   - Filtered by orphanageId
   - Shows: Name (Role)
5. User completes other fields (date, room, etc.)
6. Submits approval
7. Backend:
   - Links staff to visit request
   - Updates assignedStaffId field
8. Visit request shows assigned staff name
```

### Flow 4: Edit Staff Information

```
1. User navigates to staff profile
2. Clicks "Edit" button
3. Form fields become editable
4. User can update:
   - Role
   - Designation
   - Employee ID
   - Notes
5. Cannot change:
   - User association
   - Orphanage association
   - Joining date (or requires special permission)
6. User clicks "Save"
7. System validates changes
8. Backend updates staff record
9. Profile view refreshes
```

### Flow 5: Deactivate Staff

```
1. User views staff profile
2. Clicks "Deactivate" button
3. Confirmation modal appears:
   "Are you sure you want to deactivate [Name]?"
4. User confirms
5. Backend:
   - Sets isActive = false
   - Sets endDate = now (optional)
6. Staff status changes to "Inactive"
7. Staff no longer appears in active staff lists
8. Staff no longer available for visit assignments
```

---

## 📐 NAVIGATION STRUCTURE


### Current Navigation (dummyData.js)

**Admin Navigation:**
```javascript
[
  { label: "Dashboard", path: "/admin", icon: FiActivity },
  { label: "Children", path: "/admin/children", icon: FiUsers },
  { label: "Parent Verification", path: "/admin/parent-verification", icon: FiUserCheck },
  { label: "Register Child", path: "/admin/register-child", icon: FiPlusCircle },
  { label: "Register Orphanage", path: "/admin/register-orphanage", icon: FiHome },
  { label: "Orphanages", path: "/admin/orphanages", icon: FiHome },
  { label: "Alerts", path: "/admin/alerts", icon: FiAlertTriangle },
  { label: "Profile", path: "/admin/profile", icon: FiUser }
]
```

**Orphanage Navigation:**
```javascript
[
  { label: "Dashboard", path: "/orphanage", icon: FiActivity },
  { label: "AI Attendance", path: "/orphanage/ai-attendance", icon: FiCamera },
  { label: "Visit Requests", path: "/orphanage/visit-requests", icon: FiCalendar },
  { label: "Children", path: "/orphanage/children", icon: FiUsers },
  { label: "Register Child", path: "/orphanage/register-child", icon: FiPlusCircle },
  { label: "Adoption Management", path: "/orphanage/adoption-management", icon: FiFileText },
  { label: "Health Monitoring", path: "/orphanage/health-monitoring", icon: FiHeart },
  { label: "Reports", path: "/orphanage/reports", icon: FiShield },
  { label: "Profile", path: "/orphanage/profile", icon: FiUser }
]
```

### ⚠️ REQUIRED NAVIGATION UPDATES:

**Admin Navigation - Add:**
```javascript
{ label: "Staff Management", path: "/admin/staff", icon: FiBriefcase }
```
*Placement: After "Orphanages", before "Alerts"*

**Orphanage Navigation - Add:**
```javascript
{ label: "Staff Management", path: "/orphanage/staff", icon: FiBriefcase }
```
*Placement: After "Children", before "Register Child"*

---

## 🎯 MODAL PATTERNS ANALYSIS

### Current Modal Usage (from Modal.jsx)

```jsx
<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>
    {/* Form fields */}
  </ModalBody>
  <ModalFooter>
    <Button onClick={handleSubmit}>Submit</Button>
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
  </ModalFooter>
</Modal>
```

### Expected Staff Modals:

**1. Add Staff Modal**
```
Title: "Add New Staff Member"
Fields:
  - User Selection (dropdown or search)
  - Or: Create New User (toggle)
    - Full Name *
    - Email *
    - Phone *
  - Staff Role * (dropdown from OrphanageStaffRole enum)
  - Designation
  - Employee ID
  - Joining Date *
  - Notes (textarea)
Buttons: "Add Staff Member" | "Cancel"
```

**2. Edit Staff Modal**
```
Title: "Edit Staff Member - [Name]"
Fields: Same as Add, but pre-filled
Disabled: User selection (cannot change user)
Buttons: "Save Changes" | "Cancel"
```

**3. Deactivate Confirmation Modal**
```
Title: "Deactivate Staff Member?"
Body: "Are you sure you want to deactivate [Name]? 
       They will no longer be available for assignments."
Checkbox: "Set end date to today"
Buttons: "Deactivate" (danger) | "Cancel"
```

**4. Staff Selector Modal (for Visit Assignment)**
```
Title: "Select Staff Member"
Features:
  - Search bar
  - Role filter
  - List of active staff with:
    - Avatar/Initial
    - Name
    - Role badge
    - Current assignments count
  - Click to select
Buttons: "Confirm" | "Cancel"
```

---

## 🖼️ DISPLAY PATTERNS

### Staff Card Pattern (for Grid View)

```jsx
<div className="staff-card">
  {/* Avatar */}
  <div className="staff-avatar">
    {initials}
  </div>
  
  {/* Info */}
  <div className="staff-info">
    <h3 className="staff-name">{name}</h3>
    <span className="staff-role-badge">{role}</span>
    <p className="staff-designation">{designation}</p>
  </div>
  
  {/* Meta */}
  <div className="staff-meta">
    <span className="staff-employee-id">{employeeId}</span>
    <span className="staff-status-badge">{isActive ? "Active" : "Inactive"}</span>
  </div>
  
  {/* Actions */}
  <div className="staff-actions">
    <Button icon={FiEye} size="sm" onClick={onView} />
    <Button icon={FiEdit} size="sm" onClick={onEdit} />
  </div>
</div>
```

### Staff Profile View Pattern

```jsx
<ProfileLayout>
  {/* Header */}
  <ProfileHeader
    avatar={user.avatar}
    name={user.name}
    subtitle={`${designation} • ${role}`}
    badge={isActive ? "Active" : "Inactive"}
  />
  
  {/* Main Content */}
  <Section title="Personal Information">
    <Field label="Full Name" value={user.name} icon={FiUser} />
    <Field label="Email" value={user.email} icon={FiMail} />
    <Field label="Phone" value={user.phone} icon={FiPhone} />
  </Section>
  
  <Section title="Employment Details">
    <Field label="Employee ID" value={employeeId} icon={FiFileText} />
    <Field label="Role" value={role} icon={FiBriefcase} />
    <Field label="Designation" value={designation} icon={FiBriefcase} />
    <Field label="Joining Date" value={formatDate(joiningDate)} icon={FiCalendar} />
    {endDate && <Field label="End Date" value={formatDate(endDate)} icon={FiCalendar} />}
  </Section>
  
  <Section title="Orphanage">
    <Field label="Orphanage Name" value={orphanage.name} icon={FiHome} />
    <Field label="Location" value={orphanage.city} icon={FiMapPin} />
  </Section>
  
  {notes && (
    <Section title="Notes">
      <p>{notes}</p>
    </Section>
  )}
</ProfileLayout>
```

---

## 🔔 NOTIFICATION & FEEDBACK PATTERNS


### Toast Notification Patterns (from Toast.jsx)

**Success Messages:**
```javascript
showToast({
  type: "success",
  message: "Staff member added successfully",
  duration: 3000
});

showToast({
  type: "success",
  message: "Staff details updated",
  duration: 3000
});

showToast({
  type: "success",
  message: "Staff member deactivated",
  duration: 3000
});
```

**Error Messages:**
```javascript
showToast({
  type: "error",
  message: "Failed to add staff member",
  duration: 5000
});

showToast({
  type: "error",
  message: "User already assigned to this orphanage",
  duration: 5000
});

showToast({
  type: "error",
  message: "Cannot deactivate: Staff has pending assignments",
  duration: 5000
});
```

**Warning Messages:**
```javascript
showToast({
  type: "warning",
  message: "Some fields are incomplete",
  duration: 4000
});
```

### Loading States

```jsx
{loading ? (
  <Loader />
) : error ? (
  <ErrorState message={error} />
) : staff.length === 0 ? (
  <EmptyState 
    icon={FiUsers}
    title="No Staff Members"
    message="Add your first staff member to get started"
    action={<Button onClick={openAddModal}>Add Staff Member</Button>}
  />
) : (
  <StaffList data={staff} />
)}
```

---

## 📊 ANALYTICS & DASHBOARD INTEGRATION

### Expected Dashboard Stats (OrphanageDashboard.jsx)

**Current Stats:**
```javascript
{ label: "Registered Children", value: "1,248", trend: "+8.2%", icon: FiUsers, tone: "blue" }
{ label: "Safe Zones Online", value: "42", trend: "+3", icon: FiShield, tone: "green" }
{ label: "Active Orphanages", value: "18", trend: "+2", icon: FiHome, tone: "amber" }
{ label: "Critical Alerts", value: "7", trend: "-4", icon: FiAlertTriangle, tone: "red" }
```

**Add Staff Stats:**
```javascript
{ label: "Total Staff", value: "46", trend: "+2", icon: FiBriefcase, tone: "indigo" }
{ label: "Active Staff", value: "43", trend: "+1", icon: FiUsers, tone: "green" }
```

### Staff Distribution Chart (for Dashboard)

```javascript
const staffDistribution = {
  labels: ["Caretakers", "Teachers", "Medical", "Security", "Other"],
  datasets: [{
    data: [20, 8, 5, 6, 7],
    backgroundColor: [
      "#1c74d8", "#0f9f6e", "#f59e0b", "#dc2626", "#8b5cf6"
    ]
  }]
};
```

---

## 🔐 PERMISSION & ROLE-BASED ACCESS

### Expected Permission Rules

**ADMIN Role:**
- ✅ View all staff across all orphanages
- ✅ Add staff to any orphanage
- ✅ Edit any staff member
- ✅ Deactivate/reactivate any staff
- ✅ Access /admin/staff routes
- ✅ View staff statistics globally

**ORPHANAGE Role:**
- ✅ View staff in their orphanage only
- ✅ Add staff to their orphanage
- ✅ Edit staff in their orphanage
- ✅ Deactivate/reactivate their staff
- ✅ Access /orphanage/staff routes
- ✅ Assign staff to visit requests
- ❌ Cannot view other orphanages' staff

**PARENT Role:**
- ❌ No staff management access
- ✅ Can see assigned staff name in visit details

**SOCIAL_WORKER Role:**
- ✅ View staff (read-only)
- ❌ Cannot add/edit/delete staff

### Implementation Pattern (from existing code)

```jsx
// In ProtectedRoute
<Route element={<ProtectedRoute allowedRoles={["ADMIN", "ORPHANAGE"]} />}>
  <Route path="/staff" element={<StaffManagement />} />
</Route>

// In component
const { user } = useAuth();
const isAdmin = user?.role === "ADMIN";
const canEdit = isAdmin || user?.role === "ORPHANAGE";

{canEdit && (
  <Button onClick={handleEdit}>Edit Staff</Button>
)}
```

---

## 🔍 SEARCH & AUTOCOMPLETE PATTERNS


### User Search/Autocomplete (for Staff Assignment)

**Expected Behavior:**
```javascript
// Debounced search for existing users
const searchUsers = async (query) => {
  if (query.length < 2) return [];
  
  const results = await apiClient.get('/users/search', {
    q: query,
    role: 'STAFF', // Filter to potential staff users
    limit: 10
  });
  
  return results.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
    user
  }));
};

// Autocomplete component
<Autocomplete
  placeholder="Search existing user..."
  onSearch={searchUsers}
  onSelect={(option) => setSelectedUser(option.user)}
  renderOption={(option) => (
    <div className="flex items-center gap-3">
      <Avatar name={option.user.name} />
      <div>
        <p className="font-medium">{option.user.name}</p>
        <p className="text-xs text-gray-500">{option.user.email}</p>
      </div>
    </div>
  )}
/>
```

### Staff Search in Visit Assignment

```javascript
// Search active staff for assignment
const searchStaff = async (query) => {
  const results = await staffService.getAll({
    search: query,
    isActive: true,
    orphanageId: user.orphanageId,
    limit: 10
  });
  
  return results.staff.map(staff => ({
    value: staff.id,
    label: `${staff.user.name} (${staff.role})`,
    staff
  }));
};
```

---

## 🎨 BADGE & STATUS INDICATORS

### Role Badges

```jsx
const roleBadgeStyles = {
  ADMINISTRATOR: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  CARETAKER: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  TEACHER: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  MEDICAL_STAFF: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  SECURITY_GUARD: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
  COUNSELOR: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
  SOCIAL_WORKER: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
  VOLUNTEER: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  ACCOUNTANT: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300",
  COOK: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
  OTHER: "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300"
};

<span className={`badge ${roleBadgeStyles[role]}`}>
  {formatRole(role)}
</span>
```

### Status Badges

```jsx
<span className={`badge ${
  isActive 
    ? "badge-success" 
    : "badge-gray"
}`}>
  {isActive ? "Active" : "Inactive"}
</span>
```

### Icon Mapping

```javascript
const roleIcons = {
  ADMINISTRATOR: FiUserCheck,
  CARETAKER: FiUsers,
  TEACHER: FiBook,
  MEDICAL_STAFF: FiHeart,
  SECURITY_GUARD: FiShield,
  COUNSELOR: FiMessageCircle,
  SOCIAL_WORKER: FiBriefcase,
  VOLUNTEER: FiStar,
  ACCOUNTANT: FiDollarSign,
  COOK: FiCoffee,
  OTHER: FiBriefcase
};
```

---

## 📄 PAGINATION & INFINITE SCROLL

### Current Pagination Pattern (from Pagination.jsx)

```jsx
<Pagination
  currentPage={pagination.page}
  totalPages={pagination.totalPages}
  onPageChange={(page) => setFilters({ ...filters, page })}
  totalItems={pagination.total}
  itemsPerPage={pagination.limit}
/>
```

### Expected Staff Pagination

```javascript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

// Load staff with pagination
const loadStaff = async () => {
  const { staff, pagination: paginationData } = await staffService.getAll({
    ...filters,
    page: pagination.page,
    limit: pagination.limit
  });
  
  setStaff(staff);
  setPagination(paginationData);
};

// Page size options
const pageSizeOptions = [10, 25, 50, 100];
```

---

## 🔗 INTEGRATION POINTS

### 1. Visit Request Management Integration

**Current State:**
```javascript
assignedStaff: "Meera Nair" // Free text field
```

**Required Changes:**

```javascript
// Replace with:
assignedStaffId: "uuid"        // FK to OrphanageStaff
assignedStaff: {               // Populated staff object
  id: "uuid",
  user: {
    name: "Meera Nair",
    phone: "+91 98765 43210"
  },
  role: "CARETAKER"
}

// In visit approval modal:
<StaffSelector
  orphanageId={user.orphanageId}
  onSelect={(staff) => setApproveForm({ 
    ...approveForm, 
    assignedStaffId: staff.id 
  })}
  value={approveForm.assignedStaffId}
/>
```

### 2. Orphanage Profile Integration

**Update orphanages data structure:**
```javascript
// OLD: Only counts
staff: {
  totalStaff: 46,
  caretakers: 20,
  // ...
}

// NEW: Add link to staff records
staff: {
  totalStaff: 46,        // Keep for quick display
  caretakers: 20,
  // ... other counts
  _staffRecords: []      // Full staff list (loaded on demand)
}

// Or fetch dynamically:
const staffCount = await staffService.getCount(orphanageId);
const staffList = await staffService.getByOrphanage(orphanageId);
```

### 3. User Account Integration

**Staff creation should:**
1. Check if user exists (by email/phone)
2. If exists: Link to OrphanageStaff
3. If not exists: Create User first, then link

```javascript
const createStaff = async (formData) => {
  // Option 1: Link existing user
  if (formData.existingUserId) {
    return await staffService.create({
      userId: formData.existingUserId,
      orphanageId: user.orphanageId,
      role: formData.role,
      // ... other fields
    });
  }
  
  // Option 2: Create new user + staff
  return await staffService.createWithUser({
    user: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: "GUEST" // Or appropriate role
    },
    staff: {
      orphanageId: user.orphanageId,
      role: formData.role,
      designation: formData.designation,
      // ... other fields
    }
  });
};
```

### 4. Dashboard Analytics Integration

```javascript
// Add to OrphanageDashboard.jsx
const [staffStats, setStaffStats] = useState({
  total: 0,
  active: 0,
  byRole: {}
});

useEffect(() => {
  const loadStaffStats = async () => {
    const stats = await staffService.getStats(user.orphanageId);
    setStaffStats(stats);
  };
  loadStaffStats();
}, [user.orphanageId]);

// Display in dashboard
<StatCard 
  label="Total Staff" 
  value={staffStats.total} 
  icon={FiBriefcase}
  tone="indigo"
/>
```

---

## 🔧 UTILITY FUNCTIONS NEEDED

### Date Formatting

```javascript
export const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateTenure = (joiningDate, endDate = null) => {
  const start = new Date(joiningDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  if (years === 0) return `${months} months`;
  if (months === 0) return `${years} years`;
  return `${years} years ${months} months`;
};
```

### Role Formatting

```javascript
export const formatRole = (role) => {
  const roleLabels = {
    ADMINISTRATOR: "Administrator",
    CARETAKER: "Caretaker",
    TEACHER: "Teacher",
    MEDICAL_STAFF: "Medical Staff",
    SECURITY_GUARD: "Security Guard",
    COUNSELOR: "Counselor",
    SOCIAL_WORKER: "Social Worker",
    VOLUNTEER: "Volunteer",
    ACCOUNTANT: "Accountant",
    COOK: "Cook",
    OTHER: "Other"
  };
  return roleLabels[role] || role;
};

export const getRoleOptions = () => {
  return Object.keys(OrphanageStaffRole).map(role => ({
    value: role,
    label: formatRole(role)
  }));
};
```

### Staff Avatar/Initials

```javascript
export const getStaffInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStaffAvatarColor = (role) => {
  const colors = {
    ADMINISTRATOR: "bg-purple-600",
    CARETAKER: "bg-blue-600",
    TEACHER: "bg-green-600",
    MEDICAL_STAFF: "bg-red-600",
    SECURITY_GUARD: "bg-gray-600",
    COUNSELOR: "bg-indigo-600",
    SOCIAL_WORKER: "bg-teal-600",
    VOLUNTEER: "bg-amber-600",
    ACCOUNTANT: "bg-cyan-600",
    COOK: "bg-orange-600",
    OTHER: "bg-slate-600"
  };
  return colors[role] || "bg-civic-600";
};
```

---

## 📱 RESPONSIVE DESIGN PATTERNS


### Grid Layouts (from existing patterns)

**Desktop (xl):**
```jsx
// 4 columns for cards
className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"

// 3 columns for forms
className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"

// 2 columns main + sidebar
className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]"
```

**Tablet (md/lg):**
```jsx
// 2 columns
className="grid gap-4 md:grid-cols-2"
```

**Mobile:**
```jsx
// Single column (default)
className="grid gap-4"
```

### Table Responsive Pattern

```jsx
// Desktop: Full table
<div className="hidden md:block">
  <DataTable columns={columns} rows={rows} />
</div>

// Mobile: Card list
<div className="md:hidden space-y-3">
  {rows.map(staff => (
    <StaffCard key={staff.id} staff={staff} />
  ))}
</div>
```

---

## 🚨 ERROR HANDLING PATTERNS

### Form Validation Errors

```jsx
// Field-level errors
<FormInput
  label="Employee ID"
  error={errors.employeeId?.message}
  {...register("employeeId", {
    pattern: {
      value: /^[A-Z0-9-]+$/,
      message: "Invalid employee ID format"
    }
  })}
/>

// Form-level errors
{submitError && (
  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
    <p className="text-sm text-red-700 dark:text-red-300">
      {submitError}
    </p>
  </div>
)}
```

### API Error Handling

```javascript
const handleSubmit = async (data) => {
  try {
    setLoading(true);
    setError(null);
    
    await staffService.create(data);
    
    showToast({
      type: "success",
      message: "Staff member added successfully"
    });
    
    onClose();
    refreshList();
    
  } catch (err) {
    console.error("Failed to add staff:", err);
    
    // Handle specific error codes
    if (err.status === 409) {
      setError("User is already assigned to this orphanage");
    } else if (err.status === 404) {
      setError("User account not found");
    } else {
      setError(err.message || "Failed to add staff member");
    }
    
    showToast({
      type: "error",
      message: err.message || "Failed to add staff member"
    });
    
  } finally {
    setLoading(false);
  }
};
```

### Network Error Handling

```jsx
{error ? (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/20 dark:bg-red-900/10">
    <div className="flex items-start gap-3">
      <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      <div>
        <h3 className="font-bold text-red-900 dark:text-red-200">
          Error Loading Staff
        </h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
        <Button 
          className="mt-3"
          size="sm"
          onClick={retryLoad}
        >
          Retry
        </Button>
      </div>
    </div>
  </div>
) : (
  // Content
)}
```

---

## 🎭 ANIMATION PATTERNS

### Page Transitions (from Framer Motion)

```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25 }}
>
  {/* Content */}
</motion.div>

// Staggered list animation
{staff.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay: i * 0.05 }}
  >
    <StaffCard staff={item} />
  </motion.div>
))}
```

### Modal Animations

```jsx
<AnimatePresence>
  {modalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Modal>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Modal content */}
        </motion.div>
      </Modal>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 📋 COMPLETE FEATURE CHECKLIST

### ✅ Must-Have Features (MVP)


#### Staff Management Pages:
- [ ] Staff List page (`/orphanage/staff`)
- [ ] Staff Profile page (`/orphanage/staff/:id`)
- [ ] Admin Staff List page (`/admin/staff`)
- [ ] Admin Staff Profile page (`/admin/staff/:id`)

#### CRUD Operations:
- [ ] Add staff member (with user selection/creation)
- [ ] View staff profile
- [ ] Edit staff details
- [ ] Deactivate staff (soft delete)
- [ ] Reactivate staff

#### Search & Filters:
- [ ] Search by name/employee ID/email
- [ ] Filter by role
- [ ] Filter by active/inactive status
- [ ] Filter by orphanage (admin view)
- [ ] Sort by name, joining date, role

#### UI Components:
- [ ] Staff table with pagination
- [ ] Staff card (grid view)
- [ ] Add/Edit staff modal
- [ ] Staff selector (for assignments)
- [ ] Role badges
- [ ] Status badges

#### Integration:
- [ ] Visit request staff assignment (replace free text)
- [ ] Dashboard staff stats
- [ ] Orphanage profile staff count
- [ ] User account linking

#### Validation:
- [ ] Required field validation
- [ ] Email/phone format validation
- [ ] Date validation (joining < end date)
- [ ] Duplicate user-orphanage check
- [ ] Employee ID format validation

### 🎯 Nice-to-Have Features (Phase 2)

- [ ] Staff attendance tracking
- [ ] Staff workload dashboard
- [ ] Staff performance metrics
- [ ] Staff document upload (certifications, ID)
- [ ] Staff availability calendar
- [ ] Staff shift scheduling
- [ ] Export staff list (CSV/PDF)
- [ ] Bulk staff import
- [ ] Staff activity log
- [ ] Email notifications on staff changes

### 🚀 Future Enhancements (Phase 3)

- [ ] Staff training records
- [ ] Staff leave management
- [ ] Staff salary management
- [ ] Staff performance reviews
- [ ] Staff messaging system
- [ ] Staff mobile app
- [ ] Biometric attendance integration
- [ ] Staff certification expiry alerts

---

## 🎯 BACKEND API EXPECTATIONS SUMMARY

Based on frontend analysis, the backend must provide:

### Core Endpoints:

```
GET    /api/v1/staff
POST   /api/v1/staff
GET    /api/v1/staff/:id
PATCH  /api/v1/staff/:id
DELETE /api/v1/staff/:id (soft delete)

GET    /api/v1/orphanages/:id/staff
GET    /api/v1/staff/stats
GET    /api/v1/staff/available (for assignments)

PATCH  /api/v1/staff/:id/deactivate
PATCH  /api/v1/staff/:id/reactivate

POST   /api/v1/staff/with-user (create user + staff)
```

### Query Parameters:

```javascript
{
  search: string,           // Search name, email, employee ID
  role: OrphanageStaffRole, // Filter by role
  isActive: boolean,        // Filter by status
  orphanageId: string,      // Filter by orphanage (admin)
  sortBy: string,           // "name" | "joiningDate" | "role"
  sortOrder: "asc" | "desc",
  page: number,
  limit: number
}
```

### Response Format:

```typescript
// List response
{
  success: true,
  statusCode: 200,
  data: {
    staff: Array<{
      id: string,
      orphanageId: string,
      userId: string,
      role: OrphanageStaffRole,
      designation: string | null,
      employeeId: string | null,
      joiningDate: Date | null,
      endDate: Date | null,
      isActive: boolean,
      notes: string | null,
      user: {
        id: string,
        name: string,
        email: string,
        phone: string
      },
      orphanage: {
        id: string,
        name: string,
        city: string
      }
    }>,
    pagination: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    },
    summary?: {
      total: number,
      active: number,
      inactive: number,
      byRole: Record<OrphanageStaffRole, number>
    }
  }
}

// Single staff response
{
  success: true,
  statusCode: 200,
  data: {
    // Same as staff object above
  }
}
```

### Validation Rules:

```typescript
{
  userId: required, UUID, must exist in users table,
  orphanageId: required, UUID, must exist in orphanages table,
  role: required, must be valid OrphanageStaffRole enum value,
  designation: optional, max 200 chars,
  employeeId: optional, alphanumeric + dash only, unique per orphanage,
  joiningDate: optional, must be valid date, cannot be future,
  endDate: optional, must be valid date, must be after joiningDate,
  notes: optional, max 1000 chars,
  
  // Business rules:
  - One user can only be assigned once per orphanage (enforced by unique constraint)
  - Cannot delete if staff has active assignments
  - Admin can manage all staff
  - Orphanage role can only manage their own staff
}
```

---

## 📊 DATA FLOW DIAGRAMS

### Add Staff Flow:


```
User clicks "Add Staff"
    ↓
Modal opens
    ↓
User selects existing user OR creates new
    ↓
User fills form (role, designation, etc.)
    ↓
User clicks "Submit"
    ↓
Frontend validates input
    ↓
[If new user] POST /api/v1/staff/with-user
[If existing] POST /api/v1/staff
    ↓
Backend validates:
  - User exists (if existing)
  - User not already assigned to orphanage
  - Role is valid
  - Dates are valid
    ↓
[If new user] Create User record
    ↓
Create OrphanageStaff record
    ↓
Return created staff with populated relations
    ↓
Frontend updates staff list
    ↓
Show success notification
    ↓
Close modal
```

### Visit Request Assignment Flow:

```
Orphanage approves visit request
    ↓
Opens approval modal
    ↓
Clicks "Select Staff" dropdown
    ↓
GET /api/v1/staff/available?orphanageId=X&isActive=true
    ↓
Backend returns active staff list
    ↓
Frontend displays staff options
    ↓
User selects staff member
    ↓
Completes other approval fields
    ↓
Submits approval
    ↓
PATCH /api/v1/visit-requests/:id/approve
  Body: { assignedStaffId: "uuid", ... }
    ↓
Backend:
  - Validates staff belongs to orphanage
  - Validates staff is active
  - Updates visit request
    ↓
Frontend refreshes visit list
    ↓
Visit shows assigned staff name
```

### Staff Profile View Flow:

```
User clicks staff row/card
    ↓
Navigate to /orphanage/staff/:id
    ↓
GET /api/v1/staff/:id
    ↓
Backend:
  - Fetches staff record
  - Populates user relation
  - Populates orphanage relation
  - Checks permissions (admin or same orphanage)
    ↓
Frontend displays profile:
  - Personal info (from User)
  - Employment details
  - Orphanage info
  - Status badge
  - Action buttons (edit, deactivate)
```

---

## 🔐 SECURITY CONSIDERATIONS

### Frontend Validation:
- ✅ Role-based UI hiding (canEdit checks)
- ✅ Required field validation
- ✅ Format validation (email, phone, dates)
- ✅ Client-side duplicate prevention
- ❌ NOT sufficient for security (backend must validate)

### Expected Backend Security:
- ✅ JWT authentication on all endpoints
- ✅ Role-based authorization (ADMIN, ORPHANAGE)
- ✅ Orphanage-scoped data filtering
- ✅ Prevent cross-orphanage staff access
- ✅ Validate all foreign keys exist
- ✅ Sanitize input to prevent injection
- ✅ Rate limiting on create/update endpoints
- ✅ Audit logging for staff changes

### Permission Matrix:

```
Operation             | ADMIN | ORPHANAGE | PARENT | SOCIAL_WORKER
---------------------|-------|-----------|--------|---------------
View all staff       |  ✅   |    ❌     |   ❌   |      ✅
View own staff       |  ✅   |    ✅     |   ❌   |      ✅
Add staff            |  ✅   |    ✅     |   ❌   |      ❌
Edit staff           |  ✅   |    ✅*    |   ❌   |      ❌
Deactivate staff     |  ✅   |    ✅*    |   ❌   |      ❌
View other orphanage |  ✅   |    ❌     |   ❌   |      ✅
Assign to visits     |  ✅   |    ✅     |   ❌   |      ❌

* Only for their own orphanage
```

---

## 📝 ADDITIONAL NOTES

### Consistency with Existing Modules:

The staff module should follow the same patterns as Children and Parents modules:

1. **Service Layer:** Create `staffService.js` in `src/services/`
2. **Page Structure:** List page + Profile page pattern
3. **Form Handling:** react-hook-form with validation
4. **Data Display:** DataTable for lists, Card for details
5. **API Response:** TransformInterceptor envelope unwrapping
6. **Error Handling:** Toast notifications + inline errors
7. **Loading States:** Loader component
8. **Empty States:** Custom empty state messages
9. **Permissions:** Role-based rendering
10. **Routing:** Protected routes with role checks

### Design System Alignment:

- Use existing components (no reinventing)
- Follow existing color schemes
- Match existing spacing/padding
- Use same animation timing
- Maintain dark mode support
- Use Feather Icons (react-icons/fi)
- Follow existing naming conventions

### Performance Considerations:

- Pagination for large staff lists
- Debounced search (300ms)
- Lazy load staff profiles
- Cache staff list in memory
- Optimistic UI updates
- Proper loading states
- Error boundaries

---

## ✅ ANALYSIS COMPLETE

This document provides a **complete frontend analysis** for the Orphanage Staff module. 

### What's Been Analyzed:
✅ All 25 pages inspected  
✅ All routes documented  
✅ All components catalogued  
✅ All forms analyzed  
✅ All modals specified  
✅ All tables/displays mapped  
✅ All filters defined  
✅ All validations documented  
✅ All state management patterns identified  
✅ All user interactions flows charted  
✅ All API expectations defined  
✅ All UI/UX patterns documented  
✅ All integration points identified  
✅ Database schema verified  

### Next Steps:
**PHASE 2:** Backend Development (NestJS/Prisma)  
**PHASE 3:** Frontend Development (React)  
**PHASE 4:** Integration & Testing  
**PHASE 5:** Production Deployment  

---

**Document Status:** 🟢 COMPLETE  
**Ready for Backend Development:** ✅ YES  
**Code Generation Started:** ❌ NO (As per instructions)

