import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { classNames } from "../utils/formatters";

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showCloseButton = true 
}) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-black/40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={classNames(
                "w-full rounded-2xl bg-white p-6 shadow-modal dark:bg-slate-900",
                sizeClasses[size] ?? sizeClasses.md
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="mt-4">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ModalFooter({ children, className = "" }) {
  return (
    <div className={classNames(
      "mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800",
      className
    )}>
      {children}
    </div>
  );
}