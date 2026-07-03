import { FiActivity, FiAlertTriangle, FiCalendar, FiHome, FiPlusCircle, FiShield, FiUser, FiUsers } from "react-icons/fi";

export const users = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "admin@safety.gov",
    password: "admin123",
    role: "admin",
    department: "Child Welfare Directorate",
    avatar: "AS"
  },
  {
    id: 2,
    name: "Meera Nair",
    email: "parent@example.com",
    password: "parent123",
    role: "parent",
    department: "Registered Guardian",
    avatar: "MN"
  },
  {
    id: 3,
    name: "Rohan Verma",
    email: "orphanage@example.com",
    password: "orphanage123",
    role: "orphanage",
    department: "Sunrise Care Home",
    avatar: "RV"
  }
];

export const stats = [
  { label: "Registered Children", value: "1,248", trend: "+8.2%", icon: FiUsers, tone: "blue" },
  { label: "Safe Zones Online", value: "42", trend: "+3", icon: FiShield, tone: "green" },
  { label: "Active Orphanages", value: "18", trend: "+2", icon: FiHome, tone: "amber" },
  { label: "Critical Alerts", value: "7", trend: "-4", icon: FiAlertTriangle, tone: "red" }
];

export const children = [
  {
    id: "CH-1021",
    name: "Ishaan Roy",
    age: 9,
    gender: "Male",
    bloodGroup: "B+",
    orphanage: "Sunrise Care Home",
    risk: "Low",
    health: "Stable",
    attendance: 96,
    admissionDate: "2021-04-12",
    caseWorker: "Neha Kapoor",
    educationLevel: "Class 4",
    medicalHistory: "Seasonal asthma, inhaler advised during winter.",
    medicalHistoryFile: "CH-1021-medical-history.pdf",
    vaccinationStatus: "Up to date",
    allergies: "Dust allergy",
    emergencyContact: "Sunrise Care Home Office, +91 98765 11021",
    adopted: false
  },
  {
    id: "CH-1034",
    name: "Anaya Das",
    age: 12,
    gender: "Female",
    bloodGroup: "O+",
    orphanage: "Hope Nest",
    risk: "Medium",
    health: "Observation",
    attendance: 89,
    admissionDate: "2020-09-03",
    caseWorker: "Priya Menon",
    educationLevel: "Class 7",
    medicalHistory: "Mild anemia under nutrition follow-up.",
    medicalHistoryFile: "CH-1034-medical-history.pdf",
    vaccinationStatus: "Up to date",
    allergies: "None recorded",
    emergencyContact: "Hope Nest Welfare Desk, +91 98765 11034",
    adopted: true,
    adoptionDate: "2025-02-18",
    parentDetails: {
      id: "PAR-1034",
      fatherName: "Sourav Das",
      fatherPhone: "+91 98765 21034",
      fatherAadhaar: "XXXX-XXXX-1034",
      fatherOccupation: "School Teacher",
      motherName: "Mitali Das",
      motherPhone: "+91 98765 21035",
      motherAadhaar: "XXXX-XXXX-2034",
      motherOccupation: "Nurse",
      financialCondition: "Stable middle-income household with verified monthly income.",
      hasAnotherChild: true,
      otherChildStatus: "Own child",
      otherChildDetails: "One biological daughter, age 6.",
      adoptionReason: "Family wanted to provide long-term care and education support to a child.",
      voterId: "VTR-XXXX-1034",
      email: "das.family@example.com",
      address: "Civil Lines, Jaipur",
      adoptionOrderId: "ADP-2025-018",
      followUpOfficer: "Ritika Sharma",
      homeStudyStatus: "Approved",
      policeVerification: "Completed",
      postAdoptionFollowUp: "Quarterly welfare visits scheduled through 2027."
    }
  },
  {
    id: "CH-1057",
    name: "Kabir Khan",
    age: 7,
    gender: "Male",
    bloodGroup: "A+",
    orphanage: "Little Steps",
    risk: "Low",
    health: "Stable",
    attendance: 98,
    admissionDate: "2022-01-21",
    caseWorker: "Amit Sinha",
    educationLevel: "Class 2",
    medicalHistory: "No chronic conditions recorded.",
    medicalHistoryFile: "CH-1057-medical-history.pdf",
    vaccinationStatus: "Up to date",
    allergies: "None recorded",
    emergencyContact: "Little Steps Care Desk, +91 98765 11057",
    adopted: false
  },
  {
    id: "CH-1088",
    name: "Sara Ali",
    age: 11,
    gender: "Female",
    bloodGroup: "AB+",
    orphanage: "Sunrise Care Home",
    risk: "High",
    health: "Needs Review",
    attendance: 78,
    admissionDate: "2019-11-08",
    caseWorker: "Neha Kapoor",
    educationLevel: "Class 6",
    medicalHistory: "Recurring migraine and recent counseling referral.",
    medicalHistoryFile: "CH-1088-medical-history.pdf",
    vaccinationStatus: "Booster pending",
    allergies: "Peanuts",
    emergencyContact: "Sunrise Care Home Office, +91 98765 11088",
    adopted: false
  },
  {
    id: "CH-1102",
    name: "Vihaan Sen",
    age: 10,
    gender: "Male",
    bloodGroup: "O-",
    orphanage: "Care Bridge",
    risk: "Medium",
    health: "Stable",
    attendance: 84,
    admissionDate: "2021-07-17",
    caseWorker: "Karan Joshi",
    educationLevel: "Class 5",
    medicalHistory: "Corrective spectacles prescribed.",
    medicalHistoryFile: "CH-1102-medical-history.pdf",
    vaccinationStatus: "Up to date",
    allergies: "None recorded",
    emergencyContact: "Care Bridge Office, +91 98765 11102",
    adopted: true,
    adoptionDate: "2024-12-06",
    parentDetails: {
      id: "PAR-1102",
      fatherName: "Arjun Sen",
      fatherPhone: "+91 98765 21102",
      fatherAadhaar: "XXXX-XXXX-1102",
      fatherOccupation: "Bank Manager",
      motherName: "Nisha Sen",
      motherPhone: "+91 98765 21103",
      motherAadhaar: "XXXX-XXXX-2102",
      motherOccupation: "Small Business Owner",
      financialCondition: "Financially secure, verified savings and regular income.",
      hasAnotherChild: false,
      otherChildStatus: "No other child",
      otherChildDetails: "No other children in the household.",
      adoptionReason: "The parents completed counseling and chose adoption to build their family.",
      voterId: "VTR-XXXX-1102",
      email: "sen.family@example.com",
      address: "Arera Colony, Bhopal",
      adoptionOrderId: "ADP-2024-102",
      followUpOfficer: "Karan Joshi",
      homeStudyStatus: "Approved",
      policeVerification: "Completed",
      postAdoptionFollowUp: "Monthly follow-up for the first six months, then quarterly."
    }
  },
  {
    id: "CH-1145",
    name: "Riya Patel",
    age: 8,
    gender: "Female",
    bloodGroup: "A-",
    orphanage: "Hope Nest",
    risk: "Low",
    health: "Stable",
    attendance: 94,
    admissionDate: "2022-05-28",
    caseWorker: "Priya Menon",
    educationLevel: "Class 3",
    medicalHistory: "Recovered from wrist fracture in 2024.",
    medicalHistoryFile: "CH-1145-medical-history.pdf",
    vaccinationStatus: "Up to date",
    allergies: "None recorded",
    emergencyContact: "Hope Nest Welfare Desk, +91 98765 11145",
    adopted: false
  }
];

