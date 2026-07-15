import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiLock, FiMail, FiShield, FiUserCheck, FiUsers,
  FiEye, FiEyeOff, FiCheck, FiArrowRight, FiZap
} from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../utils/constants";

/* ─── Role config ───────────────────────────────────── */
const roleConfig = {
  admin:     { label: "Administrator", icon: FiShield,    selectedBg: "bg-indigo-600",  selectedRing: "ring-indigo-500/30" },
  parent:    { label: "Parent",        icon: FiUserCheck, selectedBg: "bg-emerald-600", selectedRing: "ring-emerald-500/30" },
  orphanage: { label: "Orphanage",     icon: FiHome,      selectedBg: "bg-civic-600",   selectedRing: "ring-civic-500/30" },
};

const heroStats = [
  { label: "Children Protected",    value: "1,248", icon: FiUsers },
  { label: "Orphanages Monitored",  value: "18",    icon: FiHome },
  { label: "AI Safety Score",       value: "94%",   icon: FiShield },
  { label: "Active Alerts",         value: "7",     icon: FiZap },
];

const trustBadges = [
  "Government Verified Platform",
  "AI-Powered Safety Engine",
  "256-bit SSL Encryption",
  "DPDP Act Compliant",
];

/* ─── Main export ───────────────────────────────────── */
export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError]               = useState("");
  const [authMode, setAuthMode]         = useState("login");
  const [selectedRole, setSelectedRole] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ FIXED: Removed default values (no pre-filled credentials)
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const signupForm = useForm({ defaultValues: { hasAnotherChild: "no", otherChildStatus: "own" } });

  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const onSubmit = async (values) => {
    if (!selectedRole) { setError("Please select a role to continue."); return; }
    setError("");
    try {
      // ✅ FIXED: Backend will return user with correct role
      const loggedInUser = await login(values);
      navigate(roleHome[loggedInUser.role], { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const onSignupSubmit = (values) => {
    const apps = JSON.parse(localStorage.getItem("parent_signup_applications") || "[]");
    localStorage.setItem("parent_signup_applications",
      JSON.stringify([...apps, { id: `PSA-${Date.now()}`, submittedAt: new Date().toISOString(), ...values }])
    );
    setSignupSuccess("Application submitted for admin verification.");
    signupForm.reset({ hasAnotherChild: "no", otherChildStatus: "own" });
  };

  return (
    /* Root: white in light, near-black in dark */
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col lg:flex-row">

        {/* ── Left: dark hero panel – always dark regardless of theme ── */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-1 flex-col justify-center overflow-hidden
                     bg-gradient-to-br from-slate-950 via-[#0e1f3d] to-slate-900
                     px-8 py-12 text-white
                     lg:min-h-screen lg:w-[52%] lg:px-14 lg:py-16"
        >
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-civic-600/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 right-0  h-80 w-80 rounded-full bg-indigo-600/15 blur-[80px]" />
          {/* Subtle grid */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative z-10">
            {/* Live status pill */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Secure Government Platform · Live
            </div>

            {/* Brand icon + heading */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-500 to-indigo-600 shadow-lg shadow-civic-600/30 ring-1 ring-white/10">
              <FiShield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]">
              AI-Powered Child<br className="hidden sm:block" /> Safety System
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
              A secure, intelligent command center for orphanage oversight, child protection,
              guardian verification, and real-time safety monitoring.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {heroStats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3.5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8">
                    <Icon className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums leading-none text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  <FiCheck className="h-3 w-3 text-emerald-400" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Right: form panel – responds to light / dark theme ── */}
        <section className="flex flex-1 items-center justify-center
                            bg-slate-50 dark:bg-slate-950
                            px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">

            {/* Header row with theme toggle */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-civic-600 dark:text-civic-400">
                  Secure Access Portal
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {authMode === "login" ? "Sign in to continue" : "Parent Registration"}
                </h2>
              </div>
              <ThemeToggle />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                {authMode === "login" ? (
                  <LoginForm
                    register={register}
                    handleSubmit={handleSubmit}
                    formState={formState}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    error={error}
                    loading={loading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onSignup={() => setAuthMode("signup")}
                    onSubmit={onSubmit}
                  />
                ) : (
                  <ParentSignupForm
                    form={signupForm}
                    onSubmit={onSignupSubmit}
                    success={signupSuccess}
                    onBack={() => setAuthMode("login")}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

      </div>
    </main>
  );
}

/* ─── Login form ─────────────────────────────────────── */
function LoginForm({
  register, handleSubmit, formState, selectedRole, setSelectedRole,
  error, loading, showPassword, setShowPassword, onSignup, onSubmit,
}) {
  /* Shared field wrapper: white bg in light, dark in dark */
  const fieldWrapper =
    "flex items-center rounded-xl border px-3 transition " +
    "border-slate-300 bg-white focus-within:border-civic-500 focus-within:ring-2 focus-within:ring-civic-500/15 " +
    "dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-civic-500";

  const inputCls =
    "min-h-[42px] w-full bg-transparent text-sm outline-none " +
    "text-slate-900 placeholder:text-slate-400 " +
    "dark:text-white dark:placeholder:text-slate-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">

      {/* ✅ FIXED: Role selector now uses roleConfig object, not dummy users array */}
      <div className="mb-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select your role
        </p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(roleConfig).map(([roleKey, cfg]) => {
            const Icon = cfg.icon;
            const isSelected = selectedRole === roleKey;
            return (
              <motion.button
                key={roleKey}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedRole(roleKey)}
                className={
                  "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-all duration-150 " +
                  (isSelected
                    ? `${cfg.selectedBg} border-transparent text-white shadow-md`
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-civic-300 hover:bg-civic-50 hover:text-civic-700 " +
                      "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white")
                }
                aria-pressed={isSelected}
              >
                <Icon style={{ height: 18, width: 18 }} />
                <span className="text-[11px] font-semibold">{cfg.label}</span>
                {isSelected && <FiCheck className="h-3 w-3" />}
              </motion.button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onSignup}
          className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-3 py-2 text-[12px] font-medium text-slate-500 transition hover:border-civic-400 hover:text-civic-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-civic-500 dark:hover:text-civic-400"
        >
          New parent? Register here →
        </button>
      </div>

      {/* Credentials */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <div className={fieldWrapper}>
            <FiMail className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="email"
              className={inputCls}
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {formState.errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className={fieldWrapper}>
            <FiLock className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              className={inputCls}
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="ml-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {formState.errors.password && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formState.errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || !selectedRole}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-civic-600 to-indigo-600 px-4 py-3 text-[15px] font-semibold text-white shadow-btn-primary transition hover:from-civic-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : <><span>Sign In</span> <FiArrowRight className="h-4 w-4" /></>
          }
        </motion.button>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Protected by government-grade encryption · DPDP compliant
        </p>
      </form>
    </div>
  );
}

/* ─── Parent signup form ─────────────────────────────── */
function ParentSignupForm({ form, onSubmit, success, onBack }) {
  const { register, handleSubmit } = form;

  /* Light mode: white bg, slate-900 text. Dark mode: slate-800, white text */
  const fieldCls =
    "mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition " +
    "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 " +
    "focus:border-civic-500 focus:ring-2 focus:ring-civic-500/15 " +
    "dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 " +
    "dark:focus:border-civic-500";

  const labelCls = "block text-[13px] font-semibold text-slate-700 dark:text-slate-300";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Fill in your details to apply as a registered parent. An admin will verify and activate your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>Father Name
            <input placeholder="Full name" className={fieldCls} {...register("fatherName", { required: true })} />
          </label>
          <label className={labelCls}>Mother Name
            <input placeholder="Full name" className={fieldCls} {...register("motherName", { required: true })} />
          </label>
          <label className={labelCls}>Father Phone
            <input type="tel" placeholder="+91 XXXXX XXXXX" className={fieldCls} {...register("fatherPhone", { required: true })} />
          </label>
          <label className={labelCls}>Mother Phone
            <input type="tel" placeholder="+91 XXXXX XXXXX" className={fieldCls} {...register("motherPhone", { required: true })} />
          </label>
          <label className={labelCls}>Father Aadhaar
            <input placeholder="XXXX-XXXX-XXXX" className={fieldCls} {...register("fatherAadhaar", { required: true })} />
          </label>
          <label className={labelCls}>Mother Aadhaar
            <input placeholder="XXXX-XXXX-XXXX" className={fieldCls} {...register("motherAadhaar", { required: true })} />
          </label>
          <label className={labelCls}>Father Occupation
            <input placeholder="e.g. Teacher" className={fieldCls} {...register("fatherOccupation", { required: true })} />
          </label>
          <label className={labelCls}>Mother Occupation
            <input placeholder="e.g. Nurse" className={fieldCls} {...register("motherOccupation", { required: true })} />
          </label>
          <label className={labelCls}>Email
            <input type="email" placeholder="family@example.com" className={fieldCls} {...register("email", { required: true })} />
          </label>
          <label className={labelCls}>Voter ID
            <input placeholder="VTR-XXXX" className={fieldCls} {...register("voterId", { required: true })} />
          </label>
        </div>

        <label className={labelCls}>Address
          <textarea rows={2} placeholder="Full residential address" className={fieldCls} {...register("address", { required: true })} />
        </label>

        <label className={labelCls}>Financial Condition
          <textarea rows={2} placeholder="Briefly describe household income and stability" className={fieldCls} {...register("financialCondition", { required: true })} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>Has Another Child?
            <select className={fieldCls} {...register("hasAnotherChild")}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label className={labelCls}>Other Child Status
            <select className={fieldCls} {...register("otherChildStatus")}>
              <option value="own">Own child</option>
              <option value="adopted">Adopted child</option>
              <option value="not-applicable">Not applicable</option>
            </select>
          </label>
        </div>

        <label className={labelCls}>Reason for Adoption
          <textarea rows={3} placeholder="Why do you wish to adopt?" className={fieldCls} {...register("adoptionReason", { required: true })} />
        </label>

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            {success}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-none">
            ← Back
          </Button>
          <Button type="submit" fullWidth>Submit Application</Button>
        </div>
      </form>
    </div>
  );
}
