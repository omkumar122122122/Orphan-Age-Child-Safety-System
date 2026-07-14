import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiEye,
  FiFileText,
  FiFilter,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiSearch,
  FiSend,
  FiShield,
  FiSlash,
  FiUserCheck,
  FiX
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import { classNames } from "../utils/formatters";

const parentApplications = [
  {
    id: "PAR-2026-0148",
    name: "Meera Nair",
    dob: "1988-04-16",
    gender: "Female",
    occupation: "Public School Teacher",
    income: "INR 8.4 LPA",
    familyMembers: "4 members",
    phone: "+91 98765 22014",
    email: "meera.nair@example.com",
    address: "Sector 21, Dwarka, New Delhi",
    emergencyContact: "Arun Nair, +91 98765 22015",
    registeredAt: "2026-07-08",
    kycStatus: "Complete",
    trustScore: 94,
    status: "Pending",
    issueStatus: "Open",
    riskLevel: "Low",
    photo: "MN",
    recommendation: "Approve after officer declaration",
    documents: ["Aadhaar", "PAN", "Passport", "Income Proof", "Marriage Certificate", "Address Proof", "Selfie"],
    ai: {
      faceMatch: "97%",
      ocrMatch: "Matched",
      identityMatch: "Strong",
      documentAuthenticity: "Verified",
      duplicateAccount: "No Duplicate",
      backgroundCheck: "Clear",
      blacklistCheck: "Clear",
      phone: "OTP Verified",
      email: "Verified"
    },
    issues: [
      {
        id: "ISS-8901",
        category: "Document Clarification",
        priority: "Medium",
        status: "Open",
        date: "2026-07-08",
        description: "Requested confirmation for updated workplace address on income proof."
      }
    ]
  },
  {
    id: "PAR-2026-0142",
    name: "Raghav Menon",
    dob: "1982-11-22",
    gender: "Male",
    occupation: "Logistics Contractor",
    income: "INR 11.2 LPA",
    familyMembers: "3 members",
    phone: "+91 98765 22142",
    email: "raghav.menon@example.com",
    address: "Kakkanad, Kochi, Kerala",
    emergencyContact: "Leela Menon, +91 98765 22143",
    registeredAt: "2026-07-07",
    kycStatus: "Partial",
    trustScore: 58,
    status: "Under Review",
    issueStatus: "Escalated",
    riskLevel: "High",
    photo: "RM",
    recommendation: "Request additional documents before approval",
    documents: ["Aadhaar", "PAN", "Driving License", "Income Proof", "Address Proof", "Selfie"],
    ai: {
      faceMatch: "81%",
      ocrMatch: "Needs Review",
      identityMatch: "Moderate",
      documentAuthenticity: "Manual Check",
      duplicateAccount: "Possible Match",
      backgroundCheck: "Pending",
      blacklistCheck: "Clear",
      phone: "OTP Verified",
      email: "Verified"
    },
    issues: [
      {
        id: "ISS-8894",
        category: "Identity Mismatch",
        priority: "High",
        status: "Open",
        date: "2026-07-07",
        description: "Form name and address proof initials differ. Officer review required."
      },
      {
        id: "ISS-8895",
        category: "Duplicate Alert",
        priority: "High",
        status: "Under Review",
        date: "2026-07-07",
        description: "AI found a historical guardian account with similar phone metadata."
      }
    ]
  },
  {
    id: "PAR-2026-0136",
    name: "Anjali Rao",
    dob: "1990-01-08",
    gender: "Female",
    occupation: "Nurse",
    income: "INR 7.1 LPA",
    familyMembers: "2 members",
    phone: "+91 98765 22136",
    email: "anjali.rao@example.com",
    address: "Jayanagar, Bengaluru, Karnataka",
    emergencyContact: "Kiran Rao, +91 98765 22137",
    registeredAt: "2026-07-06",
    kycStatus: "Complete",
    trustScore: 88,
    status: "Verified",
    issueStatus: "Resolved",
    riskLevel: "Low",
    photo: "AR",
    recommendation: "Approved for activation",
    documents: ["Aadhaar", "PAN", "Passport", "Income Proof", "Address Proof", "Selfie"],
    ai: {
      faceMatch: "95%",
      ocrMatch: "Matched",
      identityMatch: "Strong",
      documentAuthenticity: "Verified",
      duplicateAccount: "No Duplicate",
      backgroundCheck: "Clear",
      blacklistCheck: "Clear",
      phone: "OTP Verified",
      email: "Verified"
    },
    issues: []
  },
  {
    id: "PAR-2026-0129",
    name: "Sahil Kapoor",
    dob: "1979-06-30",
    gender: "Male",
    occupation: "Private Consultant",
    income: "INR 13.8 LPA",
    familyMembers: "5 members",
    phone: "+91 98765 22129",
    email: "sahil.kapoor@example.com",
    address: "Civil Lines, Jaipur, Rajasthan",
    emergencyContact: "Nisha Kapoor, +91 98765 22130",
    registeredAt: "2026-07-05",
    kycStatus: "Failed",
    trustScore: 34,
    status: "Rejected",
    issueStatus: "Closed",
    riskLevel: "High",
    photo: "SK",
    recommendation: "Reject due to document authenticity risk",
    documents: ["Aadhaar", "PAN", "Driving License", "Income Proof", "Address Proof", "Selfie"],
    ai: {
      faceMatch: "64%",
      ocrMatch: "Mismatch",
      identityMatch: "Weak",
      documentAuthenticity: "Failed",
      duplicateAccount: "No Duplicate",
      backgroundCheck: "Flagged",
      blacklistCheck: "Clear",
      phone: "OTP Verified",
      email: "Verified"
    },
    issues: [
      {
        id: "ISS-8870",
        category: "Fraud Review",
        priority: "Critical",
        status: "Closed",
        date: "2026-07-05",
        description: "Uploaded PAN image failed tamper detection review."
      }
    ]
  }
];

