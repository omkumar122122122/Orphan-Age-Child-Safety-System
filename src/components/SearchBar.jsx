import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange, placeholder = "Search records" }) {
  return (
    <label className="flex min-h-11 w-full items-center rounded-lg border border-slate-200 bg-white/80 px-3 dark:border-slate-800 dark:bg-slate-900/80 md:max-w-sm">
      <FiSearch className="mr-2 h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
      />
    </label>
  );
}
