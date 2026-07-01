import Breadcrumb from "../components/Breadcrumb";
import { DoughnutChartCard, LineChartCard } from "../components/ChartCard";
import NotificationPanel from "../components/NotificationPanel";
import { StatCard } from "../components/Card";
import DataTable from "../components/DataTable";
import { children, monthlySafety, notifications, riskDistribution, stats } from "../data/dummyData";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={["Admin", "Dashboard"]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <LineChartCard title="Monthly Safety and Compliance Score" data={monthlySafety} />
        <DoughnutChartCard title="AI Risk Distribution" data={riskDistribution} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <DataTable
          columns={[
            { key: "id", label: "Child ID" },
            { key: "name", label: "Name" },
            { key: "orphanage", label: "Orphanage" },
            { key: "risk", label: "Risk" },
            { key: "attendance", label: "Attendance %" }
          ]}
          rows={children.slice(0, 4)}
        />
        <NotificationPanel items={notifications} />
      </div>
    </div>
  );
}
