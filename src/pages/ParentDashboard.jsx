import Breadcrumb from "../components/Breadcrumb";
import Card from "../components/Card";
import NotificationPanel from "../components/NotificationPanel";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../context/AuthContext";
import { children, notifications } from "../data/dummyData";

export default function ParentDashboard() {
  const { user } = useAuth();
  const child = children[1];

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Parent", "Dashboard"]} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <ProfileCard user={user} />
        <Card>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Linked Child Overview</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Info label="Name" value={child.name} />
            <Info label="Health" value={child.health} />
            <Info label="Attendance" value={`${child.attendance}%`} />
          </div>
        </Card>
      </div>
      <NotificationPanel items={notifications} />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
