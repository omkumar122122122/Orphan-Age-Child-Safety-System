import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail, FiShield } from "react-icons/fi";
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
  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: { email: "admin@safety.gov", password: "admin123" }
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
        <div className="glass-panel w-full max-w-md rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Secure Login</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use one of the demo accounts.</p>
            </div>
            <ThemeToggle />
          </div>
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
        </div>
      </section>
    </main>
  );
}