const summaryConfig = [
  ["Pending Parents", "Pending", FiClock],
  ["Verified Parents", "Verified", FiUserCheck],
  ["Rejected Applications", "Rejected", FiSlash],
  ["High Risk Profiles", "High Risk", FiAlertTriangle],
  ["Open Issues", "Open Issues", FiMessageSquare],
  ["Today's Requests", "Today", FiFileText]
];

const filters = ["All", "Pending", "Verified", "Rejected", "Under Review", "High Risk"];
const sortOptions = ["Newest", "Oldest", "Highest Risk"];
const riskStyles = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-red-50 text-red-700 ring-red-200"
};
const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  "Under Review": "bg-blue-50 text-blue-700 ring-blue-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200"
};

export default function ParentVerificationCenter() {
  const [parents, setParents] = useState(parentApplications);
  const [selectedParent, setSelectedParent] = useState(parentApplications[0]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [searching, setSearching] = useState(false);

  const stats = useMemo(() => {
    const today = "2026-07-08";
    return {
      Pending: parents.filter((parent) => parent.status === "Pending").length,
      Verified: parents.filter((parent) => parent.status === "Verified" || parent.status === "Approved").length,
      Rejected: parents.filter((parent) => parent.status === "Rejected").length,
      "High Risk": parents.filter((parent) => parent.riskLevel === "High").length,
      "Open Issues": parents.reduce((total, parent) => total + parent.issues.filter((issue) => issue.status !== "Closed" && issue.status !== "Resolved").length, 0),
      Today: parents.filter((parent) => parent.registeredAt === today).length
    };
  }, [parents]);

  const filteredParents = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = parents.filter((parent) => {
      const matchesTerm = [parent.name, parent.id, parent.email, parent.phone].some((value) => value.toLowerCase().includes(term));
      const matchesFilter = filter === "All" || parent.status === filter || (filter === "High Risk" && parent.riskLevel === "High");
      return matchesTerm && matchesFilter;
    });

    return [...result].sort((a, b) => {
      if (sort === "Oldest") return new Date(a.registeredAt) - new Date(b.registeredAt);
      if (sort === "Highest Risk") return a.trustScore - b.trustScore;
      return new Date(b.registeredAt) - new Date(a.registeredAt);
    });
  }, [filter, parents, search, sort]);

  const handleSearch = (value) => {
    setSearch(value);
    setSearching(true);
    window.setTimeout(() => setSearching(false), 450);
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const updateParentStatus = (status, message) => {
    setParents((current) => current.map((parent) => (parent.id === selectedParent.id ? { ...parent, status } : parent)));
    setSelectedParent((parent) => ({ ...parent, status }));
    setActiveModal(null);
    notify(message);
  };

  const resolveIssue = (issueId) => {
    setParents((current) =>
      current.map((parent) =>
        parent.id === selectedParent.id
          ? { ...parent, issues: parent.issues.map((issue) => (issue.id === issueId ? { ...issue, status: "Resolved" } : issue)), issueStatus: "Resolved" }
          : parent
      )
    );
    setSelectedParent((parent) => ({
      ...parent,
      issues: parent.issues.map((issue) => (issue.id === issueId ? { ...issue, status: "Resolved" } : issue)),
      issueStatus: "Resolved"
    }));
    notify("Issue Resolved");
  };

  const openDetails = (parent) => {
    setSelectedParent(parent);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Parent Verification"]} />
      <PageHeader stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SummaryCards stats={stats} />
          <FilterBar search={search} onSearch={handleSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} searching={searching} />
          <ParentTable
            parents={filteredParents}
            loading={searching}
            onView={openDetails}
            onApprove={(parent) => {
              setSelectedParent(parent);
              setActiveModal("approve");
            }}
            onReject={(parent) => {
              setSelectedParent(parent);
              setActiveModal("reject");
            }}
            onQuery={(parent) => {
              setSelectedParent(parent);
              setActiveModal("documents");
            }}
          />
        </div>
        <RightSidebar parents={parents} />
      </div>

      <AnimatePresence>
        {detailOpen && (
          <DetailModal
            parent={selectedParent}
            onClose={() => setDetailOpen(false)}
            onAction={setActiveModal}
            onResolveIssue={resolveIssue}
            notify={notify}
          />
        )}
      </AnimatePresence>

      <ActionModal
        type={activeModal}
        parent={selectedParent}
        onClose={() => setActiveModal(null)}
        onApprove={() => updateParentStatus("Approved", "Parent Approved")}
        onReject={() => updateParentStatus("Rejected", "Application Rejected")}
        onDocuments={() => {
          setActiveModal(null);
          notify("Documents Requested");
        }}
      />

      <AnimatePresence>{toast && <NotificationToast message={toast} />}</AnimatePresence>
    </div>
  );
}

