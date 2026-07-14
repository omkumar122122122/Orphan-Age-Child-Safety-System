# Parents Module - Frontend Analysis Report

**Date**: January 14, 2026  
**Module**: Parent Management & Verification System  
**Scope**: Frontend-Only Analysis (Source of Truth)

---

## Executive Summary

The Parents module handles the complete lifecycle of parent/guardian management from registration through post-adoption compliance. The system includes AI-powered identity verification, KYC management, adoption follow-up tracking, and visit request workflows.

### Key Pages Identified
1. **ParentDashboard** - Parent portal overview
2. **ParentKYC** - Post-adoption KYC & health reports
3. **ParentProfile** - Parent/guardian detailed information
4. **ParentVerificationCenter** - Admin verification & approval workflow
5. **VisitRequest** - Parent visit scheduling (referenced)
6. **ChildWelfareFollowUpSession** - Post-adoption tracking (referenced)

---

## Page 1: Parent Dashboard
**Route**: `/parent` (index)  
**Component**: `ParentDashboard.jsx`  
**User Role**: Parent (Adoptive Parent)  
**Purpose**: Personal portal for adoptive parents to track their adoption journey and linked child


### UI Components

#### 1. Welcome Banner (Card)
- **Elements**:
  - User avatar (2-letter initials)
  - Welcome message with first name
  - Subtitle: "Track your adoption process and stay updated"
  - Trust badge strip showing:
    - KYC status
    - Face Match percentage
    - Trust Score (x/100)
    - Risk Level
    - AI-verified profile badge

#### 2. Quick Links (3 Cards)
- Visit Request (calendar icon) → `/parent/visit-request`
- My Profile (user icon) → `/parent/profile`
- Notifications (bell icon) → `/parent/notifications`

#### 3. Linked Child Card
- **Data Displayed**:
  - Child name, age, orphanage
  - Child avatar (initials)
  - Health status badge
  - Attendance percentage (last 30 days)
  - Education level
  - Risk level
  - View button → child profile

#### 4. Adoption Journey Timeline (5 Steps)
- KYC Submitted ✓
- Identity Verified ✓
- Visit Request (current step)
- Visit Approved
- Adoption Proceeding
- **Visual**: Progress indicators with checkmarks/clock icons


#### 5. Notifications Panel
- Recent notifications/alerts
- Display from global notifications array

### Required Backend APIs

#### 1. GET `/api/parents/dashboard`
**Purpose**: Fetch parent dashboard data  
**Authentication**: JWT (Parent role)  
**Request Headers**:
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response Body**:
```json
{
  "parent": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "avatar": "string" // Initials or image URL
  },
  "verification": {
    "kycStatus": "Verified" | "Pending" | "Overdue",
    "faceMatchPercentage": 99,
    "trustScore": 95,
    "riskLevel": "Low" | "Medium" | "High",
    "isAiVerified": true
  },
  "linkedChild": {
    "id": "uuid",
    "childCode": "CHD-YYYY-XXXXXX",
    "firstName": "string",
    "lastName": "string",
    "age": 10,
    "orphanageName": "string",
    "healthStatus": "Healthy" | "Under Observation" | "Critical",
    "attendancePercentage": 95,
    "educationLevel": "Grade 5",
    "riskLevel": "Low"
  },
  "adoptionJourney": {
    "currentStep": 3,
    "totalSteps": 5,
    "steps": [
      { "name": "KYC Submitted", "completed": true },
      { "name": "Identity Verified", "completed": true },
      { "name": "Visit Request", "completed": false, "isCurrent": true },
      { "name": "Visit Approved", "completed": false },
      { "name": "Adoption Proceeding", "completed": false }
    ]
  },
  "notifications": [ /* array of notifications */ ]
}
```

**Validation Rules**:
- JWT must be valid and not expired
- User role must be "parent"
- Parent must have an active adoption case

**Required Prisma Models**:
- AdoptiveParent
- User (relation)
- Child (linked child)
- AdoptionCase
- Notification

**Required Relations**:
- AdoptiveParent → User (one-to-one)
- AdoptiveParent → AdoptionCases (one-to-many)
- AdoptionCase → Child (many-to-one)
- User → Notifications (one-to-many)


---

## Page 2: Parent KYC (Post-Adoption Compliance)
**Route**: `/parent/kyc` (NOT IN ROUTES - Missing)  
**Component**: `ParentKYC.jsx`  
**User Role**: Parent (Post-Adoption)  
**Purpose**: Manage mandatory KYC renewals (every 6 months) and annual child health reports until child turns 16

### UI Components

#### 1. Page Header Card
- **Title**: "KYC Verification"
- **Subtitle**: Policy details (KYC every 6 months, health report annually, mandatory until 16)
- **Action Buttons**:
  - Submit KYC (opens modal)
  - Upload Health Report (opens modal)
  - Download Acknowledgement (opens modal)
- **Policy Strip**:
  - KYC Frequency: Every 6 months
  - Health Report: Once per year
  - Mandatory Until: Child turns 16
  - Years Remaining: X years

#### 2. Summary Cards (5 Cards)
- **Active Adoption**: Yes/No + Child name
- **KYC Status**: Verified/Pending/Overdue + Next due date
- **Next KYC Due**: X days + Urgency label
- **Health Report**: Status + Due date
- **Compliance**: Compliant/Partially Compliant/Non-Compliant

#### 3. KYC Overview Card (Collapsible Section)
- **Parent Information**:
  - Parent avatar
  - Parent Name, Parent ID
  - Child Name, Child ID, Age
  - Adoption Date
  - Last KYC Date, Next KYC Due
  - Contact Number, Email
  - Health Report Status
  - Compliance Status
