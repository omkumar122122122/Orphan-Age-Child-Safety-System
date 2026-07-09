import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCamera,
  FiCameraOff,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSlash,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import { classNames } from "../utils/formatters";
import { useNavigate } from "react-router-dom";

const childSeed = [
  { id: "CH-1001", name: "Ishaan Roy", age: 9, gender: "Male", group: "Class 4A", room: "R-12", photo: "IR", cameraId: "CAM-01", faceMatch: 99, confidence: 98, health: "Stable", status: "Present", time: "08:12 AM" },
  { id: "CH-1002", name: "Anaya Das", age: 12, gender: "Female", group: "Class 6B", room: "R-08", photo: "AD", cameraId: "CAM-02", faceMatch: 97, confidence: 96, health: "Observation", status: "Present", time: "08:18 AM" },
  { id: "CH-1003", name: "Kabir Khan", age: 7, gender: "Male", group: "Class 2A", room: "R-05", photo: "KK", cameraId: "CAM-01", faceMatch: 0, confidence: 0, health: "Stable", status: "Absent", time: "-" },
  { id: "CH-1004", name: "Riya Patel", age: 8, gender: "Female", group: "Class 3A", room: "R-09", photo: "RP", cameraId: "CAM-03", faceMatch: 94, confidence: 92, health: "Stable", status: "Present", time: "08:22 AM" },
  { id: "CH-1005", name: "Vihaan Sen", age: 10, gender: "Male", group: "Class 5A", room: "R-14", photo: "VS", cameraId: "CAM-02", faceMatch: 88, confidence: 86, health: "Stable", status: "Late", time: "08:36 AM" },
  { id: "CH-1006", name: "Sara Ali", age: 11, gender: "Female", group: "Class 6A", room: "R-10", photo: "SA", cameraId: "CAM-03", faceMatch: 0, confidence: 0, health: "Needs Review", status: "Absent", time: "-" },
  { id: "CH-1007", name: "Aarav Mehta", age: 9, gender: "Male", group: "Class 4B", room: "R-11", photo: "AM", cameraId: "CAM-01", faceMatch: 98, confidence: 97, health: "Stable", status: "Present", time: "08:14 AM" },
  { id: "CH-1008", name: "Meera Nair", age: 13, gender: "Female", group: "Class 7A", room: "R-16", photo: "MN", cameraId: "CAM-04", faceMatch: 93, confidence: 91, health: "Stable", status: "Present", time: "08:29 AM" },
  { id: "CH-1009", name: "Arjun Verma", age: 8, gender: "Male", group: "Class 3B", room: "R-07", photo: "AV", cameraId: "CAM-04", faceMatch: 96, confidence: 95, health: "Stable", status: "Present", time: "08:33 AM" },
  { id: "CH-1010", name: "Sana Khan", age: 10, gender: "Female", group: "Class 5B", room: "R-13", photo: "SK", cameraId: "CAM-02", faceMatch: 0, confidence: 0, health: "Stable", status: "Absent", time: "-" }
];

const recentDetectionSeed = [
  { name: "Ishaan Roy", photo: "IR", time: "08:12 AM", status: "Present" },
  { name: "Anaya Das", photo: "AD", time: "08:18 AM", status: "Present" },
  { name: "Vihaan Sen", photo: "VS", time: "08:36 AM", status: "Late" },
  { name: "Riya Patel", photo: "RP", time: "08:22 AM", status: "Present" }
];

const notificationSeed = [
  { id: 1, title: "Attendance Recorded", detail: "Ishaan Roy was marked present from CAM-01.", tone: "success" },
  { id: 2, title: "Unknown Face Detected", detail: "CAM-03 flagged a face with no match in the database.", tone: "warning" },
  { id: 3, title: "Duplicate Detection", detail: "Anaya Das was detected twice in a 90-second window.", tone: "warning" },
  { id: 4, title: "Face Not Recognized", detail: "CAM-04 needs admin review for the incoming scan.", tone: "danger" }
];

function localIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(value) {
  if (!value || value === "-") {
    return value;
  }
  return value;
}

function formatPercent(value) {
  return `${value}%`;
}

