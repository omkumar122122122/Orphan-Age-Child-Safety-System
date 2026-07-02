import { NavLink } from "react-router-dom";
import { FiShield } from "react-icons/fi";
import { classNames } from "../utils/formatters";

export default function Sidebar({ navItems, roleLabel, mobile = false }) {
  return (
    <aside
      className={
        mobile
          ? "block h-full w-full shrink-0 overflow-y-auto bg-transparent"
          : "hidden h-screen w-72 shrink-0 border-r border-white/50 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:sticky lg:top-0 lg:block lg:overflow-y-auto"
      }
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-civic-600 text-white">
          <FiShield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold leading-tight text-slate-950 dark:text-white">Child Safety System</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{roleLabel}</p>
        </div>
      </div>
      <nav className="mt-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              classNames(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-civic-600 text-white shadow-lg shadow-civic-600/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
