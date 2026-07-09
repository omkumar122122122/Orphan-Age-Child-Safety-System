import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange, placeholder = "Search records" }) {
  return (
    <label className="flex min-h-[38px] w-full cursor-text items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 transition focus-within:border-civic-500 focus-within:ring-2 focus-within:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800 md:max-w-xs">
      <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
      />
    </label>
  );
}
