import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiAlertTriangle, FiHeart, FiUserCheck } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import { usePagination } from "../hooks/usePagination";
import { children } from "../data/dummyData";
import { classNames } from "../utils/formatters";

const summaryConfig = [
  { label: "Total Children", key: "total",    icon: FiUsers,        color: "bg-civic-50 text-civic-700 ring-1 ring-civic-200 dark:bg-civic-500/10 dark:text-civic-300 dark:ring-civic-500/20" },
  { label: "High Risk",      key: "high",      icon: FiAlertTriangle,color: "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20" },
  { label: "Adopted",        key: "adopted",   icon: FiHeart,        color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20" },
  { label: "Needs Review",   key: "review",    icon: FiUserCheck,    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20" },
];

export default function Children() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const visibleChildren = useMemo(
    () => user?.role === "orphanage" ? children.filter((c) => c.orphanage === user.department) : children,
    [user]
  );

  const filtered = useMemo(
    () => visibleChildren.filter((c) =>
      `${c.id} ${c.name} ${c.orphanage} ${c.risk}`.toLowerCase().includes(query.toLowerCase())
    ),
    [query, visibleChildren]
  );

  const { page, setPage, totalPages, paginatedItems } = usePagination(filtered, 8);
  const basePath = user?.role === "admin" ? "/admin" : "/orphanage";

  const counts = {
    total:   visibleChildren.length,
    high:    visibleChildren.filter((c) => c.risk === "High").length,
    adopted: visibleChildren.filter((c) => c.adopted).length,
    review:  visibleChildren.filter((c) => c.health === "Needs Review").length,
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Records", "Children"]} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
            <FiUsers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="page-title">Child Records</h1>
            <p className="page-subtitle">Centralised welfare and AI risk monitoring list</p>
          </div>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, ID or risk…" className="sm:max-w-xs" />
      </motion.div>

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {summaryConfig.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={classNames("flex items-center gap-3 rounded-xl px-4 py-3", s.color)}>
              <Icon className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{s.label}</p>
                <p className="mt-0.5 text-lg font-bold tabular-nums leading-none">{counts[s.key]}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="section-card"
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
        {totalPages > 1 && (
          <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
