import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle, FiCheckCircle, FiShield,
  FiClock, FiActivity, FiAlertCircle, FiCheck
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Modal from "../components/Modal";
import NotificationPanel from "../components/NotificationPanel";
import { notifications } from "../data/dummyData";
import { classNames } from "../utils/formatters";

const alertQueue = [
  { id: "ALT-001", child: "Sara Ali",    type: "High Risk",         detail: "Recurring health flags and low attendance require immediate officer review.",     level: "high",   time: "10 min ago", orphanage: "Sunrise Care Home" },
  { id: "ALT-002", child: "Anaya Das",   type: "Medical Follow-up", detail: "Pediatric appointment due today. Welfare officer must verify completion status.", level: "medium", time: "1 hr ago",   orphanage: "Hope Nest" },
  { id: "ALT-003", child: "Vihaan Sen",  type: "Attendance Drop",   detail: "Attendance fell below 80% threshold — possible welfare concern flagged by AI.",   level: "medium", time: "3 hr ago",   orphanage: "Sunrise Care Home" },
  { id: "ALT-004", child: "General",     type: "Compliance Report", detail: "Monthly report submitted by all active homes. No critical flags raised.",          level: "low",    time: "Yesterday",  orphanage: "All facilities" },
];

const levelConfig = {
  high:   { badge: "badge-danger",  icon: FiAlertTriangle, bar: "bg-red-500",     iconBg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",         label: "High",   priority: "Critical" },
  medium: { badge: "badge-warning", icon: FiClock,         bar: "bg-amber-500",   iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",   label: "Medium", priority: "Important" },
  low:    { badge: "badge-success", icon: FiActivity,      bar: "bg-emerald-500", iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", label: "Low", priority: "Info" },
};

export default function Alerts() {
  const [open, setOpen]       = useState(false);
  const [resolved, setResolved] = useState([]);

  const counts = {
    total:   alertQueue.length,
    high:    alertQueue.filter((a) => a.level === "high").length,
    medium:  alertQueue.filter((a) => a.level === "medium").length,
    pending: alertQueue.length - resolved.length,
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Safety", "Alerts"]} />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="section-eyebrow">AI Safety Engine</p>
              <h1 className="page-title">Alert Review Queue</h1>
              <p className="page-subtitle">Prioritised child safety flags requiring officer validation</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Total",   value: counts.total,   color: "text-slate-700 dark:text-slate-200" },
              { label: "High",    value: counts.high,    color: "text-red-600 dark:text-red-400" },
              { label: "Pending", value: counts.pending, color: "text-amber-600 dark:text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-center dark:border-slate-700 dark:bg-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                <p className={classNames("mt-0.5 text-xl font-bold tabular-nums", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Alerts</h2>

          {alertQueue.map((alert, i) => {
            const cfg    = levelConfig[alert.level];
            const Icon   = cfg.icon;
            const isDone = resolved.includes(alert.id);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={classNames(
                  "overflow-hidden rounded-2xl border bg-white shadow-card transition dark:bg-slate-900",
                  isDone ? "border-emerald-200/60 opacity-60 dark:border-emerald-500/20" : "border-slate-200/80 dark:border-slate-800"
                )}
              >
                <div className={classNames("h-1 w-full", isDone ? "bg-emerald-500" : cfg.bar)} />
                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3.5">
                    <div className={classNames("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.iconBg)}>
                      {isDone ? <FiCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> : <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{alert.type}</p>
                        <span className={classNames("badge", isDone ? "badge-success" : cfg.badge)}>
                          {isDone ? "Resolved" : cfg.priority}
                        </span>
                        <span className="badge badge-neutral text-[10px]">{alert.id}</span>
                      </div>
                      <p className="mt-1 text-[13px] font-semibold text-civic-600 dark:text-civic-400">{alert.child}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{alert.detail}</p>
                      <p className="mt-1.5 text-[11px] text-slate-400">{alert.orphanage} · {alert.time}</p>
                    </div>
                  </div>
                  {!isDone && (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        icon={FiCheckCircle}
                        size="sm"
                        onClick={() => { setResolved((v) => [...v, alert.id]); setOpen(true); }}
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <NotificationPanel items={notifications} />
      </div>

      {/* Resolution modal */}
      <Modal open={open} title="Alert Resolved" onClose={() => setOpen(false)}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Alert marked as resolved</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This alert has been reviewed and closed. Officer notes, timestamp, and resolution status have been recorded in the welfare system.
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
