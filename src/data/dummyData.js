import { FiActivity, FiAlertTriangle, FiHome, FiPlusCircle, FiShield, FiUser, FiUsers } from "react-icons/fi";

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
  { id: "CH-1021", name: "Ishaan Roy", age: 9, orphanage: "Sunrise Care Home", risk: "Low", health: "Stable", attendance: 96 },
  { id: "CH-1034", name: "Anaya Das", age: 12, orphanage: "Hope Nest", risk: "Medium", health: "Observation", attendance: 89 },
  { id: "CH-1057", name: "Kabir Khan", age: 7, orphanage: "Little Steps", risk: "Low", health: "Stable", attendance: 98 },
  { id: "CH-1088", name: "Sara Ali", age: 11, orphanage: "Sunrise Care Home", risk: "High", health: "Needs Review", attendance: 78 },
  { id: "CH-1102", name: "Vihaan Sen", age: 10, orphanage: "Care Bridge", risk: "Medium", health: "Stable", attendance: 84 },
  { id: "CH-1145", name: "Riya Patel", age: 8, orphanage: "Hope Nest", risk: "Low", health: "Stable", attendance: 94 }
];

export const orphanages = [
  { id: "ORP-001", name: "Sunrise Care Home", city: "Delhi", capacity: 180, occupancy: 164, compliance: 94 },
  { id: "ORP-002", name: "Hope Nest", city: "Jaipur", capacity: 120, occupancy: 101, compliance: 91 },
  { id: "ORP-003", name: "Little Steps", city: "Lucknow", capacity: 90, occupancy: 86, compliance: 88 },
  { id: "ORP-004", name: "Care Bridge", city: "Bhopal", capacity: 130, occupancy: 119, compliance: 96 }
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
  { label: "Orphanages", path: "/admin/orphanages", icon: FiHome },
  { label: "Alerts", path: "/admin/alerts", icon: FiAlertTriangle },
  { label: "Profile", path: "/admin/profile", icon: FiUser }
];

export const parentNav = [
  { label: "Dashboard", path: "/parent", icon: FiActivity },
  { label: "Profile", path: "/parent/profile", icon: FiUser },
  { label: "Notifications", path: "/parent/notifications", icon: FiAlertTriangle }
];

export const orphanageNav = [
  { label: "Dashboard", path: "/orphanage", icon: FiActivity },
  { label: "Children", path: "/orphanage/children", icon: FiUsers },
  { label: "Register Child", path: "/orphanage/register-child", icon: FiPlusCircle },
  { label: "Reports", path: "/orphanage/reports", icon: FiShield },
  { label: "Profile", path: "/orphanage/profile", icon: FiUser }
];