- **KYC Renewal Cycle Progress Bar**:
  - Visual progress (0-100%)
  - Days remaining/overdue
  - Urgency indicator (color-coded)
  - Next renewal date
- **Action Buttons**:
  - View Documents
  - Update KYC


#### 4. Reminders & Alerts Panel (Collapsible)
- Urgent reminders for overdue KYC
- Upcoming KYC due dates
- Health report due dates
- Color-coded urgency indicators:
  - Red: Overdue or < 14 days
  - Amber: 15-45 days
  - Green: > 45 days

#### 5. KYC Verification Form Section (Collapsible)
- **Display Only** (no editable form shown in UI)
- Shows next due date
- Urgency indicator
- "Submit KYC" button → opens modal

#### 6. Annual Health Report Section (Collapsible)
- Report status
- Next due date
- Upload button → opens modal

#### 7. Verification History Table
- **Columns**:
  - Date
  - Type (KYC / Health Report)
  - Status (Verified / Submitted / Pending)
  - Officer Name
  - Actions (View Docs button)
- Historical records of past submissions

#### 8. Modals

##### Modal 1: Submit KYC
- **Form Fields**:
  - Confirmation checkbox
  - Declaration text
- **Actions**:
  - Confirm button
  - Cancel button
- **Behavior**: Updates KYC status to "Verified", sets next due date to +6 months

##### Modal 2: Upload Health Report
- **Form Fields**:
  - File upload input
  - Comments textarea
- **Actions**:
  - Upload button
  - Cancel button
- **Behavior**: Updates report status to "Submitted"

##### Modal 3: View Documents
- **Display**:
  - List of uploaded documents
  - Document type badges
  - Preview/Download buttons per document

##### Modal 4: Download Acknowledgement
- **Display**:
  - Parent details
  - Child details
  - KYC status
  - Health report status
  - Compliance status
  - Download button (generates PDF)


### Required Backend APIs

#### 1. GET `/api/parents/kyc`
**Purpose**: Fetch parent KYC compliance data  
**Authentication**: JWT (Parent role)  
**Response Body**:
```json
{
  "parentId": "uuid",
  "parentAvatar": "MN",
  "parentName": "Meera Nair",
  "childId": "uuid",
  "childName": "Aarav Kumar",
  "childAge": 8,
  "adoptionDate": "2024-03-15",
  "lastKycDate": "2025-09-20",
  "nextKycDue": "2026-03-20",
  "kycStatus": "Verified" | "Pending" | "Overdue",
  "contactNumber": "+91 9876543210",
  "email": "parent@example.com",
  "healthReportStatus": "Submitted" | "Pending" | "Overdue",
  "nextHealthReportDue": "2026-12-25",
  "yearsUntil16": 8,
  "complianceStatus": "Compliant" | "Partially Compliant" | "Non-Compliant",
  "verificationHistory": [
    {
      "id": "uuid",
      "date": "2025-09-20",
      "type": "KYC" | "Health Report",
      "status": "Verified",
      "officerName": "Officer Name",
      "documents": ["Aadhaar", "Address Proof"]
    }
  ],
  "documents": [
    {
      "id": "uuid",
      "type": "Aadhaar",
      "fileName": "aadhaar.pdf",
      "uploadedAt": "2025-09-20",
      "status": "Verified"
    }
  ]
}
```

**Validation Rules**:
- JWT must be valid
- User must be parent role
- Must have completed adoption case

#### 2. POST `/api/parents/kyc/submit`
**Purpose**: Submit KYC renewal  
**Request Body**:
```json
{
  "declaration": true,
  "documents": ["uuid", "uuid"] // Document IDs
}
```

**Response**:
```json
{
  "success": true,
  "message": "KYC submitted successfully",
  "nextDueDate": "2026-09-20",
  "verificationId": "uuid"
}
```

**Validation Rules**:
- Declaration must be true
- All required documents must be uploaded
- Previous KYC must not be in pending state


#### 3. POST `/api/parents/health-reports/upload`
**Purpose**: Upload annual child health report  
**Request**: Multipart form data
```
report_file: File
comments: string (optional)
childId: uuid
```

**Response**:
```json
{
  "success": true,
  "message": "Health report uploaded successfully",
  "reportId": "uuid",
  "nextDueDate": "2027-12-25"
}
```

**Validation Rules**:
- File must be PDF, JPG, or PNG
- Max file size: 5MB
- Child must be linked to parent
- Previous report must not be pending

#### 4. GET `/api/parents/kyc/documents`
**Purpose**: Fetch all parent KYC documents  
**Response**:
```json
{
  "documents": [
    {
      "id": "uuid",
      "type": "Aadhaar" | "PAN" | "Address Proof" | "Income Proof",
      "fileName": "aadhaar.pdf",
      "fileUrl": "url",
      "uploadedAt": "2025-09-20",
      "status": "Verified" | "Pending" | "Rejected",
      "verifiedBy": "Officer Name",
      "verifiedAt": "2025-09-21"
    }
  ]
}
```

#### 5. GET `/api/parents/kyc/acknowledgement`
**Purpose**: Generate KYC acknowledgement PDF  
**Response**: PDF file stream or download URL

**Required Prisma Models**:
- AdoptiveParent
- Child (linked child)
- AdoptionCase
- KYCVerification (new model)
- HealthReport (new model)
- Document (parent documents)

**Required Relations**:
- AdoptiveParent → KYCVerifications (one-to-many)
- AdoptiveParent → HealthReports (one-to-many)
- AdoptiveParent → Documents (one-to-many)
- KYCVerification → Staff (verifiedBy)
- HealthReport → Child (one-to-one per year)


---

