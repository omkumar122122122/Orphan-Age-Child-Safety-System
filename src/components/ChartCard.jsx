import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Card from "./Card";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Filler, Tooltip, Legend
);

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 6,
        boxHeight: 6,
        padding: 16,
        font: { family: "Inter", size: 12 },
        color: "#64748b",
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleFont: { family: "Inter", size: 12, weight: "600" },
      bodyFont:  { family: "Inter", size: 12 },
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 4,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: "rgba(148,163,184,0.10)", drawBorder: false },
      ticks: {
        font: { family: "Inter", size: 11 },
        color: "#94a3b8",
        padding: 8,
      },
      border: { display: false },
    },
    x: {
      grid: { display: false, drawBorder: false },
      ticks: {
        font: { family: "Inter", size: 11 },
        color: "#94a3b8",
        padding: 4,
      },
      border: { display: false },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 6,
        boxHeight: 6,
        padding: 16,
        font: { family: "Inter", size: 12 },
        color: "#64748b",
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleFont: { family: "Inter", size: 12, weight: "600" },
      bodyFont:  { family: "Inter", size: 12 },
      padding: 12,
      cornerRadius: 10,
    },
  },
};

export function LineChartCard({ title, data }) {
  return (
    <Card>
      <div className="px-5 pt-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="px-5 pb-5 pt-4" style={{ height: 260 }}>
        <Line data={data} options={lineOptions} />
      </div>
    </Card>
  );
}

export function DoughnutChartCard({ title, data }) {
  return (
    <Card>
      <div className="px-5 pt-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="px-5 pb-5 pt-4" style={{ height: 260 }}>
        <Doughnut data={data} options={doughnutOptions} />
      </div>
    </Card>
  );
}
