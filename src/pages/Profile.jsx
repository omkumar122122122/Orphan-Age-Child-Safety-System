import { FiLogOut, FiMail, FiShield, FiUserCheck } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../context/AuthContext";
import { children } from "../data/dummyData";
import { roleLabels } from "../utils/constants";

export default function Profile() {
  const { user, logout } = useAuth();
  const child = children[1];
  const isParent = user?.role === "parent";

  return (
    <div className="space-y-6">
      <Breadcrumb items={[roleLabels[user.role], "Profile"]} />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-6">
          <ProfileCard user={user} />
        </div>
        <Card>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">User Profile</h1>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field icon={FiUserCheck} label="Name" value={user.name} />
            <Field icon={FiMail} label="Email" value={user.email} />
            <Field icon={FiShield} label="Role" value={roleLabels[user.role]} />
            <Field icon={FiShield} label="Department" value={user.department} />
          </dl>
        </Card>
      </div>
      {isParent && (
        <Card>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Linked Child Welfare Profile</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Child ID" value={child.id} />
            <Field label="Name" value={child.name} />
            <Field label="Age" value={child.age} />
            <Field label="Orphanage" value={child.orphanage} />
            <Field label="Health Status" value={child.health} />
            <Field label="Attendance" value={`${child.attendance}%`} />
          </dl>
        </Card>
      )}
      <LogoutSection onLogout={logout} />
    </div>
  );
}

function LogoutSection({ onLogout }) {
  return (
    <Card>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Account Actions</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            End the current secure dashboard session.
          </p>
        </div>
        <Button variant="danger" icon={FiLogOut} onClick={onLogout} className="w-full md:w-auto">
          Logout
        </Button>
      </div>
    </Card>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </dt>
      <dd className="mt-2 font-bold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}