## Page 3: Parent Profile (Admin/Orphanage View)
**Route**: `/admin/parent-profiles/:parentId` OR `/orphanage/parent-profiles/:parentId`  
**Component**: `ParentProfile.jsx`  
**User Role**: Admin, Orphanage  
**Purpose**: View detailed parent/guardian information for follow-up tracking

### UI Components

#### 1. Page Header
- Back button
- Parent avatar (initials)
- Title: "Parent / Guardian Follow-up"
- Subtitle: "Linked to [Child Name] ([Child ID])"

#### 2. AI Verification Strip (4 Cards)
- **Home Study**: Status (Approved/Pending/Rejected)
- **Police Check**: Status (Completed/Pending/Failed)
- **Adoption Order**: Order ID
- **Has Other Child**: Yes/No

#### 3. Parent Details Section (Card)
- **Icon**: User Check
- **Fields** (10 fields, 2 columns):
  - Father Name
  - Father Phone
  - Father Aadhaar
  - Father Occupation
  - Mother Name
  - Mother Phone
  - Mother Aadhaar
  - Mother Occupation
  - Email
  - Address (full width)

#### 4. Adoption Assessment Section (Card)
- **Icon**: Shield
- **Fields** (12 fields, 2-3 columns):
  - Adoption Order ID
  - Voter ID
  - Home Study Status
  - Police Verification
  - Has Another Child (Yes/No)
  - Other Child Status
  - Other Child Details (full width)
  - Reason for Adoption (full width)
  - Financial Condition (full width)
  - Follow-up Officer
  - Post-adoption Follow-up (full width)


### Required Backend APIs

#### 1. GET `/api/parents/:parentId/profile`
**Purpose**: Fetch detailed parent profile for admin/orphanage view  
**Authentication**: JWT (Admin or Orphanage role)  
**Response Body**:
```json
{
  "id": "uuid",
  "fatherName": "Rajesh Kumar",
  "fatherPhone": "+91 9876543210",
  "fatherAadhaar": "1234 5678 9012",
  "fatherOccupation": "Software Engineer",
  "motherName": "Priya Kumar",
  "motherPhone": "+91 9876543211",
  "motherAadhaar": "9876 5432 1098",
  "motherOccupation": "Teacher",
  "email": "parent@example.com",
  "address": "123, Main Street, Bangalore",
  "adoptionOrderId": "AO-2024-001",
  "voterId": "VOT123456",
  "homeStudyStatus": "Approved" | "Pending" | "Rejected",
  "policeVerification": "Completed" | "Pending" | "Failed",
  "hasAnotherChild": true,
  "otherChildStatus": "Living with family",
  "otherChildDetails": "Son, Age 12, studying in 7th grade",
  "adoptionReason": "Wanted to provide a loving home",
  "financialCondition": "Stable income, own house",
  "followUpOfficer": "Officer Name",
  "postAdoptionFollowUp": "Monthly visits scheduled",
  "linkedChild": {
    "id": "uuid",
    "name": "Child Name",
    "childCode": "CHD-2024-001"
  }
}
```

**Validation Rules**:
- JWT must be valid
- User must be Admin or Orphanage staff
- If Orphanage role, parent's linked child must belong to their orphanage

**Required Permissions**:
- Admin: Can view any parent profile
- Orphanage: Can only view parents of children in their orphanage

**Required Prisma Models**:
- AdoptiveParent
- User (for authentication)
- Child (linked child)
- Staff (follow-up officer)
- AdoptionCase

**Required Relations**:
- AdoptiveParent → User (one-to-one)
- AdoptiveParent → Child (through AdoptionCase)
- AdoptiveParent → Staff (followUpOfficer)


---

## Page 4: Parent Verification Center (Admin)
**Route**: `/admin/parent-verification`  
**Component**: `ParentVerificationCenter.jsx`  
**User Role**: Admin ONLY  
**Purpose**: AI-powered parent verification, identity validation, document review, and approval workflow

### UI Components

#### 1. Page Header Card
- Title: "Parent Verification & Approval Center"
- Subtitle: "Review, validate and securely approve parent registrations"
- **Statistics Strip** (4 cards):
  - Today's Registrations
  - Pending Verification
  - Approved
  - Rejected

#### 2. Summary Cards (6 Cards)
- **Pending Parents**: Count of pending applications
- **Verified Parents**: Count of verified
- **Rejected Applications**: Count rejected
- **High Risk Profiles**: Count of high-risk applications
- **Open Issues**: Count of parent-raised issues
- **Today's Requests**: Count of today's registrations

#### 3. Search & Filter Panel (Card)
- **Search Input**:
  - Placeholder: "Search by name, ID, email or phone"
  - Debounced search (client-side only - shown with animation)
  - Search icon with "searching" animation

- **Status Filter Chips**:
  - All
  - Pending
  - Verified
  - Rejected
  - Under Review
  - High Risk

- **Sort Dropdown**:
  - Newest (default)
  - Oldest
  - Highest Risk


#### 4. Parent Registration Queue Table
- **Columns** (9 columns):
  1. Profile Photo (avatar with initials)
  2. Parent ID
  3. Name + Email
  4. Registration Date
  5. KYC Status (Complete/Partial/Failed badge)
  6. AI Trust Score (0-100 with progress bar)
  7. Verification Status (Pending/Verified/Rejected/Under Review)
  8. Issue Status (Open/Resolved/Escalated)
  9. Actions (4 buttons):
     - View (eye icon)
     - Approve (check circle)
     - Reject (slash icon)
     - Raise Query (message icon)

- **Empty State**: Shows message when no matching records

#### 5. Parent Detail Modal (Full Screen)
Opens when "View" is clicked. Contains:

