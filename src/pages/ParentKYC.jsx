import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield, FiUser, FiCalendar, FiCheckCircle, FiAlertCircle,
  FiClock, FiUpload, FiDownload, FiEye, FiEdit2, FiFileText,
  FiPhone, FiMail, FiHome, FiAlertTriangle, FiX, FiCheck,
  FiChevronDown, FiChevronUp, FiRefreshCw
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { parentKycData } from "../data/dummyData";
import { classNames } from "../utils/formatters";

/* ── Helpers ─────────────────────────────────────────────── */
function daysUntil(isoDate) {
  if (!isoDate) return null;
  return Math.ceil((new Date(isoDate) - new Date()) / 86400000);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function addMonths(isoDate, months) {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

/* ── Derived urgency for a due-date ─────────────────────── */
function urgencyFor(days) {
  if (days === null)      return { color: "text-slate-500",                  bg: "bg-slate-50 dark:bg-slate-800",              bar: "bg-slate-400",   label: "Unknown",   badge: "badge-neutral"  };
  if (days < 0)           return { color: "text-red-600 dark:text-red-400",   bg: "bg-red-50 dark:bg-red-500/10",               bar: "bg-red-500",     label: "Overdue",   badge: "badge-danger"   };
  if (days <= 14)         return { color: "text-red-600 dark:text-red-400",   bg: "bg-red-50 dark:bg-red-500/10",               bar: "bg-red-500",     label: "Urgent",    badge: "badge-danger"   };
  if (days <= 45)         return { color: "text-amber-600 dark:text-amber-400",bg: "bg-amber-50 dark:bg-amber-500/10",          bar: "bg-amber-500",   label: "Due Soon",  badge: "badge-warning"  };
  return                         { color: "text-green-600 dark:text-green-400",bg: "bg-green-50 dark:bg-green-500/10",          bar: "bg-green-500",   label: "On Track",  badge: "badge-success"  };
}

/* ── Status badge config ─────────────────────────────────── */
const statusCfg = {
  Verified:            { badge: "badge-success", icon: FiCheckCircle  },
  Approved:            { badge: "badge-success", icon: FiCheckCircle  },
  Submitted:           { badge: "badge-blue",    icon: FiFileText     },
  Pending:             { badge: "badge-warning", icon: FiClock        },
  Overdue:             { badge: "badge-danger",  icon: FiAlertCircle  },
  "Partially Compliant":{ badge: "badge-warning", icon: FiAlertTriangle},
  Compliant:           { badge: "badge-success", icon: FiCheckCircle  },
  "Non-Compliant":     { badge: "badge-danger",  icon: FiAlertCircle  },
};

function StatusBadge({ status }) {
  const cfg = statusCfg[status] ?? statusCfg["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={classNames("badge", cfg.badge)}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ── Shared field-block display ──────────────────────────── */
function InfoField({ label, value, accent = false, wide = false }) {
  return (
    <div className={classNames("field-block min-w-0", wide ? "sm:col-span-2" : "")}>
      <span className="field-label">{label}</span>
      <p className={classNames(
        "field-value mt-1.5 truncate",
        accent ? "font-bold text-civic-700 dark:text-civic-400" : ""
      )} title={value || "—"}>
        {value || "—"}
      </p>
    </div>
  );
}

/* ── Section wrapper (card with header) ─────────────────── */
function Section({ title, icon: Icon, iconBg = "bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400", action, children, collapsible = false }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div
        className={classNames(
          "flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800",
          collapsible ? "cursor-pointer select-none" : ""
        )}
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
      >
        <div className="flex items-center gap-2.5">
          <div className={classNames("flex h-7 w-7 items-center justify-center rounded-lg", iconBg)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
          {collapsible && (open
            ? <FiChevronUp className="h-4 w-4 text-slate-400" />
            : <FiChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {(!collapsible || open) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Shared input style ──────────────────────────────────── */
const INP = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-civic-500 focus:ring-2 focus:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LBL = "block text-[13px] font-semibold text-slate-700 dark:text-slate-300";

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function ParentKYC() {
  const kyc = parentKycData;

  /* modal state */
  const [kycOpen,    setKycOpen]    = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [docsOpen,   setDocsOpen]   = useState(false);
  const [ackOpen,    setAckOpen]    = useState(false);

  /* local mutable state for KYC status (demo toggle) */
  const [kycStatus,    setKycStatus]    = useState(kyc.kycStatus);
  const [reportStatus, setReportStatus] = useState(kyc.healthReportStatus);
  const [nextKycDue,   setNextKycDue]   = useState(kyc.nextKycDue);

  const kycDays    = daysUntil(nextKycDue);
  const reportDays = daysUntil(kyc.nextHealthReportDue);
  const kycUrg     = urgencyFor(kycDays);
  const reportUrg  = urgencyFor(reportDays);

  /* compliance derives from both statuses */
  const isCompliant = kycStatus === "Verified" && reportStatus === "Submitted";
  const complianceLabel  = isCompliant ? "Compliant" : kycDays < 0 || reportDays < 0 ? "Non-Compliant" : "Partially Compliant";

  /* submit KYC handler (demo) */
  function handleKycSubmit() {
    setKycStatus("Verified");
    setNextKycDue(addMonths(new Date().toISOString().slice(0, 10), 6));
    setKycOpen(false);
  }

  /* submit health report handler (demo) */
  function handleReportSubmit() {
    setReportStatus("Submitted");
    setReportOpen(false);
  }

  /* ── Summary cards config ───────────────────────────────── */
  const summaryCards = [
    {
      label: "Active Adoption",
      value: "Yes",
      accent: "border-l-civic-500",
      iconBg: "bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400",
      sub: `Child: ${kyc.childName}`
    },
    {
      label: "KYC Status",
      value: kycStatus,
      accent: kycStatus === "Verified" ? "border-l-green-500" : kycStatus === "Overdue" ? "border-l-red-500" : "border-l-amber-500",
      iconBg: kycStatus === "Verified" ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      sub: `Next due: ${formatDate(nextKycDue)}`
    },
    {
      label: "Next KYC Due",
      value: kycDays !== null ? `${Math.max(0, kycDays)} days` : "—",
      accent: kycUrg.bar === "bg-red-500" ? "border-l-red-500" : kycUrg.bar === "bg-amber-500" ? "border-l-amber-500" : "border-l-green-500",
      iconBg: kycUrg.bar === "bg-red-500" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : kycUrg.bar === "bg-amber-500" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
      sub: kycUrg.label
    },
    {
      label: "Health Report",
      value: reportStatus,
      accent: reportStatus === "Submitted" ? "border-l-green-500" : reportStatus === "Overdue" ? "border-l-red-500" : "border-l-amber-500",
      iconBg: reportStatus === "Submitted" ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      sub: `Due: ${formatDate(kyc.nextHealthReportDue)}`
    },
    {
      label: "Compliance",
      value: complianceLabel,
      accent: isCompliant ? "border-l-green-500" : complianceLabel === "Non-Compliant" ? "border-l-red-500" : "border-l-amber-500",
      iconBg: isCompliant ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      sub: isCompliant ? "All requirements met" : "Action required"
    },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Parent", "KYC Verification"]} />

      {/* ── Page header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="section-eyebrow">Post-Adoption Compliance</p>
              <h1 className="page-title">KYC Verification</h1>
              <p className="page-subtitle">
                KYC renewal every 6 months · Annual child health report · Mandatory until child turns 16
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button icon={FiRefreshCw} onClick={() => setKycOpen(true)}>Submit KYC</Button>
            <Button icon={FiUpload} variant="secondary" onClick={() => setReportOpen(true)}>Upload Health Report</Button>
            <Button icon={FiDownload} variant="secondary" onClick={() => setAckOpen(true)}>Download Acknowledgement</Button>
          </div>
        </div>
        {/* Policy notice strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-gray-100 bg-gray-50 px-6 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">
          {[
            { label: "KYC Frequency",        value: "Every 6 months" },
            { label: "Health Report",         value: "Once per year" },
            { label: "Mandatory Until",       value: "Child turns 16" },
            { label: "Years Remaining",        value: `${kyc.yearsUntil16} years` },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">{b.label}:</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{b.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Summary cards ─────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={classNames(
              "overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 border-l-4",
              card.accent
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="mt-1.5 text-base font-bold text-slate-900 dark:text-white truncate">{card.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">{card.sub}</p>
              </div>
              <div className={classNames("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", card.iconBg)}>
                <FiShield className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── KYC Overview card ─────────────────────────────────── */}
      <KycOverviewCard
        kyc={kyc}
        kycStatus={kycStatus}
        nextKycDue={nextKycDue}
        reportStatus={reportStatus}
        kycDays={kycDays}
        complianceLabel={complianceLabel}
        onSubmitKyc={() => setKycOpen(true)}
        onViewDocs={() => setDocsOpen(true)}
      />

      {/* ── Reminders & Alerts ────────────────────────────────── */}
      <RemindersPanel
        kycDays={kycDays}
        reportDays={reportDays}
        nextKycDue={nextKycDue}
        nextReportDue={kyc.nextHealthReportDue}
        kycUrg={kycUrg}
        reportUrg={reportUrg}
        onKyc={() => setKycOpen(true)}
        onReport={() => setReportOpen(true)}
      />

      {/* ── KYC Verification form ─────────────────────────────── */}
      <KycFormSection
        kyc={kyc}
        kycDays={kycDays}
        kycUrg={kycUrg}
        onSubmit={() => setKycOpen(true)}
      />

      {/* ── Annual Health Report ──────────────────────────────── */}
      <HealthReportSection
        kyc={kyc}
        reportStatus={reportStatus}
        reportDays={reportDays}
        reportUrg={reportUrg}
        onUpload={() => setReportOpen(true)}
      />

      {/* ── Verification History ──────────────────────────────── */}
      <VerificationHistory history={kyc.verificationHistory} onViewDocs={() => setDocsOpen(true)} />

      {/* ── Modals ────────────────────────────────────────────── */}
      <SubmitKycModal   open={kycOpen}    onClose={() => setKycOpen(false)}    onConfirm={handleKycSubmit} kyc={kyc} />
      <UploadReportModal open={reportOpen} onClose={() => setReportOpen(false)} onConfirm={handleReportSubmit} kyc={kyc} />
      <ViewDocsModal    open={docsOpen}   onClose={() => setDocsOpen(false)}   docs={kyc.documents} />
      <AckModal         open={ackOpen}    onClose={() => setAckOpen(false)}    kyc={kyc} kycStatus={kycStatus} reportStatus={reportStatus} complianceLabel={complianceLabel} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 1 — KYC Overview Card
═══════════════════════════════════════════════════════════ */
function KycOverviewCard({ kyc, kycStatus, nextKycDue, reportStatus, kycDays, complianceLabel, onSubmitKyc, onViewDocs }) {
  const kycUrg = urgencyFor(kycDays);
  const pct    = kycDays !== null ? Math.max(0, Math.min(100, Math.round((1 - kycDays / 180) * 100))) : 0;

  return (
    <Section
      title="Parent KYC Overview"
      icon={FiUser}
      iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
      action={
        <div className="flex gap-2">
          <Button icon={FiEye} variant="secondary" className="text-xs px-3 py-1.5" onClick={onViewDocs}>View Documents</Button>
          <Button icon={FiRefreshCw} className="text-xs px-3 py-1.5" onClick={onSubmitKyc}>Update KYC</Button>
        </div>
      }
    >
      <div className="p-5">
        {/* Top: avatar + identity */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-civic-600 text-2xl font-bold text-white shadow-sm">
              {kyc.parentAvatar}
            </div>
            <StatusBadge status={kycStatus} />
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoField label="Parent Name"    value={kyc.parentName} accent />
            <InfoField label="Parent ID"      value={kyc.parentId} />
            <InfoField label="Child Name"     value={kyc.childName} accent />
            <InfoField label="Child ID"       value={kyc.childId} />
            <InfoField label="Child Age"      value={`${kyc.childAge} years`} />
            <InfoField label="Adoption Date"  value={formatDate(kyc.adoptionDate)} />
            <InfoField label="Last KYC"       value={formatDate(kyc.lastKycDate)} />
            <InfoField label="Next KYC Due"   value={formatDate(nextKycDue)} />
            <InfoField label="Contact"        value={kyc.contactNumber} />
            <InfoField label="Email"          value={kyc.email} />
            <InfoField label="Health Report"  value={reportStatus} />
            <InfoField label="Compliance"     value={complianceLabel} />
          </div>
        </div>

        {/* KYC cycle progress */}
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiClock className={classNames("h-4 w-4", kycUrg.color)} />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">KYC Renewal Cycle</span>
              <span className={classNames("badge", kycUrg.badge)}>{kycUrg.label}</span>
            </div>
            <span className={classNames("text-xs font-bold", kycUrg.color)}>
              {kycDays !== null ? (kycDays < 0 ? `${Math.abs(kycDays)} days overdue` : `${kycDays} days remaining`) : "—"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <motion.div
              className={classNames("h-full rounded-full", kycUrg.bar)}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            {pct}% of 6-month cycle elapsed · Next renewal: {formatDate(nextKycDue)}
          </p>
        </div>
      </div>
    </Section>
  );
}
