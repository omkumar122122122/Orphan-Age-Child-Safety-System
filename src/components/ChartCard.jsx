import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Card from "./Card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } }
  },
  scales: {
    y: { beginAtZero: true, max: 100, grid: { color: "rgba(148, 163, 184, 0.18)" } },
    x: { grid: { display: false } }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } }
  }
};

export function LineChartCard({ title, data }) {
  return (
    <Card className="min-h-[320px]">
      <h2 className="text-base font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5 h-60">
        <Line data={data} options={lineOptions} />
      </div>
    </Card>
  );
}

export function DoughnutChartCard({ title, data }) {
  return (
    <Card className="min-h-[320px]">
      <h2 className="text-base font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5 h-60">
        <Doughnut data={data} options={doughnutOptions} />
      </div>
    </Card>
  );
}
