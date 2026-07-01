import { FiX } from "react-icons/fi";
import Button from "./Button";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-xl p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
          <Button variant="ghost" icon={FiX} onClick={onClose} aria-label="Close modal" className="px-3" />
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
