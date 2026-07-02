import { Briefcase, Building, Calendar, Hash, Mail, Phone } from "lucide-react";

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40">
      <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-civic-500/15 dark:text-civic-100">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</div>
        <div className="mt-1 font-medium text-slate-800 dark:text-slate-100">{value || "Not provided"}</div>
      </div>
    </div>
  );
}

export default function ProfileInfoGrid({ user }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <InfoField icon={Hash} label="Full Name" value={user.name} />
      <InfoField icon={Mail} label="Email" value={user.email} />
      <InfoField icon={Phone} label="Phone" value={user.phone} />
      <InfoField icon={Hash} label="Employee ID" value={user.employeeId} />
      <InfoField icon={Building} label="Department" value={user.department} />
      <InfoField icon={Briefcase} label="Designation" value={user.designation} />
      <InfoField icon={Calendar} label="Joining Date" value={user.joiningDate} />
    </div>
  );
}
