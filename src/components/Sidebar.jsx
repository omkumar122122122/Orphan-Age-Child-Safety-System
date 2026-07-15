import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiChevronRight, FiLogOut, FiChevronLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { classNames } from "../utils/formatters";

const roleAccent = {
  admin:     { dot: "bg-indigo-500", label: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20" },
  orphanage: { dot: "bg-civic-500",  label: "bg-civic-500/15 text-civic-300 border-civic-500/20" },
  parent:    { dot: "bg-emerald-500",label: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" },
};

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive }) =>
        classNames(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          isActive
            ? "bg-white/12 text-white shadow-sm"
            : "text-slate-400 hover:bg-white/6 hover:text-slate-200"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="activeNav"
              className="absolute inset-0 rounded-xl bg-white/10"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
            <item.icon
              className={classNames(
                "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              )}
            />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="relative flex-1 truncate"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {!collapsed && isActive && (
            <FiChevronRight className="relative h-3.5 w-3.5 shrink-0 opacity-60" />
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ navItems, roleLabel, user, collapsed, onToggle, onLogout }) {
  const accent = roleAccent[user?.role] ?? roleAccent.admin;

  return (
    <div className="flex h-full flex-col">
      {/* ── Brand ──────────────────────────────── */}
      <div className={classNames("flex items-center gap-3 px-3 py-5", collapsed ? "justify-center" : "px-4")}>
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-civic-500 to-indigo-600 shadow-lg shadow-civic-600/30 ring-1 ring-white/10">
          <FiShield className="h-[18px] w-[18px] text-white" />
          <span className={classNames("absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-sidebar", accent.dot)} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="min-w-0"
            >
              <p className="truncate text-[13px] font-bold leading-tight text-white">Child Safety</p>
              <span className={classNames("mt-1 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", accent.label)}>
                {roleLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ────────────────────────────── */}
      <div className="mx-4 h-px bg-white/6" />

      {/* ── Navigation ─────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Sidebar navigation">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* ── Divider ────────────────────────────── */}
      <div className="mx-4 h-px bg-white/6" />

      {/* ── User profile footer ─────────────────── */}
      {user && (
        <div className={classNames("px-3 py-3", collapsed ? "px-3" : "")}>
          <div className={classNames("flex items-center gap-3 rounded-xl px-2 py-2.5", collapsed ? "justify-center" : "")}>
            <div className={classNames(
              "flex shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm",
              "h-8 w-8",
              user.role === "admin" ? "bg-indigo-600" : user.role === "parent" ? "bg-emerald-600" : "bg-civic-600"
            )}>
              {user.avatar}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-[13px] font-semibold leading-tight text-white">{user.name}</p>
                  <p className="truncate text-[11px] text-slate-500 capitalize">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={onLogout}
            className={classNames(
              "group mt-1 flex w-full items-center gap-3 rounded-xl px-2 py-2 text-xs font-medium text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400",
              collapsed ? "justify-center" : ""
            )}
            aria-label="Sign out"
          >
            <FiLogOut className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}

      {/* ── Collapse toggle (desktop) ─────────── */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center border-t border-white/6 py-3 text-slate-500 transition hover:text-slate-300"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronLeft className="h-4 w-4" />
        </motion.span>
      </button>
    </div>
  );
}

export default function Sidebar({ navItems, roleLabel, mobile = false }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (mobile) {
    return (
      <div className="h-full w-full overflow-y-auto bg-sidebar">
        <SidebarContent
          navItems={navItems}
          roleLabel={roleLabel}
          user={user}
          collapsed={false}
          onToggle={() => {}}
          onLogout={logout}
        />
      </div>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden lg:flex lg:flex-col lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-sidebar overflow-hidden z-10"
      style={{ boxShadow: "4px 0 32px rgba(15,23,42,0.20)" }}
    >
      <SidebarContent
        navItems={navItems}
        roleLabel={roleLabel}
        user={user}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        onLogout={logout}
      />
    </motion.aside>
  );
}
