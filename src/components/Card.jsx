import { motion } from "framer-motion";
import { classNames } from "../utils/formatters";

export default function Card({ children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={classNames("glass-panel rounded-xl p-5", className)}
    >
      {children}
    </motion.section>
  );
}

export function StatCard({ label, value, trend, icon: Icon, tone = "blue" }) {
  const toneMap = {
    blue: "bg-civic-100 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</h3>
          <p className="mt-2 text-xs font-semibold text-safety">{trend} this month</p>
        </div>
        <div className={classNames("rounded-lg p-3", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
