import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { DoughnutChartCard, LineChartCard } from "../components/ChartCard";
import NotificationPanel from "../components/NotificationPanel";
import { StatCard } from "../components/Card";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import { children, monthlySafety, notifications, riskDistribution, stats } from "../data/dummyData";

const quickActions = [
  { label: "Register Child",      href: "/admin/register-child",      color: "bg-civic-600",   desc: "Add new intake record" },
  { label: "Register Orphanage",  href: "/admin/register-orphanage",  color: "bg-indigo-600",  desc: "Onboard new care home" },
  { label: "View Orphanages",     href: "/admin/orphanages",          color: "bg-accent-600",  desc: "Monitor all facilities" },
  { label: "Review Alerts",       href: "/admin/alerts",              color: "bg-red-600",     desc: "Safety flags pending" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Dashboard"]} />

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="section-eyebrow">Government Child Welfare Directorate</p>
            <h1 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Here's an overview of the national child safety monitoring system.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 dark:border-green-500/20 dark:bg-green-500/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">System</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-green-700 dark:text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Operational
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-500/20 dark:bg-amber-500/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">AI Model</p>
              <p className="mt-0.5 text-sm font-bold text-amber-700 dark:text-amber-300">Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="group rounded-xl border border-gray-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.color} shadow-sm`}>
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="mt-3 text-[13px] font-bold text-slate-900 dark:text-white">{a.label}</p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{a.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <LineChartCard title="Monthly Safety & Compliance Score" data={monthlySafety} />
        <DoughnutChartCard title="AI Risk Distribution" data={riskDistribution} />
      </div>

      {/* Recent children + notifications */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Child Records</h2>
            <a href="/admin/children" className="text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">View all →</a>
          </div>
          <DataTable
            columns={[
              { key: "id",        label: "Child ID" },
              { key: "name",      label: "Name" },
              { key: "orphanage", label: "Orphanage" },
              { key: "risk",      label: "Risk" },
              { key: "attendance",label: "Attendance" },
            ]}
            rows={children.slice(0, 4)}
          />
        </div>
        <NotificationPanel items={notifications} />
      </div>
    </div>
  );
}
