import { classNames } from "../utils/formatters";

const variants = {
  primary:
    "bg-civic-600 text-white hover:bg-civic-700 shadow-sm shadow-civic-600/20 active:scale-[0.98]",
  secondary:
    "bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800",
  outline:
    "border border-civic-300 text-civic-700 hover:bg-civic-50 dark:border-civic-600 dark:text-civic-400 dark:hover:bg-civic-500/10",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  loading = false,
  ...props
}) {
  return (
    <button
      className={classNames(
        "focus-ring inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" />
      )}
      {children}
    </button>
  );
}
