import { useState } from "react";
import { FiMenu, FiBell, FiMoon, FiSun, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 lg:px-6">
      {/* Left: hamburger + title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <p className="hidden text-[10px] font-bold uppercase tracking-widest text-civic-600 dark:text-civic-400 sm:block">
            Government Monitoring Console
          </p>
          <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">{title}</h1>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <FiSun className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} /> : <FiMoon className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} />}
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <FiBell style={{ height: "18px", width: "18px" }} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Profile dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-civic-600 text-xs font-bold text-white">
              {user?.avatar}
            </span>
            <div className="hidden text-left sm:block">
              <p className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">{user?.department}</p>
            </div>
            <FiChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1.5 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-modal dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-gray-100 px-4 py-3 dark:border-slate-700">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