##### Section 1: Parent Information
- Large avatar
- Info Grid (11 fields):
  - Parent ID
  - Name
  - Date of Birth
  - Gender
  - Occupation
  - Income
  - Family Members
  - Phone
  - Email
  - Address
  - Emergency Contact

##### Section 2: AI Verification Metrics (13 Cards)
- Face Match percentage
- OCR Match status
- Identity Match strength
- Document Authenticity status
- Duplicate Account check
- Background Check status
- Blacklist Check status
- Phone verification
- Email verification
- Overall Trust Score (highlighted)
- Risk Level
- Recommendation (full width)


##### Section 3: Identity Verification Documents (Grid of Cards)
Each document shows:
- Document type (Aadhaar, PAN, Passport, Income Proof, Marriage Certificate, Address Proof, Selfie)
- "Verified" badge
- Preview button
- Download button

##### Section 4: Cross Verification Checks (5 Items)
- Form Name = Aadhaar Name ✓
- DOB = Government ID ✓
- Address = Address Proof ✓
- Phone = OTP Verified ✓
- Email = Verified ✓

##### Section 5: Parent Raised Issues
- List of issues with:
  - Issue ID
  - Category
  - Priority badge
  - Status badge
  - Date
  - Description
  - Action buttons:
    - Reply
    - Resolve
    - Raise Internal Note
- Empty state if no issues

##### Section 6: Admin Notes
- Textarea for internal remarks
- Save button

##### Modal Footer Actions:
- Approve Parent (primary button)
- Reject Parent (danger button)
- Request Documents (secondary)
- Suspend Account (secondary)
- Generate Verification Report (secondary)


#### 6. Action Modals

##### Approve Parent Modal
- Verification Summary display
- AI Recommendation display
- **Declaration Checkbox**: "I confirm that parent identity, documents, AI checks, and issue records have been reviewed"
- Approve button (disabled until checkbox checked)
- Cancel button

##### Reject Parent Modal
- **Reason Dropdown** (required):
  - Incomplete Documents
  - Identity Mismatch
  - Fraud Detected
  - High Risk
  - Other
- **Comments Textarea** (optional)
- Reject button
- Cancel button

##### Request Documents Modal
- **Document Checklist** (multiple selection):
  - Updated Aadhaar
  - PAN
  - Income Proof
  - Address Proof
  - Selfie
  - Additional Documents
- Send Request button
- Cancel button

#### 7. Right Sidebar Panels (4 Panels)
- **Recent Registrations**: Last 3 parents
- **Recent Approvals**: Recently approved parents
- **High Risk Alerts**: High-risk applications
- **Pending Reviews**: Pending/Under Review applications

#### 8. Toast Notifications
Displays after actions:
- "Parent Approved"
- "Application Rejected"
- "Documents Requested"
- "Issue Resolved"
- "Verification Completed"


### Required Backend APIs

#### 1. GET `/api/admin/parents/verification/queue`
**Purpose**: Fetch parent applications for verification queue  
**Authentication**: JWT (Admin role ONLY)  
**Query Parameters**:
```
search: string (optional)
status: "All" | "Pending" | "Verified" | "Rejected" | "Under Review" | "High Risk"
sort: "Newest" | "Oldest" | "Highest Risk"
page: number (default: 1)
limit: number (default: 20)
```

**Response Body**:
```json
{
  "data": [
    {
      "id": "uuid",
      "parentId": "PAR-2026-0148",
      "name": "Meera Nair",
      "dob": "1988-04-16",
      "gender": "Female",
      "occupation": "Public School Teacher",
      "income": "INR 8.4 LPA",
      "familyMembers": "4 members",
      "phone": "+91 98765 22014",
      "email": "meera.nair@example.com",
      "address": "Sector 21, Dwarka, New Delhi",
      "emergencyContact": "Arun Nair, +91 98765 22015",
      "registeredAt": "2026-07-08T10:30:00Z",
      "kycStatus": "Complete" | "Partial" | "Failed",
      "trustScore": 94,
      "status": "Pending" | "Verified" | "Rejected" | "Under Review",
      "issueStatus": "Open" | "Resolved" | "Escalated",
      "riskLevel": "Low" | "Medium" | "High",
      "photo": "image_url or null",
      "recommendation": "Approve after officer declaration"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "stats": {
    "pending": 50,
    "verified": 80,
    "rejected": 20,
    "highRisk": 10,
    "openIssues": 15,
    "today": 5
  }
}
```

**Validation Rules**:
- User must be Admin role
- Status filter must be valid enum
- Pagination: page >= 1, limit between 1-100


#### 2. GET `/api/admin/parents/:parentId/verification-details`
**Purpose**: Fetch complete parent verification details for modal  
**Response Body**:
```json
{
  "parent": {
    // Same as queue item plus:
    "ai": {
      "faceMatch": "97%",
      "ocrMatch": "Matched" | "Needs Review" | "Mismatch",
      "identityMatch": "Strong" | "Moderate" | "Weak",
      "documentAuthenticity": "Verified" | "Manual Check" | "Failed",
      "duplicateAccount": "No Duplicate" | "Possible Match",
      "backgroundCheck": "Clear" | "Pending" | "Flagged",
      "blacklistCheck": "Clear" | "Flagged",
      "phone": "OTP Verified" | "Pending",
      "email": "Verified" | "Pending"
    },
    "documents": [
      {
        "id": "uuid",
        "type": "Aadhaar" | "PAN" | "Passport" | "Income Proof" | "Marriage Certificate" | "Address Proof" | "Selfie",
        "fileName": "aadhaar.pdf",
        "fileUrl": "url",
        "uploadedAt": "2026-07-08",
        "status": "Verified" | "Pending" | "Rejected"
      }
    ],
    "issues": [
      {
        "id": "uuid",
        "issueId": "ISS-8901",
        "category": "Document Clarification" | "Identity Mismatch" | "Duplicate Alert" | "Fraud Review",
        "priority": "Low" | "Medium" | "High" | "Critical",
        "status": "Open" | "Under Review" | "Resolved" | "Closed",
        "date": "2026-07-08",
        "description": "Issue description text"
      }
    ]
  }
}
```


