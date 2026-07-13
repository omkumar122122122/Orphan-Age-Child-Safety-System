import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiBriefcase, FiCreditCard, FiFileText, FiHome, FiLock,
  FiMail, FiPhone, FiShield, FiUserCheck, FiUsers, FiEye, FiEyeOff
} from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  { label: "Children Registered", value: "1,248", icon: FiUsers },
  { label: "Orphanages Monitored", value: "18", icon: FiHome },
  { label: "AI Safety Score", value: "94%", icon: FiShield },
  { label: "Active Alerts", value: "7", icon: FiFileText },
];

export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError]           = useState("");
  const [authMode, setAuthMode]     = useState("login");
  const [selectedRole, setSelectedRole] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState("");
  const [showPassword, setShowPassword]   = useState(false);

  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: { email: "admin@safety.gov", password: "admin123" },
  });
  const signupForm = useForm({ defaultValues: { hasAnotherChild: "no", otherChildStatus: "own" } });

  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const onSubmit = async (values) => {
    if (!selectedRole) {
      setError("Please select a role first.");
      return;
    }

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
    localStorage.setItem(
      "parent_signup_applications",
      JSON.stringify([...apps, { id: `PSA-${Date.now()}`, submittedAt: new Date().toISOString(), ...values }])
    );
    setSignupSuccess("Parent sign-up submitted for verification.");
    signupForm.reset({ hasAnotherChild: "no", otherChildStatus: "own" });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex flex-1 items-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 px-6 py-10 text-white sm:px-8 lg:min-h-screen lg:w-[55%] lg:px-12 lg:py-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.18),_transparent_34%)]" />
          <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 right-0 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />

          <div className="relative z-10 w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-200 backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]" />
              Secure Government Platform
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-7"
            >
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
                AI-Powered Child Safety Management System
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                A secure, intelligent command center for orphanage oversight, child protection, guardian verification, and real-time safety intelligence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex justify-center rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-[0_20px_60px_-28px_rgba(2,6,23,0.9)] backdrop-blur-xl sm:justify-start"
            >
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-violet-500/30 shadow-[0_0_45px_rgba(56,189,248,0.2)]">
                <div className="absolute inset-3 rounded-[18px] border border-white/20" />
                <FiShield className="h-10 w-10 text-cyan-200" />
              </div>
            </motion.div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.22)] backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-cyan-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">{item.label}</p>
                        <p className="mt-1 text-xl font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-slate-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              System operational · 24/7 monitoring active
            </div>
          </div>
        </motion.section>

        <section className="flex flex-1 items-center justify-center bg-slate-950/70 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className={`w-full rounded-[24px] border border-white/20 bg-white/80 p-6 shadow-[0_28px_90px_-24px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/80 sm:p-8 ${authMode === "signup" ? "max-w-2xl" : "max-w-md"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-cyan-400">
                    Secure Access
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {authMode === "login" ? "Welcome back" : "Parent Registration"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {authMode === "login" ? "Select a role and sign in to continue." : "Submit details for admin verification."}
                  </p>
                </div>
                <ThemeToggle />
              </div>

              <div className="mt-6">
                {authMode === "login" ? (
                  <>
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-2 shadow-inner dark:border-slate-700 dark:bg-slate-800/70">
                      <div className="grid grid-cols-3 gap-2">
                        {users.map((item) => {
                          const cfg = roleConfig[item.role];
                          const isSelected = selectedRole === item.role;
                          return (
                            <motion.button
                              key={item.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              aria-pressed={isSelected}
                              onClick={() => {
                                setSelectedRole(item.role);
                                setAuthMode("login");
                                setValue("email", item.email);
                                setValue("password", item.password);
                              }}
                              className={`rounded-xl border px-2.5 py-2.5 text-center text-[11px] font-semibold tracking-[0.04em] transition-all ${
                                isSelected
                                  ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-slate-700/80"
                              }`}
                            >
                              {roleLabels[item.role]}
                            </motion.button>
                          );
                        })}
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedRole(null); setAuthMode("signup"); }}
                        className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
                      >
                        Sign up as parent →
                      </motion.button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                      <FormInput
                        label="Email address"
                        type="email"
                        icon={FiMail}
                        error={formState.errors.email?.message}
                        aria-label="Email address"
                        {...register("email", { required: "Email is required" })}
                      />
                      <div className="relative">
                        <FormInput
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          icon={FiLock}
                          error={formState.errors.password?.message}
                          aria-label="Password"
                          {...register("password", { required: "Password is required" })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label="Toggle password visibility"
                          className="absolute bottom-0 right-3 flex h-[38px] items-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                          tabIndex={-1}
                        >
                          {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                        </button>
                      </div>

                      {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                          {error}
                        </div>
                      )}

                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:via-cyan-600 hover:to-indigo-700"
                          loading={loading}
                          disabled={!selectedRole}
                        >
                          {loading ? "Verifying…" : "Sign In"}
                        </Button>
                      </motion.div>
                    </form>
                  </>
                ) : (
                  <ParentSignupForm
                    form={signupForm}
                    onSubmit={onSignupSubmit}
                    success={signupSuccess}
                    onBack={() => setAuthMode("login")}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
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
