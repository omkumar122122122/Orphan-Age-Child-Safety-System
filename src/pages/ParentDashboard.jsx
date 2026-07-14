import { motion } from "framer-motion";
import { FiCalendar, FiBell, FiUser, FiHeart, FiCheckCircle, FiClock } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Card from "../components/Card";
import NotificationPanel from "../components/NotificationPanel";
import Chatbot from "../components/Chatbot/Chatbot";
import { useAuth } from "../context/AuthContext";
import { children, notifications } from "../data/dummyData";

const childStatusColor = {
  Stable:       "badge-success",
  Observation:  "badge-warning",
  "Needs Review": "badge-danger",
};

const quickLinks = [
  { label: "Visit Request",   href: "/parent/visit-request",   icon: FiCalendar, desc: "Schedule a visit" },
  { label: "My Profile",      href: "/parent/profile",         icon: FiUser,     desc: "View & update info" },
  { label: "Notifications",   href: "/parent/notifications",   icon: FiBell,     desc: "Alerts & updates" },
];

const adoptionTimeline = [
  { step: "KYC Submitted",         done: true  },
  { step: "Identity Verified",     done: true  },
  { step: "Visit Request",         done: false, current: true },
  { step: "Visit Approved",        done: false },
  { step: "Adoption Proceeding",   done: false },
];

export default function ParentDashboard() {
  const { user } = useAuth();
  const child = children[1]; // linked child for demo

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Parent", "Dashboard"]} />

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="px-6 py-5">
          <p className="section-eyebrow">Parent Portal</p>
          <h1 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your adoption process, schedule visits, and stay updated on your child's welfare.
          </p>
        </div>

        {/* Trust badge strip */}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 bg-gray-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          {[
            { label: "KYC",        value: "Verified",   color: "text-green-600 dark:text-green-400" },
            { label: "Face Match", value: "99%",         color: "text-civic-600 dark:text-civic-400" },
            { label: "Trust Score",value: "95 / 100",    color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Risk Level", value: "Low",         color: "text-green-600 dark:text-green-400" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">{b.label}:</span>
              <span className={`text-xs font-bold ${b.color}`}>{b.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
              <link.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 dark:text-white">{link.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        {/* Linked child overview */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Linked Child Overview</h2>
            <FiHeart className="h-4 w-4 text-red-400" />
          </div>

          <div className="mt-4 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-sm font-bold">
              {child.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-white">{child.name}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{child.orphanage} · Age {child.age}</p>
            </div>
            <span className={`badge ${childStatusColor[child.health] ?? "badge-neutral"}`}>{child.health}</span>
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
        </Card>

        {/* Adoption timeline */}
        <Card>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Adoption Journey</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Track your progress through the adoption process.</p>

          <ol className="mt-5 space-y-3">
            {adoptionTimeline.map((step, i) => (
              <li key={step.step} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition
                  ${step.done    ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                  : step.current ? "bg-civic-600 text-white shadow-sm shadow-civic-600/25"
                  : "border border-gray-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800"}`}>
                  {step.done ? <FiCheckCircle className="h-4 w-4" /> : step.current ? <FiClock className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${
                  step.done    ? "text-slate-500 line-through dark:text-slate-500"
                  : step.current ? "text-slate-900 dark:text-white"
                  : "text-slate-400 dark:text-slate-500"
                }`}>{step.step}</span>
                {step.current && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-civic-600 dark:text-civic-400">In Progress</span>
                )}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Notifications */}
      <NotificationPanel items={notifications} />

      {/* AI Chatbot — fixed floating button + window */}
      <Chatbot parentId="PAR-2026-0148" childId={child.id} />
    </div>
  );
}