#### 3. POST `/api/admin/parents/:parentId/approve`
**Purpose**: Approve parent application  
**Request Body**:
```json
{
  "declaration": true,
  "adminNotes": "Reviewed all documents and AI checks. Approved."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Parent application approved successfully",
  "parent": {
    "id": "uuid",
    "status": "Approved",
    "approvedBy": "Admin Name",
    "approvedAt": "2026-07-08T14:30:00Z"
  }
}
```

**Validation Rules**:
- Declaration must be true
- Admin must review all required documents
- Parent status must be "Pending" or "Under Review"
- KYC status must be "Complete"

**Business Logic**:
- Update parent status to "Approved"
- Create User account for parent (if not exists)
- Send approval email notification
- Log admin action in audit trail
- Update adoption case status if linked

#### 4. POST `/api/admin/parents/:parentId/reject`
**Purpose**: Reject parent application  
**Request Body**:
```json
{
  "reason": "Incomplete Documents" | "Identity Mismatch" | "Fraud Detected" | "High Risk" | "Other",
  "comments": "Additional rejection notes"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Parent application rejected",
  "parent": {
    "id": "uuid",
    "status": "Rejected",
    "rejectedBy": "Admin Name",
    "rejectedAt": "2026-07-08",
    "rejectionReason": "Incomplete Documents"
  }
}
```

**Validation Rules**:
- Reason is required
- Cannot reject already approved parent
- Must provide comments for certain rejection reasons

**Business Logic**:
- Update parent status to "Rejected"
- Send rejection email notification
- Log rejection in audit trail
- Mark adoption case as rejected if linked


#### 5. POST `/api/admin/parents/:parentId/request-documents`
**Purpose**: Request additional documents from parent  
**Request Body**:
```json
{
  "documents": ["Updated Aadhaar", "PAN", "Income Proof", "Address Proof", "Selfie", "Additional Documents"],
  "message": "Please upload the following documents for verification"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Document request sent to parent",
  "requestId": "uuid"
}
```

**Business Logic**:
- Update parent status to "Under Review"
- Create document request record
- Send email/SMS notification to parent
- Log request in parent communication history

#### 6. POST `/api/admin/parents/:parentId/issues/:issueId/resolve`
**Purpose**: Resolve a parent-raised issue  
**Request Body**:
```json
{
  "resolution": "Issue resolved successfully",
  "internalNotes": "Admin notes"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Issue resolved",
  "issue": {
    "id": "uuid",
    "status": "Resolved",
    "resolvedBy": "Admin Name",
    "resolvedAt": "2026-07-08"
  }
}
```

#### 7. POST `/api/admin/parents/:parentId/notes`
**Purpose**: Save admin internal notes  
**Request Body**:
```json
{
  "notes": "Internal admin remarks"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Notes saved successfully"
}
```


#### 8. GET `/api/admin/parents/:parentId/verification-report`
**Purpose**: Generate verification report PDF  
**Response**: PDF file stream or download URL

**Required Prisma Models**:
- AdoptiveParent
- User (for authentication & parent account)
- Document (parent documents)
- AIVerification (AI check results)
- ParentIssue (parent-raised issues)
- AdminNote (internal notes)
- AuditLog (admin actions)
- AdoptionCase (if linked to child)

**Required Relations**:
- AdoptiveParent → User (one-to-one)
- AdoptiveParent → Documents (one-to-many)
- AdoptiveParent → AIVerification (one-to-one)
- AdoptiveParent → ParentIssues (one-to-many)
- AdoptiveParent → AdminNotes (one-to-many)
- AdoptiveParent → AuditLogs (one-to-many)
- ParentIssue → Staff (resolvedBy)

---

## Additional Backend Requirements

### Required Prisma Models Summary

#### 1. AdoptiveParent
```prisma
model AdoptiveParent {
  id                    String    @id @default(uuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id])
  
  // Personal Information
  fatherName            String?
  fatherPhone           String?
  fatherAadhaar         String?
  fatherOccupation      String?
  motherName            String?
  motherPhone           String?
  motherAadhaar         String?
  motherOccupation      String?
  
  // Contact & Address
  alternatePhone        String?
  spouseName            String?
  emergencyContact      String?
  
  // Verification & Compliance
  kycStatus             KYCStatus @default(PENDING)
  verificationStatus    VerificationStatus @default(PENDING)
  trustScore            Int       @default(0)
  riskLevel             RiskLevel @default(LOW)
  
  // Adoption Assessment
  adoptionOrderId       String?
  voterId               String?
  homeStudyStatus       ApprovalStatus?
  policeVerification    VerificationStatus?
  hasAnotherChild       Boolean   @default(false)
  otherChildStatus      String?
  otherChildDetails     String?
  adoptionReason        String?
  financialCondition    String?
  
  // Post-Adoption Compliance
  lastKycDate           DateTime?
  nextKycDue            DateTime?
  lastHealthReportDate  DateTime?
  nextHealthReportDue   DateTime?
  complianceStatus      ComplianceStatus @default(COMPLIANT)
  
  // Follow-up
  followUpOfficerId     String?
  followUpOfficer       Staff?    @relation(fields: [followUpOfficerId], references: [id])
  postAdoptionFollowUp  String?
  
  // Relations
  documents             Document[]
  aiVerification        AIVerification?
  kycVerifications      KYCVerification[]
  healthReports         HealthReport[]
  issues                ParentIssue[]
  adminNotes            AdminNote[]
  auditLogs             AuditLog[]
  adoptionCases         AdoptionCase[]
  addresses             Address[]
  
  // Timestamps
  registeredAt          DateTime  @default(now())
  approvedAt            DateTime?
  approvedBy            String?
  rejectedAt            DateTime?
  rejectedBy            String?
  rejectionReason       String?
  
  isActive              Boolean   @default(true)
  deletedAt             DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([userId])
  @@index([verificationStatus])
  @@index([kycStatus])
  @@index([riskLevel])
}
```


