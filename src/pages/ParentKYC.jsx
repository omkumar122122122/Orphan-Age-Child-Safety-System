import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield, FiUser, FiCalendar, FiCheckCircle, FiAlertCircle,
  FiClock, FiUpload, FiDownload, FiEye, FiEdit2, FiFileText,
  FiPhone, FiMail, FiHome, FiAlertTriangle, FiX, FiCheck,
  FiChevronDown, FiChevronUp, FiRefreshCw, FiLoader
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { classNames } from "../utils/formatters";
import { parentsService } from "../services/parentsService";
import { useAuth } from "../context/AuthContext";

/* ── Helpers ─────────────────────────────────────────────── */
function daysUntil(isoDate) {
  if (!isoDate) return null;
  return Math.ceil((new Date(isoDate) - new Date()) / 86400000);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
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
  APPROVED:            { badge: "badge-success", icon: FiCheckCircle  },
  Submitted:           { badge: "badge-blue",    icon: FiFileText     },
  SUBMITTED:           { badge: "badge-blue",    icon: FiFileText     },
  Pending:             { badge: "badge-warning", icon: FiClock        },
  PENDING:             { badge: "badge-warning", icon: FiClock        },
  Overdue:             { badge: "badge-danger",  icon: FiAlertCircle  },
  "Partially Compliant":{ badge: "badge-warning", icon: FiAlertTriangle},
  Compliant:           { badge: "badge-success", icon: FiCheckCircle  },
  "Non-Compliant":     { badge: "badge-danger",  icon: FiAlertCircle  },
  REJECTED:            { badge: "badge-danger",  icon: FiX            },
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
      )} title={String(value || "—")}>
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

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
 ═══════════════════════════════════════════════════════════ */
