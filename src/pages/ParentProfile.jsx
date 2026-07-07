import {
  FiArrowLeft, FiFileText, FiHome, FiMail,
  FiPhone, FiShield, FiUserCheck, FiUsers
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { children } from "../data/dummyData";
import { roleLabels } from "../utils/constants";
import { classNames } from "../utils/formatters";

export default function ParentProfile() {
  const { parentId } = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const visibleChildren =
    user?.role === "orphanage"
      ? children.filter((c) => c.orphanage === user.department)
      : children;

  const child  = visibleChildren.find((c) => c.parentDetails?.id === parentId);
  const parent = child?.parentDetails;

  if (!parent) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={[roleLabels[user.role], "Parent Profile"]} />
        <Card>
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
              <FiUsers className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Parent Profile Not Available</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This parent record could not be found for your dashboard access.
              </p>
            </div>
            <Button icon={FiArrowLeft} onClick={() => navigate(-1)}>Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[roleLabels[user.role], "Parent Profile", parent.id]} />

      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            {parent.fatherName?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "P"}
          </div>
          <div>
            <h1 className="page-title">Parent / Guardian Follow-up</h1>
            <p className="page-subtitle">
              Linked to {child.name} ({child.id})
            </p>
          </div>
        </div>
        <Button icon={FiArrowLeft} variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>

      {/* AI verification strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Home Study",      value: parent.homeStudyStatus,     ok: parent.homeStudyStatus === "Approved" },
          { label: "Police Check",    value: parent.policeVerification,  ok: parent.policeVerification === "Completed" },
          { label: "Adoption Order",  value: parent.adoptionOrderId,     ok: true },
          { label: "Has Other Child", value: parent.hasAnotherChild ? "Yes" : "No", ok: null },
        ].map((b) => (
          <div key={b.label} className={`rounded-xl border px-4 py-3 ${b.ok === true ? "border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10" : b.ok === false ? "border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10" : "border-gray-100 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"}`}>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{b.label}</p>
            <p className={`mt-1 text-sm font-bold ${b.ok === true ? "text-green-700 dark:text-green-400" : b.ok === false ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-200"}`}>{b.value}</p>
          </div>
        ))}
      </div>

      {/* Parent details */}
      <ProfileSection title="Parent Details" icon={FiUserCheck}>
        <Field icon={FiUserCheck}  label="Father Name"          value={parent.fatherName} />
        <Field icon={FiPhone}      label="Father Phone"         value={parent.fatherPhone} />
        <Field icon={FiShield}     label="Father Aadhaar"       value={parent.fatherAadhaar} />
        <Field icon={FiFileText}   label="Father Occupation"    value={parent.fatherOccupation} />
        <Field icon={FiUserCheck}  label="Mother Name"          value={parent.motherName} />
        <Field icon={FiPhone}      label="Mother Phone"         value={parent.motherPhone} />
        <Field icon={FiShield}     label="Mother Aadhaar"       value={parent.motherAadhaar} />
        <Field icon={FiFileText}   label="Mother Occupation"    value={parent.motherOccupation} />
        <Field icon={FiMail}       label="Email"                value={parent.email} />
        <Field icon={FiHome}       label="Address"              value={parent.address} wide />
      </ProfileSection>

      {/* Adoption assessment */}
      <ProfileSection title="Adoption Assessment" icon={FiShield}>
        <Field icon={FiFileText}  label="Adoption Order ID"           value={parent.adoptionOrderId} />
        <Field icon={FiShield}    label="Voter ID"                    value={parent.voterId} />
        <Field icon={FiShield}    label="Home Study Status"           value={parent.homeStudyStatus} />
        <Field icon={FiShield}    label="Police Verification"         value={parent.policeVerification} />
        <Field icon={FiUsers}     label="Has Another Child"           value={parent.hasAnotherChild ? "Yes" : "No"} />
        <Field icon={FiUsers}     label="Other Child Status"          value={parent.otherChildStatus} />
        <Field icon={FiUsers}     label="Other Child Details"         value={parent.otherChildDetails} wide />
        <Field icon={FiFileText}  label="Reason for Adoption"         value={parent.adoptionReason} wide />
        <Field icon={FiFileText}  label="Financial Condition"         value={parent.financialCondition} wide />
        <Field icon={FiShield}    label="Follow-up Officer"           value={parent.followUpOfficer} />
        <Field icon={FiFileText}  label="Post-adoption Follow-up"     value={parent.postAdoptionFollowUp} wide />
      </ProfileSection>
    </div>
  );
}

function ProfileSection({ title, icon: Icon, children: content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <dl className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">{content}</dl>
    </motion.div>
  );
}

function Field({ icon: Icon, label, value, wide = false }) {
  return (
    <div className={classNames("field-block", wide ? "sm:col-span-2 xl:col-span-3" : "")}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        <span className="field-label">{label}</span>
      </div>
      <p className="field-value">{value || "Not provided"}</p>
    </div>
  );
}
