import { useState } from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiShield, FiClock, FiActivity } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import NotificationPanel from "../components/NotificationPanel";
import { notifications } from "../data/dummyData";

const alertQueue = [
  { id: "ALT-001", child: "Sara Ali",    type: "High Risk",        detail: "Recurring health flags and low attendance require officer review.",       level: "high",   time: "10 min ago" },
  { id: "ALT-002", child: "Anaya Das",   type: "Medical Follow-up", detail: "Pediatric appointment due today. Welfare officer must verify completion.", level: "medium", time: "1 hr ago" },
  { id: "ALT-003", child: "Vihaan Sen",  type: "Attendance Drop",  detail: "Attendance fell below 80% threshold — possible welfare concern.",          level: "medium", time: "3 hr ago" },
  { id: "ALT-004", child: "General",     type: "Compliance Report", detail: "Monthly report submitted by all active homes. No critical flags.",         level: "low",    time: "Yesterday" },
];

const levelConfig = {
  high:   { badge: "badge-danger",  icon: FiAlertTriangle, bar: "bg-red-500",   label: "High" },
  medium: { badge: "badge-warning", icon: FiClock,         bar: "bg-amber-500", label: "Medium" },
  low:    { badge: "badge-success", icon: FiActivity,      bar: "bg-green-500", label: "Low" },
};

export default function Alerts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Safety", "Alerts"]} />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="page-title">AI Alert Review Queue</h1>
              <p className="page-subtitle">Prioritised child safety flags requiring officer validation and follow-up.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: "Total", value: alertQueue.length, color: "text-slate-700 dark:text-slate-200" },
              { label: "High",  value: alertQueue.filter(a => a.level === "high").length,   color: "text-red-600 dark:text-red-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-800">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Alert queue */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Alerts</h2>
          {alertQueue.map((alert, i) => {
            const cfg = levelConfig[alert.level];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`h-1 w-full ${cfg.bar}`} />
                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      alert.level === "high" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" :
                      alert.level === "medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                      "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                    }`}>
                      <Icon className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{alert.type}</p>
                        <span className={`badge ${cfg.badge}`}>{cfg.label} Priority</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-civic-700 dark:text-civic-400">{alert.child}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{alert.detail}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-xs text-slate-400">{alert.time}</p>
                    <Button icon={FiCheckCircle} onClick={() => setOpen(true)} className="shrink-0 text-xs">
                      Resolve
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <NotificationPanel items={notifications} />
      </div>

      {/* Resolution modal */}
      <Modal open={open} title="Resolve Alert" onClose={() => setOpen(false)}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Alert Marked as Resolved</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The alert has been marked as reviewed. In production, this would store officer notes, timestamps, and escalation status on the backend.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button icon={FiCheckCircle} onClick={() => setOpen(false)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
}
