import Breadcrumb from "../components/Breadcrumb";
import { LineChartCard } from "../components/ChartCard";
import DataTable from "../components/DataTable";
import { StatCard } from "../components/Card";
import { children, monthlySafety, stats } from "../data/dummyData";

export default function OrphanageDashboard() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={["Orphanage", "Dashboard"]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
      <LineChartCard title="Care Home Safety Performance" data={monthlySafety} />
      <DataTable
        columns={[
          { key: "id", label: "Child ID" },
          { key: "name", label: "Name" },
          { key: "age", label: "Age" },
          { key: "risk", label: "Risk" },
          { key: "health", label: "Health" }
        ]}
        rows={children.filter((item) => item.orphanage === "Sunrise Care Home")}
      />
    </div>
  );
}
