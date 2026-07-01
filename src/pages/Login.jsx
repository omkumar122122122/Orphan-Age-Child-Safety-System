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
      <section className="flex min-h-[42vh] items-center bg-slate-950 px-6 py-12 text-white lg:min-h-screen lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-civic-600">
            <FiShield className="h-8 w-8" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">AI Child Welfare Command Center</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            AI Based Child Safety Management System for Orphanages
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Role-based monitoring for child records, risk flags, orphanage compliance, guardian communication, and safety reporting.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {users.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setValue("email", item.email);
                  setValue("password", item.password);
                }}
                className="rounded-xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15"
              >
                <p className="text-sm font-bold">{roleLabels[item.role]}</p>
                <p className="mt-1 text-xs text-slate-300">{item.email}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className={`glass-panel w-full rounded-xl p-6 ${authMode === "signup" ? "max-w-3xl" : "max-w-md"}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {authMode === "login" ? "Secure Login" : "Parent Sign Up"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {authMode === "login" ? "Use one of the demo accounts." : "Submit adoption parent details for verification."}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                authMode === "login" ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                authMode === "signup" ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500"
              }`}
            >
              Parent Sign Up
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
      <div className="mt-2 flex rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
        {Icon && <Icon className="mr-2 mt-1 h-4 w-4 text-slate-400" />}
        <textarea
          rows={3}
          className="focus-ring w-full resize-y border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
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
      <div className="mt-2 flex items-center rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
        {Icon && <Icon className="mr-2 h-4 w-4 text-slate-400" />}
        <select className="focus-ring min-h-11 w-full border-0 bg-transparent text-sm text-slate-950 outline-none dark:text-white" {...props}>
          {children}
        </select>
      </div>
    </label>
  );
}
