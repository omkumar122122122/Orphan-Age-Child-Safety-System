import Breadcrumb from "../components/Breadcrumb";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { orphanages } from "../data/dummyData";
import { percentage } from "../utils/formatters";

export default function Orphanages() {
  const rows = orphanages.map((item) => ({
    ...item,
    occupancyRate: percentage(item.occupancy, item.capacity),
    complianceRate: `${item.compliance}%`
  }));

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Orphanages"]} />
      <Card>
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Registered Orphanages</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Capacity, occupancy, and compliance monitoring.</p>
        </div>
        <DataTable
          columns={[
            { key: "id", label: "Home ID" },
            { key: "name", label: "Name" },
            { key: "city", label: "City" },
            { key: "capacity", label: "Capacity" },
            { key: "occupancyRate", label: "Occupancy" },
            { key: "complianceRate", label: "Compliance" }
          ]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
