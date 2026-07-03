function sanitizeInputValue(label, type, value) {
  if (type === "file") {
    return value;
  }

  if (type === "number") {
    return value.replace(/[^0-9]/g, "");
  }

  if (type === "tel") {
    return value.replace(/[^0-9]/g, "");
  }

  if (/name/i.test(label)) {
    return value.replace(/[^A-Za-z\s'.-]/g, "");
  }

  return value;
}

export default function FormInput({ label, error, icon: Icon, onChange, ...props }) {
  const isFile = props.type === "file";
  const isNumber = props.type === "number";
  const isTel = props.type === "tel";
  const inputMode = props.inputMode || (isNumber || isTel ? "numeric" : undefined);

  const handleChange = (event) => {
    const nextValue = sanitizeInputValue(label, props.type, event.target.value);
    if (nextValue !== event.target.value) {
      event.target.value = nextValue;
    }
    onChange?.(event);
  };

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className={`mt-2 flex items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-civic-500 focus-within:ring-offset-0 dark:border-slate-700 dark:bg-slate-950 ${isFile ? "py-1.5" : ""}`}>
        {Icon && <Icon className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400" />}
        <input
          className={`w-full border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white ${
            isFile 
              ? "file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-civic-50 file:text-civic-700 hover:file:bg-civic-100 dark:file:bg-slate-800 dark:file:text-slate-200 cursor-pointer file:cursor-pointer"
              : "min-h-11"
          }`}
          inputMode={inputMode}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
