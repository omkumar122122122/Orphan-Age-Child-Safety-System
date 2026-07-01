import { FiChevronRight, FiHome } from "react-icons/fi";

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
      <FiHome className="h-4 w-4" />
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2">
          <FiChevronRight className="h-4 w-4" />
          <span>{item}</span>
        </span>
      ))}
    </nav>
  );
}
