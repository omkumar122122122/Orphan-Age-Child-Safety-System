import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-panel max-w-lg rounded-xl p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-600 dark:text-civic-100">404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">The requested route is not available in this frontend prototype.</p>
        <Link to="/login" className="mt-6 inline-block">
          <Button>Return to Login</Button>
        </Link>
      </section>
    </main>
  );
}
