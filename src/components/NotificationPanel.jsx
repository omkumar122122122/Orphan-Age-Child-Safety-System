import { FiBell } from "react-icons/fi";
import Card from "./Card";

export default function NotificationPanel({ items }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">Notifications</h2>
        <FiBell className="h-5 w-5 text-civic-600 dark:text-civic-100" />
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
