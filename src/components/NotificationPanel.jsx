import { FiBell, FiActivity, FiHeart, FiFileText } from "react-icons/fi";
import Card from "./Card";

const typeIcon = {
  Review:  FiActivity,
  Health:  FiHeart,
  Report:  FiFileText,
};

const typeTone = {
  Review: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Health: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Report: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
};

export default function NotificationPanel({ items }) {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h2>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
          <FiBell className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-3 divide-y divide-gray-50 dark:divide-slate-800">
        {items.map((item) => {
          const Icon = typeIcon[item.type] ?? FiBell;
          const tone = typeTone[item.type] ?? "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
          return (
            <article key={item.id} className="flex gap-3 px-5 py-3.5">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <span className="shrink-0 text-[11px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
