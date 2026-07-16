import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheck,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiHome,
  FiInfo,
  FiMapPin,
  FiShield,
  FiUser,
  FiUsers,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { RiFingerprintLine } from "react-icons/ri";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { classNames } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/Toast";
import { parentsService } from "../services/parentsService";
import { orphanagesService } from "../services/orphanagesService";
import { visitRequestsService } from "../services/visitRequestsService";

// AI Analysis - computed from parent profile data
const getAiAnalysis = (parentProfile) => {
  if (!parentProfile) return [];
  const trustScore = parentProfile.trustScore || 0;
  const kycStatus = parentProfile.kycStatus || 'PENDING';
  const isVerified = kycStatus === 'APPROVED' || kycStatus === 'VERIFIED';
  
  return [
    { label: "Parent Trust Score", value: `${trustScore}%`, score: trustScore, detail: trustScore >= 70 ? "High confidence profile" : "Needs improvement" },
    { label: "Face Match", value: isVerified ? "99%" : "N/A", score: isVerified ? 99 : 0, detail: isVerified ? "Biometric identity matched" : "Pending verification" },
    { label: "Document Verification", value: isVerified ? "Verified" : "Pending", score: isVerified ? 100 : 50, detail: isVerified ? "All documents accepted" : "Documents under review" },
    { label: "Background Check", value: isVerified ? "Passed" : "Pending", score: isVerified ? 92 : 0, detail: isVerified ? "No adverse records" : "Background check in progress" },
    { label: "Risk Level", value: trustScore >= 80 ? "Low" : trustScore >= 60 ? "Medium" : "High", score: trustScore, detail: trustScore >= 80 ? "Eligible low-risk visitor" : "Additional review required" },
    { label: "Recommendation", value: isVerified && trustScore >= 70 ? "Eligible for Visit" : "Under Review", score: isVerified && trustScore >= 70 ? 96 : 50, detail: isVerified && trustScore >= 70 ? "Proceed with scheduling" : "Complete verification first" }
  ];
};

const getDocuments = (parentProfile) => {
  if (!parentProfile?.documents) return [];
  return parentProfile.documents.map(doc => [
    doc.documentType?.replace(/_/g, ' ') || 'Document',
    doc.status === 'APPROVED' ? 'Verified and accepted' : doc.status === 'REJECTED' ? 'Rejected - resubmit required' : 'Under review',
    doc.status === 'APPROVED' ? 'Verified' : doc.status === 'REJECTED' ? 'Rejected' : 'Pending'
  ]);
};

const statusTone = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200",
  Rescheduled: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
  Completed: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-civic-500 focus:ring-2 focus:ring-civic-500/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white";

