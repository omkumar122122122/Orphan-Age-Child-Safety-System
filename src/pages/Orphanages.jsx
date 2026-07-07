import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiShield, FiChevronRight } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { orphanages } from "../data/dummyData";
import { percentage } from "../utils/formatters";

function complianceColor(val) {
  if (val >= 90) return "text-green-600 dark:text-green-400";
  if (val >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function occupancyBar(occupancy, capacity) {
  const pct = Math.min(100, Math.round((occupancy / capacity) * 100));
  const color = pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-green-500";
  return { pct, color };
}

export default function Orphanages() {
  const navigate = useNavigate();

  const rows = orphanages.map((item) => ({
    ...item,
    occupancyRate: percentage(item.occupancy, item.capacity),
    complianceRate: item.compliance,
    ...occupancyBar(item.occupancy, item.capacity),
  }));

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Admin", "Orphanages"]} />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiHome className="h-5 w-5" />
          </div>
          <div>
            <h1 className="page-title">Registered Orphanages</h1>
            <p className="page-subtitle">Capacity, occupancy and compliance monitoring.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total: </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{orphanages.length}</span>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {rows.map((orphanage, i) => (
          <motion.div
            key={orphanage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/admin/orphanages/${orphanage.id}`)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-civic-500 to-indigo-500" />

            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400 text-sm font-bold">
                    {orphanage.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{orphanage.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{orphanage.id} · {orphanage.city}</p>
                  </div>
                </div>
                <FiChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-civic-500 transition-colors dark:text-slate-600" />
              </div>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="field-block text-center">
                  <div className="flex justify-center text-slate-400"><FiUsers className="h-3.5 w-3.5" /></div>
                  <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{orphanage.occupancy}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">of {orphanage.capacity}</p>
                </div>
                <div className="field-block text-center">
                  <div className="flex justify-center text-slate-400"><FiShield className="h-3.5 w-3.5" /></div>
                  <p className={`mt-1 text-base font-bold ${complianceColor(orphanage.compliance)}`}>{orphanage.compliance}%</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Compliance</p>
                </div>
                <div className="field-block text-center">
                  <div className="flex justify-center text-slate-400"><FiHome className="h-3.5 w-3.5" /></div>
                  <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{orphanage.pct}%</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Occupancy</p>
                </div>
              </div>

              {/* Occupancy progress bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Occupancy</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{orphanage.occupancyRate}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                  <div className={`h-full rounded-full transition-all ${orphanage.color}`} style={{ width: `${orphanage.pct}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Also show table view */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">All Orphanages — Table View</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-header">
              <tr>
                {["Home ID", "Name", "City", "Capacity", "Occupancy", "Compliance"].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(`/admin/orphanages/${row.id}`)}
                  className="table-row cursor-pointer"
                >
                  <td className="table-td font-medium text-civic-700 dark:text-civic-400">{row.id}</td>
                  <td className="table-td font-semibold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="table-td">{row.city}</td>
                  <td className="table-td">{row.capacity}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-xs font-medium">{row.occupancyRate}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className={`text-sm font-bold ${complianceColor(row.complianceRate)}`}>{row.complianceRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
