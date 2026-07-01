import { FiArrowLeft, FiCalendar, FiDownload, FiFileText, FiHeart, FiHome, FiLogOut, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { children } from "../data/dummyData";
import { roleLabels } from "../utils/constants";

export default function ChildProfile() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const allowedChildren =
    user?.role === "orphanage" ? children.filter((child) => child.orphanage === user.department) : children;
  const child = allowedChildren.find((item) => item.id === childId);

  if (!child) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[roleLabels[user.role], "Children", "Profile"]} />
        <Card>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Child Profile Not Available</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This child record could not be found for your dashboard access.
          </p>
          <Button icon={FiArrowLeft} onClick={() => navigate(-1)} className="mt-5">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  const dashboardBase = user?.role === "admin" ? "/admin" : "/orphanage";

  return (
    <div className="space-y-6">
      <Breadcrumb items={[roleLabels[user.role], "Children", child.name]} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">{child.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{child.id} welfare profile</p>
        </div>
        <Button icon={FiArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Basic Details</h2>
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUserCheck} label="Child ID" value={child.id} />
          <Field icon={FiUserCheck} label="Name" value={child.name} />
          <Field icon={FiUserCheck} label="Age" value={child.age} />
          <Field icon={FiUserCheck} label="Gender" value={child.gender} />
          <Field icon={FiHome} label="Orphanage" value={child.orphanage} />
          <Field icon={FiCalendar} label="Admission Date" value={child.admissionDate} />
          <Field icon={FiUsers} label="Case Worker" value={child.caseWorker} />
          <Field icon={FiFileText} label="Education Level" value={child.educationLevel} />
          <Field icon={FiShield} label="Risk Status" value={child.risk} />
          <Field icon={FiShield} label="Attendance" value={`${child.attendance}%`} />
        </dl>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Medical Details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiHeart} label="Health Status" value={child.health} />
          <Field icon={FiHeart} label="Blood Group" value={child.bloodGroup} />
          <Field icon={FiShield} label="Vaccination Status" value={child.vaccinationStatus} />
          <Field icon={FiShield} label="Allergies" value={child.allergies} />
          <Field icon={FiFileText} label="Medical History" value={child.medicalHistory} className="xl:col-span-2" />
          <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <FiFileText className="h-4 w-4" />
              Medical History File
            </dt>
            <dd className="mt-3 flex flex-col gap-3">
              <span className="break-words font-bold text-slate-950 dark:text-white">{child.medicalHistoryFile}</span>
              <Button icon={FiDownload} variant="secondary" className="w-fit">
                View File
              </Button>
            </dd>
          </div>
        </dl>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Adoption Details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUsers} label="Adopted" value={child.adopted ? "Yes" : "No"} />
          <Field icon={FiPhone} label="Emergency Contact" value={child.emergencyContact} className="xl:col-span-2" />
          {child.adopted && <Field icon={FiCalendar} label="Adoption Date" value={child.adoptionDate} />}
        </dl>
      </Card>
      {child.adopted && child.parentDetails && (
        <Card>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Parent / Guardian Details</h2>
            <Button
              icon={FiUsers}
              variant="secondary"
              onClick={() => navigate(`${dashboardBase}/parent-profiles/${child.parentDetails.id}`)}
            >
              Follow Up Profile
            </Button>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Field icon={FiUserCheck} label="Father Name" value={child.parentDetails.fatherName} />
            <Field icon={FiUserCheck} label="Mother Name" value={child.parentDetails.motherName} />
            <Field icon={FiPhone} label="Father Phone" value={child.parentDetails.fatherPhone} />
            <Field icon={FiPhone} label="Mother Phone" value={child.parentDetails.motherPhone} />
            <Field icon={FiMail} label="Email" value={child.parentDetails.email} />
            <Field icon={FiHome} label="Address" value={child.parentDetails.address} />
            <Field icon={FiFileText} label="Adoption Order ID" value={child.parentDetails.adoptionOrderId} />
            <Field icon={FiShield} label="Follow-up Officer" value={child.parentDetails.followUpOfficer} />
          </dl>
        </Card>
      )}
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