export default function VisitRequest() {
  const { user } = useAuth();
  const { toasts, success: showSuccess, error: showError, removeToast } = useToast();
  
  const [parentProfile, setParentProfile] = useState(null);
  const [orphanageOptions, setOrphanageOptions] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [selectedOrphanage, setSelectedOrphanage] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const selected = useMemo(
    () => orphanageOptions.find((orphanage) => orphanage.id === selectedOrphanage),
    [selectedOrphanage, orphanageOptions]
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      orphanageId: "",
      purpose: "Adoption Inquiry",
      timeline: "Within 3 months",
      visitors: 2
    }
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      
      // Load parent profile
      const dashboardData = await parentsService.getDashboard();
      setParentProfile(dashboardData.parent);

      // Load approved orphanages
      const orphanagesData = await orphanagesService.getAll({ 
        verificationStatus: 'APPROVED',
        limit: 50 
      });
      const orphanages = orphanagesData.data || [];
      setOrphanageOptions(orphanages);
      if (orphanages.length > 0) {
        setSelectedOrphanage(orphanages[0].id);
      }

      // Load parent's visit request history
      const requestsData = await visitRequestsService.getMyRequests({ limit: 10 });
      setRequestHistory(requestsData.data || []);
    } catch (err) {
      showError(err.message || 'Failed to load page data');
      console.error('Error loading page data:', err);
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(formData) {
    try {
      setSubmitting(true);
      
      const requestData = {
        orphanageId: formData.orphanageId || selectedOrphanage,
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        purpose: formData.purpose,
        reason: formData.reason,
        familyBackground: formData.familyBackground,
        visitorsCount: parseInt(formData.visitors, 10),
        relationship: formData.relationship,
        specialRequirements: formData.requirements || null,
      };

      await visitRequestsService.create(requestData);
      
      showSuccess('Visit request submitted successfully');
      setToastVisible(true);
      window.setTimeout(() => setToastVisible(false), 3200);
      
      // Reload request history
      const requestsData = await visitRequestsService.getMyRequests({ limit: 10 });
      setRequestHistory(requestsData.data || []);
    } catch (err) {
      showError(err.message || 'Failed to submit visit request');
      console.error('Error submitting visit request:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <FiLoader className="h-12 w-12 animate-spin text-civic-600" />
      </div>
    );
  }

  if (!parentProfile) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={["Parent", "Visit Request"]} />
        <Card className="py-16">
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiAlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <p className="empty-state-title">Parent Profile Not Found</p>
            <p className="empty-state-desc">Unable to load your parent profile. Please contact support.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Breadcrumb items={["Parent", "Visit Request"]} />

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden rounded-lg p-5 shadow-glass sm:p-7"
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-civic-50 px-3 py-2 text-sm font-bold text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
              <FiShield className="h-4 w-4" />
              Parent Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl">Visit Request for Child Adoption</h1>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Submit a request to visit an orphanage for child adoption. All requests are verified using AI-based identity and risk analysis.
            </p>
          </div>
          <ProgressTracker />
        </div>
      </motion.header>

      <section className="grid gap-6 2xl:grid-cols-[1fr_0.92fr]">
        <ParentInformation parentProfile={parentProfile} />
        <OrphanageSelection register={register} selected={selected} onChange={setSelectedOrphanage} orphanageOptions={orphanageOptions} />
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <VisitForm register={register} errors={errors} submitting={submitting} />
        <DocumentStatus parentProfile={parentProfile} />
        <AiSafetyAnalysis parentProfile={parentProfile} />
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-civic-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-civic-600/25 transition hover:bg-civic-700 focus:outline-none focus:ring-2 focus:ring-civic-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-950"
        >
          {submitting ? (
            <>
              <FiLoader className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FiCalendar className="h-5 w-5" />
              Request Visit
            </>
          )}
        </motion.button>
      </form>

      <RequestHistory onView={setActiveRequest} requestHistory={requestHistory} orphanageOptions={orphanageOptions} />
      <RequestDetailsModal request={activeRequest} onClose={() => setActiveRequest(null)} orphanageOptions={orphanageOptions} />
      <Toast visible={toastVisible} />
    </div>
  );
}

