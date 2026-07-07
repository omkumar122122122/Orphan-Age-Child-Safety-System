import { NavLink } from "react-router-dom";
import { FiShield, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { classNames } from "../utils/formatters";

/* ── Sidebar nav section groups ─────────────────────────── */
function groupNavItems(navItems) {
  // Single flat group – we just render them all together
  return [{ items: navItems }];
}

export default function Sidebar({ navItems, roleLabel, mobile = false }) {
  const { user } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-civic-500 to-indigo-600 shadow-lg shadow-civic-600/30">
          <FiShield className="h-4.5 w-4.5 text-white" style={{ height: "18px", width: "18px" }} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold leading-tight text-white">Child Safety System</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400">{roleLabel}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/8" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                classNames(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-civic-600 text-white shadow-md shadow-civic-600/30"
                    : "text-slate-400 hover:bg-white/6 hover:text-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={classNames(
                      "h-[18px] w-[18px] shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && (
                    <FiChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User profile footer */}
      {user && (
        <>
          <div className="mx-4 h-px bg-white/8" />
          <div className="px-3 py-4">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-civic-600 text-xs font-bold text-white">
                {user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
                <p className="truncate text-[11px] text-slate-500">{user.role}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (mobile) {
    return (
      <div className="h-full w-full overflow-y-auto bg-sidebar">
        {content}
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-sidebar overflow-hidden" style={{ boxShadow: "2px 0 8px rgba(15,23,42,0.08)" }}>
      {content}
    </aside>
  );
}
