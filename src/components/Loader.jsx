export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-slate-600 dark:text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-civic-600 border-t-transparent" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
