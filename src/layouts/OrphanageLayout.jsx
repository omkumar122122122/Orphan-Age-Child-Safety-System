import { orphanageNav } from "../data/dummyData";
import DashboardLayout from "./DashboardLayout";

export default function OrphanageLayout() {
  return <DashboardLayout navItems={orphanageNav} role="orphanage" title="Orphanage Console" />;
}
