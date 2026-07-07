import Card from "./Card";

const roleColors = {
  admin:     "bg-indigo-600",
  orphanage: "bg-civic-600",
  parent:    "bg-emerald-600",
};

const roleBadge = {
  admin:     "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  orphanage: "bg-civic-50 text-civic-700 dark:bg-civic-500/10 dark:text-civic-400",
  parent:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export default function ProfileCard({ user }) {
  const avatarBg = roleColors[user.role] ?? "bg-slate-600";
  const badge    = roleBadge[user.role]  ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <Card>
      <div className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${avatarBg}`}>
          {user.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-slate-900 dark:text-white">{user.name}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{user.department}</p>
          <span className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badge}`}>
            {user.role}
          </span>
        </div>
      </div>
    </Card>
  );
}
