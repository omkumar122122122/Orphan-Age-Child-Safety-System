import { ORPHANAGE_NAV_ITEMS } from "../constants/navigation";
import DashboardLayout from "./DashboardLayout";

export default function OrphanageLayout() {
  return <DashboardLayout navItems={ORPHANAGE_NAV_ITEMS} role="orphanage" title="Orphanage Console" />;
}
