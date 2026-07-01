import { useState } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import NotificationPanel from "../components/NotificationPanel";
import { notifications } from "../data/dummyData";

export default function Alerts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Safety", "Alerts"]} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-500/15 dark:text-red-300">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">AI Alert Review Queue</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Prioritized child safety flags requiring officer validation, documentation, and follow-up.
              </p>
              <Button icon={FiCheckCircle} onClick={() => setOpen(true)} className="mt-5">
                Resolve Sample Alert
              </Button>
            </div>
          </div>
        </Card>
        <NotificationPanel items={notifications} />
      </div>
      <Modal open={open} title="Alert Resolution" onClose={() => setOpen(false)}>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          The alert has been marked as reviewed in this frontend prototype. A production backend would store officer notes,
          timestamps, and escalation status.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
}
