export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4" role="status" aria-label={label}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-100 dark:border-slate-800" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-civic-600" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function SkeletonLine({ width = "w-full", height = "h-4" }) {
  return <div className={`${width} ${height} skeleton rounded-lg`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
      <div className="flex items-center justify-between">
        <SkeletonLine width="w-28" height="h-3" />
        <div className="skeleton h-11 w-11 rounded-xl" />
      </div>
      <SkeletonLine width="w-20" height="h-7 mt-4" />
      <SkeletonLine width="w-24" height="h-3 mt-2.5" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="skeleton h-3 flex-1 rounded-full" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="skeleton h-4 flex-1 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
