import { FiBell, FiActivity, FiHeart, FiFileText, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import { classNames } from "../utils/formatters";

const typeIcon = {
  Review:  FiActivity,
  Health:  FiHeart,
  Report:  FiFileText,
  Alert:   FiAlertTriangle,
};

const typeTone = {
  Review: { bg: "bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400", dot: "bg-civic-500" },
  Health: { bg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",         dot: "bg-red-500" },
  Report: { bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", dot: "bg-emerald-500" },
  Alert:  { bg: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", dot: "bg-amber-500" },
};

export default function NotificationPanel({ items = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
            <FiBell className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {items.length}
          </span>
        </div>
        <button className="text-[11px] font-semibold text-civic-600 hover:underline dark:text-civic-400">
          Mark all read
        </button>
      </div>

      {/* Items */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.length === 0 ? (
          <div className="empty-state py-10">
            <div className="empty-state-icon"><FiBell className="h-6 w-6 text-slate-400" /></div>
            <p className="empty-state-title">No notifications</p>
            <p className="empty-state-desc">You're all caught up.</p>
          </div>
        ) : (
          items.map((item, i) => {
            const Icon  = typeIcon[item.type]  ?? FiBell;
            const tone  = typeTone[item.type]  ?? typeTone.Review;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 px-6 py-4 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
              >
                <div className={classNames("relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", tone.bg)}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className={classNames("absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-900", tone.dot)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-white">{item.title}</h3>
                    <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">{item.detail}</p>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
}
