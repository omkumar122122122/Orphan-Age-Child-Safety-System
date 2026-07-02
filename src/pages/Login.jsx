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

export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [signupSuccess, setSignupSuccess] = useState("");
  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: { email: "admin@safety.gov", password: "admin123" }
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
    try {
      const loggedInUser = await login(values);
      navigate(roleHome[loggedInUser.role], { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const onSignupSubmit = (values) => {
    const applications = JSON.parse(localStorage.getItem("parent_signup_applications") || "[]");
    const application = {
      id: `PSA-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...values
    };
    localStorage.setItem("parent_signup_applications", JSON.stringify([...applications, application]));
    setSignupSuccess("Parent sign-up submitted for verification.");
    signupForm.reset({ hasAnotherChild: "no", otherChildStatus: "own" });
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative overflow-hidden flex min-h-[45vh] items-center bg-slate-950 px-6 py-12 text-white lg:h-screen lg:sticky lg:top-0 lg:self-start lg:px-12">
        {/* Decorative background glow circles */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-civic-600/20 blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none animate-float-reverse" />
        {/* Subtle tech grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl w-full">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-500 to-civic-700 shadow-lg shadow-civic-500/30 ring-4 ring-civic-500/10 animate-fade-in">
            <FiShield className="h-7 w-7 text-white" />
          </div>
          <p className="animate-fade-in text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            AI Child Welfare Command Center
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl animate-fade-in-up">
            AI-Powered <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-saffron bg-clip-text text-transparent">Child Safety</span> Management
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300/90 animate-fade-in-up-delay">
            Next-generation platform for real-time monitoring, automated risk detection, orphanage compliance tracking, and secure guardian integrations.
          </p>

          {/* Tech command center status grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md animate-fade-in-delay-2">
            <div className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Status</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <p className="text-lg font-bold text-emerald-400">24/7 Secure</p>
              </div>
            </div>
            <div className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Operations</p>
              <p className="mt-2 text-lg font-bold text-amber-400">Compliance A+</p>
            </div>
          </div>
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
                  className={`rounded-lg border py-2.5 text-left transition ${item.role === "parent" ? "px-3" : "px-2.5"} ${selectedRole === item.role
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
              onClick={() => {
                setSelectedRole(null);
                setAuthMode("signup");
              }}
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

function ParentSignupForm({ form, onSubmit, success }) {
  const { register, handleSubmit, formState } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput label="Father Name" icon={FiUserCheck} error={formState.errors.fatherName?.message} {...register("fatherName", { required: "Father name is required" })} />
        <FormInput label="Mother Name" icon={FiUserCheck} error={formState.errors.motherName?.message} {...register("motherName", { required: "Mother name is required" })} />
        <FormInput label="Father Phone Number" type="tel" icon={FiPhone} error={formState.errors.fatherPhone?.message} {...register("fatherPhone", { required: "Father phone is required" })} />
        <FormInput label="Mother Phone Number" type="tel" icon={FiPhone} error={formState.errors.motherPhone?.message} {...register("motherPhone", { required: "Mother phone is required" })} />
        <FormInput label="Father Aadhaar Card" icon={FiCreditCard} error={formState.errors.fatherAadhaar?.message} {...register("fatherAadhaar", { required: "Father Aadhaar is required" })} />
        <FormInput label="Mother Aadhaar Card" icon={FiCreditCard} error={formState.errors.motherAadhaar?.message} {...register("motherAadhaar", { required: "Mother Aadhaar is required" })} />
        <FormInput label="Father Occupation" icon={FiBriefcase} error={formState.errors.fatherOccupation?.message} {...register("fatherOccupation", { required: "Father occupation is required" })} />
        <FormInput label="Mother Occupation" icon={FiBriefcase} error={formState.errors.motherOccupation?.message} {...register("motherOccupation", { required: "Mother occupation is required" })} />
        <FormInput label="Email" type="email" icon={FiMail} error={formState.errors.email?.message} {...register("email", { required: "Email is required" })} />
        <FormInput label="Voter ID" icon={FiShield} error={formState.errors.voterId?.message} {...register("voterId", { required: "Voter ID is required" })} />
      </div>
      <TextArea label="Address" icon={FiHome} error={formState.errors.address?.message} {...register("address", { required: "Address is required" })} />
      <TextArea label="Financial Condition" icon={FiFileText} error={formState.errors.financialCondition?.message} {...register("financialCondition", { required: "Financial condition is required" })} />
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Do you have another child?" icon={FiUsers} {...register("hasAnotherChild")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
        <Select label="Other child status" icon={FiUsers} {...register("otherChildStatus")}>
          <option value="own">Own child</option>
          <option value="adopted">Adopted child</option>
          <option value="not-applicable">Not applicable</option>
        </Select>
      </div>
      <TextArea label="Other Child Details" icon={FiUsers} {...register("otherChildDetails")} />
      <TextArea label="Reason for Adoption" icon={FiFileText} error={formState.errors.adoptionReason?.message} {...register("adoptionReason", { required: "Reason for adoption is required" })} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput label="Income Proof File" type="file" icon={FiFileText} {...register("incomeProofFile")} />
        <FormInput label="Identity Proof File" type="file" icon={FiFileText} {...register("identityProofFile")} />
      </div>
      {success && <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{success}</p>}
      <Button type="submit" className="w-full">
        Submit Parent Sign Up
      </Button>
    </form>
  );
}

function TextArea({ label, error, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="mt-2 flex rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-inset focus-within:ring-civic-500 focus-within:ring-offset-0 dark:border-slate-700 dark:bg-slate-950">
        {Icon && <Icon className="mr-2 mt-1 h-4 w-4 text-slate-400" />}
        <textarea
          rows={3}
          className="w-full resize-y border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function Select({ label, icon: Icon, children, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="mt-2 flex items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-civic-500 focus-within:ring-offset-0 dark:border-slate-700 dark:bg-slate-950">
        {Icon && <Icon className="mr-2 h-4 w-4 text-slate-400" />}
        <select className="min-h-11 w-full border-0 bg-transparent text-sm text-slate-950 outline-none dark:text-white" {...props}>
          {children}
        </select>
      </div>
    </label>
  );
}