#### 2. AIVerification (New Model)
```prisma
model AIVerification {
  id                    String    @id @default(uuid())
  parentId              String    @unique
  parent                AdoptiveParent @relation(fields: [parentId], references: [id])
  
  faceMatchPercentage   Int
  faceMatchStatus       String    // "Verified" | "Needs Review" | "Failed"
  ocrMatch              String    // "Matched" | "Needs Review" | "Mismatch"
  identityMatchScore    String    // "Strong" | "Moderate" | "Weak"
  documentAuthenticity  String    // "Verified" | "Manual Check" | "Failed"
  duplicateAccountCheck String    // "No Duplicate" | "Possible Match"
  backgroundCheckStatus String    // "Clear" | "Pending" | "Flagged"
  blacklistCheckStatus  String    // "Clear" | "Flagged"
  phoneVerificationStatus String  // "OTP Verified" | "Pending"
  emailVerificationStatus String  // "Verified" | "Pending"
  
  overallRecommendation String?
  aiNotes               String?
  
  verifiedAt            DateTime  @default(now())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([parentId])
}
```

#### 3. KYCVerification (New Model)
```prisma
model KYCVerification {
  id                String    @id @default(uuid())
  parentId          String
  parent            AdoptiveParent @relation(fields: [parentId], references: [id])
  
  verificationType  String    // "KYC" | "Health Report"
  submittedAt       DateTime
  verifiedAt        DateTime?
  status            VerificationStatus @default(PENDING)
  
  verifiedById      String?
  verifiedBy        Staff?    @relation(fields: [verifiedById], references: [id])
  
  documents         Document[]
  officerNotes      String?
  
  nextDueDate       DateTime?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([parentId])
  @@index([status])
}
```


#### 4. HealthReport (New Model)
```prisma
model HealthReport {
  id                String    @id @default(uuid())
  parentId          String
  parent            AdoptiveParent @relation(fields: [parentId], references: [id])
  childId           String
  child             Child     @relation(fields: [childId], references: [id])
  
  reportYear        Int       // Year of the report
  reportFile        String?   // File path/URL
  submittedAt       DateTime
  status            VerificationStatus @default(PENDING)
  
  verifiedById      String?
  verifiedBy        Staff?    @relation(fields: [verifiedById], references: [id])
  verifiedAt        DateTime?
  
  comments          String?
  officerNotes      String?
  
  nextDueDate       DateTime?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@unique([parentId, reportYear])
  @@index([parentId])
  @@index([childId])
  @@index([status])
}
```

#### 5. ParentIssue (New Model)
```prisma
model ParentIssue {
  id                String    @id @default(uuid())
  issueId           String    @unique // ISS-XXXX format
  parentId          String
  parent            AdoptiveParent @relation(fields: [parentId], references: [id])
  
  category          String    // "Document Clarification" | "Identity Mismatch" | "Duplicate Alert" | "Fraud Review"
  priority          Priority  @default(MEDIUM)
  status            IssueStatus @default(OPEN)
  
  description       String
  resolution        String?
  
  raisedAt          DateTime  @default(now())
  resolvedAt        DateTime?
  resolvedById      String?
  resolvedBy        Staff?    @relation(fields: [resolvedById], references: [id])
  
  internalNotes     String?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([parentId])
  @@index([status])
  @@index([priority])
}
```

#### 6. AdminNote (New Model)
```prisma
model AdminNote {
  id                String    @id @default(uuid())
  parentId          String
  parent            AdoptiveParent @relation(fields: [parentId], references: [id])
  
  note              String
  
  createdById       String
  createdBy         User      @relation(fields: [createdById], references: [id])
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([parentId])
}
```


### Required Enums

```prisma
enum KYCStatus {
  PENDING
  PARTIAL
  COMPLETE
  FAILED
  OVERDUE
}

enum VerificationStatus {
  PENDING
  VERIFIED
  APPROVED
  REJECTED
  UNDER_REVIEW
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ComplianceStatus {
  COMPLIANT
  PARTIALLY_COMPLIANT
  NON_COMPLIANT
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum IssueStatus {
  OPEN
  UNDER_REVIEW
  RESOLVED
  CLOSED
  ESCALATED
}
```

---

## Security & Authorization Requirements

### Role-Based Access Control

#### Admin Role
- **Full Access** to all parent management features
- Can view Parent Verification Center
- Can approve/reject parent applications
- Can view any parent profile
- Can manage parent KYC compliance
- Can resolve parent issues
- Can access parent verification reports

#### Orphanage Role
- **Limited Access**
- Can view parent profiles ONLY for children in their orphanage
- CANNOT access Parent Verification Center
- CANNOT approve/reject applications
- Can view adoption follow-up information

#### Parent Role
- Can access Parent Dashboard
- Can view their own KYC status
- Can submit KYC renewals
- Can upload health reports
- Can request visits
- CANNOT access other parents' data
- CANNOT access admin verification center


### Data Validation Rules

