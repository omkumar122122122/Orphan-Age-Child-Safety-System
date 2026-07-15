import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCamera, FiCalendar, FiUserPlus, FiBarChart2, FiArrowRight, FiShield, FiUsers, FiHeart, FiActivity } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { LineChartCard } from "../components/ChartCard";
import DataTable from "../components/DataTable";
import { StatCard } from "../components/Card";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../context/AuthContext";
import { orphanagesService } from "../services/orphanagesService";
import { alertsService } from "../services/alertsService";

const quickActions = [
  { label: "AI Attendance",   to: "/orphanage/ai-attendance",  icon: FiCamera,   color: "bg-violet-600",  ring: "ring-violet-500/20",  desc: "Face recognition check-in" },
  { label: "Visit Requests",  to: "/orphanage/visit-requests", icon: FiCalendar, color: "bg-civic-600",   ring: "ring-civic-500/20",   desc: "Review parent visits" },
  { label: "Register Child",  to: "/orphanage/register-child", icon: FiUserPlus, color: "bg-emerald-600", ring: "ring-emerald-500/20", desc: "New child intake" },
  { label: "View Reports",    to: "/orphanage/reports",        icon: FiBarChart2,color: "bg-indigo-600",  ring: "ring-indigo-500/20",  desc: "Safety & compliance" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function OrphanageDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [children, setChildren] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [stats, childrenData, safetyChart, alertData] = await Promise.all([
        orphanagesService.getDashboardStats(),
        orphanagesService.getMyChildren(10),
        orphanagesService.getSafetyChart(),
        alertsService.getAll(),
      ]);
      setDashboardData(stats);
      setChildren(childrenData.data || []);
      setChartData(safetyChart);
      setAlerts((alertData.data || []).map((alert) => ({ id: alert.id, title: alert.title, detail: alert.detail, type: "Alert", time: new Date(alert.createdAt).toLocaleString('en-IN') })));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
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

  const inCare = dashboardData?.inCare || 0;
  const atRisk = dashboardData?.atRisk || 0;
  const aiStatus = dashboardData?.aiStatus || 'Active';

  const stats = [
    { label: "Registered Children", value: dashboardData?.registeredChildren || 0, icon: FiUsers, color: "blue", trend: "+12% this month" },
    { label: "Safe Zones Online", value: dashboardData?.safeZonesOnline || 0, icon: FiShield, color: "green", trend: "All monitored" },
    { label: "Active Orphanages", value: dashboardData?.activeOrphanages || 0, icon: FiHeart, color: "amber", trend: "System-wide" },
    { label: "Critical Alerts", value: dashboardData?.criticalAlerts || 0, icon: FiActivity, color: "red", trend: "Require attention" },
  ];

  return (
    <div className="space-y-7">
      <Breadcrumb items={["Orphanage", "Dashboard"]} />

      {/* Welcome banner */}
      <motion.div {...fadeUp(0)} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-600 to-indigo-600 shadow-md shadow-civic-600/25 text-xl font-bold text-white">
              {user?.avatar}
            </div>
            <div>
              <p className="section-eyebrow">Orphanage Operations Console</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{user?.department}</h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Manage attendance, welfare monitoring, and visit coordination
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-civic-200 bg-civic-50 px-4 py-2.5 dark:border-civic-500/20 dark:bg-civic-500/10">
              <FiUsers className="h-4 w-4 text-civic-600 dark:text-civic-400" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-civic-600 dark:text-civic-400">In Care</p>
                <p className="text-lg font-bold tabular-nums text-civic-700 dark:text-civic-300">{inCare}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <FiShield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">At Risk</p>
                <p className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-300">{atRisk}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">AI Status</p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{aiStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, i) => (
          <motion.div key={item.label} {...fadeUp(i * 0.05)}>
            <StatCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div {...fadeUp(0.15)}>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Quick Actions</h2>
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
                <FiArrowRight className="absolute right-4 top-4 h-3.5 w-3.5 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div {...fadeUp(0.2)}>
        <LineChartCard 
          title="Care Home Safety Performance" 
          subtitle="Monthly welfare and compliance trend" 
          data={chartData || { labels: [], datasets: [] }} 
        />
      </motion.div>

      {/* Children + notifications */}
      <motion.div {...fadeUp(0.25)} className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="section-card">
          <div className="section-card-header">
            <div className="flex items-center gap-2.5">
              <div className="section-card-icon bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
                <FiUsers className="h-3.5 w-3.5" />
              </div>
              <h2 className="section-card-title">Children in Your Care</h2>
              <span className="badge badge-civic">{children.length} children</span>
            </div>
            <Link to="/orphanage/children" className="flex items-center gap-1 text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">
              View all <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <DataTable
            columns={[
              { key: "childCode", label: "Child ID" },
              { key: "name",      label: "Name" },
              { key: "age",       label: "Age" },
              { key: "risk",      label: "Risk" },
              { key: "health",    label: "Health" },
            ]}
            rows={children}
          />
        </div>
        <NotificationPanel items={alerts} />
      </motion.div>
    </div>
  );
}
