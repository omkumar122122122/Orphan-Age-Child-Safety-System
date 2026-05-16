import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBriefcase, FiCreditCard, FiFileText, FiHome, FiLock,
  FiMail, FiPhone, FiShield, FiUserCheck, FiUsers, FiEye,
  FiEyeOff, FiCheck, FiArrowRight, FiStar, FiZap
} from "react-icons/fi";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { users } from "../data/dummyData";
import { roleHome, roleLabels } from "../utils/constants";

const roleConfig = {
  admin:     { label: "Administrator", icon: FiShield,    color: "from-indigo-600 to-indigo-700",  ring: "ring-indigo-500/30",  light: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300" },
  parent:    { label: "Parent",        icon: FiUserCheck, color: "from-emerald-600 to-emerald-700",ring: "ring-emerald-500/30", light: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300" },
  orphanage: { label: "Orphanage",     icon: FiHome,      color: "from-civic-600 to-civic-700",   ring: "ring-civic-500/30",   light: "bg-civic-50 border-civic-200 text-civic-700 dark:bg-civic-500/10 dark:border-civic-500/30 dark:text-civic-300" },
};

const heroStats = [
  { label: "Children Protected", value: "1,248", icon: FiUsers },
  { label: "Orphanages Monitored", value: "18",  icon: FiHome },
  { label: "AI Safety Score",    value: "94%",   icon: FiShield },
  { label: "Active Alerts",      value: "7",     icon: FiZap },
];

const trustBadges = [
  "Government Verified Platform",
  "AI-Powered Safety Engine",
  "256-bit SSL Encryption",
  "DPDP Act Compliant",
];

export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError]               = useState("");
  const [authMode, setAuthMode]         = useState("login");
  const [selectedRole, setSelectedRole] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: { email: "admin@safety.gov", password: "admin123" },
  });
  const signupForm = useForm({ defaultValues: { hasAnotherChild: "no", otherChildStatus: "own" } });

  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const onSubmit = async (values) => {
    if (!selectedRole) { setError("Please select a role to continue."); return; }
    setError("");
    try {
      const loggedInUser = await login(values);
      navigate(roleHome[loggedInUser.role], { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const onSignupSubmit = (values) => {
    const apps = JSON.parse(localStorage.getItem("parent_signup_applications") || "[]");
    localStorage.setItem("parent_signup_applications", JSON.stringify([...apps, { id: `PSA-${Date.now()}`, submittedAt: new Date().toISOString(), ...values }]));
    setSignupSuccess("Application submitted for admin verification.");
    signupForm.reset({ hasAnotherChild: "no", otherChildStatus: "own" });
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col lg:flex-row">

        {/* ── Left Panel ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-1 flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#0e1f3d] to-slate-900 px-8 py-12 text-white lg:min-h-screen lg:w-[52%] lg:px-14 lg:py-16"
        >
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-civic-600/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[100px]" />
          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative z-10">
            {/* System status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Secure Government Platform · Live
            </motion.div>

            {/* Brand */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-500 to-indigo-600 shadow-lg shadow-civic-600/30 ring-1 ring-white/10">
                <FiShield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
                AI-Powered Child<br className="hidden sm:block" /> Safety System
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
                A secure, intelligent command center for orphanage oversight, child protection, guardian verification, and real-time safety monitoring.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-10 grid grid-cols-2 gap-3"
            >
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3.5 backdrop-blur-sm transition hover:bg-white/10">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8">
                      <Icon className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <p className="mt-0.5 text-lg font-bold tabular-nums text-white leading-none">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {trustBadges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  <FiCheck className="h-3 w-3 text-emerald-400" />{badge}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ── Right Panel ────────────────────────────────── */}
        <section className="flex flex-1 items-center justify-center bg-slate-900/40 px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-civic-400">Secure Access Portal</p>
                <h2 className="mt-1 text-2xl font-bold text-white">
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
                    setValue={setValue}
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

/* ── Login form ───────────────────────────────────────── */
function LoginForm({ register, handleSubmit, formState, selectedRole, setSelectedRole, setValue, error, loading, showPassword, setShowPassword, onSignup, onSubmit }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl dark:bg-white/3">
      {/* Role selector */}
      <div className="mb-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Select your role</p>
        <div className="grid grid-cols-3 gap-2">
          {users.map((u) => {
            const cfg = roleConfig[u.role];
            const Icon = cfg.icon;
            const isSelected = selectedRole === u.role;
            return (
              <motion.button
                key={u.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedRole(u.role);
                  setValue("email", u.email);
                  setValue("password", u.password);
                }}
                className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-all duration-150 ${
                  isSelected
                    ? `bg-gradient-to-b ${cfg.color} border-transparent text-white shadow-md`
                    : "border-white/10 bg-white/4 text-slate-400 hover:bg-white/8 hover:text-white hover:border-white/20"
                }`}
                aria-pressed={isSelected}
              >
                <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                <span className="text-[11px] font-semibold">{cfg.label}</span>
                {isSelected && <FiCheck className="h-3 w-3" />}
              </motion.button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onSignup}
          className="mt-2 w-full rounded-xl border border-dashed border-white/15 px-3 py-2 text-[12px] font-medium text-slate-400 transition hover:border-civic-500/50 hover:text-civic-400"
        >
          New parent? Register here →
        </button>
      </div>

      {/* Credentials */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-300">Email address</label>
          <div className="flex items-center rounded-xl border border-white/10 bg-white/6 px-3 transition focus-within:border-civic-500/60 focus-within:ring-2 focus-within:ring-civic-500/20">
            <FiMail className="mr-2.5 h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="email"
              className="min-h-[42px] w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {formState.errors.email && <p className="mt-1 text-xs text-red-400">{formState.errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-300">Password</label>
          <div className="flex items-center rounded-xl border border-white/10 bg-white/6 px-3 transition focus-within:border-civic-500/60 focus-within:ring-2 focus-within:ring-civic-500/20">
            <FiLock className="mr-2.5 h-4 w-4 shrink-0 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              className="min-h-[42px] w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-slate-500 transition hover:text-slate-300" aria-label="Toggle password">
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {formState.errors.password && <p className="mt-1 text-xs text-red-400">{formState.errors.password.message}</p>}
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || !selectedRole}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-civic-600 to-indigo-600 px-4 py-3 text-[15px] font-semibold text-white shadow-lg shadow-civic-600/25 transition hover:from-civic-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>Sign In <FiArrowRight className="h-4 w-4" /></>
          )}
        </motion.button>

        <p className="text-center text-[11px] text-slate-500">
          Protected by government-grade encryption · DPDP compliant
        </p>
      </form>
    </div>
  );
}

/* ── Parent signup ───────────────────────────────────── */
function ParentSignupForm({ form, onSubmit, success, onBack }) {
  const { register, handleSubmit, formState } = form;
  const fieldCls = "mt-1.5 w-full rounded-xl border border-white/10 bg-white/6 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-civic-500/60 focus:ring-2 focus:ring-civic-500/20";
  const labelCls = "block text-[13px] font-semibold text-slate-300";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="mb-5 text-sm text-slate-400 leading-relaxed">Fill in your details to apply as a registered parent. An admin will verify and activate your account.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>Father Name<input placeholder="Full name" className={fieldCls} {...register("fatherName", { required: true })} /></label>
          <label className={labelCls}>Mother Name<input placeholder="Full name" className={fieldCls} {...register("motherName", { required: true })} /></label>
          <label className={labelCls}>Father Phone<input type="tel" placeholder="+91 XXXXX XXXXX" className={fieldCls} {...register("fatherPhone", { required: true })} /></label>
          <label className={labelCls}>Mother Phone<input type="tel" placeholder="+91 XXXXX XXXXX" className={fieldCls} {...register("motherPhone", { required: true })} /></label>
          <label className={labelCls}>Father Aadhaar<input placeholder="XXXX-XXXX-XXXX" className={fieldCls} {...register("fatherAadhaar", { required: true })} /></label>
          <label className={labelCls}>Mother Aadhaar<input placeholder="XXXX-XXXX-XXXX" className={fieldCls} {...register("motherAadhaar", { required: true })} /></label>
          <label className={labelCls}>Father Occupation<input placeholder="e.g. Teacher" className={fieldCls} {...register("fatherOccupation", { required: true })} /></label>
          <label className={labelCls}>Mother Occupation<input placeholder="e.g. Nurse" className={fieldCls} {...register("motherOccupation", { required: true })} /></label>
          <label className={labelCls}>Email<input type="email" placeholder="family@example.com" className={fieldCls} {...register("email", { required: true })} /></label>
          <label className={labelCls}>Voter ID<input placeholder="VTR-XXXX" className={fieldCls} {...register("voterId", { required: true })} /></label>
        </div>
        <label className={labelCls}>Address<textarea rows={2} placeholder="Full residential address" className={fieldCls} {...register("address", { required: true })} /></label>
        <label className={labelCls}>Financial Condition<textarea rows={2} placeholder="Briefly describe household income and stability" className={fieldCls} {...register("financialCondition", { required: true })} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>Has Another Child?
            <select className={fieldCls} {...register("hasAnotherChild")}><option value="no">No</option><option value="yes">Yes</option></select>
          </label>
          <label className={labelCls}>Other Child Status
            <select className={fieldCls} {...register("otherChildStatus")}><option value="own">Own child</option><option value="adopted">Adopted child</option><option value="not-applicable">Not applicable</option></select>
          </label>
        </div>
        <label className={labelCls}>Reason for Adoption<textarea rows={3} placeholder="Why do you wish to adopt?" className={fieldCls} {...register("adoptionReason", { required: true })} /></label>

        {success && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300">{success}</div>
        )}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="ghost" onClick={onBack} className="flex-none text-slate-400 hover:text-white">← Back</Button>
          <Button type="submit" fullWidth>Submit Application</Button>
        </div>
      </form>
    </div>
  );
}