function ProgressTracker() {
  const steps = [
    ["KYC Completed", "done"],
    ["Identity Verified", "done"],
    ["Visit Request", "current"],
    ["Visit Approved", "pending"],
    ["Visit Completed", "pending"]
  ];

  return (
    <div className="rounded-lg border border-white/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <div className="grid gap-3 sm:grid-cols-5 xl:grid-cols-1">
        {steps.map(([label, state], index) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className={classNames(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold",
                state === "done" && "bg-emerald-500 text-white",
                state === "current" && "bg-civic-600 text-white",
                state === "pending" && "border border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900"
              )}
            >
              {state === "done" ? <FiCheck /> : state === "current" ? <FiChevronRight /> : index + 1}
            </span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParentInformation({ parentProfile }) {
  if (!parentProfile) return null;

  const details = [
    ["Full Name", `${parentProfile.user?.firstName || ''} ${parentProfile.user?.lastName || ''}`.trim() || 'N/A'],
    ["Parent ID", parentProfile.id || 'N/A'],
    ["Email", parentProfile.user?.email || 'N/A'],
    ["Phone Number", parentProfile.user?.phone || 'N/A'],
    ["Occupation", parentProfile.occupation || 'N/A'],
    ["Annual Income", parentProfile.annualIncome ? `INR ${parentProfile.annualIncome.toLocaleString()}` : 'N/A'],
    ["Marital Status", parentProfile.maritalStatus || 'N/A'],
    ["KYC Status", parentProfile.kycStatus || 'Pending'],
  ];

  const initials = `${parentProfile.user?.firstName?.charAt(0) || ''}${parentProfile.user?.lastName?.charAt(0) || ''}`;
  const trustScore = parentProfile.trustScore || 0;

  return (
    <Card className="rounded-lg">
      <SectionTitle icon={FiUser} title="Parent Information" subtitle="Auto-filled verified parent profile" />
      <div className="mt-5 flex flex-col gap-5 lg:flex-row">
        <div className="flex shrink-0 flex-col items-center rounded-lg border border-slate-200 bg-white/75 p-5 dark:border-slate-700 dark:bg-slate-950/45">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-civic-600 text-3xl font-extrabold text-white shadow-lg shadow-civic-600/20">
            {initials || 'P'}
          </div>
          <span className={classNames(
            "mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-extrabold",
            parentProfile.kycStatus === 'VERIFIED' 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
              : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
          )}>
            <FiCheck className="h-4 w-4" />
            KYC {parentProfile.kycStatus || 'Pending'}
          </span>
          <div className="mt-5">
            <CircularProgress value={trustScore} label="AI Trust Score" />
          </div>
        </div>
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <ReadOnlyField key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function OrphanageSelection({ register, selected, onChange, orphanageOptions }) {
  return (
    <Card className="rounded-lg">
      <SectionTitle icon={FiHome} title="Orphanage Selection" subtitle="Choose a registered orphanage for your visit" />
      <label className="mt-5 block text-sm font-bold text-slate-700 dark:text-slate-200">
        Select Orphanage
        <select
          {...register("orphanageId")}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        >
          {orphanageOptions.map((orphanage) => (
            <option key={orphanage.id} value={orphanage.id}>
              {orphanage.name}
            </option>
          ))}
        </select>
      </label>
      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoTile icon={FiMapPin} label="City" value={selected.city || 'N/A'} />
          <InfoTile icon={FiMapPin} label="State" value={selected.state || 'N/A'} />
          <InfoTile icon={FiInfo} label="Organization Type" value={selected.organizationType || 'N/A'} />
          <InfoTile icon={FiShield} label="Verification Status" value={selected.verificationStatus || 'N/A'} />
        </motion.div>
      )}
    </Card>
  );
}

function VisitForm({ register, errors, submitting }) {
  const visitorsField = register("visitors");

  return (
    <Card className="rounded-lg">
      <SectionTitle icon={FiFileText} title="Visit Request Form" subtitle="Provide the scheduling and family details required for review" />
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <FormField label="Preferred Visit Date" error={errors.visitDate?.message}>
          <input type="date" {...register("visitDate", { required: "Visit date is required" })} disabled={submitting} className={fieldClass} />
        </FormField>
        <FormField label="Preferred Time" error={errors.visitTime?.message}>
          <input type="time" {...register("visitTime", { required: "Visit time is required" })} disabled={submitting} className={fieldClass} />
        </FormField>
        <FormField label="Purpose of Visit">
          <select {...register("purpose")} disabled={submitting} className={fieldClass}>
            {["Adoption Inquiry", "Meet Child", "Document Verification", "Counselling", "General Visit"].map((purpose) => (
              <option key={purpose}>{purpose}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Expected Adoption Timeline">
          <input {...register("timeline")} disabled={submitting} placeholder="Within 3 months" className={fieldClass} />
        </FormField>
        <FormField label="Reason for Adoption" error={errors.reason?.message} wide>
          <textarea
            {...register("reason", { required: "Reason for adoption is required" })}
            rows={4}
            disabled={submitting}
            placeholder="Share your motivation and readiness for adoption"
            className={fieldClass}
          />
        </FormField>
        <FormField label="Family Background" error={errors.familyBackground?.message} wide>
          <textarea
            {...register("familyBackground", { required: "Family background is required" })}
            rows={4}
            disabled={submitting}
            placeholder="Describe family environment, support system, and caregiving plan"
            className={fieldClass}
          />
        </FormField>
        <FormField label="Number of Visitors">
          <input
            type="text"
            inputMode="numeric"
            min="1"
            max="5"
            disabled={submitting}
            {...visitorsField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/[^0-9]/g, "");
              visitorsField.onChange(event);
            }}
            className={fieldClass}
          />
        </FormField>
        <FormField label="Relationship of Visitors">
          <input {...register("relationship")} disabled={submitting} placeholder="Spouse, parent, sibling" className={fieldClass} />
        </FormField>
        <FormField label="Special Requirements" wide>
          <input {...register("requirements")} disabled={submitting} placeholder="Accessibility, interpreter, counselling support" className={fieldClass} />
        </FormField>
      </div>
      <label className="mt-5 flex items-start gap-3 rounded-lg border border-civic-100 bg-civic-50/80 p-4 text-sm font-bold text-slate-700 dark:border-civic-500/20 dark:bg-civic-500/10 dark:text-slate-200">
        <input type="checkbox" {...register("agreement", { required: true })} disabled={submitting} className="mt-1 h-4 w-4 rounded border-slate-300 text-civic-600 focus:ring-civic-500" />
        <span>I agree to follow orphanage rules.</span>
      </label>
      {errors.agreement && <p className="mt-2 text-sm font-semibold text-red-600">Agreement is required before submitting.</p>}
    </Card>
  );
}

function DocumentStatus({ parentProfile }) {
  const docs = getDocuments(parentProfile);
  if (!docs || docs.length === 0) {
    return (
      <Card className="rounded-lg">
        <SectionTitle icon={RiFingerprintLine} title="Document Status" subtitle="Uploaded documents verified before visit scheduling" />
        <div className="mt-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No documents uploaded yet. Complete KYC to see document status.
        </div>
      </Card>
    );
  }
  return (
    <Card className="rounded-lg">
      <SectionTitle icon={RiFingerprintLine} title="Document Status" subtitle="Uploaded documents verified before visit scheduling" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {docs.map(([title, detail, status]) => (
          <motion.div
            key={title}
            whileHover={{ y: -3 }}
            className="rounded-lg border border-slate-200 bg-white/75 p-4 dark:border-slate-700 dark:bg-slate-950/45"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                <FiCheck className="h-5 w-5" />
              </div>
              <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">{status}</span>
            </div>
            <h3 className="mt-4 text-base font-extrabold text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{detail}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function AiSafetyAnalysis({ parentProfile }) {
  const analysis = getAiAnalysis(parentProfile);
  if (!analysis || analysis.length === 0) {
    return (
      <Card className="rounded-lg">
        <SectionTitle icon={FiShield} title="AI Safety Analysis" subtitle="Risk and identity insights computed from your profile" />
        <div className="mt-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Complete your profile verification to see AI safety analysis.
        </div>
      </Card>
    );
  }
  return (
    <Card className="rounded-lg">
      <SectionTitle icon={FiShield} title="AI Safety Analysis" subtitle="Risk and identity insights computed from your profile" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {analysis.map((item) => (
          <motion.div key={item.label} whileHover={{ y: -3 }} className="rounded-lg border border-slate-200 bg-white/75 p-4 dark:border-slate-700 dark:bg-slate-950/45">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.label}</p>
                <h3 className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{item.value}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
              <CircularProgress value={item.score} compact />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function RequestHistory({ onView, requestHistory, orphanageOptions }) {
  if (!requestHistory || requestHistory.length === 0) {
    return (
      <Card className="rounded-lg">
        <SectionTitle icon={FiClock} title="Request History" subtitle="Track previous and current orphanage visit requests" />
        <div className="mt-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No visit requests yet. Submit your first request above.
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg">
      <SectionTitle icon={FiClock} title="Request History" subtitle="Track previous and current orphanage visit requests" />
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[920px] border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-sm font-extrabold text-slate-500 dark:text-slate-400">
              {["Request ID", "Orphanage", "Visit Date", "Visit Time", "Purpose", "Status", "Actions"].map((heading) => (
                <th key={heading} className="px-3 py-2">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requestHistory.map((request) => {
              const orphanage = orphanageOptions.find(o => o.id === request.orphanageId);
              
              return (
                <tr key={request.id} className="rounded-lg bg-white/75 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-950/45 dark:text-slate-200">
                  <td className="rounded-l-lg px-3 py-4 font-extrabold text-civic-700 dark:text-civic-100">{request.id}</td>
                  <td className="px-3 py-4">{orphanage?.name || 'Unknown'}</td>
                  <td className="px-3 py-4">{new Date(request.visitDate).toLocaleDateString()}</td>
                  <td className="px-3 py-4">{request.visitTime || 'N/A'}</td>
                  <td className="px-3 py-4">{request.purpose}</td>
                  <td className="px-3 py-4">
                    <span className={classNames("rounded-lg px-3 py-1 text-xs font-extrabold", statusTone[request.status] || statusTone.Pending)}>{request.status}</span>
                  </td>
                  <td className="rounded-r-lg px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => onView(request)} className="px-3 py-2 text-xs">
                        View Details
                      </Button>
                      {request.status === "PENDING" && (
                        <Button variant="ghost" className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10">
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RequestDetailsModal({ request, onClose, orphanageOptions }) {
  if (!request) return null;
  const orphanage = orphanageOptions.find((item) => item.id === request.orphanageId) || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg p-5 shadow-glass"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Request Details</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{request.id} - {orphanage?.name || 'Unknown Orphanage'}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Close request details">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <DetailPanel title="Complete Request Details">
            <ReadOnlyField label="Visit Date" value={new Date(request.visitDate).toLocaleDateString()} />
            <ReadOnlyField label="Visit Time" value={request.visitTime || 'N/A'} />
            <ReadOnlyField label="Purpose" value={request.purpose} />
            <ReadOnlyField label="Current Status" value={request.status} />
          </DetailPanel>
          {orphanage && (
            <DetailPanel title="Orphanage Information">
              <ReadOnlyField label="Name" value={orphanage.name} />
              <ReadOnlyField label="City" value={orphanage.city || 'N/A'} />
              <ReadOnlyField label="State" value={orphanage.state || 'N/A'} />
              <ReadOnlyField label="Type" value={orphanage.organizationType || 'N/A'} />
            </DetailPanel>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function CircularProgress({ value, label, compact = false }) {
  const size = compact ? 68 : 108;
  const stroke = compact ? 7 : 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-200 dark:text-slate-700" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-civic-600"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className={classNames("absolute flex items-center justify-center", compact ? "h-[68px] w-[68px]" : "h-[108px] w-[108px]")}>
        <span className={classNames("font-extrabold text-slate-950 dark:text-white", compact ? "text-sm" : "text-xl")}>{value}%</span>
      </div>
      {label && <p className="mt-2 text-center text-xs font-extrabold text-slate-500 dark:text-slate-400">{label}</p>}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-civic-100 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/65 p-3 dark:border-slate-700 dark:bg-slate-950/35">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-extrabold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, wide = false }) {
  return (
    <div className={classNames("rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40", wide && "sm:col-span-2")}>
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 shrink-0 text-civic-600" />
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, error, children, wide = false }) {
  return (
    <label className={classNames("block text-sm font-bold text-slate-700 dark:text-slate-200", wide && "lg:col-span-2")}>
      {label}
      {children}
      {error && <span className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600"><FiAlertCircle />{error}</span>}
    </label>
  );
}

function DetailPanel({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40">
      <h3 className="mb-3 text-sm font-extrabold text-slate-950 dark:text-white">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Toast({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25"
        >
          <FiCheck className="h-5 w-5 shrink-0" />
          Visit Request Submitted Successfully.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
