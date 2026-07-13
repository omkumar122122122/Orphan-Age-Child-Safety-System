import { forwardRef } from "react";
import { classNames } from "../utils/formatters";

function sanitizeInputValue(label, type, value) {
  if (type === "file") return value;
  if (type === "number") return value.replace(/[^0-9]/g, "");
  if (type === "tel") return value.replace(/[^0-9]/g, "");
  if (/name/i.test(label)) return value.replace(/[^A-Za-z\s'.-]/g, "");
  return value;
}

const FormInput = forwardRef(function FormInput({ label, error, icon: Icon, onChange, ...props }, ref) {
  const isFile   = props.type === "file";
  const isNumber = props.type === "number";
  const isTel    = props.type === "tel";
  const inputMode = props.inputMode || (isNumber || isTel ? "numeric" : undefined);

  const handleChange = (e) => {
    const next = sanitizeInputValue(label, props.type, e.target.value);
    if (next !== e.target.value) e.target.value = next;
    onChange?.(e);
  };

  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{label}</span>

      <div
        className={classNames(
          "mt-1.5 flex items-center rounded-xl border border-gray-200 bg-white transition",
          "focus-within:border-civic-500 focus-within:ring-2 focus-within:ring-civic-500/15",
          "dark:border-slate-700 dark:bg-slate-800",
          isFile ? "py-1.5 px-3" : "px-3"
        )}
      >
        {Icon && <Icon className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />}
        <input
          ref={ref}
          className={classNames(
            "w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white",
            isFile
              ? "cursor-pointer file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-civic-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-civic-700 hover:file:bg-civic-100 dark:file:bg-slate-700 dark:file:text-slate-200"
              : "min-h-[38px]"
          )}
          inputMode={inputMode}
          onChange={handleChange}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </label>
  );
});

export default FormInput;
