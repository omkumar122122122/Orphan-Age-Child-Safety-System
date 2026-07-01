import { parentNav } from "../data/dummyData";
import DashboardLayout from "./DashboardLayout";

export default function ParentLayout() {
  return <DashboardLayout navItems={parentNav} role="parent" title="Parent Portal" />;
}
