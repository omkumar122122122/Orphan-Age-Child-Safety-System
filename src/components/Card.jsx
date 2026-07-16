import { motion } from "framer-motion";
import { classNames } from "../utils/formatters";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
};

export default function Card({ children, className = "", hover = false, padding = true }) {
  return (
    <motion.section
      {...fadeUp}
      className={classNames(
        "rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        padding && "p-6",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

/* ── Accent colours ────────────────────────────────────── */
const toneConfig = {
  blue: {
    icon:  "bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400",
    bar:   "bg-civic-500",
    trend: "text-civic-600 dark:text-civic-400",
    glow:  "shadow-civic-500/10",
  },
  green: {
    icon:  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    bar:   "bg-emerald-500",
    trend: "text-emerald-600 dark:text-emerald-400",
    glow:  "shadow-emerald-500/10",
  },
  amber: {
    icon:  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    bar:   "bg-amber-500",
    trend: "text-amber-600 dark:text-amber-400",
    glow:  "shadow-amber-500/10",
  },
  red: {
    icon:  "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    bar:   "bg-red-500",
    trend: "text-red-600 dark:text-red-400",
    glow:  "shadow-red-500/10",
  },
  indigo: {
    icon:  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    bar:   "bg-indigo-500",
    trend: "text-indigo-600 dark:text-indigo-400",
    glow:  "shadow-indigo-500/10",
  },
  ai: {
    icon:  "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    bar:   "bg-violet-500",
    trend: "text-violet-600 dark:text-violet-400",
    glow:  "shadow-violet-500/10",
  },
};

export function StatCard({ label, value, trend, icon: Icon, tone = "blue" }) {
  const cfg = toneConfig[tone] ?? toneConfig.blue;
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={classNames(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900",
        "transition-shadow duration-200 hover:shadow-card-hover"
      )}
    >
      {/* Accent bar */}
      <div className={classNames("absolute inset-y-0 left-0 w-1 rounded-l-2xl", cfg.bar)} />

      {/* Subtle background glow */}
      <div className={classNames("absolute inset-0 opacity-[0.03] rounded-2xl", cfg.bar.replace("bg-", "bg-"))} />

      <div className="relative flex items-start justify-between gap-4 pl-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-2.5 text-[28px] font-bold tracking-tight tabular-nums text-slate-900 dark:text-white leading-none">{value}</p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className={classNames(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold",
              isPositive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : isNegative ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            )}>
              {trend}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">this month</span>
          </div>
        </div>
        <div className={classNames("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm", cfg.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}


