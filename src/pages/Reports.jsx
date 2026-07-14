import { motion } from "framer-motion";
import {
  FiBarChart2, FiTrendingUp, FiTrendingDown, FiCheckSquare,
  FiAlertCircle, FiAward, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { DoughnutChartCard, LineChartCard } from "../components/ChartCard";
import { monthlySafety, riskDistribution } from "../data/dummyData";
import { classNames } from "../utils/formatters";

const safetyHighlights = [
  { label: "AI Safety Score",        value: "94%",   trend: "+2.1%", up: true,  tone: "blue"   },
  { label: "Compliance Rate",        value: "92%",   trend: "+3.4%", up: true,  tone: "green"  },
  { label: "Children at High Risk",  value: "8%",    trend: "-1.2%", up: false, tone: "amber"  },
  { label: "Avg Attendance",         value: "89.8%", trend: "+0.8%", up: true,  tone: "indigo" },
];

const complianceMetrics = [
  { label: "Submitted Forms",   value: "34/36", desc: "95% completion rate",     icon: FiCheckSquare, tone: "green" },
  { label: "Pending Reviews",   value: "4",     desc: "Require officer action",  icon: FiAlertCircle, tone: "amber" },
  { label: "Inspection Score",  value: "96%",   desc: "Above national benchmark",icon: FiAward,       tone: "blue"  },
];

const toneCfg = {
  blue:   { kpiBg: "bg-civic-50 dark:bg-civic-500/10",   kpiText: "text-civic-700 dark:text-civic-300",   kpiIcon: "bg-civic-100 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400",   bar: "bg-civic-500" },
  green:  { kpiBg: "bg-emerald-50 dark:bg-emerald-500/10",kpiText: "text-emerald-700 dark:text-emerald-300",kpiIcon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",bar: "bg-emerald-500" },
  amber:  { kpiBg: "bg-amber-50 dark:bg-amber-500/10",   kpiText: "text-amber-700 dark:text-amber-300",   kpiIcon: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",   bar: "bg-amber-500" },
  indigo: { kpiBg: "bg-indigo-50 dark:bg-indigo-500/10", kpiText: "text-indigo-700 dark:text-indigo-300", kpiIcon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",bar: "bg-indigo-500" },
};

const activityRows = [
  { activity: "Guardian Visits Verified",   count: 32, pct: 88 },
  { activity: "Health Checks Completed",    count: 76, pct: 95 },
  { activity: "Education Updates Filed",    count: 58, pct: 80 },
  { activity: "Safety Inspections Done",    count: 44, pct: 73 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay },
});

export default function Reports() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={["Orphanage", "Reports"]} />

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <FiBarChart2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="page-title">Reports &amp; Analytics</h1>
          <p className="page-subtitle">Welfare performance, risk distribution, and compliance summary.</p>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {safetyHighlights.map((kpi, i) => {
          const cfg = toneCfg[kpi.tone];
          return (
            <motion.div key={kpi.label} {...fadeUp(i * 0.05)}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={classNames("absolute inset-y-0 left-0 w-1 rounded-l-2xl", cfg.bar)} />
              <div className="pl-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{kpi.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{kpi.value}</p>
                <div className={classNames("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", kpi.up ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400")}>
                  {kpi.up ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
                  {kpi.trend}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <motion.div {...fadeUp(0.15)} className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <LineChartCard title="Monthly Welfare Report" subtitle="Safety and compliance trend across the year" data={monthlySafety} />
        <DoughnutChartCard title="Current Risk Profile" subtitle="AI-assessed distribution across children" data={riskDistribution} />
      </motion.div>

      {/* Compliance summary */}
      <motion.div {...fadeUp(0.2)} className="section-card">
        <div className="section-card-header">
          <div className="flex items-center gap-2.5">
            <div className="section-card-icon bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FiCheckSquare className="h-3.5 w-3.5" />
            </div>
            <h2 className="section-card-title">Compliance Summary</h2>
          </div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {complianceMetrics.map((m, i) => {
            const cfg = toneCfg[m.tone];
            return (
              <motion.div key={m.label} {...fadeUp(0.22 + i * 0.06)}
                className={classNames("flex items-start gap-4 rounded-xl p-4", cfg.kpiBg)}
              >
                <div className={classNames("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.kpiIcon)}>
                  <m.icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.label}</p>
                  <p className={classNames("mt-1 text-2xl font-bold tabular-nums", cfg.kpiText)}>{m.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Activity breakdown */}
      <motion.div {...fadeUp(0.25)} className="section-card">
        <div className="section-card-header">
          <div className="flex items-center gap-2.5">
            <div className="section-card-icon bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
              <FiBarChart2 className="h-3.5 w-3.5" />
            </div>
            <h2 className="section-card-title">Monthly Activity Breakdown</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activityRows.map((row) => (
            <div key={row.activity} className="flex items-center gap-4 px-5 py-4">
              <p className="w-56 shrink-0 text-sm font-medium text-slate-700 dark:text-slate-200">{row.activity}</p>
              <div className="flex flex-1 items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-civic-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">{row.pct}%</span>
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums text-slate-500">{row.count}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
