import { FiArrowLeft, FiFileText, FiHome, FiPhone, FiShield, FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { children, orphanages } from "../data/dummyData";
import { percentage } from "../utils/formatters";

export default function OrphanageDetail() {
  const { orphanageId } = useParams();
  const navigate = useNavigate();
  const orphanage = orphanages.find((item) => item.id === orphanageId);

  if (!orphanage) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={["Admin", "Orphanages", "Details"]} />
        <Card>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Orphanage Not Found</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This orphanage record is not available.</p>
          <Button icon={FiArrowLeft} onClick={() => navigate(-1)} className="mt-5">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  const linkedChildren = children.filter((child) => child.orphanage === orphanage.name);
  const adoptedChildren = linkedChildren.filter((child) => child.adopted);
  const currentChildren = orphanage.occupancy ?? linkedChildren.length;
  const totalAdmissions = orphanage.totalAdmissions ?? currentChildren + adoptedChildren.length;

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Orphanages", orphanage.name]} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">{orphanage.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{orphanage.id} basic orphanage overview</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button icon={FiArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button icon={FiFileText} onClick={() => navigate(`/admin/orphanages/${orphanage.id}/profile`)}>
            Follow Up Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Admissions Till Now" value={totalAdmissions} icon={FiUsers} />
        <Metric label="Total Children Adopted" value={adoptedChildren.length} icon={FiShield} />
        <Metric label="Currently In Orphanage" value={currentChildren} icon={FiHome} />
        <Metric label="Occupancy" value={percentage(currentChildren, orphanage.capacity)} icon={FiUsers} />
      </div>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Basic Details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiHome} label="Orphanage Name" value={orphanage.name} />
          <Field icon={FiFileText} label="Registration Number" value={orphanage.registrationNumber} />
          <Field icon={FiShield} label="Government License Number" value={orphanage.governmentLicenseNumber} />
          <Field icon={FiHome} label="City" value={orphanage.city} />
          <Field icon={FiUsers} label="Capacity" value={orphanage.capacity} />
          <Field icon={FiShield} label="Compliance" value={`${orphanage.compliance}%`} />
          <Field icon={FiPhone} label="Phone Number" value={orphanage.phone} />
          <Field icon={FiHome} label="Address" value={orphanage.fullAddress} className="xl:col-span-2" />
        </dl>
      </Card>
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">{value}</h2>
        </div>
        <div className="rounded-lg bg-civic-100 p-3 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
          <Icon className="h-5 w-5" />
        </div>
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
      <dd className="mt-2 break-words font-bold text-slate-950 dark:text-white">{value || "Not provided"}</dd>
    </div>
  );
}