export const orphanages = [
  {
    id: "ORP-001",
    name: "Sunrise Care Home",
    registrationNumber: "REG-DL-2012-0148",
    governmentLicenseNumber: "GOV-CW-DEL-4892",
    establishmentDate: "2012-06-18",
    organizationType: "NGO",
    numberOfChildren: 164,
    totalAdmissions: 238,
    capacity: 180,
    officialEmail: "office@sunrisecare.org",
    phone: "+91 98765 40001",
    alternativeContact: "+91 98765 40002",
    website: "https://sunrisecare.example.org",
    country: "India",
    state: "Delhi",
    district: "South Delhi",
    city: "Delhi",
    fullAddress: "21 Welfare Road, Saket, New Delhi",
    pinCode: "110017",
    administrator: {
      name: "Rohan Verma",
      designation: "Home Administrator",
      mobile: "+91 98765 40003",
      email: "orphanage@example.com",
      profilePhoto: "rohan-verma-profile.jpg"
    },
    kyc: {
      registrationCertificate: "sunrise-registration-certificate.pdf",
      ngoCertificate: "sunrise-ngo-certificate.pdf",
      governmentLicense: "sunrise-government-license.pdf",
      administratorIdProof: "rohan-verma-id-proof.pdf",
      panCard: "SUNRISE-pan-card.pdf",
      gstNumber: "07SUNRISE1234Z1Z",
      addressProof: "sunrise-address-proof.pdf"
    },
    childSummary: {
      totalBoys: 91,
      totalGirls: 73,
      below5: 24,
      age5To12: 96,
      above12: 44,
      specialNeeds: 12
    },
    staff: {
      totalStaff: 46,
      caretakers: 20,
      teachers: 8,
      medicalStaff: 5,
      securityGuards: 6,
      volunteers: 7
    },
    facilities: [
      "Medical Room",
      "CCTV Surveillance",
      "School",
      "Playground",
      "Library",
      "Computer Lab",
      "Dining Hall",
      "Dormitory",
      "Security Guards",
      "Biometric Attendance"
    ],
    emergencyContact: {
      contactPerson: "Anita Rao",
      mobile: "+91 98765 40004",
      email: "emergency@sunrisecare.org",
      relationship: "Emergency Response Officer"
    },
    aiSafety: {
      faceRecognitionEnabled: "Yes",
      cctvInstalled: "Yes",
      numberOfCameras: 38,
      visitorFaceVerificationEnabled: "Yes",
      childAttendanceSystem: "Biometric and face recognition",
      gpsTrackingAvailable: "Yes",
      emergencyAlertSystemEnabled: "Yes"
    },
    bankDetails: {
      bankName: "State Bank of India",
      accountHolderName: "Sunrise Care Home",
      accountNumber: "XXXXXX4482",
      ifscCode: "SBIN0001482"
    },
    occupancy: 164,
    compliance: 94
  },
  { id: "ORP-002", name: "Hope Nest", city: "Jaipur", capacity: 120, occupancy: 101, compliance: 91, totalAdmissions: 176 },
  { id: "ORP-003", name: "Little Steps", city: "Lucknow", capacity: 90, occupancy: 86, compliance: 88, totalAdmissions: 129 },
  { id: "ORP-004", name: "Care Bridge", city: "Bhopal", capacity: 130, occupancy: 119, compliance: 96, totalAdmissions: 158 }
];

