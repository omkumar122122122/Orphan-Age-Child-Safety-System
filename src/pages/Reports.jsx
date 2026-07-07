import { motion } from "framer-motion";
import { FiBarChart2, FiTrendingUp, FiCheckSquare, FiAlertCircle, FiAward } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { DoughnutChartCard, LineChartCard } from "../components/ChartCard";
import { monthlySafety, riskDistribution } from "../data/dummyData";

const complianceMetrics = [
  { label: "Submitted Forms",    value: "34/36", desc: "95% completion rate",    icon: FiCheckSquare, color: "green" },
  { label: "Pending Reviews",    value: "4",     desc: "Require officer action",  icon: FiAlertCircle, color: "amber" },
  { label: "Inspection Score",   value: "96%",   desc: "Above national benchmark",icon: FiAward,       color: "blue"  },
];

const safetyHighlights = [
  { label: "AI Safety Score",       value: "94%",  trend: "+2.1%",  up: true  },
  { label: "Compliance Rate",       value: "92%",  trend: "+3.4%",  up: true  },
  { label: "Children at High Risk", value: "8%",   trend: "-1.2%",  up: false },
  { label: "Avg Attendance",        value: "89.8%",trend: "+0.8%",  up: true  },
];

const accentMap = {
  green: {
    bg:   "bg-green-50 dark:bg-green-500/10",
    icon: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    bar:  "bg-green-500",
    text: "text-green-700 dark:text-green-400",
  },
  amber: {
    bg:   "bg-amber-50 dark:bg-amber-500/10",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    bar:  "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  blue: {
    bg:   "bg-civic-50 dark:bg-civic-500/10",
    icon: "bg-civic-100 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400",
    bar:  "bg-civic-500",
    text: "text-civic-700 dark:text-civic-400",
  },
};

export default function Reports() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={["Orphanage", "Reports"]} />

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <FiBarChart2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Welfare performance, risk distribution, and compliance summary.</p>
        </div>
      </div>

      {/* KPI highlights */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {safetyHighlights.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
            <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${kpi.up ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
              <FiTrendingUp className={`h-3 w-3 ${kpi.up ? "" : "rotate-180"}`} />
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <LineChartCard title="Monthly Welfare Report" data={monthlySafety} />
        <DoughnutChartCard title="Current Risk Profile" data={riskDistribution} />
      </div>

      {/* Compliance summary */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiCheckSquare className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Compliance Summary</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {complianceMetrics.map((metric, i) => {
            const cfg = accentMap[metric.color];
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className={`flex items-start gap-4 rounded-xl border border-transparent p-4 ${cfg.bg}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.icon}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{metric.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${cfg.text}`}>{metric.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{metric.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Activity breakdown table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Activity Breakdown</h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {[
            { activity: "Guardian Visits Verified",  count: 32, pct: 88 },
            { activity: "Health Checks Completed",   count: 76, pct: 95 },
            { activity: "Education Updates Filed",   count: 58, pct: 80 },
            { activity: "Safety Inspections Done",   count: 44, pct: 73 },
          ].map((row) => (
            <div key={row.activity} className="flex items-center gap-4 px-5 py-3.5">
              <p className="min-w-[200px] text-sm font-medium text-slate-700 dark:text-slate-200">{row.activity}</p>
              <div className="flex flex-1 items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-civic-500 transition-all" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs font-bold text-slate-700 dark:text-slate-200">{row.pct}%</span>
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-bold text-slate-500 dark:text-slate-400">{row.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
