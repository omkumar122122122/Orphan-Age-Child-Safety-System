import { riskClasses } from "../utils/constants";

export default function DataTable({ columns, rows, onRowClick }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50/90 dark:bg-slate-950/50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`transition hover:bg-civic-50/60 dark:hover:bg-slate-800/70 ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(event) => {
                  if (onRowClick && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                      {column.key === "risk" ? (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${riskClasses[value]}`}>{value}</span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
