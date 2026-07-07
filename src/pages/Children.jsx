import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import { usePagination } from "../hooks/usePagination";
import { children } from "../data/dummyData";

export default function Children() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const visibleChildren = useMemo(
    () => (user?.role === "orphanage" ? children.filter((c) => c.orphanage === user.department) : children),
    [user]
  );

  const filtered = useMemo(
    () => visibleChildren.filter((c) =>
      `${c.id} ${c.name} ${c.orphanage} ${c.risk}`.toLowerCase().includes(query.toLowerCase())
    ),
    [query, visibleChildren]
  );

  const { page, setPage, totalPages, paginatedItems } = usePagination(filtered, 5);
  const basePath = user?.role === "admin" ? "/admin" : "/orphanage";

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Records", "Children"]} />

      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
            <FiUsers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="page-title">Child Records</h1>
            <p className="page-subtitle">Centralised welfare and AI risk monitoring list.</p>
          </div>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, ID or risk…" />
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total", value: visibleChildren.length, color: "bg-civic-50 text-civic-700 dark:bg-civic-500/10 dark:text-civic-300" },
          { label: "High Risk",  value: visibleChildren.filter(c => c.risk === "High").length,   color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300" },
          { label: "Adopted",    value: visibleChildren.filter(c => c.adopted).length,            color: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${s.color}`}>
            <span>{s.label}:</span><span>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <DataTable
          columns={[
            { key: "id",         label: "Child ID" },
            { key: "name",       label: "Name" },
            { key: "age",        label: "Age" },
            { key: "orphanage",  label: "Orphanage" },
            { key: "risk",       label: "Risk" },
            { key: "health",     label: "Health" },
            { key: "attendance", label: "Attendance" },
          ]}
          rows={paginatedItems}
          onRowClick={(child) => navigate(`${basePath}/children/${child.id}`)}
        />
        <div className="border-t border-gray-100 px-5 py-4 dark:border-slate-800">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </motion.div>
    </div>
  );
}
