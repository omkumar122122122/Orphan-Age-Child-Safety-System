import {
  FiBriefcase, FiCamera, FiCreditCard, FiFileText,
  FiHome, FiLogOut, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers
} from "react-icons/fi";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import ProfileCard from "../components/ProfileCard";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfoGrid from "../components/ProfileInfoGrid";
import ProfileActions from "../components/ProfileActions";
import { useAuth } from "../context/AuthContext";
import { children, orphanages } from "../data/dummyData";
import { roleLabels } from "../utils/constants";
import { classNames } from "../utils/formatters";

export default function Profile() {
  const { user, logout } = useAuth();
  const child      = children[1];
  const isAdmin    = user?.role === "admin";
  const isParent   = user?.role === "parent";
  const isOrphanage = user?.role === "orphanage";
  const hasSideDetails = isParent || isOrphanage;
  const orphanage  = orphanages.find((o) => o.name === user.department);

  return (
    <div className="space-y-5">
      <Breadcrumb items={[roleLabels[user.role], "Profile"]} />

      {isAdmin ? (
        <div className="space-y-5">
          <ProfileCard user={user} />
          <Card>
            <ProfileHeader user={user} />
            <ProfileInfoGrid user={user} />
            <ProfileActions onEdit={() => {}} onChangePassword={() => {}} />
          </Card>
          <LogoutSection onLogout={logout} />
        </div>
      ) : (
        <div className={hasSideDetails ? "grid gap-5 xl:grid-cols-[0.9fr_1.1fr]" : "space-y-5"}>
          <div className="space-y-5">
            <ProfileCard user={user} />
            <Card>
              <ProfileHeader user={user} />
              <ProfileInfoGrid user={user} />
              <ProfileActions onEdit={() => {}} onChangePassword={() => {}} />
            </Card>
            <LogoutSection onLogout={logout} />
          </div>

          {hasSideDetails && (
            <div className="space-y-5">
              {isParent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="border-b border-gray-100 px-5 py-4 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Linked Child Welfare Profile</h2>
                  </div>
                  <dl className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
                    <Field label="Child ID"      value={child.id} />
                    <Field label="Name"          value={child.name} />
                    <Field label="Age"           value={child.age} />
                    <Field label="Orphanage"     value={child.orphanage} />
                    <Field label="Health Status" value={child.health} />
                    <Field label="Attendance"    value={`${child.attendance}%`} />
                  </dl>
                </motion.div>
              )}
              {isOrphanage && orphanage && <OrphanageProfileDetails orphanage={orphanage} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Orphanage profile details (same structure as FullProfile) ── */
function OrphanageProfileDetails({ orphanage }) {
  return (
    <div className="space-y-5">
      {[
        {
          title: "Orphanage Registration Details",
          fields: [
            [FiHome,     "Orphanage Name",          orphanage.name],
            [FiFileText, "Registration Number",     orphanage.registrationNumber],
            [FiShield,   "Govt License Number",     orphanage.governmentLicenseNumber],
            [FiFileText, "Date of Establishment",   orphanage.establishmentDate],
            [FiBriefcase,"Type of Organization",    orphanage.organizationType],
            [FiUsers,    "Number of Children",      orphanage.numberOfChildren],
            [FiUsers,    "Capacity",                orphanage.capacity],
          ],
        },
        {
          title: "Contact Information",
          fields: [
            [FiMail,  "Official Email",      orphanage.officialEmail],
            [FiPhone, "Phone Number",        orphanage.phone],
            [FiPhone, "Alternative Contact", orphanage.alternativeContact],
            [FiHome,  "Website",             orphanage.website],
          ],
          cols: "xl:grid-cols-4",
        },
        {
          title: "Administrator Details",
          fields: [
            [FiUserCheck,  "Administrator Name", orphanage.administrator.name],
            [FiBriefcase,  "Designation",        orphanage.administrator.designation],
            [FiPhone,      "Mobile Number",      orphanage.administrator.mobile],
            [FiMail,       "Email",              orphanage.administrator.email],
          ],
        },
        {
          title: "AI Safety Details",
          fields: [
            [FiCamera, "Face Recognition", orphanage.aiSafety.faceRecognitionEnabled],
            [FiCamera, "CCTV Installed",   orphanage.aiSafety.cctvInstalled],
            [FiCamera, "No. of Cameras",   orphanage.aiSafety.numberOfCameras],
            [FiShield, "Emergency Alerts", orphanage.aiSafety.emergencyAlertSystemEnabled],
          ],
        },
      ].map((section) => (
        <div key={section.title} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{section.title}</h2>
          </div>
          <dl className={`grid gap-3 p-5 sm:grid-cols-2 ${section.cols ?? "xl:grid-cols-3"}`}>
            {section.fields.map(([Icon, label, value]) => (
              <Field key={label} icon={Icon} label={label} value={value} />
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function LogoutSection({ onLogout }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-red-800 dark:text-red-200">Sign Out</p>
          <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">End the current secure dashboard session.</p>
        </div>
        <Button variant="danger" icon={FiLogOut} onClick={onLogout} className="shrink-0">
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, wide = false }) {
  return (
    <div className={classNames("field-block", wide ? "sm:col-span-2" : "")}>
      {Icon && (
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className="h-3.5 w-3.5 text-slate-400" />
          <span className="field-label">{label}</span>
        </div>
      )}
      {!Icon && <span className="field-label">{label}</span>}
      <p className="field-value">{value || "Not provided"}</p>
    </div>
  );
}
