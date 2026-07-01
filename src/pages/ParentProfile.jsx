import { FiArrowLeft, FiFileText, FiHome, FiLogOut, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { children } from "../data/dummyData";
import { roleLabels } from "../utils/constants";

export default function ParentProfile() {
  const { parentId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const visibleChildren =
    user?.role === "orphanage" ? children.filter((child) => child.orphanage === user.department) : children;
  const child = visibleChildren.find((item) => item.parentDetails?.id === parentId);
  const parent = child?.parentDetails;

  if (!parent) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[roleLabels[user.role], "Parent Profile"]} />
        <Card>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Parent Profile Not Available</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This parent record could not be found for your dashboard access.
          </p>
          <Button icon={FiArrowLeft} onClick={() => navigate(-1)} className="mt-5">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[roleLabels[user.role], "Parent Profile", parent.id]} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">Parent / Guardian Follow-up</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Linked to {child.name} ({child.id})
          </p>
        </div>
        <Button icon={FiArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Parent Details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUserCheck} label="Father Name" value={parent.fatherName} />
          <Field icon={FiPhone} label="Father Phone" value={parent.fatherPhone} />
          <Field icon={FiShield} label="Father Aadhaar" value={parent.fatherAadhaar} />
          <Field icon={FiFileText} label="Father Occupation" value={parent.fatherOccupation} />
          <Field icon={FiUserCheck} label="Mother Name" value={parent.motherName} />
          <Field icon={FiPhone} label="Mother Phone" value={parent.motherPhone} />
          <Field icon={FiShield} label="Mother Aadhaar" value={parent.motherAadhaar} />
          <Field icon={FiFileText} label="Mother Occupation" value={parent.motherOccupation} />
          <Field icon={FiMail} label="Email" value={parent.email} />
          <Field icon={FiHome} label="Address" value={parent.address} className="xl:col-span-2" />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Adoption Assessment</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiFileText} label="Adoption Order ID" value={parent.adoptionOrderId} />
          <Field icon={FiShield} label="Voter ID" value={parent.voterId} />
          <Field icon={FiShield} label="Home Study Status" value={parent.homeStudyStatus} />
          <Field icon={FiShield} label="Police Verification" value={parent.policeVerification} />
          <Field icon={FiUsers} label="Has Another Child" value={parent.hasAnotherChild ? "Yes" : "No"} />
          <Field icon={FiUsers} label="Other Child Status" value={parent.otherChildStatus} />
          <Field icon={FiUsers} label="Other Child Details" value={parent.otherChildDetails} className="xl:col-span-2" />
          <Field icon={FiFileText} label="Reason for Adoption" value={parent.adoptionReason} className="xl:col-span-2" />
          <Field icon={FiFileText} label="Financial Condition" value={parent.financialCondition} className="xl:col-span-2" />
          <Field icon={FiShield} label="Follow-up Officer" value={parent.followUpOfficer} />
          <Field icon={FiFileText} label="Post-adoption Follow-up" value={parent.postAdoptionFollowUp} className="xl:col-span-2" />
        </dl>
      </Card>
      <LogoutSection onLogout={logout} />
    </div>
  );
}

function LogoutSection({ onLogout }) {
  return (
    <Card>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Account Actions</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            End the current secure dashboard session.
          </p>
        </div>
        <Button variant="danger" icon={FiLogOut} onClick={onLogout} className="w-full md:w-auto">
          Logout
        </Button>
      </div>
    </Card>
  );
}

function Field({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </dt>
      <dd className="mt-2 break-words font-bold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}
