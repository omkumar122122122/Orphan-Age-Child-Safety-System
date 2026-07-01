import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "./Button";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button variant="secondary" icon={FiChevronLeft} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </Button>
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" icon={FiChevronRight} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