function createAvatar(initials, startColor, endColor) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#g)" />
      <circle cx="60" cy="50" r="22" fill="rgba(255,255,255,0.22)" />
      <path d="M28 98c6-18 19-28 32-28s27 10 32 28" fill="rgba(255,255,255,0.22)" />
      <text x="60" y="68" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#fff">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function statusTone(status) {
  const map = {
    Present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    Absent: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    Late: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
  };

  return map[status] || map.Absent;
}

function toneLabel(tone) {
  const map = {
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
  };

  return map[tone];
}

function dataUriForUnknown() {
  return createAvatar("??", "#94a3b8", "#1c74d8");
}

function CardLabel({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</h3>
        </div>
        <div className="rounded-2xl bg-civic-100 p-3 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-civic-600 dark:text-civic-100">{eyebrow}</p>
      <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function DetectionDot({ detected }) {
  return (
    <span className={classNames("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold", detected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")}>
      <span className={classNames("h-2.5 w-2.5 rounded-full", detected ? "bg-emerald-500" : "bg-slate-400")} />
      {detected ? "Face Detected" : "Waiting for face..."}
    </span>
  );
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 top-4 z-[70] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className={classNames("flex max-w-xs items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl", toneLabel(toast.tone), "border-white/60")}
          >
            <div className="mt-0.5 rounded-full bg-white/60 p-2 text-current">
              {toast.tone === "success" ? <FiCheck className="h-4 w-4" /> : toast.tone === "danger" ? <FiSlash className="h-4 w-4" /> : <FiAlertCircle className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{toast.title}</p>
              <p className="mt-1 text-xs font-medium opacity-90">{toast.detail}</p>
            </div>
            <button onClick={() => onDismiss(toast.id)} className="mt-0.5 rounded-lg p-1 transition hover:bg-white/30" aria-label="Dismiss toast">
              <FiX className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AIAttendance() {
  const navigate = useNavigate();
  const today = localIsoDate(new Date());
  const [cameraOn, setCameraOn] = useState(true);
  const [scanState, setScanState] = useState("scanning");
  const [detectedChild, setDetectedChild] = useState(null);
  const [recognitionType, setRecognitionType] = useState("known");
  const [showUnknownModal, setShowUnknownModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [attendanceRows, setAttendanceRows] = useState(() =>
    childSeed.map((child, index) => ({
      ...child,
      time: child.time,
      lastSeen: index < 4 ? "Today" : "Yesterday"
    }))
  );
  const [toasts, setToasts] = useState([]);
  const [isScanningManual, setIsScanningManual] = useState(false);
  const [lastCameraAction, setLastCameraAction] = useState("Auto scan active");

  const markToast = (title, detail, tone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, title, detail, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const startScan = (source = "manual") => {
    if (!cameraOn) {
      markToast("Camera Disabled", "Turn the camera on before running AI detection.", "warning");
      return;
    }

    setScanState("scanning");
    setDetectedChild(null);
    setShowUnknownModal(false);
    setRecognitionType("known");
    setIsScanningManual(source === "manual");
    setLastCameraAction(source === "manual" ? "Manual capture started" : "Auto scan started");

    window.setTimeout(() => {
      const knownChance = source === "manual" ? 0.8 : 0.72;
      const isKnown = Math.random() < knownChance;

      if (isKnown) {
        const pick = childSeed[Math.floor(Math.random() * childSeed.length)];
        const result = {
          ...pick,
          detectionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          attendanceStatus: "Present",
          matchPercent: Math.min(99, pick.faceMatch || 95),
          confidencePercent: Math.min(99, pick.confidence || 94)
        };

        setDetectedChild(result);
        setRecognitionType("known");
        setScanState("detected");
        markToast("Attendance Ready", `${result.name} recognized with ${result.matchPercent}% face match.`, "success");
      } else {
        setDetectedChild({
          name: "Unknown Person",
          detectionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          matchPercent: 42,
          confidencePercent: 38
        });
        setRecognitionType("unknown");
        setScanState("unknown");
        setShowUnknownModal(true);
        markToast("Unknown Face Detected", "The system could not find a verified match.", "warning");
      }

      setIsScanningManual(false);
    }, 1600);
  };

  useEffect(() => {
    if (!cameraOn) {
      setScanState("idle");
      return undefined;
    }

    const timer = window.setTimeout(() => startScan("auto"), 700);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOn]);

  const counts = useMemo(() => {
    const present = attendanceRows.filter((row) => row.status === "Present").length;
    const late = attendanceRows.filter((row) => row.status === "Late").length;
    return {
      total: attendanceRows.length,
      present,
      absent: attendanceRows.filter((row) => row.status === "Absent").length,
      late,
      accuracy: 98.6
    };
  }, [attendanceRows]);

  const lastDetectedChild = detectedChild?.name || recentDetectionSeed[0].name;

  const filteredRows = useMemo(() => {
    return attendanceRows.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        row.id.toLowerCase().includes(search.trim().toLowerCase()) ||
        row.cameraId.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = statusFilter === "All" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [attendanceRows, search, statusFilter]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const recognitionDetails = detectedChild && recognitionType === "known" ? detectedChild : null;

  const handleMarkPresent = () => {
    if (!recognitionDetails) {
      markToast("No Child Selected", "Run a successful scan before marking attendance.", "warning");
      return;
    }

    setAttendanceRows((current) =>
      current.map((row) =>
        row.id === recognitionDetails.id
          ? {
              ...row,
              status: "Present",
              time: recognitionDetails.detectionTime,
              faceMatch: recognitionDetails.matchPercent,
              confidence: recognitionDetails.confidencePercent
            }
          : row
      )
    );
    setShowSuccess(true);
    markToast("Attendance Recorded", `${recognitionDetails.name} was marked present.`, "success");
    window.setTimeout(() => setShowSuccess(false), 2200);
  };

  const handleRetry = () => {
    setShowUnknownModal(false);
    startScan("manual");
  };

  const handleCameraToggle = () => {
    setCameraOn((current) => !current);
    if (cameraOn) {
      setLastCameraAction("Camera turned off");
      setScanState("idle");
      setDetectedChild(null);
    } else {
      setLastCameraAction("Camera turned on");
    }
  };

  return (
    <div className="relative space-y-8 overflow-x-hidden pb-8">
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />

      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-civic-500/15 blur-3xl" />
      <div className="absolute left-0 top-48 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <Breadcrumb items={["Orphanage", "AI Attendance"]} />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-6 shadow-md"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-civic-500/10 via-transparent to-violet-500/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-civic-600 dark:text-civic-100">AI Face Attendance</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">AI Attendance</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Automatic attendance using AI face recognition with live scanning, instant verification, duplicate checks, and a safe attendance workflow for the orphanage dashboard.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button icon={FiRefreshCw} variant="secondary" className="rounded-full" onClick={() => startScan("manual")}>
              Refresh Scan
            </Button>
            <Button icon={FiCamera} className="rounded-full" onClick={handleCameraToggle}>
              {cameraOn ? "Camera On" : "Camera Off"}
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardLabel label="Total Children" value={counts.total} icon={FiUsers} />
        <CardLabel label="Present Today" value={counts.present} icon={FiCheckCircle} />
        <CardLabel label="Absent" value={counts.absent} icon={FiSlash} />
        <CardLabel label="Recognition Accuracy" value={`${counts.accuracy}%`} icon={FiShield} />
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1fr_1fr] items-start">
        <div className="space-y-6 flex flex-col min-w-0">
          <Card className="overflow-hidden rounded-3xl p-0">
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle eyebrow="Live Camera" title="AI face recognition feed" subtitle="Scan a face to verify identity and record attendance automatically." />
              <DetectionDot detected={scanState === "detected"} />
            </div>
          </div>

          <div className="px-5 pb-5 mt-5 grid gap-4">
            <motion.div
              className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-900/10 dark:border-slate-800"
              animate={scanState === "scanning" ? { boxShadow: ["0 0 0 rgba(28,116,216,0.00)", "0 0 0 10px rgba(28,116,216,0.08)", "0 0 0 rgba(28,116,216,0.00)"] } : {}}
              transition={{ duration: 1.8, repeat: scanState === "scanning" ? Infinity : 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-civic-950" />
              <div className="absolute inset-0 opacity-35">
                <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-civic-500/30 blur-3xl animate-float" />
                <div className="absolute right-12 top-20 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl animate-float-reverse" />
              </div>

              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

              {cameraOn ? (
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-civic-400/0 via-civic-400/25 to-civic-400/0"
                    animate={{ y: [0, 340, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                  />

                  <div className="absolute left-1/2 top-1/2 h-[68%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-civic-300/20 bg-civic-500/10 backdrop-blur-[1px]" />

                  {scanState === "scanning" ? (
                    <motion.div
                      className="absolute left-1/2 top-1/2 h-[62%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-civic-300 shadow-[0_0_0_9999px_rgba(15,23,42,0.12)]"
                      animate={{ borderColor: ["rgba(59,130,246,0.95)", "rgba(16,185,129,0.95)", "rgba(59,130,246,0.95)"] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-x-4 top-4 rounded-full bg-emerald-400/15 px-3 py-1 text-center text-xs font-bold text-emerald-100"
                        animate={{ opacity: [0.55, 1, 0.55] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      >
                        Scanning face...
                      </motion.div>
                    </motion.div>
                  ) : null}

                  {scanState === "detected" && recognitionDetails ? (
                    <motion.div
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute left-1/2 top-1/2 h-[62%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.08)]"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0.25)", "0 0 0 12px rgba(16,185,129,0.00)"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-emerald-500/90 px-3 py-2 text-center text-xs font-bold text-white">
                        Face detected and verified
                      </div>
                    </motion.div>
                  ) : null}

                  {scanState === "unknown" ? (
                    <motion.div
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute left-1/2 top-1/2 h-[60%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-rose-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.08)]"
                    >
                      <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-rose-500/90 px-3 py-2 text-center text-xs font-bold text-white">
                        Unknown person detected
                      </div>
                    </motion.div>
                  ) : null}

                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="rounded-2xl border border-white/15 bg-slate-950/55 px-4 py-3 text-white backdrop-blur-xl">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-civic-100">Camera Status</p>
                      <p className="mt-1 text-sm font-semibold">{cameraOn ? "Online and ready" : "Offline"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-slate-950/55 px-4 py-3 text-white backdrop-blur-xl">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-civic-100">AI State</p>
                      <p className="mt-1 text-sm font-semibold">{scanState === "scanning" ? "Loading scan..." : lastCameraAction}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
                  <div className="max-w-sm text-center text-white">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white">
                      <FiCameraOff className="h-10 w-10" />
                    </div>
                    <p className="mt-4 text-lg font-bold">Camera is turned off</p>
                    <p className="mt-2 text-sm text-white/70">Switch the camera on to continue face detection and attendance capture.</p>
                  </div>
                </div>
              )}

              {scanState === "scanning" ? (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center text-white">
                    <motion.div
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-civic-200/25"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    >
                      <FiCamera className="h-8 w-8 text-civic-100" />
                    </motion.div>
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.28em] text-civic-100">AI Scanning</p>
                    <p className="mt-2 text-base font-semibold">Analyzing live face feed...</p>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button icon={cameraOn ? FiCamera : FiCameraOff} className="rounded-full" onClick={handleCameraToggle}>
                {cameraOn ? "Camera On" : "Camera Off"}
              </Button>
              <Button icon={FiEye} variant="secondary" className="rounded-full" onClick={() => startScan("manual")}>
                Capture
              </Button>
              <Button icon={FiRefreshCw} variant="secondary" className="rounded-full" onClick={() => startScan("manual")}>
                Re-scan
              </Button>
            </div>
          </div>
          </Card>

          <Card className="rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <SectionTitle eyebrow="Recognition Result" title="Live AI recognition card" subtitle="This card updates automatically after detection." />
              <DetectionDot detected={scanState === "detected"} />            </div>

            <AnimatePresence mode="wait">
              {scanState === "scanning" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mt-5 rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-civic-100 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100"
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <FiRefreshCw className="h-7 w-7 animate-spin" />
                    </motion.div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-civic-600 dark:text-civic-100">Loading State</p>
                      <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Waiting for face...</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        AI scanning is active. Hold the child in frame for recognition.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : recognitionDetails ? (
                <motion.div
                  key={recognitionDetails.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50/85 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-3xl border border-white/60">
                      <img
                        src={createAvatar(recognitionDetails.photo, "#1c74d8", "#7c3aed")}
                        alt={recognitionDetails.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-200">Present</p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{recognitionDetails.name}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Face recognition successfully matched the child profile.</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 px-4 py-3 text-right shadow-sm dark:bg-slate-950/60">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Detection Time</p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{formatTime(recognitionDetails.detectionTime)}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <MiniStat label="Child Photo" value={recognitionDetails.photo} />
                    <MiniStat label="Child ID" value={recognitionDetails.id} />
                    <MiniStat label="Age" value={`${recognitionDetails.age} years`} />
                    <MiniStat label="Gender" value={recognitionDetails.gender} />
                    <MiniStat label="Class / Group" value={recognitionDetails.group} />
                    <MiniStat label="Room No." value={recognitionDetails.room} />
                    <MiniStat label="Attendance Status" value="Present" />
                    <MiniStat label="Health Status" value={recognitionDetails.health} />
                    <MiniStat label="Face Match" value={formatPercent(recognitionDetails.matchPercent)} />
                    <MiniStat label="AI Confidence" value={formatPercent(recognitionDetails.confidencePercent)} />
                    <MiniStat label="Camera ID" value={recognitionDetails.cameraId} />
                    <MiniStat label="Recorded By" value="AI Attendance" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button className="rounded-full" onClick={handleMarkPresent} icon={FiCheckCircle}>
                      Mark Present
                    </Button>
                    <Button variant="secondary" className="rounded-full" onClick={() => startScan("manual")} icon={FiRefreshCw}>
                      Retry Detection
                    </Button>
                  </div>
                </motion.div>
              ) : recognitionType === "unknown" ? (
                <motion.div
                  key="unknown"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  className="mt-5 rounded-3xl border border-rose-200 bg-rose-50/80 p-5 dark:border-rose-500/20 dark:bg-rose-500/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">
                      <FiAlertCircle className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-700 dark:text-rose-200">Face Not Recognized</p>
                      <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Unknown person detected</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The AI could not match the face confidently to a registered child.</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <MiniStat label="Confidence" value="38%" />
                    <MiniStat label="Face Match" value="42%" />
                    <MiniStat label="Action" value="Register or retry" />
                    <MiniStat label="Detection" value="Manual review" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button className="rounded-full" onClick={() => navigate("/orphanage/register-child")} icon={FiUser}>
                      Register New Child
                    </Button>
                    <Button variant="secondary" className="rounded-full" onClick={handleRetry} icon={FiRefreshCw}>
                      Retry Scan
                    </Button>
                    <Button variant="danger" className="rounded-full" onClick={() => markToast("Admin Notified", "A high priority review alert was sent to the admin.", "danger")} icon={FiAlertCircle}>
                      Notify Admin
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  className="mt-5 rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-civic-100 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
                      <FiCamera className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-civic-600 dark:text-civic-100">Recognition Result</p>
                      <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Waiting for face...</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start a scan to populate the attendance card automatically.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-white/75 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <SectionTitle eyebrow="AI Status" title="Detection verification" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Face Detected", scanState === "detected"],
                  ["Identity Verified", !!recognitionDetails],
                  ["Attendance Recorded", attendanceRows.some((row) => row.status === "Present")],
                  ["Duplicate Check Passed", true]
                ].map(([label, done]) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className={classNames("flex h-9 w-9 items-center justify-center rounded-full", done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300")}>
                      <FiCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-950 dark:text-white">{label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{done ? "Verified" : "Pending"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 flex flex-col">
          <Card className="rounded-3xl">
          <div className="flex flex-wrap items-end justify-between gap-4">            <SectionTitle eyebrow="Recent Attendance" title="Attendance table" subtitle="Search, filter, and paginate through the latest AI face check-ins." />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 dark:border-slate-800 dark:bg-slate-950/70">
                <FiSearch className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search child, ID or camera"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </label>
              <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 dark:border-slate-800 dark:bg-slate-950/70">
                <FiFilter className="h-4 w-4 text-slate-400" />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full bg-transparent text-sm outline-none">
                  <option value="All">All</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                <thead className="bg-slate-50/95 dark:bg-slate-950/55">
                  <tr>
                    {["Photo", "Child ID", "Name", "Time", "Face Match %", "Status", "Camera ID"].map((column) => (
                      <th key={column} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/70 dark:divide-slate-800 dark:bg-slate-950/40">
                  {currentRows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-civic-50/60 dark:hover:bg-slate-900/70">
                      <td className="px-4 py-4">
                        <div className="h-12 w-12 overflow-hidden rounded-2xl">
                          <img src={createAvatar(row.photo, "#1c74d8", "#7c3aed")} alt={row.name} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">{row.id}</td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-slate-950 dark:text-white">{row.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{row.group}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-200">{formatTime(row.time)}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">{row.faceMatch ? `${row.faceMatch}%` : "-"}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={classNames("rounded-full px-3 py-1.5 text-xs font-bold", statusTone(row.status))}>{row.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-200">{row.cameraId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredRows.length)} of {filteredRows.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="rounded-full px-3 py-2 text-xs" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} icon={FiChevronLeft}>
                Prev
              </Button>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                Page {page} of {totalPages}
              </span>
              <Button variant="secondary" className="rounded-full px-3 py-2 text-xs" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} icon={FiChevronRight}>
                Next
              </Button>
            </div>
          </div>
          </Card>

          <Card className="rounded-3xl">
            <SectionTitle eyebrow="Today's Summary" title="Attendance snapshot" subtitle="Quick operational view for the current shift." />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <MiniStat label="Present" value={counts.present} />
              <MiniStat label="Absent" value={counts.absent} />
              <MiniStat label="Late" value={counts.late} />
              <MiniStat label="Last Detected Child" value={lastDetectedChild} />
            </div>
          </Card>

          <Card className="rounded-3xl">
            <SectionTitle eyebrow="Recent Detections" title="Latest faces detected" subtitle="Small snapshots of the most recent AI matches." />
            <div className="mt-5 space-y-3">
              {recentDetectionSeed.map((item) => (
                <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <div className="h-12 w-12 overflow-hidden rounded-2xl">
                    <img src={createAvatar(item.photo, "#1c74d8", "#7c3aed")} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-950 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                  </div>
                  <span className={classNames("rounded-full px-3 py-1.5 text-xs font-bold", statusTone(item.status))}>{item.status}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl">
            <SectionTitle eyebrow="Notifications" title="Attendance alerts" subtitle="Examples of system toasts and safety notices." />
            <div className="mt-5 space-y-3">
              {notificationSeed.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <div className={classNames("rounded-2xl p-3", toneLabel(item.tone))}>
                    {item.tone === "success" ? <FiCheckCircle className="h-5 w-5" /> : item.tone === "danger" ? <FiAlertCircle className="h-5 w-5" /> : <FiSlash className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-5 right-5 z-[65] w-[min(92vw,360px)] rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-2xl dark:border-emerald-500/20 dark:bg-emerald-500/10"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                <FiCheck className="h-6 w-6" />
              </motion.div>
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-100">Attendance Recorded</p>
                <p className="text-sm text-emerald-700/80 dark:text-emerald-100/80">
                  The AI face match was saved successfully.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showUnknownModal ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="glass-panel w-full max-w-3xl rounded-3xl p-6 shadow-glass"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-civic-600 dark:text-civic-100">Unknown Face Modal</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Face not recognized</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    The scan did not match a registered child. You can register, retry, or notify admin.
                  </p>
                </div>
                <Button variant="ghost" icon={FiX} onClick={() => setShowUnknownModal(false)} className="rounded-full px-3" />
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="overflow-hidden rounded-2xl">
                    <img src={dataUriForUnknown()} alt="Unknown person" className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <MiniStat label="Confidence" value="38%" />
                    <MiniStat label="Match" value="42%" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniStat label="Action" value="Register New Child" />
                    <MiniStat label="Scan State" value="Unknown" />
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">Recommended next steps</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li>1. Register the child if this is a legitimate first-time visit.</li>
                      <li>2. Retry the scan if the face was partially obscured.</li>
                      <li>3. Notify admin if the person is unauthorized.</li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-full" icon={FiUser} onClick={() => navigate("/orphanage/register-child")}>
                      Register New Child
                    </Button>
                    <Button variant="secondary" className="rounded-full" icon={FiRefreshCw} onClick={handleRetry}>
                      Retry Scan
                    </Button>
                    <Button
                      variant="danger"
                      className="rounded-full"
                      icon={FiAlertCircle}
                      onClick={() => {
                        markToast("Admin Notified", "An unknown face alert was sent to the admin panel.", "danger");
                        setShowUnknownModal(false);
                      }}
                    >
                      Notify Admin
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
