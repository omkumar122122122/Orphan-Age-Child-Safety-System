import { adminNav } from "../data/dummyData";
import DashboardLayout from "./DashboardLayout";

export default function AdminLayout() {
  return <DashboardLayout navItems={adminNav} role="admin" title="Admin Dashboard" />;
}