#### Parent Registration
- Email: Valid email format, unique
- Phone: Valid Indian mobile (+91 format), unique
- Aadhaar: 12 digits, format: XXXX XXXX XXXX
- PAN: Valid PAN format (ABCDE1234F)
- Annual Income: Positive number
- Family Members: Integer > 0
- Documents: Required types (Aadhaar, PAN, Address Proof, Selfie)

#### KYC Submission
- Must upload all required documents
- Declaration checkbox must be checked
- Cannot submit if previous KYC is pending
- Next due date = current date + 6 months

#### Health Report Upload
- File types: PDF, JPG, PNG
- Max file size: 5MB
- One report per year
- Must be linked to child
- Next due date = current date + 1 year

#### Verification Actions
- Approval requires declaration checkbox
- Rejection requires reason selection
- Document request requires at least one document selected
- Admin notes: max 2000 characters

---

## File Upload Requirements

### Document Types
1. **Aadhaar Card** (PDF/JPG/PNG, max 2MB)
2. **PAN Card** (PDF/JPG/PNG, max 2MB)
3. **Passport** (PDF/JPG/PNG, max 2MB)
4. **Income Proof** (PDF, max 2MB)
5. **Marriage Certificate** (PDF/JPG/PNG, max 2MB)
6. **Address Proof** (PDF/JPG/PNG, max 2MB)
7. **Selfie/Photo** (JPG/PNG, max 1MB)
8. **Child Health Report** (PDF, max 5MB)

### Upload Storage
- Store in cloud storage (S3/Azure Blob)
- Generate unique filenames
- Store file paths in database
- Implement virus scanning
- Generate thumbnails for images
- Encrypt sensitive documents

### Upload Endpoints Required
```
POST /api/parents/documents/upload
POST /api/parents/health-reports/upload
GET /api/parents/documents/:documentId/download
GET /api/parents/documents/:documentId/preview
```

---

## Business Logic Requirements

### Parent Lifecycle
1. **Registration** → Status: Pending
2. **AI Verification** → Auto-calculate trust score
3. **Admin Review** → Manual verification
4. **Approval/Rejection** → Update status + create User account
5. **Account Activation** → Parent can login
6. **KYC Compliance** → Recurring every 6 months
7. **Health Reports** → Annual submission
8. **Compliance Monitoring** → Auto-flag overdue


### AI Trust Score Calculation
**Algorithm** (weighted scoring):
```
trustScore = (
  faceMatchPercentage * 0.25 +
  documentAuthenticityScore * 0.20 +
  identityMatchScore * 0.20 +
  backgroundCheckScore * 0.15 +
  duplicateCheckScore * 0.10 +
  phoneVerificationScore * 0.05 +
  emailVerificationScore * 0.05
) * 100
```

**Risk Level Determination**:
- Trust Score >= 80: Low Risk
- Trust Score 60-79: Medium Risk
- Trust Score < 60: High Risk

### KYC Compliance Logic

#### Compliance Status Calculation
```
if (kycStatus === "Verified" && healthReportStatus === "Submitted") {
  return "Compliant"
} else if (nextKycDue < today || nextHealthReportDue < today) {
  return "Non-Compliant"
} else {
  return "Partially Compliant"
}
```

#### Auto-Flagging Rules
- Flag as "Overdue" if nextKycDue < today - 7 days
- Send reminder email 14 days before due date
- Send SMS reminder 7 days before due date
- Send urgent notification on due date
- Auto-update compliance status daily

### Adoption Journey Tracking
**Steps**:
1. KYC Submitted → When parent registers
2. Identity Verified → When admin approves
3. Visit Request → When parent submits first visit request
4. Visit Approved → When orphanage approves visit
5. Adoption Proceeding → When legal process starts

**Progress Calculation**:
```
currentStep / totalSteps * 100
```

---

## Notification Requirements

### Email Notifications
1. **Registration Confirmation** → On parent registration
2. **Verification Approved** → On admin approval
3. **Application Rejected** → On admin rejection with reason
4. **Documents Requested** → When admin requests additional documents
5. **KYC Due Reminder** → 14 days before, 7 days before, on due date
6. **Health Report Due** → 30 days before, 14 days before, on due date
7. **KYC Overdue Alert** → When overdue
8. **Health Report Overdue** → When overdue
9. **Issue Resolved** → When admin resolves parent issue

### SMS Notifications
1. KYC Due (7 days before)
2. Health Report Due (14 days before)
3. Verification Status Change
4. Urgent Compliance Alert

### In-App Notifications
- All email notifications also appear in-app
- Real-time updates using WebSocket (optional)

---

## Report Generation Requirements

### Verification Report (PDF)
**Contents**:
- Parent Information
- AI Verification Results
- Document Verification Status
- Issue History
- Admin Notes
- Verification Timeline
- Approval/Rejection Details
- Officer Signature

### KYC Acknowledgement (PDF)
**Contents**:
- Parent Details
- Child Details
- KYC Status
- Health Report Status
- Compliance Status
- Next Due Dates
- Terms & Conditions
- Official Stamp/Seal


---

## Missing Frontend Routes

The following routes are referenced in components but NOT defined in AppRoutes.jsx:

1. **`/parent/kyc`** - ParentKYC page exists but route missing
2. **`/admin/parent-verification`** - Route exists ✓
3. **`/admin/parent-profiles/:parentId`** - Route exists ✓
4. **`/orphanage/parent-profiles/:parentId`** - Route exists ✓

**Action Required**: Add `/parent/kyc` route to parent routes in AppRoutes.jsx

---

## API Endpoint Summary

### Parent Portal APIs (Role: Parent)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/parents/dashboard` | Parent dashboard data |
| GET | `/api/parents/kyc` | KYC compliance status |
| POST | `/api/parents/kyc/submit` | Submit KYC renewal |
| POST | `/api/parents/health-reports/upload` | Upload health report |
| GET | `/api/parents/kyc/documents` | Fetch KYC documents |
| GET | `/api/parents/kyc/acknowledgement` | Download acknowledgement PDF |
| POST | `/api/parents/documents/upload` | Upload document |

