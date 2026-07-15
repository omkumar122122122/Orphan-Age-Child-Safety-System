import { PARENT_NAV_ITEMS } from "../constants/navigation";
import DashboardLayout from "./DashboardLayout";

export default function ParentLayout() {
  return <DashboardLayout navItems={PARENT_NAV_ITEMS} role="parent" title="Parent Portal" />;
}
