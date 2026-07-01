import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" icon={FiMenu} onClick={onMenuClick} className="px-3 lg:hidden" aria-label="Open navigation" />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-civic-600 dark:text-civic-100">Government Monitoring Console</p>
            <h2 className="truncate text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-900 md:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-civic-600 text-xs font-bold text-white">{user?.avatar}</span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.department}</p>
            </div>
          </div>
          <Button variant="danger" icon={FiLogOut} onClick={logout} className="px-3">
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
