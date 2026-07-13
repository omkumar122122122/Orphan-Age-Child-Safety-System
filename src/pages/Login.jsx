import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiBriefcase, FiCreditCard, FiFileText, FiHome, FiLock, FiMail, FiPhone, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { users } from "../data/dummyData";
import { roleHome, roleLabels } from "../utils/constants";

/* ── helpers ─────────────────────────────────────────────── */
const roleConfig = {
  admin:     { label: "Admin",     color: "bg-indigo-600",  light: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:border-indigo-500/30 dark:text-indigo-300 dark:bg-indigo-500/10" },
  parent:    { label: "Parent",    color: "bg-emerald-600", light: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/10" },
  orphanage: { label: "Orphanage", color: "bg-civic-600",   light: "bg-civic-50 border-civic-200 text-civic-700 dark:border-civic-500/30 dark:text-civic-300 dark:bg-civic-500/10" },
};

const stats = [
  { label: "Children Registered", value: "1,248" },
  { label: "Orphanages Monitored", value: "18" },
  { label: "AI Safety Score", value: "94%" },
  { label: "Active Alerts", value: "7" },
];

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [showPassword, setShowPassword]   = useState(false);

  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: { email: "admin@safety.gov", password: "admin123" },
  });
  const signupForm = useForm({
    defaultValues: {
      hasAnotherChild: "no",
      otherChildStatus: "own"
    }
  });

  if (user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  const onSubmit = async (values) => {
    setError("");

    if (!selectedRole) {
      setError("Please select a role before logging in.");
      return;
    }

    try {
      const loggedInUser = await login(values);
      navigate(roleHome[loggedInUser.role], { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const onSignupSubmit = (values) => {
    const apps = JSON.parse(localStorage.getItem("parent_signup_applications") || "[]");
    localStorage.setItem(
      "parent_signup_applications",
      JSON.stringify([...apps, { id: `PSA-${Date.now()}`, submittedAt: new Date().toISOString(), ...values }])
    );
    setSignupSuccess("Parent sign-up submitted for verification.");
    signupForm.reset({ hasAnotherChild: "no", otherChildStatus: "own" });
  };

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.1fr_0.9fr]">

      {/* ── Left panel: Brand + stats ─────────────────────── */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-sidebar px-8 py-10 lg:px-12 lg:py-14">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-civic-600/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl animate-float-reverse" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-civic-500 to-indigo-600 shadow-lg shadow-civic-600/30">
              <FiShield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Child Safety System</p>
              <p className="text-[11px] text-slate-500">Government of India</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mt-12">
            <p className="text-xs font-bold uppercase tracking-widest text-civic-400">
              AI Child Welfare Command Center
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl xl:text-[2.6rem]">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-civic-400 to-indigo-400 bg-clip-text text-transparent">
                Child Safety
              </span>
              <br />Management
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Real-time AI monitoring, risk detection, orphanage compliance tracking, and secure guardian verification — all in one platform.
            </p>
          </div>

          {/* Stats grid */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="relative z-10 mt-10 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <p className="text-xs font-medium text-slate-500">System operational · 24/7 Monitoring active</p>
        </div>
      </section>
      <section className="relative overflow-hidden flex items-center justify-center px-4 py-10">
        {/* Decorative background glow circles on the right side */}
        <div className="absolute right-10 top-1/4 h-72 w-72 rounded-full bg-civic-500/10 dark:bg-civic-500/5 blur-3xl pointer-events-none animate-float" />
        <div className="absolute left-10 bottom-1/4 h-72 w-72 rounded-full bg-amber-500/5 dark:bg-amber-500/5 blur-3xl pointer-events-none animate-float-reverse" />

        <div className={`relative z-10 glass-panel w-full rounded-xl p-6 transition-all duration-300 animate-scale-in ${authMode === "signup" ? "max-w-3xl" : "max-w-md"}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {authMode === "login" ? "Secure Login" : "Parent Sign Up"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {authMode === "login" ? "Choose a demo role to continue." : "Submit adoption parent details for verification."}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex flex-wrap justify-center sm:justify-between">
              {users.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(item.role);
                    setAuthMode("login");
                    setValue("email", item.email);
                    setValue("password", item.password);
                  }}
                  className={`rounded-lg border px-2.5 py-2.5 text-left transition ${selectedRole === item.role
                    ? "border-civic-500 bg-civic-50 shadow-sm dark:border-civic-400 dark:bg-civic-500/10"
                    : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
                    }`}
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{roleLabels[item.role]}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className="mt-3 w-full rounded-lg border border-civic-200 bg-white px-3 py-2 text-sm font-semibold text-civic-700 transition hover:bg-civic-50 dark:border-civic-500/30 dark:bg-slate-950 dark:text-civic-300 dark:hover:bg-civic-500/10"
            >
              Sign up as parent
            </button>
          </div>
          {authMode === "login" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                label="Email"
                type="email"
                icon={FiMail}
                error={formState.errors.email?.message}
                {...register("email", { required: "Email is required" })}
              />
              <FormInput
                label="Password"
                type="password"
                icon={FiLock}
                error={formState.errors.password?.message}
                {...register("password", { required: "Password is required" })}
              />
              {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying" : "Login"}
              </Button>
            </form>
          ) : (
            <ParentSignupForm form={signupForm} onSubmit={onSignupSubmit} success={signupSuccess} />
          )}
        </div>
      </section>
    </main>
  );
}

/* ── Parent signup form ───────────────────────────────────── */
function ParentSignupForm({ form, onSubmit, success, onBack }) {
  const { register, handleSubmit, formState } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput label="Father Name"         icon={FiUserCheck} error={formState.errors.fatherName?.message}     {...register("fatherName",     { required: "Father name is required" })} />
        <FormInput label="Mother Name"         icon={FiUserCheck} error={formState.errors.motherName?.message}     {...register("motherName",     { required: "Mother name is required" })} />
        <FormInput label="Father Phone"        type="tel"  icon={FiPhone}     error={formState.errors.fatherPhone?.message}    {...register("fatherPhone",    { required: "Father phone is required" })} />
        <FormInput label="Mother Phone"        type="tel"  icon={FiPhone}     error={formState.errors.motherPhone?.message}    {...register("motherPhone",    { required: "Mother phone is required" })} />
        <FormInput label="Father Aadhaar"      icon={FiCreditCard} error={formState.errors.fatherAadhaar?.message} {...register("fatherAadhaar",  { required: "Father Aadhaar is required" })} />
        <FormInput label="Mother Aadhaar"      icon={FiCreditCard} error={formState.errors.motherAadhaar?.message} {...register("motherAadhaar",  { required: "Mother Aadhaar is required" })} />
        <FormInput label="Father Occupation"   icon={FiBriefcase}  error={formState.errors.fatherOccupation?.message} {...register("fatherOccupation", { required: "Required" })} />
        <FormInput label="Mother Occupation"   icon={FiBriefcase}  error={formState.errors.motherOccupation?.message} {...register("motherOccupation", { required: "Required" })} />
        <FormInput label="Email"               type="email" icon={FiMail}    error={formState.errors.email?.message}         {...register("email",          { required: "Email is required" })} />
        <FormInput label="Voter ID"            icon={FiShield}     error={formState.errors.voterId?.message}        {...register("voterId",        { required: "Voter ID is required" })} />
      </div>

      <SignupTextArea label="Address"            icon={FiHome}     error={formState.errors.address?.message}           {...register("address",           { required: "Address is required" })} />
      <SignupTextArea label="Financial Condition" icon={FiFileText} error={formState.errors.financialCondition?.message} {...register("financialCondition", { required: "Required" })} />

      <div className="grid gap-4 md:grid-cols-2">
        <SignupSelect label="Do you have another child?" icon={FiUsers} {...register("hasAnotherChild")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </SignupSelect>
        <SignupSelect label="Other child status" icon={FiUsers} {...register("otherChildStatus")}>
          <option value="own">Own child</option>
          <option value="adopted">Adopted child</option>
          <option value="not-applicable">Not applicable</option>
        </SignupSelect>
      </div>

      <SignupTextArea label="Other Child Details"  icon={FiUsers}    {...register("otherChildDetails")} />
      <SignupTextArea label="Reason for Adoption"  icon={FiFileText} error={formState.errors.adoptionReason?.message} {...register("adoptionReason", { required: "Required" })} />

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput label="Income Proof File"   type="file" icon={FiFileText} {...register("incomeProofFile")} />
        <FormInput label="Identity Proof File" type="file" icon={FiFileText} {...register("identityProofFile")} />
      </div>

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-none">
          ← Back
        </Button>
        <Button type="submit" className="flex-1">
          Submit Application
        </Button>
      </div>
    </form>
  );
}

function SignupTextArea({ label, error, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="mt-1.5 flex rounded-xl border border-gray-200 bg-white px-3 py-2 transition focus-within:border-civic-500 focus-within:ring-2 focus-within:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800">
        {Icon && <Icon className="mr-2.5 mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
        <textarea rows={3} className="w-full resize-y border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" {...props} />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </label>
  );
}

function SignupSelect({ label, icon: Icon, children, ...props }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="mt-1.5 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition focus-within:border-civic-500 focus-within:ring-2 focus-within:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800">
        {Icon && <Icon className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />}
        <select className="min-h-[38px] w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" {...props}>
          {children}
        </select>
      </div>
    </label>
  );
}