export const notifications = [
  { id: 1, title: "AI anomaly check completed", detail: "7 records need welfare officer review.", type: "Review", time: "10 min ago" },
  { id: 2, title: "Medical follow-up due", detail: "Anaya Das has a pediatric appointment today.", type: "Health", time: "1 hr ago" },
  { id: 3, title: "Monthly compliance report", detail: "All active homes submitted mandatory data.", type: "Report", time: "Yesterday" }
];

export const activityFeed = [
  { label: "Guardian visit verified", value: 32 },
  { label: "Health checks", value: 76 },
  { label: "Education updates", value: 58 },
  { label: "Safety inspections", value: 44 }
];

export const monthlySafety = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Safety Score",
      data: [82, 85, 87, 89, 91, 94],
      borderColor: "#1c74d8",
      backgroundColor: "rgba(28, 116, 216, 0.14)",
      tension: 0.4,
      fill: true
    },
    {
      label: "Compliance",
      data: [78, 81, 84, 86, 88, 92],
      borderColor: "#0f9f6e",
      backgroundColor: "rgba(15, 159, 110, 0.12)",
      tension: 0.4,
      fill: true
    }
  ]
};

export const riskDistribution = {
  labels: ["Low", "Medium", "High"],
  datasets: [
    {
      data: [68, 24, 8],
      backgroundColor: ["#0f9f6e", "#f59e0b", "#dc2626"],
      borderWidth: 0
    }
  ]
};

export const adminNav = [
  { label: "Dashboard", path: "/admin", icon: FiActivity },
  { label: "Children", path: "/admin/children", icon: FiUsers },
  { label: "Register Child", path: "/admin/register-child", icon: FiPlusCircle },
  { label: "Register Orphanage", path: "/admin/register-orphanage", icon: FiHome },
  { label: "Orphanages", path: "/admin/orphanages", icon: FiHome },
  { label: "Alerts", path: "/admin/alerts", icon: FiAlertTriangle },
  { label: "Profile", path: "/admin/profile", icon: FiUser }
];

export const parentNav = [
  { label: "Dashboard", path: "/parent", icon: FiActivity },
  { label: "Profile", path: "/parent/profile", icon: FiUser },
  { label: "Visit Request", path: "/parent/visit-request", icon: FiCalendar },
  { label: "Notifications", path: "/parent/notifications", icon: FiAlertTriangle }
];

export const orphanageNav = [
  { label: "Dashboard", path: "/orphanage", icon: FiActivity },
  { label: "Visit Requests", path: "/orphanage/visit-requests", icon: FiCalendar },
  { label: "Children", path: "/orphanage/children", icon: FiUsers },
  { label: "Register Child", path: "/orphanage/register-child", icon: FiPlusCircle },
  { label: "Reports", path: "/orphanage/reports", icon: FiShield },
  { label: "Profile", path: "/orphanage/profile", icon: FiUser }
];
