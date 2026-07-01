export default function FormInput({ label, error, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="mt-2 flex items-center rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
        {Icon && <Icon className="mr-2 h-4 w-4 text-slate-400" />}
        <input
          className="focus-ring min-h-11 w-full border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
