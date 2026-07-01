import Breadcrumb from "../components/Breadcrumb";
import Card from "../components/Card";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../context/AuthContext";
import { children } from "../data/dummyData";

export default function Profile() {
  const { user } = useAuth();
  const child = children[1];

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Parent", "Child Profile"]} />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <ProfileCard user={user} />
        <Card>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Child Welfare Profile</h1>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Child ID" value={child.id} />
            <Field label="Name" value={child.name} />
            <Field label="Age" value={child.age} />
            <Field label="Orphanage" value={child.orphanage} />
            <Field label="Health Status" value={child.health} />
            <Field label="Attendance" value={`${child.attendance}%`} />
          </dl>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 font-bold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}
