import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Card from "../components/Card";
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
    () => (user?.role === "orphanage" ? children.filter((child) => child.orphanage === user.department) : children),
    [user]
  );
  const filtered = useMemo(
    () =>
      visibleChildren.filter((child) =>
        `${child.id} ${child.name} ${child.orphanage} ${child.risk}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query, visibleChildren]
  );
  const { page, setPage, totalPages, paginatedItems } = usePagination(filtered, 5);
  const basePath = user?.role === "admin" ? "/admin" : "/orphanage";

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Records", "Children"]} />
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Child Records</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Centralized welfare and AI risk monitoring list.</p>
          </div>
          <SearchBar value={query} onChange={setQuery} placeholder="Search child, risk, home" />
        </div>
        <DataTable
          columns={[
            { key: "id", label: "Child ID" },
            { key: "name", label: "Name" },
            { key: "age", label: "Age" },
            { key: "orphanage", label: "Orphanage" },
            { key: "risk", label: "Risk" },
            { key: "health", label: "Health" },
            { key: "attendance", label: "Attendance %" }
          ]}
          rows={paginatedItems}
          onRowClick={(child) => navigate(`${basePath}/children/${child.id}`)}
        />
        <div className="mt-5">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
