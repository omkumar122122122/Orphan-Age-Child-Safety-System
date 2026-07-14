import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCalendar, FiBell, FiUser, FiHeart, FiCheckCircle,
  FiClock, FiShield, FiArrowRight, FiZap, FiActivity, FiAlertCircle
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../context/AuthContext";
import { notifications } from "../data/dummyData";
import { classNames } from "../utils/formatters";
import { parentsService } from "../services/parentsService";
import { useToast } from "../hooks/useToast";

const quickLinks = [
  { label: "Visit Request",   to: "/parent/visit-request",   icon: FiCalendar, desc: "Schedule a visit",    color: "bg-civic-600",   ring: "ring-civic-500/20" },
  { label: "My Profile",      to: "/parent/profile",         icon: FiUser,     desc: "View & update info",  color: "bg-indigo-600",  ring: "ring-indigo-500/20" },
  { label: "Notifications",   to: "/parent/notifications",   icon: FiBell,     desc: "Alerts & updates",    color: "bg-amber-600",   ring: "ring-amber-500/20" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function ParentDashboard() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await parentsService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      showError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-7">
        <Breadcrumb items={["Parent", "Dashboard"]} />
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-civic-200 border-t-civic-600" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="space-y-7">
        <Breadcrumb items={["Parent", "Dashboard"]} />
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">
          <FiAlertCircle className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Unable to load dashboard</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Extract data from dashboard
  const trustBadges = [
    { label: "KYC", value: dashboard.kycStatus || "Pending", color: dashboard.kycStatus === "APPROVED" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400" },
    { label: "Verification", value: dashboard.verificationStatus || "Pending", color: dashboard.verificationStatus === "APPROVED" ? "text-civic-600 dark:text-civic-400" : "text-amber-600 dark:text-amber-400" },
    { label: "Trust Score", value: `${dashboard.trustScore || 0}/100`, color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Profile", value: `${dashboard.profileCompletion || 0}% Complete`, color: "text-emerald-600 dark:text-emerald-400" },
  ];

  const adoptionTimeline = [
    { step: "Profile Created", done: true },
    { step: "KYC Submitted", done: dashboard.kycStatus !== "PENDING" },
    { step: "Identity Verified", done: dashboard.verificationStatus === "APPROVED", current: dashboard.verificationStatus === "IN_REVIEW" },
    { step: "Background Check", done: dashboard.policeVerificationStatus === "COMPLETED" },
    { step: "Adoption Process", done: false },
  ];

  return (
    <div className="space-y-7">
      <Breadcrumb items={["Parent", "Dashboard"]} />

      {/* Welcome banner */}
      <motion.div {...fadeUp(0)} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-civic-600 shadow-md shadow-emerald-600/25 text-sm font-bold text-white">
              {dashboard.parentName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P'}
            </div>
            <div>
              <p className="section-eyebrow">Parent Portal</p>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
                Welcome back, {dashboard.parentName?.split(" ")[0] || user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Track your adoption process and stay updated on your child's welfare.
              </p>
            </div>
          </div>
        </div>

        {/* Trust badge strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{b.label}:</span>
              <span className={`text-[11px] font-bold ${b.color}`}>{b.value}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
            <FiZap className="h-3 w-3 text-violet-500" />
            AI-verified profile
          </div>
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              to={link.to}
              className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${link.color} shadow-sm ring-2 ${link.ring} ring-offset-1`}>
                <Icon className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-900 dark:text-white">{link.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{link.desc}</p>
              </div>
              <FiArrowRight className="absolute right-4 h-3.5 w-3.5 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
            </Link>
          );
        })}
      </motion.div>

      <motion.div {...fadeUp(0.15)} className="grid gap-5 xl:grid-cols-2">
        {/* Linked child overview */}
        {dashboard.linkedChild && (
          <div className="section-card">
            <div className="section-card-header">
              <div className="flex items-center gap-2.5">
                <div className="section-card-icon bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <FiHeart className="h-3.5 w-3.5" />
                </div>
                <h2 className="section-card-title">Linked Child</h2>
              </div>
              <span className={classNames("badge", "badge-success")}>Linked</span>
            </div>
            <div className="section-card-body">
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-sm font-bold">
                  {dashboard.linkedChild.name?.split(" ").map((n) => n[0]).join("") || "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white">{dashboard.linkedChild.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {dashboard.linkedChild.orphanage || "N/A"} · Age {dashboard.linkedChild.age || "N/A"}
                  </p>
                </div>
                <Link to="/parent/profile" className="text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">View →</Link>
              </div>
            </div>
          </div>
        )}

        {/* Adoption timeline */}
        <div className="section-card">
          <div className="section-card-header">
            <div className="flex items-center gap-2.5">
              <div className="section-card-icon bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
                <FiActivity className="h-3.5 w-3.5" />
              </div>
              <h2 className="section-card-title">Adoption Journey</h2>
            </div>
            <span className="badge badge-civic">Step {dashboard.adoptionStep || 1} of 5</span>
          </div>
          <div className="section-card-body">
            <ol className="space-y-3">
              {adoptionTimeline.map((step, i) => (
                <li key={step.step} className="flex items-center gap-3">
                  <div className={classNames(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all",
                    step.done    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : step.current ? "bg-civic-600 text-white shadow-sm shadow-civic-600/30"
                    : "border border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                  )}>
                    {step.done ? <FiCheckCircle className="h-4 w-4" /> : step.current ? <FiClock className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={classNames(
                    "flex-1 text-sm font-medium",
                    step.done    ? "text-slate-400 line-through dark:text-slate-500"
                    : step.current ? "font-semibold text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                  )}>
                    {step.step}
                  </span>
                  {step.current && (
                    <span className="rounded-full bg-civic-50 px-2 py-0.5 text-[10px] font-bold text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
                      In Progress
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fadeUp(0.2)}>
        <NotificationPanel items={notifications} />
      </motion.div>
    </div>
  );
}
