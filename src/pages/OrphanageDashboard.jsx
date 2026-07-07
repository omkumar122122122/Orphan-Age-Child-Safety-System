import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { LineChartCard } from "../components/ChartCard";
import DataTable from "../components/DataTable";
import { StatCard } from "../components/Card";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../context/AuthContext";
import { children, monthlySafety, notifications, stats } from "../data/dummyData";

const quickActions = [
  { label: "AI Attendance",    href: "/orphanage/ai-attendance",   icon: "📸", desc: "Face recognition check-in" },
  { label: "Visit Requests",   href: "/orphanage/visit-requests",  icon: "📅", desc: "Review parent visits" },
  { label: "Register Child",   href: "/orphanage/register-child",  icon: "➕", desc: "New child intake" },
  { label: "View Reports",     href: "/orphanage/reports",         icon: "📊", desc: "Safety & compliance" },
];

export default function OrphanageDashboard() {
  const { user } = useAuth();
  const myChildren = children.filter((c) => c.orphanage === user.department);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Orphanage", "Dashboard"]} />

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="section-eyebrow">Orphanage Operations Console</p>
            <h1 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
              {user?.department}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage attendance, welfare monitoring, and visit coordination for your care home.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-xl border border-civic-200 bg-civic-50 px-3 py-2 dark:border-civic-500/20 dark:bg-civic-500/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-civic-600 dark:text-civic-400">Children in Care</p>
              <p className="mt-0.5 text-xl font-bold text-civic-700 dark:text-civic-300">{myChildren.length}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 dark:border-green-500/20 dark:bg-green-500/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">AI Status</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-green-700 dark:text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Active
              </p>
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
              <span className="text-2xl leading-none">{a.icon}</span>
              <p className="mt-3 text-[13px] font-bold text-slate-900 dark:text-white">{a.label}</p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{a.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Chart */}
      <LineChartCard title="Care Home Safety Performance" data={monthlySafety} />

      {/* Children table + notifications */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Children in Your Care</h2>
            <a href="/orphanage/children" className="text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">View all →</a>
          </div>
          <DataTable
            columns={[
              { key: "id",     label: "Child ID" },
              { key: "name",   label: "Name" },
              { key: "age",    label: "Age" },
              { key: "risk",   label: "Risk" },
              { key: "health", label: "Health" },
            ]}
            rows={myChildren}
          />
        </div>
        <NotificationPanel items={notifications} />
      </div>
    </div>
  );
}
