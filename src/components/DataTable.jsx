import { classNames } from "../utils/formatters";

const riskBadge = {
  Low:    "badge-success",
  Medium: "badge-warning",
  High:   "badge-danger",
};

export default function DataTable({ columns, rows, onRowClick }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
            <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">No records found</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">There is no data to display yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="table-header">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-th">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className={classNames(
                  "table-row",
                  onRowClick ? "cursor-pointer" : ""
                )}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <td key={col.key} className="table-td whitespace-nowrap">
                      {col.key === "risk" ? (
                        <span className={classNames("badge", riskBadge[value] ?? "badge-neutral")}>
                          <span className={classNames(
                            "h-1.5 w-1.5 rounded-full",
                            value === "High" ? "bg-red-500" : value === "Medium" ? "bg-amber-500" : "bg-green-500"
                          )} />
                          {value}
                        </span>
                      ) : col.key === "compliance" || col.key === "complianceRate" || col.key === "occupancyRate" ? (
                        <span className="font-medium text-slate-700 dark:text-slate-200">{value}</span>
                      ) : col.key === "health" ? (
                        <span className={classNames(
                          "badge",
                          value === "Stable" ? "badge-success" :
                          value === "Observation" ? "badge-warning" :
                          "badge-danger"
                        )}>{value}</span>
                      ) : col.key === "attendance" ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                            <div
                              className={classNames(
                                "h-full rounded-full",
                                value >= 90 ? "bg-green-500" : value >= 75 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{value}%</span>
                        </div>
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
