import { FiArrowLeft, FiHeart, FiHome, FiShield, FiUserCheck } from "react-icons/fi";
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
  const { user } = useAuth();
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
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUserCheck} label="Child ID" value={child.id} />
          <Field icon={FiUserCheck} label="Name" value={child.name} />
          <Field icon={FiUserCheck} label="Age" value={child.age} />
          <Field icon={FiHome} label="Orphanage" value={child.orphanage} />
          <Field icon={FiShield} label="Risk Status" value={child.risk} />
          <Field icon={FiHeart} label="Health Status" value={child.health} />
          <Field icon={FiShield} label="Attendance" value={`${child.attendance}%`} />
        </dl>
      </Card>
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </dt>
      <dd className="mt-2 font-bold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}
