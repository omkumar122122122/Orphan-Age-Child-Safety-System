import { FiBriefcase, FiCamera, FiCreditCard, FiFileText, FiHome, FiLogOut, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../context/AuthContext";
import { children, orphanages } from "../data/dummyData";
import { roleLabels } from "../utils/constants";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfoGrid from "../components/ProfileInfoGrid";
import ProfileActions from "../components/ProfileActions";

export default function Profile() {
  const { user, logout } = useAuth();
  const child = children[1];
  const isAdmin = user?.role === "admin";
  const isParent = user?.role === "parent";
  const isOrphanage = user?.role === "orphanage";
  const hasSideDetails = isParent || isOrphanage;
  const orphanage = orphanages.find((item) => item.name === user.department);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[roleLabels[user.role], "Profile"]} />
      {isAdmin ? (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="w-full">
            <ProfileCard user={user} />
          </div>
          <div className="space-y-6">
            <Card>
              <ProfileHeader user={user} />
              <ProfileInfoGrid user={user} />
              <ProfileActions onEdit={() => {}} onChangePassword={() => {}} />
            </Card>
            <LogoutSection onLogout={logout} />
          </div>
        </div>
      ) : (
        <div className={hasSideDetails ? "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" : "space-y-6"}>
          <div className="space-y-6">
            <ProfileCard user={user} />
            <Card>
              <ProfileHeader user={user} />
              <ProfileInfoGrid user={user} />
              <ProfileActions onEdit={() => {}} onChangePassword={() => {}} />
            </Card>
            <LogoutSection onLogout={logout} />
          </div>
          {hasSideDetails && (
            <div className="space-y-6">
            {isParent && (
              <Card>
                <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Linked Child Welfare Profile</h2>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <Field label="Child ID" value={child.id} />
                  <Field label="Name" value={child.name} />
                  <Field label="Age" value={child.age} />
                  <Field label="Orphanage" value={child.orphanage} />
                  <Field label="Health Status" value={child.health} />
                  <Field label="Attendance" value={`${child.attendance}%`} />
                </dl>
              </Card>
            )}
            {isOrphanage && orphanage && <OrphanageProfileDetails orphanage={orphanage} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrphanageProfileDetails({ orphanage }) {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Orphanage Registration Details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiHome} label="Orphanage Name" value={orphanage.name} />
          <Field icon={FiFileText} label="Registration Number" value={orphanage.registrationNumber} />
          <Field icon={FiShield} label="Government License Number" value={orphanage.governmentLicenseNumber} />
          <Field icon={FiFileText} label="Date of Establishment" value={orphanage.establishmentDate} />
          <Field icon={FiBriefcase} label="Type of Organization" value={orphanage.organizationType} />
          <Field icon={FiUsers} label="Number of Children" value={orphanage.numberOfChildren} />
          <Field icon={FiUsers} label="Capacity" value={orphanage.capacity} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Contact Information</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field icon={FiMail} label="Official Email" value={orphanage.officialEmail} />
          <Field icon={FiPhone} label="Phone Number" value={orphanage.phone} />
          <Field icon={FiPhone} label="Alternative Contact" value={orphanage.alternativeContact} />
          <Field icon={FiHome} label="Website" value={orphanage.website} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Address</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiHome} label="Country" value={orphanage.country} />
          <Field icon={FiHome} label="State" value={orphanage.state} />
          <Field icon={FiHome} label="District" value={orphanage.district} />
          <Field icon={FiHome} label="City" value={orphanage.city} />
          <Field icon={FiHome} label="PIN Code" value={orphanage.pinCode} />
          <Field icon={FiHome} label="Full Address" value={orphanage.fullAddress} className="xl:col-span-2" />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Administrator Details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUserCheck} label="Administrator Name" value={orphanage.administrator.name} />
          <Field icon={FiBriefcase} label="Designation" value={orphanage.administrator.designation} />
          <Field icon={FiPhone} label="Mobile Number" value={orphanage.administrator.mobile} />
          <Field icon={FiMail} label="Email" value={orphanage.administrator.email} />
          <Field icon={FiFileText} label="Profile Photo" value={orphanage.administrator.profilePhoto} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Identity Verification (KYC)</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiFileText} label="Registration Certificate" value={orphanage.kyc.registrationCertificate} />
          <Field icon={FiFileText} label="NGO Certificate" value={orphanage.kyc.ngoCertificate} />
          <Field icon={FiFileText} label="Government License" value={orphanage.kyc.governmentLicense} />
          <Field icon={FiFileText} label="Administrator ID Proof" value={orphanage.kyc.administratorIdProof} />
          <Field icon={FiCreditCard} label="PAN Card" value={orphanage.kyc.panCard} />
          <Field icon={FiCreditCard} label="GST Number" value={orphanage.kyc.gstNumber} />
          <Field icon={FiHome} label="Address Proof" value={orphanage.kyc.addressProof} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Child Information Summary</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUsers} label="Total Boys" value={orphanage.childSummary.totalBoys} />
          <Field icon={FiUsers} label="Total Girls" value={orphanage.childSummary.totalGirls} />
          <Field icon={FiUsers} label="Children Below 5 Years" value={orphanage.childSummary.below5} />
          <Field icon={FiUsers} label="Children 5-12 Years" value={orphanage.childSummary.age5To12} />
          <Field icon={FiUsers} label="Children Above 12 Years" value={orphanage.childSummary.above12} />
          <Field icon={FiUsers} label="Special Needs Children" value={orphanage.childSummary.specialNeeds} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Staff Details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiUsers} label="Total Staff" value={orphanage.staff.totalStaff} />
          <Field icon={FiUsers} label="Caretakers" value={orphanage.staff.caretakers} />
          <Field icon={FiUsers} label="Teachers" value={orphanage.staff.teachers} />
          <Field icon={FiUsers} label="Medical Staff" value={orphanage.staff.medicalStaff} />
          <Field icon={FiShield} label="Security Guards" value={orphanage.staff.securityGuards} />
          <Field icon={FiUsers} label="Volunteers" value={orphanage.staff.volunteers} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Facilities Available</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {orphanage.facilities.map((facility) => (
            <div key={facility} className="rounded-lg border border-slate-200 bg-white/70 p-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
              {facility}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Emergency Contact</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field icon={FiUserCheck} label="Contact Person" value={orphanage.emergencyContact.contactPerson} />
          <Field icon={FiPhone} label="Mobile Number" value={orphanage.emergencyContact.mobile} />
          <Field icon={FiMail} label="Email" value={orphanage.emergencyContact.email} />
          <Field icon={FiBriefcase} label="Relationship/Role" value={orphanage.emergencyContact.relationship} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">AI Safety Details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field icon={FiCamera} label="AI Face Recognition Enabled" value={orphanage.aiSafety.faceRecognitionEnabled} />
          <Field icon={FiCamera} label="CCTV Cameras Installed" value={orphanage.aiSafety.cctvInstalled} />
          <Field icon={FiCamera} label="Number of Cameras" value={orphanage.aiSafety.numberOfCameras} />
          <Field icon={FiShield} label="Visitor Face Verification Enabled" value={orphanage.aiSafety.visitorFaceVerificationEnabled} />
          <Field icon={FiUsers} label="Child Attendance System" value={orphanage.aiSafety.childAttendanceSystem} />
          <Field icon={FiShield} label="GPS Tracking Available" value={orphanage.aiSafety.gpsTrackingAvailable} />
          <Field icon={FiShield} label="Emergency Alert System Enabled" value={orphanage.aiSafety.emergencyAlertSystemEnabled} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Bank Details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field icon={FiCreditCard} label="Bank Name" value={orphanage.bankDetails.bankName} />
          <Field icon={FiUserCheck} label="Account Holder Name" value={orphanage.bankDetails.accountHolderName} />
          <Field icon={FiCreditCard} label="Account Number" value={orphanage.bankDetails.accountNumber} />
          <Field icon={FiCreditCard} label="IFSC Code" value={orphanage.bankDetails.ifscCode} />
        </dl>
      </Card>
    </div>
  );
}

function LogoutSection({ onLogout, className = "" }) {
  return (
    <Card className={className}>
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
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </dt>
      <dd className="mt-2 break-words font-bold text-slate-950 dark:text-white">{value || "Not provided"}</dd>
    </div>
  );
}
