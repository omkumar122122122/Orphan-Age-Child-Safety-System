import { FiArrowLeft, FiBriefcase, FiCamera, FiCreditCard, FiFileText, FiHome, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { orphanages } from "../data/dummyData";

export default function OrphanageFullProfile() {
  const { orphanageId } = useParams();
  const navigate = useNavigate();
  const orphanage = orphanages.find((item) => item.id === orphanageId);

  if (!orphanage) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={["Admin", "Orphanages", "Full Profile"]} />
        <Card>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Orphanage Profile Not Found</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This detailed orphanage profile is not available.</p>
          <Button icon={FiArrowLeft} onClick={() => navigate(-1)} className="mt-5">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Orphanages", orphanage.name, "Full Profile"]} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">{orphanage.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Full orphanage registration and safety profile</p>
        </div>
        <Button icon={FiArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <Section title="Organization Details">
            <Field icon={FiHome} label="Orphanage Name" value={orphanage.name} />
            <Field icon={FiFileText} label="Registration Number" value={orphanage.registrationNumber} />
            <Field icon={FiShield} label="Government License Number" value={orphanage.governmentLicenseNumber} />
            <Field icon={FiFileText} label="Date of Establishment" value={orphanage.establishmentDate} />
            <Field icon={FiBriefcase} label="Type of Organization" value={orphanage.organizationType} />
            <Field icon={FiUsers} label="Number of Children" value={orphanage.numberOfChildren ?? orphanage.occupancy} />
            <Field icon={FiUsers} label="Capacity" value={orphanage.capacity} />
          </Section>

          <Section title="Contact Information" columns="xl:grid-cols-4">
            <Field icon={FiMail} label="Official Email" value={orphanage.officialEmail} />
            <Field icon={FiPhone} label="Phone Number" value={orphanage.phone} />
            <Field icon={FiPhone} label="Alternative Contact" value={orphanage.alternativeContact} />
            <Field icon={FiHome} label="Website" value={orphanage.website} />
          </Section>

          <Section title="Address">
            <Field icon={FiHome} label="Country" value={orphanage.country} />
            <Field icon={FiHome} label="State" value={orphanage.state} />
            <Field icon={FiHome} label="District" value={orphanage.district} />
            <Field icon={FiHome} label="City" value={orphanage.city} />
            <Field icon={FiHome} label="PIN Code" value={orphanage.pinCode} />
            <Field icon={FiHome} label="Full Address" value={orphanage.fullAddress} className="xl:col-span-2" />
          </Section>

          <Section title="Administrator Details">
            <Field icon={FiUserCheck} label="Administrator Name" value={orphanage.administrator?.name} />
            <Field icon={FiBriefcase} label="Designation" value={orphanage.administrator?.designation} />
            <Field icon={FiPhone} label="Mobile Number" value={orphanage.administrator?.mobile} />
            <Field icon={FiMail} label="Email" value={orphanage.administrator?.email} />
            <Field icon={FiFileText} label="Profile Photo" value={orphanage.administrator?.profilePhoto} />
          </Section>

          <Section title="Identity Verification (KYC)">
            <Field icon={FiFileText} label="Registration Certificate" value={orphanage.kyc?.registrationCertificate} />
            <Field icon={FiFileText} label="NGO Certificate" value={orphanage.kyc?.ngoCertificate} />
            <Field icon={FiFileText} label="Government License" value={orphanage.kyc?.governmentLicense} />
            <Field icon={FiFileText} label="Administrator ID Proof" value={orphanage.kyc?.administratorIdProof} />
            <Field icon={FiCreditCard} label="PAN Card" value={orphanage.kyc?.panCard} />
            <Field icon={FiCreditCard} label="GST Number" value={orphanage.kyc?.gstNumber} />
            <Field icon={FiHome} label="Address Proof" value={orphanage.kyc?.addressProof} />
          </Section>

          <Section title="Child Information Summary">
            <Field icon={FiUsers} label="Total Boys" value={orphanage.childSummary?.totalBoys} />
            <Field icon={FiUsers} label="Total Girls" value={orphanage.childSummary?.totalGirls} />
            <Field icon={FiUsers} label="Children Below 5 Years" value={orphanage.childSummary?.below5} />
            <Field icon={FiUsers} label="Children 5-12 Years" value={orphanage.childSummary?.age5To12} />
            <Field icon={FiUsers} label="Children Above 12 Years" value={orphanage.childSummary?.above12} />
            <Field icon={FiUsers} label="Special Needs Children" value={orphanage.childSummary?.specialNeeds} />
          </Section>

          <Section title="Staff Details">
            <Field icon={FiUsers} label="Total Staff" value={orphanage.staff?.totalStaff} />
            <Field icon={FiUsers} label="Caretakers" value={orphanage.staff?.caretakers} />
            <Field icon={FiUsers} label="Teachers" value={orphanage.staff?.teachers} />
            <Field icon={FiUsers} label="Medical Staff" value={orphanage.staff?.medicalStaff} />
            <Field icon={FiShield} label="Security Guards" value={orphanage.staff?.securityGuards} />
            <Field icon={FiUsers} label="Volunteers" value={orphanage.staff?.volunteers} />
          </Section>

          <Card>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Facilities Available</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {(orphanage.facilities?.length ? orphanage.facilities : ["Not provided"]).map((facility) => (
                <div key={facility} className="rounded-lg border border-slate-200 bg-white/70 p-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                  {facility}
                </div>
              ))}
            </div>
          </Card>

          <Section title="Emergency Contact" columns="xl:grid-cols-4">
            <Field icon={FiUserCheck} label="Contact Person" value={orphanage.emergencyContact?.contactPerson} />
            <Field icon={FiPhone} label="Mobile Number" value={orphanage.emergencyContact?.mobile} />
            <Field icon={FiMail} label="Email" value={orphanage.emergencyContact?.email} />
            <Field icon={FiBriefcase} label="Relationship/Role" value={orphanage.emergencyContact?.relationship} />
          </Section>

          <Section title="AI Safety Details">
            <Field icon={FiCamera} label="AI Face Recognition Enabled" value={orphanage.aiSafety?.faceRecognitionEnabled} />
            <Field icon={FiCamera} label="CCTV Cameras Installed" value={orphanage.aiSafety?.cctvInstalled} />
            <Field icon={FiCamera} label="Number of Cameras" value={orphanage.aiSafety?.numberOfCameras} />
            <Field icon={FiShield} label="Visitor Face Verification Enabled" value={orphanage.aiSafety?.visitorFaceVerificationEnabled} />
            <Field icon={FiUsers} label="Child Attendance System" value={orphanage.aiSafety?.childAttendanceSystem} />
            <Field icon={FiShield} label="GPS Tracking Available" value={orphanage.aiSafety?.gpsTrackingAvailable} />
            <Field icon={FiShield} label="Emergency Alert System Enabled" value={orphanage.aiSafety?.emergencyAlertSystemEnabled} />
          </Section>

          <Section title="Bank Details" columns="xl:grid-cols-4">
            <Field icon={FiCreditCard} label="Bank Name" value={orphanage.bankDetails?.bankName} />
            <Field icon={FiUserCheck} label="Account Holder Name" value={orphanage.bankDetails?.accountHolderName} />
            <Field icon={FiCreditCard} label="Account Number" value={orphanage.bankDetails?.accountNumber} />
            <Field icon={FiCreditCard} label="IFSC Code" value={orphanage.bankDetails?.ifscCode} />
          </Section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-1">
          <Card>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Quick Overview</h2>
            <div className="mt-5 space-y-4">
              <Field icon={FiHome} label="Orphanage Name" value={orphanage.name} />
              <Field icon={FiUsers} label="Children / Capacity" value={`${orphanage.numberOfChildren ?? orphanage.occupancy} / ${orphanage.capacity}`} />
              <Field icon={FiShield} label="Compliance" value={`${orphanage.compliance}%`} />
              <Field icon={FiBriefcase} label="Organization Type" value={orphanage.organizationType} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Contact Snapshot</h2>
            <div className="mt-5 space-y-4">
              <Field icon={FiMail} label="Official Email" value={orphanage.officialEmail} />
              <Field icon={FiPhone} label="Phone Number" value={orphanage.phone} />
              <Field icon={FiHome} label="City" value={orphanage.city} />
              <Field icon={FiHome} label="District" value={orphanage.district} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Safety Snapshot</h2>
            <div className="mt-5 space-y-4">
              <Field icon={FiCamera} label="Face Recognition" value={orphanage.aiSafety?.faceRecognitionEnabled} />
              <Field icon={FiCamera} label="CCTV Installed" value={orphanage.aiSafety?.cctvInstalled} />
              <Field icon={FiShield} label="Emergency Alerts" value={orphanage.aiSafety?.emergencyAlertSystemEnabled} />
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}

function Section({ title, columns = "xl:grid-cols-3", children }) {
  return (
    <Card>
      <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>
      <dl className={`mt-5 grid gap-4 sm:grid-cols-2 ${columns}`}>{children}</dl>
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
