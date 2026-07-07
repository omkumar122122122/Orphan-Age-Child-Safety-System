import { FiHome, FiChevronRight } from "react-icons/fi";

export default function Breadcrumb({ items }) {
  return (
    <nav
      className="flex flex-wrap items-center gap-1 text-xs text-slate-400 dark:text-slate-500"
      aria-label="Breadcrumb"
    >
      <FiHome className="h-3.5 w-3.5 shrink-0" />
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-1">
          <FiChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span
            className={
              i === items.length - 1
                ? "font-semibold text-slate-600 dark:text-slate-300"
                : ""
            }
          >
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}
