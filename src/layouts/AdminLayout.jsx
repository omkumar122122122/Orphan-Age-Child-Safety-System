import { ADMIN_NAV_ITEMS } from "../constants/navigation";
import DashboardLayout from "./DashboardLayout";

export default function AdminLayout() {
  return <DashboardLayout navItems={ADMIN_NAV_ITEMS} role="admin" title="Admin Dashboard" />;
}
