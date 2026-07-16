import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiUserPlus, FiHome, FiShield, FiAlertTriangle,
  FiArrowRight, FiTrendingUp, FiZap, FiActivity,
  FiUsers,
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { DoughnutChartCard, LineChartCard } from "../components/ChartCard";
import NotificationPanel from "../components/NotificationPanel";
import { StatCard } from "../components/Card";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import dashboardService from "../services/dashboardService";
import { alertsService } from "../services/alertsService";

const quickActions = [
  { label: "Register Child",      to: "/admin/register-child",     icon: FiUserPlus,     color: "bg-civic-600",   ring: "ring-civic-500/20",   desc: "New child intake" },
  { label: "Register Orphanage",  to: "/admin/register-orphanage", icon: FiHome,         color: "bg-indigo-600",  ring: "ring-indigo-500/20",  desc: "Onboard care home" },
  { label: "View Orphanages",     to: "/admin/orphanages",         icon: FiShield,       color: "bg-violet-600",  ring: "ring-violet-500/20",  desc: "Monitor facilities" },
  { label: "Review Alerts",       to: "/admin/alerts",             icon: FiAlertTriangle,color: "bg-red-600",     ring: "ring-red-500/20",     desc: "Safety flags pending" },
];

const iconMap = {
  'AI Safety Score': FiShield,
  'Compliance Rate': FiActivity,
  'Risk-flagged Children': FiAlertTriangle,
  'Avg Attendance': FiTrendingUp,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [recentChildren, setRecentChildren] = useState([]);
  const [alertStats, setAlertStats] = useState({ total: 0, high: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [statsResponse, chartsResponse, childrenResponse, alertsResponse] = await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getAdminCharts(),
        dashboardService.getAdminRecentChildren(),
        alertsService.getAll({ limit: 1 }).catch(() => ({ stats: { total: 0, high: 0, pending: 0 } })),
      ]);

      setDashboardData(statsResponse.data);
      setChartsData(chartsResponse.data);
      setRecentChildren(childrenResponse.data.children || []);

      // Extract alert stats from the alerts API response
      // alertsService.getAll() returns { data: [...], stats: { total, high, pending } }
      const alertStatsData = alertsResponse?.stats || { total: 0, high: 0, pending: 0 };
      setAlertStats(alertStatsData);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const aiInsights = dashboardData?.aiInsights || [];
  const stats = dashboardData?.stats || [];
  const systemStatus = dashboardData?.systemStatus || 'Unknown';
  const aiModelStatus = dashboardData?.aiModelStatus || 'Unknown';
  const monthlySafety = chartsData?.monthlySafety || { labels: [], datasets: [] };
  const riskDistribution = chartsData?.riskDistribution || { labels: [], datasets: [] };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Dashboard"]} />

      {/* ── Welcome banner ─────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-600 to-indigo-600 shadow-md shadow-civic-600/25">
              <FiShield className="h-5.5 w-5.5 text-white" style={{ height: 22, width: 22 }} />
            </div>
            <div>
              <p className="section-eyebrow">Government Child Welfare Directorate</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.firstName ?? user?.name?.split(" ")[0] ?? "Admin"} 👋
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                National child safety monitoring · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">System</p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{systemStatus}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 dark:border-violet-500/20 dark:bg-violet-500/10">
              <FiZap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">AI Model</p>
                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{aiModelStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight strip */}
        <div className="grid divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0 dark:divide-slate-800 dark:border-slate-800">
          {aiInsights.map((kpi) => {
            const Icon = iconMap[kpi.label] || FiActivity;
            const colorMap = {
              'AI Safety Score': { color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10" },
              'Compliance Rate': { color: "text-civic-600 dark:text-civic-400", bg: "bg-civic-50 dark:bg-civic-500/10" },
              'Risk-flagged Children': { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
              'Avg Attendance': { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            };
            const colors = colorMap[kpi.label] || { color: "text-slate-600", bg: "bg-slate-50" };
            
            return (
              <div key={kpi.label} className="flex items-center gap-3 px-5 py-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${colors.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{kpi.value}</p>
                    <FiTrendingUp className={`h-3 w-3 ${kpi.up ? "text-emerald-500" : "text-red-500 rotate-180"}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Stat cards (live data) ─────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, i) => (
          <motion.div key={item.label} {...fadeUp(i * 0.05)}>
            <StatCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* ── Quick actions ───────────────────────────────── */}
      <motion.div {...fadeUp(0.15)}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                to={a.to}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.color} shadow-sm ring-2 ${a.ring} ring-offset-1`}>
                  <Icon className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
                </div>
                <p className="mt-3 text-[13px] font-bold text-slate-900 dark:text-white">{a.label}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{a.desc}</p>
                {/* Live critical-alert badge on the "Review Alerts" card */}
                {a.label === "Review Alerts" && alertStats.pending > 0 && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {alertStats.pending > 9 ? "9+" : alertStats.pending}
                  </span>
                )}
                <FiArrowRight className="absolute right-4 top-4 h-3.5 w-3.5 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── Charts ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.2)} className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <LineChartCard title="Monthly Safety & Compliance Score" subtitle="12-month welfare performance trend" data={monthlySafety} />
        <DoughnutChartCard title="AI Risk Distribution" subtitle="Current risk profile across children" data={riskDistribution} />
      </motion.div>

      {/* ── Recent children + live alert notifications ── */}
      <motion.div {...fadeUp(0.25)} className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="section-card">
          <div className="section-card-header">
            <div className="flex items-center gap-2.5">
              <div className="section-card-icon bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
                <FiActivity className="h-3.5 w-3.5" />
              </div>
              <h2 className="section-card-title">Recent Child Records</h2>
              <span className="badge badge-neutral">{recentChildren.length} recent</span>
            </div>
            <Link to="/admin/children" className="flex items-center gap-1 text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">
              View all <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <DataTable
            columns={[
              { key: "id",         label: "Child ID" },
              { key: "name",       label: "Name" },
              { key: "orphanage",  label: "Orphanage" },
              { key: "risk",       label: "Risk" },
              { key: "attendance", label: "Attendance" },
            ]}
            rows={recentChildren}
          />
        </div>
        <NotificationPanel />
      </motion.div>
    </div>
  );
}