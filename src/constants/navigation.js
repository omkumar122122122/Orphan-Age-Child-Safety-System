/**
 * Navigation Configuration
 * Static navigation items for each role
 * No dummy/test data - these are production navigation items
 */

import {
  FiActivity,
  FiAlertTriangle,
  FiBriefcase,
  FiCalendar,
  FiHeart,
  FiHome,
  FiMessageCircle,
  FiPlusCircle,
  FiUser,
  FiUserCheck,
  FiUsers
} from "react-icons/fi";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: FiActivity },
  { label: "Children", path: "/admin/children", icon: FiUsers },
  { label: "Parent Verification", path: "/admin/parent-verification", icon: FiUserCheck },
  { label: "Register Child", path: "/admin/register-child", icon: FiPlusCircle },
  { label: "Register Orphanage", path: "/admin/register-orphanage", icon: FiHome },
  { label: "Orphanages", path: "/admin/orphanages", icon: FiHome },
  { label: "Staff Management", path: "/admin/staff", icon: FiBriefcase },
  { label: "Alerts", path: "/admin/alerts", icon: FiAlertTriangle },
  { label: "Profile", path: "/admin/profile", icon: FiUser }
];

export const PARENT_NAV_ITEMS = [
  { label: "Dashboard", path: "/parent", icon: FiActivity },
  { label: "Sahayak AI", path: "/parent/sahayak-ai", icon: FiMessageCircle },
  { label: "Profile", path: "/parent/profile", icon: FiUser },
  { label: "Visit Request", path: "/parent/visit-request", icon: FiCalendar },
  { label: "Child Welfare Follow-up", path: "/parent/child-welfare-follow-up-session", icon: FiHeart },
  { label: "Notifications", path: "/parent/notifications", icon: FiAlertTriangle }
];

export const ORPHANAGE_NAV_ITEMS = [
  { label: "Dashboard", path: "/orphanage", icon: FiActivity },
  { label: "Children", path: "/orphanage/children", icon: FiUsers },
  { label: "AI Attendance", path: "/orphanage/ai-attendance", icon: FiActivity },
  { label: "Visit Requests", path: "/orphanage/visit-requests", icon: FiCalendar },
  { label: "Register Child", path: "/orphanage/register-child", icon: FiPlusCircle },
  { label: "Adoption Management", path: "/orphanage/adoption-management", icon: FiHeart },
  { label: "Health Monitoring", path: "/orphanage/health-monitoring", icon: FiHeart },
  { label: "Reports", path: "/orphanage/reports", icon: FiActivity },
  { label: "Profile", path: "/orphanage/profile", icon: FiUser }
];

export const getNavItemsByRole = (role) => {
  switch (role) {
    case "admin":
      return ADMIN_NAV_ITEMS;
    case "parent":
      return PARENT_NAV_ITEMS;
    case "orphanage":
      return ORPHANAGE_NAV_ITEMS;
    default:
      return [];
  }
};
