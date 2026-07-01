import Breadcrumb from "../components/Breadcrumb";
import { DoughnutChartCard, LineChartCard } from "../components/ChartCard";
import Card from "../components/Card";
import { monthlySafety, riskDistribution } from "../data/dummyData";

export default function Reports() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={["Orphanage", "Reports"]} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <LineChartCard title="Monthly Welfare Report" data={monthlySafety} />
        <DoughnutChartCard title="Current Risk Profile" data={riskDistribution} />
      </div>
      <Card>
        <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Compliance Summary</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Metric label="Submitted Forms" value="34/36" />
          <Metric label="Pending Reviews" value="4" />
          <Metric label="Inspection Score" value="96%" />
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
