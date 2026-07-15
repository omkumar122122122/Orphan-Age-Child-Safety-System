import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCalendar, FiBell, FiUser, FiHeart, FiCheckCircle,
  FiClock, FiArrowRight, FiZap, FiActivity
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../context/AuthContext";
import { parentsService } from "../services/parentsService";
import { alertsService } from "../services/alertsService";
import { classNames } from "../utils/formatters";

/* ── Linked child for the demo parent (Meera Nair → Anaya Das) */
let linkedChild = null;

/* ── Quick navigation links */
const quickLinks = [
  { label: "Visit Request",  to: "/parent/visit-request", icon: FiCalendar, desc: "Schedule a visit",   color: "bg-civic-600",  ring: "ring-civic-500/20"  },
  { label: "My Profile",     to: "/parent/profile",       icon: FiUser,     desc: "View & update info", color: "bg-indigo-600", ring: "ring-indigo-500/20" },
  { label: "Notifications",  to: "/parent/notifications", icon: FiBell,     desc: "Alerts & updates",   color: "bg-amber-600",  ring: "ring-amber-500/20"  },
];

/* ── Framer Motion stagger helper */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 10 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ── Adoption journey steps (derived from dummy data) ──────── */
let adoptionTimeline = [];

/* ── Trust badge strip */
const trustBadges = [
  { label: "KYC",         value: "Verified",  color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Face Match",  value: "99%",        color: "text-civic-600 dark:text-civic-400"    },
  { label: "Trust Score", value: "95 / 100",   color: "text-indigo-600 dark:text-indigo-400"  },
  { label: "Risk Level",  value: "Low",        color: "text-emerald-600 dark:text-emerald-400" },
];

const childStatusColor = {
  Stable:         "badge-success",
  Observation:    "badge-warning",
  "Needs Review": "badge-danger",
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const [, setDashboardVersion] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load parent dashboard data and live alerts in parallel
    Promise.allSettled([
      parentsService.getDashboard(),
      alertsService.getAll(),
    ]).then(([dashResult, alertResult]) => {
      if (dashResult.status === 'fulfilled') {
        const dashboard = dashResult.value;
        linkedChild = dashboard.linkedChild ? {
          ...dashboard.linkedChild,
          orphanage: dashboard.linkedChild.orphanageName,
          health: dashboard.linkedChild.healthStatus,
          attendance: '—', educationLevel: 'Not provided', risk: 'Not available',
        } : null;
        adoptionTimeline = (dashboard.adoptionJourney?.steps || []).map((step) => ({ step: step.name, done: step.completed, current: step.isCurrent }));
      }

      if (alertResult.status === 'fulfilled') {
        const result = alertResult.value;
        setNotifications(
          (result?.data || []).slice(0, 10).map((a) => ({
            id: a.id,
            title: a.title,
            detail: a.detail,
            type: 'Alert',
            time: new Date(a.createdAt).toLocaleString('en-IN'),
          }))
        );
      }

      setDashboardVersion((v) => v + 1);
    }).catch(() => {
      linkedChild = null;
      adoptionTimeline = [];
      setDashboardVersion((v) => v + 1);
    });
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Parent", "Dashboard"]} />

      {/* Welcome banner */}
      <motion.div
        {...fadeUp(0)}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-civic-600 text-sm font-bold text-white shadow-md shadow-emerald-600/25">
              {user?.avatar ?? "MN"}
            </div>
            <div>
              <p className="section-eyebrow">Parent Portal</p>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name?.split(" ")[0] ?? "Parent"} 👋
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Track your adoption process and stay updated on your child's welfare.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 bg-gray-50/60 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{b.label}:</span>
              <span className={classNames("text-[11px] font-bold", b.color)}>{b.value}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
            <FiZap className="h-3 w-3 text-violet-500" />
            AI-verified profile
          </div>
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div {...fadeUp(0.05)} className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              to={link.to}
              className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={classNames(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-2 ring-offset-1",
                link.color, link.ring
              )}>
                <Icon className="h-[18px] w-[18px] text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-900 dark:text-white">{link.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{link.desc}</p>
              </div>
              <FiArrowRight className="absolute right-4 h-3.5 w-3.5 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
            </Link>
          );
        })}
      </motion.div>

      {/* Linked child + Adoption journey */}
      <motion.div {...fadeUp(0.1)} className="grid gap-5 xl:grid-cols-2">

        {/* Linked child */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <FiHeart className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Linked Child Overview</h2>
            </div>
            <span className="badge badge-success">{linkedChild ? 'Linked' : 'Not linked'}</span>
          </div>
          <div className="p-5">
            {/* Child avatar row */}
            {linkedChild ? <div className="mb-4 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                {linkedChild.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white">{linkedChild.name}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {linkedChild.orphanage} · Age {linkedChild.age}
                </p>
              </div>
              <span className={classNames("badge", childStatusColor[linkedChild.health] ?? "badge-neutral")}>
                {linkedChild.health}
              </span>
            </div> : <p className="text-sm text-slate-500 dark:text-slate-400">Your adopted child will appear here once the adoption is approved.</p>}
            {/* Stats grid */}
            {linkedChild && <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Attendance",  value: `${linkedChild.attendance}%` },
                { label: "Education",   value: linkedChild.educationLevel    },
                { label: "Risk Level",  value: linkedChild.risk              },
              ].map((info) => (
                <div key={info.label} className="field-block text-center">
                  <p className="field-label">{info.label}</p>
                  <p className="field-value mt-1">{info.value}</p>
                </div>
              ))}
            </div>}
          </div>
        </div>

        {/* Adoption journey */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-slate-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
              <FiActivity className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Adoption Journey</h2>
          </div>
          <div className="p-5">
            <ol className="space-y-3">
              {adoptionTimeline.map((step, i) => (
                <li key={step.step} className="flex items-center gap-3">
                  <div className={classNames(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                    step.done      ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                    : step.current ? "bg-civic-600 text-white shadow-sm shadow-civic-600/25"
                    : "border border-gray-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                  )}>
                    {step.done ? <FiCheckCircle className="h-4 w-4" /> : step.current ? <FiClock className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={classNames(
                    "flex-1 text-sm font-medium",
                    step.done      ? "text-slate-400 line-through dark:text-slate-500"
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
      <motion.div {...fadeUp(0.15)}>
        <NotificationPanel />
      </motion.div>

      {/* ── Sahayak AI — inline chat section ─────────────────── */}
      <motion.div {...fadeUp(0.2)}>
        <SahayakAI parentId={user?.parentId} childId={linkedChild?.id} />
      </motion.div>

      {/* ── Floating chat button (always visible) ────────────── */}
      <Chatbot parentId={user?.parentId} childId={linkedChild?.id} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SAHAYAK AI — Full-width inline chat card
   Collapsible section on the Parent Dashboard.
   Shares the same useChat hook + ChatWindow as the floating bot,
   so both have independent conversation histories.
═══════════════════════════════════════════════════════════ */
function SahayakAI({ parentId, childId }) {
  const [expanded, setExpanded] = useState(false);
  const { messages, isLoading, error, send, retry, clearConversation } = useChat({ parentId, childId });

  const capabilities = [
    { icon: "🩺", label: "Health Reports"  },
    { icon: "💉", label: "Vaccinations"    },
    { icon: "🔐", label: "KYC Status"      },
    { icon: "📅", label: "Appointments"    },
    { icon: "🚨", label: "Emergency"       },
    { icon: "📜", label: "Adoption Policy" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">

      {/* ── Collapsible header ──────────────────────────────── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50/60 dark:hover:bg-slate-800/40"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          {/* Gradient icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-civic-600 to-indigo-600 shadow-sm shadow-civic-600/25">
            <FiCpu className="h-4 w-4 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sahayak AI</h2>
              {/* Online badge */}
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 ring-1 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Online
              </span>
              {/* Gemini badge */}
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                Gemini AI
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Your AI welfare assistant — health, KYC, vaccination &amp; adoption guidance
            </p>
          </div>
        </div>

        {/* Right side: message count + chevron */}
        <div className="flex shrink-0 items-center gap-2.5">
          {messages.length > 0 && (
            <span className="rounded-full bg-civic-50 px-2 py-0.5 text-[11px] font-bold text-civic-700 dark:bg-civic-500/10 dark:text-civic-300">
              {messages.length} {messages.length === 1 ? "msg" : "msgs"}
            </span>
          )}
          <div className={classNames(
            "flex h-7 w-7 items-center justify-center rounded-lg border transition",
            expanded
              ? "border-civic-200 bg-civic-50 text-civic-600 dark:border-civic-500/30 dark:bg-civic-500/10 dark:text-civic-400"
              : "border-gray-200 bg-gray-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800"
          )}>
            <FiMessageSquare className="h-3.5 w-3.5" />
          </div>
        </div>
      </button>

      {/* ── Expanded body ───────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="sahayak-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Capability chips strip */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
              {capabilities.map((cap) => (
                <span
                  key={cap.label}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {cap.icon} {cap.label}
                </span>
              ))}

              {/* Clear button at end of chips row */}
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearConversation(); }}
                  className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-gray-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <FiTrash2 className="h-3 w-3" /> Clear chat
                </button>
              )}
            </div>

            {/* Inline ChatWindow — no header, no floating wrapper */}
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSend={send}
              onRetry={retry}
              onClear={clearConversation}
              onClose={() => setExpanded(false)}
              inline
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
