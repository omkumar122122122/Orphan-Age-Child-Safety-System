import { motion } from "framer-motion";
import { classNames } from "../utils/formatters";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22 }
};

export default function Card({ children, className = "" }) {
  return (
    <motion.section
      {...fadeUp}
      className={classNames(
        "rounded-2xl border border-gray-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

/* ── Accent colours for StatCard ─────────────────────── */
const toneConfig = {
  blue: {
    icon:   "bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400",
    bar:    "bg-civic-500",
    trend:  "text-civic-600 dark:text-civic-400",
  },
  green: {
    icon:   "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    bar:    "bg-green-500",
    trend:  "text-green-600 dark:text-green-400",
  },
  amber: {
    icon:   "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    bar:    "bg-amber-500",
    trend:  "text-amber-600 dark:text-amber-400",
  },
  red: {
    icon:   "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    bar:    "bg-red-500",
    trend:  "text-red-600 dark:text-red-400",
  },
};

export function StatCard({ label, value, trend, icon: Icon, tone = "blue" }) {
  const cfg = toneConfig[tone] ?? toneConfig.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(15,23,42,0.10)" }}
      className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Coloured left accent bar */}
      <div className={classNames("absolute inset-y-0 left-0 w-1 rounded-l-2xl", cfg.bar)} />

      <div className="flex items-start justify-between gap-4 pl-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          <p className={classNames("mt-2 text-xs font-semibold", cfg.trend)}>
            {trend} this month
          </p>
        </div>
        <div className={classNames("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", cfg.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
