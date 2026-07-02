export default function FormInput({ label, error, icon: Icon, ...props }) {
  const isFile = props.type === "file";
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className={`mt-2 flex items-center rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950 ${isFile ? "py-1.5" : ""}`}>
        {Icon && <Icon className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400" />}
        <input
          className={`focus-ring w-full border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white ${
            isFile 
              ? "file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-civic-50 file:text-civic-700 hover:file:bg-civic-100 dark:file:bg-slate-800 dark:file:text-slate-200 cursor-pointer file:cursor-pointer"
              : "min-h-11"
          }`}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
