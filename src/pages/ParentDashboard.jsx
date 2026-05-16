import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCalendar, FiBell, FiUser, FiHeart, FiCheckCircle,
  FiClock, FiShield, FiArrowRight, FiZap, FiActivity
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../context/AuthContext";
import { children, notifications } from "../data/dummyData";
import { classNames } from "../utils/formatters";

const childStatusCfg = {
  Stable:           { badge: "badge-success", color: "text-emerald-600 dark:text-emerald-400" },
  Observation:      { badge: "badge-warning",  color: "text-amber-600 dark:text-amber-400" },
  "Needs Review":   { badge: "badge-danger",   color: "text-red-600 dark:text-red-400" },
};

const quickLinks = [
  { label: "Visit Request",   to: "/parent/visit-request",   icon: FiCalendar, desc: "Schedule a visit",    color: "bg-civic-600",   ring: "ring-civic-500/20" },
  { label: "My Profile",      to: "/parent/profile",         icon: FiUser,     desc: "View & update info",  color: "bg-indigo-600",  ring: "ring-indigo-500/20" },
  { label: "Notifications",   to: "/parent/notifications",   icon: FiBell,     desc: "Alerts & updates",    color: "bg-amber-600",   ring: "ring-amber-500/20" },
];

const trustBadges = [
  { label: "KYC",         value: "Verified",  color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Face Match",  value: "99%",        color: "text-civic-600 dark:text-civic-400" },
  { label: "Trust Score", value: "95/100",     color: "text-indigo-600 dark:text-indigo-400" },
  { label: "Risk Level",  value: "Low",        color: "text-emerald-600 dark:text-emerald-400" },
];

const adoptionTimeline = [
  { step: "KYC Submitted",       done: true  },
  { step: "Identity Verified",   done: true  },
  { step: "Visit Request",       done: false, current: true },
  { step: "Visit Approved",      done: false },
  { step: "Adoption Proceeding", done: false },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function ParentDashboard() {
  const { user } = useAuth();
  const child = children[1];

  return (
    <div className="space-y-7">
      <Breadcrumb items={["Parent", "Dashboard"]} />

      {/* Welcome banner */}
      <motion.div {...fadeUp(0)} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-civic-600 shadow-md shadow-emerald-600/25 text-sm font-bold text-white">
              {user?.avatar}
            </div>
            <div>
              <p className="section-eyebrow">Parent Portal</p>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name?.split(" ")[0]} 👋
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
        <div className="section-card">
          <div className="section-card-header">
            <div className="flex items-center gap-2.5">
              <div className="section-card-icon bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <FiHeart className="h-3.5 w-3.5" />
              </div>
              <h2 className="section-card-title">Linked Child</h2>
            </div>
            <span className={classNames("badge", childStatusCfg[child.health]?.badge ?? "badge-neutral")}>{child.health}</span>
          </div>
          <div className="section-card-body">
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-sm font-bold">
                {child.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white">{child.name}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{child.orphanage} · Age {child.age}</p>
              </div>
              <Link to="/parent/profile" className="text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">View →</Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Attendance",  value: `${child.attendance}%` },
                { label: "Education",   value: child.educationLevel },
                { label: "Risk Level",  value: child.risk },
              ].map((info) => (
                <div key={info.label} className="field-block text-center">
                  <p className="field-label">{info.label}</p>
                  <p className="field-value mt-1">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adoption timeline */}
        <div className="section-card">
          <div className="section-card-header">
            <div className="flex items-center gap-2.5">
              <div className="section-card-icon bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
                <FiActivity className="h-3.5 w-3.5" />
              </div>
              <h2 className="section-card-title">Adoption Journey</h2>
            </div>
            <span className="badge badge-civic">Step 3 of 5</span>
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
