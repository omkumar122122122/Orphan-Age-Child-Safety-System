import { CheckCircle, User } from "lucide-react";

export default function ProfileHeader({ user }) {
  return (
    <div className="flex items-center gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-civic-500/15 dark:text-civic-100">
        <User size={36} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{user.name}</h2>
          <span className="inline-flex items-center gap-2 rounded-md bg-green-50 px-2 py-1 text-sm text-green-600 dark:bg-emerald-500/15 dark:text-emerald-200">
            <CheckCircle size={14} />
            Active
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {user.role} • {user.department}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-500 dark:text-slate-400">Member since</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.joiningDate || "—"}</p>
      </div>
    </div>
  );
}
