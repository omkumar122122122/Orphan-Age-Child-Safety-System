export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4">
      {/* Animated spinner rings */}
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-gray-100 dark:border-slate-700" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-civic-600" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

/* ── Skeleton line ────────────────────────────────────── */
export function SkeletonLine({ width = "w-full", height = "h-4" }) {
  return (
    <div className={`${width} ${height} skeleton rounded-lg`} />
  );
}

/* ── Skeleton card ────────────────────────────────────── */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <SkeletonLine width="w-32" height="h-3" />
        <div className="skeleton h-10 w-10 rounded-xl" />
      </div>
      <SkeletonLine width="w-20" height="h-7 mt-3" />
      <SkeletonLine width="w-24" height="h-3 mt-2" />
    </div>
  );
}