### Admin Verification APIs (Role: Admin)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/parents/verification/queue` | Verification queue list |
| GET | `/api/admin/parents/:id/verification-details` | Full verification details |
| POST | `/api/admin/parents/:id/approve` | Approve application |
| POST | `/api/admin/parents/:id/reject` | Reject application |
| POST | `/api/admin/parents/:id/request-documents` | Request documents |
| POST | `/api/admin/parents/:id/issues/:issueId/resolve` | Resolve issue |
| POST | `/api/admin/parents/:id/notes` | Save admin notes |
| GET | `/api/admin/parents/:id/verification-report` | Generate report PDF |

### Profile APIs (Role: Admin, Orphanage)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/parents/:id/profile` | Parent profile details |

**Total APIs Required**: 16 endpoints

---

## Database Transactions Required

### 1. Approve Parent Application
**Transaction includes**:
- Update AdoptiveParent status to "Approved"
- Create User account for parent
- Update AdoptionCase status if linked
- Create AuditLog entry
- Send email notification
- Update AI verification timestamp

### 2. Reject Parent Application
**Transaction includes**:
- Update AdoptiveParent status to "Rejected"
- Store rejection reason
- Update AdoptionCase status
- Create AuditLog entry
- Send email notification

### 3. Submit KYC Renewal
**Transaction includes**:
- Create KYCVerification record
- Update AdoptiveParent lastKycDate and nextKycDue
- Update complianceStatus
- Link documents to verification
- Send confirmation notification

### 4. Upload Health Report
**Transaction includes**:
- Create HealthReport record
- Update AdoptiveParent health report dates
- Update complianceStatus
- Upload file to storage
- Send confirmation notification


---

## Performance Considerations

### Pagination
- Default page size: 20
- Maximum page size: 100
- Implement cursor-based pagination for large datasets

### Caching Strategy
- Cache dashboard data for 5 minutes
- Cache verification queue for 2 minutes
- Cache parent profile for 10 minutes
- Invalidate cache on data update

### Indexing Requirements
```sql
-- Critical indexes for performance
CREATE INDEX idx_adoptive_parent_status ON AdoptiveParent(verificationStatus);
CREATE INDEX idx_adoptive_parent_kyc ON AdoptiveParent(kycStatus);
CREATE INDEX idx_adoptive_parent_risk ON AdoptiveParent(riskLevel);
CREATE INDEX idx_adoptive_parent_user ON AdoptiveParent(userId);
CREATE INDEX idx_kyc_verification_parent ON KYCVerification(parentId);
CREATE INDEX idx_kyc_verification_status ON KYCVerification(status);
CREATE INDEX idx_health_report_parent ON HealthReport(parentId);
CREATE INDEX idx_parent_issue_status ON ParentIssue(status);
```

### File Upload Optimization
- Use pre-signed URLs for direct S3 uploads
- Implement client-side image compression
- Use CDN for document delivery
- Lazy load document previews

---

## Testing Requirements

### Unit Tests (Backend)
- KYC compliance calculation logic
- Trust score calculation algorithm
- Date calculation (next due dates)
- Validation rules for all DTOs
- Authorization checks for all endpoints

### Integration Tests
- Parent registration flow
- Verification workflow (approve/reject)
- KYC submission flow
- Health report upload
- Document request flow
- Issue resolution flow

### E2E Tests (Frontend)
- Parent dashboard load
- KYC form submission
- Document upload
- Admin verification workflow
- Search and filter functionality
- Modal interactions

---

## Module Dependencies

### Required Existing Modules
1. **User Management** - For authentication and user accounts
2. **Children Module** - For linked child data
3. **Document Management** - For file uploads and storage
4. **Notification Service** - For email/SMS notifications
5. **Audit Log** - For tracking admin actions

### Optional Integrations
1. **AI/ML Service** - For face matching and document verification
2. **SMS Gateway** - For SMS notifications
3. **Email Service** - For email notifications
4. **PDF Generator** - For reports and acknowledgements
5. **Payment Gateway** - If adoption fees are applicable

---

## Conclusion

This frontend analysis provides a complete blueprint for the Parents module backend implementation. The module requires:

- **6 New Prisma Models**: AdoptiveParent, AIVerification, KYCVerification, HealthReport, ParentIssue, AdminNote
- **7 Enums**: KYCStatus, VerificationStatus, RiskLevel, ApprovalStatus, ComplianceStatus, Priority, IssueStatus
- **16 API Endpoints**: 7 for parents, 8 for admin, 1 for profile viewing
- **4 Major Workflows**: Registration & Verification, KYC Compliance, Health Reports, Issue Management
- **8 Document Types**: Aadhaar, PAN, Passport, Income Proof, Marriage Cert, Address Proof, Selfie, Health Report

### Next Steps
1. ✅ Frontend analysis complete
2. ⏳ Await user approval
3. ⏳ Design database schema
4. ⏳ Create Prisma models and migrations
5. ⏳ Implement backend services and controllers
6. ⏳ Create DTOs and validation
7. ⏳ Implement file upload handling
8. ⏳ Add Swagger documentation
9. ⏳ Integrate with frontend

**Estimated Backend Complexity**: High (AI verification, compliance tracking, multiple workflows)  
**Estimated Implementation Time**: 3-4 days for complete backend

---

**Report Generated**: January 14, 2026  
**Status**: ✅ Frontend Analysis Complete - Awaiting Approval  
**Next Phase**: Backend Implementation

