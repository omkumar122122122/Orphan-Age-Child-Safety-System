import { FiArrowLeft, FiCalendar, FiDownload, FiFileText, FiHeart, FiHome, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { children } from "../data/dummyData";
import { roleLabels } from "../utils/constants";
import { classNames } from "../utils/formatters";

const riskBadge = {
  Low:    "badge-success",
  Medium: "badge-warning",
  High:   "badge-danger",
};

const healthBadge = {
  Stable:         "badge-success",
  Observation:    "badge-warning",
  "Needs Review": "badge-danger",
};

export default function ChildProfile() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const allowedChildren =
    user?.role === "orphanage"
      ? children.filter((c) => c.orphanage === user.department)
      : children;
  const child = allowedChildren.find((c) => c.id === childId);

  if (!child) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={[roleLabels[user.role], "Children", "Profile"]} />
        <Card>
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
              <FiUsers className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Child Profile Not Available</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This child record could not be found for your dashboard access.</p>
            </div>
            <Button icon={FiArrowLeft} onClick={() => navigate(-1)}>Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  const dashboardBase = user?.role === "admin" ? "/admin" : "/orphanage";

  return (
    <div className="space-y-5">
      <Breadcrumb items={[roleLabels[user.role], "Children", child.name]} />

      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            {child.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h1 className="page-title">{child.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{child.id}</span>
              <span className={classNames("badge", riskBadge[child.risk])}>{child.risk} Risk</span>
              <span className={classNames("badge", healthBadge[child.health] ?? "badge-neutral")}>{child.health}</span>
              {child.adopted && <span className="badge badge-blue">Adopted</span>}
            </div>
          </div>
        </div>
        <Button icon={FiArrowLeft} variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>

      {/* Details grid */}
      <div className="grid gap-5 xl:grid-cols-2">
        {/* Basic + admission */}
        <ProfileSection title="Basic Details" icon={FiUserCheck}>
          <FieldGrid>
            <Field icon={FiUserCheck} label="Child ID"       value={child.id} />
            <Field icon={FiUserCheck} label="Full Name"      value={child.name} />
            <Field icon={FiUserCheck} label="Age"            value={child.age} />
            <Field icon={FiUserCheck} label="Gender"         value={child.gender} />
            <Field icon={FiHome}      label="Orphanage"      value={child.orphanage} />
            <Field icon={FiCalendar}  label="Admission Date" value={child.admissionDate} />
            <Field icon={FiUsers}     label="Case Worker"    value={child.caseWorker} />
            <Field icon={FiFileText}  label="Education"      value={child.educationLevel} />
          </FieldGrid>
        </ProfileSection>

        {/* Medical */}
        <ProfileSection title="Medical Details" icon={FiHeart}>
          <FieldGrid>
            <Field icon={FiHeart}    label="Health Status"      value={child.health} />
            <Field icon={FiHeart}    label="Blood Group"        value={child.bloodGroup} />
            <Field icon={FiShield}   label="Vaccination"        value={child.vaccinationStatus} />
            <Field icon={FiShield}   label="Allergies"          value={child.allergies} />
            <Field icon={FiFileText} label="Medical History"    value={child.medicalHistory} wide />
          </FieldGrid>

          {/* Medical file download */}
          <div className="mt-3 field-block">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiFileText className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="field-label">Medical History File</p>
                  <p className="field-value">{child.medicalHistoryFile}</p>
                </div>
              </div>
              <Button icon={FiDownload} variant="secondary" className="shrink-0 text-xs">View</Button>
            </div>
          </div>
        </ProfileSection>
      </div>

      {/* AI & Attendance strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Attendance Rate" value={`${child.attendance}%`} color={child.attendance >= 90 ? "green" : child.attendance >= 75 ? "amber" : "red"} />
        <MetricCard label="Risk Level"      value={child.risk}            color={child.risk === "Low" ? "green" : child.risk === "Medium" ? "amber" : "red"} />
        <MetricCard label="AI Safety Score" value="94%"                   color="blue" />
      </div>

      {/* Adoption */}
      <ProfileSection title="Adoption Details" icon={FiUsers}>
        <FieldGrid>
          <Field icon={FiUsers}   label="Adopted"          value={child.adopted ? "Yes" : "No"} />
          <Field icon={FiPhone}   label="Emergency Contact" value={child.emergencyContact} wide />
          {child.adopted && <Field icon={FiCalendar} label="Adoption Date" value={child.adoptionDate} />}
        </FieldGrid>
      </ProfileSection>

      {/* Parent details */}
      {child.adopted && child.parentDetails && (
        <ProfileSection
          title="Parent / Guardian Details"
          icon={FiUserCheck}
          action={
            <Button
              icon={FiUsers}
              variant="secondary"
              onClick={() => navigate(`${dashboardBase}/parent-profiles/${child.parentDetails.id}`)}
            >
              Follow Up Profile
            </Button>
          }
        >
          <FieldGrid>
            <Field icon={FiUserCheck} label="Father Name"       value={child.parentDetails.fatherName} />
            <Field icon={FiUserCheck} label="Mother Name"       value={child.parentDetails.motherName} />
            <Field icon={FiPhone}     label="Father Phone"      value={child.parentDetails.fatherPhone} />
            <Field icon={FiPhone}     label="Mother Phone"      value={child.parentDetails.motherPhone} />
            <Field icon={FiMail}      label="Email"             value={child.parentDetails.email} />
            <Field icon={FiHome}      label="Address"           value={child.parentDetails.address} />
            <Field icon={FiFileText}  label="Adoption Order ID" value={child.parentDetails.adoptionOrderId} />
            <Field icon={FiShield}    label="Follow-up Officer" value={child.parentDetails.followUpOfficer} />
          </FieldGrid>
        </ProfileSection>
      )}
    </div>
  );
}

/* ── Reusable sub-components ─────────────────────────────── */
function ProfileSection({ title, icon: Icon, action, children: content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{content}</div>
    </motion.div>
  );
}

function FieldGrid({ children: content }) {
  return <div className="grid gap-3 sm:grid-cols-2">{content}</div>;
}

function Field({ icon: Icon, label, value, wide = false }) {
  return (
    <div className={classNames("field-block", wide ? "sm:col-span-2" : "")}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        <span className="field-label">{label}</span>
      </div>
      <p className="field-value">{value || "Not provided"}</p>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  const colorMap = {
    green: "border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10",
    amber: "border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
    red:   "border-red-100   bg-red-50   dark:border-red-500/20   dark:bg-red-500/10",
    blue:  "border-civic-100 bg-civic-50 dark:border-civic-500/20 dark:bg-civic-500/10",
  };
  const textMap = {
    green: "text-green-700 dark:text-green-400",
    amber: "text-amber-700 dark:text-amber-400",
    red:   "text-red-700   dark:text-red-400",
    blue:  "text-civic-700 dark:text-civic-400",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${textMap[color]}`}>{value}</p>
    </div>
  );
}