function PageHeader({ stats }) {
  const headerStats = [
    ["Today's Registrations", stats.Today],
    ["Pending Verification",  stats.Pending],
    ["Approved",              stats.Verified],
    ["Rejected",              stats.Rejected],
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-eyebrow">Secure Identity Verification Workflow</p>
          <h1 className="mt-1 page-title">Parent Verification &amp; Approval Center</h1>
          <p className="page-subtitle">Review, validate and securely approve parent registrations.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {headerStats.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryCards({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryConfig.map(([label, key, Icon]) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{stats[key]}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FilterBar({ search, onSearch, filter, setFilter, sort, setSort, searching }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <FiFilter className="h-4 w-4 text-slate-400" />
          Search &amp; Filter
        </h3>
      </div>
      <div className="space-y-5 p-6">
        {/* Search */}
        <div>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Search by name, ID, email or phone
          </span>
          <div className="flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-civic-500 focus-within:ring-2 focus-within:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800">
            <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Search parent records…"
            />
            {searching && <span className="h-2 w-2 animate-ping rounded-full bg-civic-500" />}
          </div>
        </div>

        {/* Filters + Sort row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Status Filter
            </span>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={classNames(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    filter === item
                      ? "bg-civic-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sort By
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-h-[38px] w-44 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-civic-500 focus:ring-2 focus:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {sortOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentTable({ parents, loading, onView, onApprove, onReject, onQuery }) {
  if (loading) return <SkeletonTable />;

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h2 className="section-card-title">Parent Registration Queue</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Registration → AI Verification → Admin Review → Approval / Rejection → Account Activated</p>
        </div>
      </div>
      {parents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] divide-y divide-slate-200 text-left dark:divide-slate-800">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
              <tr>
                {["Profile Photo", "Parent ID", "Name", "Registration Date", "KYC Status", "AI Trust Score", "Verification Status", "Issue Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-bold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {parents.map((parent) => (
                <tr key={parent.id} className="align-top transition hover:bg-civic-50/50 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-4">
                    <Avatar initials={parent.photo} risk={parent.riskLevel} />
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white">{parent.id}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">{parent.name}</p>
                    <p className="text-xs text-slate-500">{parent.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{parent.registeredAt}</td>
                  <td className="px-4 py-4">
                    <Badge label={parent.kycStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <TrustMeter score={parent.trustScore} />
                  </td>
                  <td className="px-4 py-4">
                    <Badge label={parent.status} className={statusStyles[parent.status]} />
                    <Badge label={parent.riskLevel} className={classNames("ml-2", riskStyles[parent.riskLevel])} />
                  </td>
                  <td className="px-4 py-4">
                    <Badge label={parent.issueStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <IconButton label="View" icon={FiEye} onClick={() => onView(parent)} />
                      <IconButton label="Approve" icon={FiCheckCircle} onClick={() => onApprove(parent)} />
                      <IconButton label="Reject" icon={FiSlash} onClick={() => onReject(parent)} danger />
                      <IconButton label="Raise Query" icon={FiMessageSquare} onClick={() => onQuery(parent)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DetailModal({ parent, onClose, onAction, onResolveIssue, notify }) {
  const { register, handleSubmit } = useForm({ defaultValues: { notes: "" } });
  const submitNotes = () => notify("Verification Completed");

  return (
    <motion.div className="fixed inset-0 z-50 bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-xl border border-white/70 bg-slate-50 shadow-2xl dark:border-white/10 dark:bg-slate-950"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 28, opacity: 0 }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-civic-600 dark:text-civic-100">Secure parent identity dossier</p>
            <h2 className="truncate text-xl font-extrabold text-slate-950 dark:text-white">{parent.name}</h2>
          </div>
          <Button variant="ghost" icon={FiX} onClick={onClose} className="px-3" aria-label="Close verification dossier" />
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
            <Section title="Parent Information">
              <div className="flex flex-col gap-4 md:flex-row">
                <Avatar initials={parent.photo} risk={parent.riskLevel} large />
                <InfoGrid
                  items={[
                    ["Parent ID", parent.id],
                    ["Name", parent.name],
                    ["DOB", parent.dob],
                    ["Gender", parent.gender],
                    ["Occupation", parent.occupation],
                    ["Income", parent.income],
                    ["Family Members", parent.familyMembers],
                    ["Phone", parent.phone],
                    ["Email", parent.email],
                    ["Address", parent.address],
                    ["Emergency Contact", parent.emergencyContact]
                  ]}
                />
              </div>
            </Section>

            <Section title="AI Verification">
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(parent.ai).map(([key, value]) => (
                  <MetricCard key={key} label={labelize(key)} value={value} />
                ))}
                <MetricCard label="Overall Trust Score" value={`${parent.trustScore}/100`} highlight />
                <MetricCard label="Risk Level" value={parent.riskLevel} />
                <MetricCard label="Recommendation" value={parent.recommendation} wide />
              </div>
            </Section>

            <Section title="Identity Verification">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {parent.documents.map((doc) => (
                  <DocumentCard key={doc} name={doc} />
                ))}
              </div>
            </Section>

            <Section title="Cross Verification">
              <div className="grid gap-3 sm:grid-cols-2">
                {["Form Name = Aadhaar Name", "DOB = Government ID", "Address = Address Proof", "Phone = OTP Verified", "Email = Verified"].map((item) => (
                  <div key={item} className="flex min-h-12 items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-800">
                    <FiCheckCircle className="h-5 w-5" /> {item}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Parent Raised Issues">
              <div className="space-y-3">
                {parent.issues.length === 0 ? (
                  <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950">No parent-raised issues are pending for this application.</p>
                ) : (
                  parent.issues.map((issue) => (
                    <div key={issue.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-extrabold text-slate-950 dark:text-white">{issue.id}</p>
                          <p className="text-xs font-semibold text-slate-500">{issue.category} - {issue.date}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge label={issue.priority} />
                          <Badge label={issue.status} />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{issue.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <IconButton label="Reply" icon={FiSend} onClick={() => notify("Internal reply drafted")} />
                        <IconButton label="Resolve" icon={FiCheck} onClick={() => onResolveIssue(issue.id)} />
                        <IconButton label="Raise Internal Note" icon={FiFileText} onClick={() => notify("Internal note added")} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Section>

            <Section title="Admin Notes">
              <form onSubmit={handleSubmit(submitNotes)} className="space-y-3">
                <textarea
                  {...register("notes")}
                  rows={7}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-civic-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Internal remarks for verification officers"
                />
                <Button type="submit" icon={FiFileText}>Save Internal Remarks</Button>
              </form>
            </Section>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <Button icon={FiUserCheck} onClick={() => onAction("approve")}>Approve Parent</Button>
          <Button variant="danger" icon={FiSlash} onClick={() => onAction("reject")}>Reject Parent</Button>
          <Button variant="secondary" icon={FiFileText} onClick={() => onAction("documents")}>Request Documents</Button>
          <Button variant="secondary" icon={FiShield} onClick={() => notify("Account suspension review queued")}>Suspend Account</Button>
          <Button variant="secondary" icon={FiDownload} onClick={() => notify("Verification report generated")}>Generate Verification Report</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ActionModal({ type, parent, onClose, onApprove, onReject, onDocuments }) {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { declaration: false, reason: "Incomplete Documents" } });
  if (!type) return null;

  const titles = {
    approve: "Approve Parent Account",
    reject: "Reject Application",
    documents: "Request Updated Documents"
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.form
        onSubmit={handleSubmit(type === "approve" ? onApprove : type === "reject" ? onReject : onDocuments)}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg rounded-xl border border-white/70 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">{titles[type]}</h3>
          <Button type="button" variant="ghost" icon={FiX} onClick={onClose} className="px-3" aria-label="Close action modal" />
        </div>

        {type === "approve" && (
          <div className="mt-4 space-y-4">
            <MetricCard label="Verification Summary" value={`${parent.name} - ${parent.id}`} wide />
            <MetricCard label="AI Recommendation" value={parent.recommendation} wide />
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <input type="checkbox" {...register("declaration", { required: true })} className="mt-1" />
              I confirm that parent identity, documents, AI checks, and issue records have been reviewed.
            </label>
            <Button type="submit" icon={FiCheckCircle} disabled={!watch("declaration")}>Approve Button</Button>
          </div>
        )}

        {type === "reject" && (
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-500">Reason Dropdown</span>
              <select {...register("reason")} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                {["Incomplete Documents", "Identity Mismatch", "Fraud Detected", "High Risk", "Other"].map((reason) => (
                  <option key={reason}>{reason}</option>
                ))}
              </select>
            </label>
            <textarea {...register("comments")} rows={5} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white" placeholder="Comments" />
            <Button type="submit" variant="danger" icon={FiSlash}>Reject Button</Button>
          </div>
        )}

        {type === "documents" && (
          <div className="mt-4 space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {["Updated Aadhaar", "PAN", "Income Proof", "Address Proof", "Selfie", "Additional Documents"].map((doc) => (
                <label key={doc} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  <input type="checkbox" {...register(doc)} /> {doc}
                </label>
              ))}
            </div>
            <Button type="submit" icon={FiSend}>Send Request</Button>
          </div>
        )}
      </motion.form>
    </div>
  );
}

function RightSidebar({ parents }) {
  const highRisk = parents.filter((parent) => parent.riskLevel === "High");
  const pending = parents.filter((parent) => parent.status === "Pending" || parent.status === "Under Review");
  const approved = parents.filter((parent) => parent.status === "Verified" || parent.status === "Approved");

  return (
    <aside className="space-y-4 xl:sticky xl:top-40 xl:self-start">
      <SidebarPanel title="Recent Registrations" items={parents.slice(0, 3).map((parent) => `${parent.name} - ${parent.id}`)} icon={FiFileText} />
      <SidebarPanel title="Recent Approvals" items={approved.map((parent) => `${parent.name} - activated`)} icon={FiCheckCircle} />
      <SidebarPanel title="High Risk Alerts" items={highRisk.map((parent) => `${parent.name} - trust ${parent.trustScore}`)} icon={FiAlertTriangle} alert />
      <SidebarPanel title="Pending Reviews" items={pending.map((parent) => `${parent.name} - ${parent.status}`)} icon={FiClock} />
    </aside>
  );
}

function SidebarPanel({ title, items, icon: Icon, alert = false }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className={classNames("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", alert ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400")}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-2 p-4">
        {items.length
          ? items.map((item) => (
              <p key={item} className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-medium leading-snug text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</p>
            ))
          : <p className="py-2 text-xs text-slate-400 dark:text-slate-500">No records</p>
        }
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      {children}
    </section>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid flex-1 gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-[11px] font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function DocumentCard({ name }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <FiFileText className="h-5 w-5 text-civic-600" />
        <Badge label="Verified" className="bg-emerald-50 text-emerald-700 ring-emerald-200" />
      </div>
      <p className="mt-3 text-sm font-extrabold text-slate-950 dark:text-white">{name}</p>
      <div className="mt-3 flex gap-2">
        <IconButton label="Preview" icon={FiEye} />
        <IconButton label="Download" icon={FiDownload} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, highlight = false, wide = false }) {
  return (
    <div className={classNames("rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950", wide && "sm:col-span-2", highlight && "border-civic-200 bg-civic-50")}>
      <p className="text-[11px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function Avatar({ initials, risk, large = false }) {
  return (
    <div className={classNames("flex shrink-0 items-center justify-center rounded-lg bg-civic-600 font-extrabold text-white shadow-sm", large ? "h-28 w-28 text-3xl" : "h-11 w-11 text-sm", risk === "High" && "bg-red-600")}>
      {initials}
    </div>
  );
}

function Badge({ label, className = "" }) {
  return <span className={classNames("inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ring-1 ring-inset", className || "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700")}>{label}</span>;
}

function TrustMeter({ score }) {
  const tone = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-28">
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
        <span>{score}%</span>
        <span>AI</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={classNames("h-2 rounded-full", tone)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function IconButton({ label, icon: Icon, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={classNames(
        "inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-extrabold transition",
        danger ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function SkeletonTable() {
  return (
    <div className="section-card">
      <div className="section-card-header">
        <div className="flex items-center gap-2 text-sm font-semibold text-civic-600 dark:text-civic-400">
          <FiSearch className="h-4 w-4 animate-pulse" /> Searching verification records…
        </div>
      </div>
      <div className="space-y-3 p-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <FiShield className="h-12 w-12 text-slate-300" />
      <h3 className="mt-3 text-lg font-extrabold text-slate-950 dark:text-white">No matching parent applications</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">Adjust the search or filter criteria to continue reviewing parent verification records.</p>
    </div>
  );
}

function NotificationToast({ message }) {
  const icons = {
    "Parent Approved": FiCheckCircle,
    "Application Rejected": FiSlash,
    "Documents Requested": FiFileText,
    "Issue Resolved": FiMessageSquare,
    "Verification Completed": FiShield
  };
  const Icon = icons[message] || FiCheckCircle;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-2xl">
      <Icon className="h-5 w-5 text-civic-100" />
      {message}
    </motion.div>
  );
}

function labelize(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