export default function ParentKYC() {
  const { user } = useAuth();
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* modal state */
  const [kycOpen,    setKycOpen]    = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [docsOpen,   setDocsOpen]   = useState(false);
  const [ackOpen,    setAckOpen]    = useState(false);

  useEffect(() => {
    loadKycStatus();
  }, []);

  async function loadKycStatus() {
    setLoading(true);
    try {
      const data = await parentsService.getKycStatus();
      setKyc(data);
    } catch (err) {
      setError(err?.message || "Failed to load KYC status");
    } finally {
      setLoading(false);
    }
  }

  async function handleKycSubmit(notes) {
    try {
      await parentsService.submitKyc(notes);
      await loadKycStatus();
      setKycOpen(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleFileUpload(type, file, docNumber) {
    try {
      await parentsService.uploadDocument(kyc.parentId, type, file, docNumber);
      await loadKycStatus();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <FiLoader className="h-8 w-8 animate-spin text-civic-600" />
    </div>
  );

  if (error) return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
      <FiAlertCircle className="mx-auto mb-3 h-12 w-12" />
      <h2 className="text-lg font-bold">Error Loading KYC</h2>
      <p className="mt-1">{error}</p>
      <Button className="mt-4" onClick={loadKycStatus}>Retry</Button>
    </div>
  );

  const kycDays    = daysUntil(kyc.nextKycDue);
  const reportDays = daysUntil(kyc.nextHealthReportDue);
  const kycUrg     = urgencyFor(kycDays);
  const reportUrg  = urgencyFor(reportDays);

  const summaryCards = [
    { label: "KYC Status", value: kyc.kycStatus, sub: `Next due: ${formatDate(kyc.nextKycDue)}`, accent: "border-l-civic-500", iconBg: "bg-civic-50 text-civic-600" },
    { label: "Compliance", value: kyc.complianceStatus, sub: kyc.complianceStatus === 'Compliant' ? 'All clear' : 'Action needed', accent: kyc.complianceStatus === 'Compliant' ? "border-l-green-500" : "border-l-amber-500", iconBg: "bg-amber-50 text-amber-600" },
    { label: "Child Linked", value: kyc.childName || 'No', sub: kyc.childId || 'N/A', accent: "border-l-indigo-500", iconBg: "bg-indigo-50 text-indigo-600" },
    { label: "Years Remaining", value: `${kyc.yearsUntil16} yrs`, sub: 'Until child turns 16', accent: "border-l-emerald-500", iconBg: "bg-emerald-50 text-emerald-600" },
    { label: "Trust Score", value: `${kyc.trustScore}/100`, sub: kyc.trustScore >= 70 ? 'High trust' : 'Needs improvement', accent: "border-l-violet-500", iconBg: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Parent", "KYC Verification"]} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="section-eyebrow">Post-Adoption Compliance</p>
              <h1 className="page-title">KYC Verification</h1>
              <p className="page-subtitle">KYC renewal every 6 months · Mandatory until child turns 16</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button icon={FiRefreshCw} onClick={() => setKycOpen(true)} disabled={kyc.kycStatus === 'APPROVED'}>Submit KYC</Button>
            <Button icon={FiUpload} variant="secondary" onClick={() => setReportOpen(true)}>Upload Report</Button>
            <Button icon={FiDownload} variant="secondary" onClick={() => setAckOpen(true)}>Acknowledgement</Button>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card, i) => (
          <div key={i} className={classNames("rounded-2xl border border-gray-100 bg-white p-5 shadow-sm border-l-4 dark:bg-slate-900 dark:border-slate-800", card.accent)}>
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">{card.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{card.value}</p>
                <p className="text-[11px] text-slate-400">{card.sub}</p>
              </div>
              <div className={classNames("h-8 w-8 rounded-lg flex items-center justify-center", card.iconBg)}>
                <FiCheckCircle className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <KycOverviewCard kyc={kyc} kycStatus={kyc.kycStatus} nextKycDue={kyc.nextKycDue} reportStatus={kyc.healthReportStatus} kycDays={kycDays} complianceLabel={kyc.complianceStatus} onSubmitKyc={() => setKycOpen(true)} onViewDocs={() => setDocsOpen(true)} />
          <KycFormSection kyc={kyc} onUpload={handleFileUpload} />
          <VerificationHistory history={kyc.verificationHistory} />
        </div>
        <div className="space-y-6">
          <RemindersPanel kycDays={kycDays} reportDays={reportDays} kycUrg={kycUrg} reportUrg={reportUrg} />
          <HealthReportSection kyc={kyc} reportStatus={kyc.healthReportStatus} reportDays={reportDays} />
        </div>
      </div>

      {/* Modals */}
      <SubmitKycModal open={kycOpen} onClose={() => setKycOpen(false)} onConfirm={handleKycSubmit} />
      <ViewDocsModal open={docsOpen} onClose={() => setDocsOpen(false)} docs={kyc.documents} />
      {/* simplified modals for this iteration */}
    </div>
  );
}

function KycOverviewCard({ kyc, kycStatus, nextKycDue, reportStatus, kycDays, complianceLabel, onSubmitKyc, onViewDocs }) {
  const kycUrg = urgencyFor(kycDays);
  const pct    = kycDays !== null ? Math.max(0, Math.min(100, Math.round((1 - kycDays / 180) * 100))) : 0;

  return (
    <Section title="Parent KYC Overview" icon={FiUser} action={<Button icon={FiEye} variant="secondary" size="sm" onClick={onViewDocs}>Docs</Button>}>
      <div className="p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-civic-600 text-2xl font-bold text-white">
              {kyc.parentAvatar || 'P'}
            </div>
            <StatusBadge status={kycStatus} />
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoField label="Parent Name"    value={kyc.parentName} accent />
            <InfoField label="Parent ID"      value={kyc.parentId} />
            <InfoField label="Child Name"     value={kyc.childName} accent />
            <InfoField label="Child ID"       value={kyc.childId} />
            <InfoField label="Last KYC"       value={formatDate(kyc.lastKycDate)} />
            <InfoField label="Next KYC Due"   value={formatDate(nextKycDue)} />
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="flex justify-between text-xs font-bold mb-2">
             <span>Renewal Cycle</span>
             <span className={kycUrg.color}>{kycDays} days remaining</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
             <div className={classNames("h-full", kycUrg.bar)} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function KycFormSection({ kyc, onUpload }) {
  const [selectedDoc, setSelectedRole] = useState(kyc.missingDocuments[0] || "");
  const [file, setFile] = useState(null);
  const [docNum, setDocNum] = useState("");

  const handleUpload = () => {
    if (!selectedDoc || !file) return;
    onUpload(selectedDoc, file, docNum);
    setFile(null);
    setDocNum("");
  };

  return (
    <Section title="Document Management" icon={FiUpload}>
       <div className="p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
             <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Required Documents</label>
                <div className="flex flex-wrap gap-2">
                   {kyc.requiredDocuments.map(d => (
                     <span key={d} className={classNames("px-2.5 py-1 rounded-lg text-[10px] font-bold border", kyc.missingDocuments.includes(d) ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                        {d.replace('_', ' ')}
                     </span>
                   ))}
                </div>
             </div>
          </div>
          <div className="border-t pt-4">
             <p className="text-sm font-bold mb-3">Upload New Document</p>
             <div className="flex flex-col gap-3 sm:flex-row">
                <select value={selectedDoc} onChange={e => setSelectedRole(e.target.value)} className="input-field max-w-xs">
                   <option value="">Select Document Type</option>
                   {kyc.requiredDocuments.map(d => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                </select>
                <input type="text" placeholder="Document Number" className="input-field max-w-xs" value={docNum} onChange={e => setDocNum(e.target.value)} />
                <input type="file" onChange={e => setFile(e.target.files[0])} className="text-sm" />
                <Button onClick={handleUpload} disabled={!file || !selectedDoc}>Upload</Button>
             </div>
          </div>
       </div>
    </Section>
  );
}

function VerificationHistory({ history }) {
  return (
    <Section title="Recent Activity" icon={FiClock}>
       <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">
                <tr>
                   <th className="p-3">Type</th>
                   <th className="p-3">Status</th>
                   <th className="p-3">Date</th>
                   <th className="p-3">Notes</th>
                </tr>
             </thead>
             <tbody className="divide-y dark:divide-slate-800">
                {history.map((h, i) => (
                   <tr key={i}>
                      <td className="p-3 font-medium">{h.type.replace('_', ' ')}</td>
                      <td className="p-3"><StatusBadge status={h.status} /></td>
                      <td className="p-3 text-slate-500">{formatDate(h.date)}</td>
                      <td className="p-3 text-xs text-slate-400">{h.notes || '—'}</td>
                   </tr>
                ))}
                {history.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-400">No recent activity</td></tr>}
             </tbody>
          </table>
       </div>
    </Section>
  );
}

function RemindersPanel({ kycDays, reportDays, kycUrg, reportUrg }) {
  return (
    <div className="space-y-4">
       <div className={classNames("p-4 rounded-2xl border flex items-start gap-3", kycUrg.bg, kycUrg.color.replace('text', 'border'))}>
          <FiAlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
             <p className="font-bold text-sm">KYC Renewal Due</p>
             <p className="text-xs opacity-80">Your next KYC renewal is in {kycDays} days. Please ensure all documents are up to date.</p>
          </div>
       </div>
       <div className={classNames("p-4 rounded-2xl border flex items-start gap-3", reportUrg.bg, reportUrg.color.replace('text', 'border'))}>
          <FiHeart className="h-5 w-5 mt-0.5" />
          <div>
             <p className="font-bold text-sm">Health Report Reminder</p>
             <p className="text-xs opacity-80">Annual child health report is due in {reportDays} days. Mandatory for compliance.</p>
          </div>
       </div>
    </div>
  );
}

function HealthReportSection({ kyc, reportStatus, reportDays }) {
  return (
     <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <div className="flex items-center gap-2 mb-3">
           <FiHeart className="text-emerald-600" />
           <h3 className="font-bold text-sm">Annual Health Report</h3>
        </div>
        <p className="text-xs text-emerald-800 dark:text-emerald-300 mb-4">Mandatory health update for {kyc.childName || 'the child'}.</p>
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
              <p className="text-xs font-bold">{reportStatus}</p>
           </div>
           <Button size="sm" variant="secondary" icon={FiUpload}>Upload</Button>
        </div>
     </div>
  );
}

function SubmitKycModal({ open, onClose, onConfirm }) {
  const [notes, setNotes] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
       <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-lg font-bold mb-2">Submit KYC Package</h3>
          <p className="text-sm text-slate-500 mb-4">Are you sure you want to submit your documents for review? You cannot edit them during the review process.</p>
          <textarea className="input-field w-full h-24 mb-4" placeholder="Optional notes for the reviewer..." value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex gap-3">
             <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
             <Button fullWidth onClick={() => onConfirm(notes)}>Submit</Button>
          </div>
       </div>
    </div>
  );
}

function ViewDocsModal({ open, onClose, docs }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
       <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold">Uploaded Documents</h3>
             <Button variant="ghost" icon={FiX} onClick={onClose} />
          </div>
          <div className="space-y-3">
             {docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                      <FiFileText className="text-civic-600" />
                      <div>
                         <p className="text-sm font-bold">{doc.documentType.replace('_', ' ')}</p>
                         <p className="text-[10px] text-slate-400">{doc.fileName}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <StatusBadge status={doc.status} />
                      <a href={doc.storageUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-civic-600">
                         <FiDownload className="h-4 w-4" />
                      </a>
                   </div>
                </div>
             ))}
             {docs.length === 0 && <p className="text-center py-10 text-slate-400">No documents uploaded yet.</p>}
          </div>
       </div>
    </div>
  );
}
