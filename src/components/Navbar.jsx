import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiBell, FiMoon, FiSun, FiChevronDown,
  FiLogOut, FiUser, FiSearch, FiX, FiCheck
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const roleColors = {
  admin:     "bg-indigo-600",
  orphanage: "bg-civic-600",
  parent:    "bg-emerald-600",
};

const mockNotifications = [
  { id: 1, title: "High Risk Alert", body: "Sara Ali flagged for welfare review", time: "5m ago", unread: true,  tone: "red"   },
  { id: 2, title: "Visit Approved",  body: "Parent visit confirmed for today",     time: "1h ago", unread: true,  tone: "green" },
  { id: 3, title: "KYC Pending",     body: "2 parent verifications awaiting review", time: "3h ago", unread: false, tone: "amber" },
];

const toneMap = {
  red:   "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
};

function NotificationDropdown({ onClose }) {
  const unreadCount = mockNotifications.filter((n) => n.unread).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white shadow-modal dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-civic-600 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
          <FiX className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {mockNotifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${n.unread ? "" : "opacity-60"}`}>
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${toneMap[n.tone]}`}>
              {n.unread ? <span className="h-2 w-2 rounded-full bg-current" /> : <FiCheck className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">{n.title}</p>
                <span className="shrink-0 text-[10px] text-slate-400 mt-0.5">{n.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
        <button className="text-xs font-semibold text-civic-600 hover:underline dark:text-civic-400">
          View all notifications →
        </button>
      </div>
    </motion.div>
  );
}

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const searchRef = useRef(null);
  const avatarBg  = roleColors[user?.role] ?? "bg-slate-600";
  const unread    = mockNotifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95 lg:px-6"
      style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)" }}
    >
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open navigation"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-civic-600 dark:text-civic-400 sm:block">
          Government Monitoring Console
        </p>
        <h1 className="truncate text-[15px] font-bold text-slate-900 dark:text-white leading-tight">{title}</h1>
      </div>

      {/* Search */}
      <div className="relative hidden sm:block">
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800"
            >
              <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                ref={searchRef}
                placeholder="Search records…"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Search"
            >
              <FiSearch className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label={isDark ? "Light mode" : "Dark mode"}
      >
        {isDark ? <FiSun className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} /> : <FiMoon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <FiBell style={{ height: 18, width: 18 }} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
              {unread}
            </span>
          )}
        </button>
        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="relative z-50">
                <NotificationDropdown onClose={() => setNotifOpen(false)} />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      <div className="relative ml-0.5">
        <button
          onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
          className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm ${avatarBg}`}>
            {user?.avatar}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-[10px] leading-tight text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <FiChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white py-1.5 shadow-modal dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${avatarBg}`}>
                      {user?.avatar}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                  <FiUser className="h-4 w-4" /> My Profile
                </button>
                <div className="mx-2 my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <FiLogOut className="h-4 w-4" /> Sign out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
