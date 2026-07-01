import Card from "./Card";

export default function ProfileCard({ user }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-civic-600 text-lg font-bold text-white">
          {user.avatar}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">{user.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user.department}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-civic-600 dark:text-civic-100">{user.role}</p>
        </div>
      </div>
    </Card>
  );
}
