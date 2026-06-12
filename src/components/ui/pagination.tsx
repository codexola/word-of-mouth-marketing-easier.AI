import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/providers/app-provider";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useApp();
  if (totalPages <= 1) return null;

  return (
    <div className="dash-pagination">
      <p className="small text-muted mb-0">
        {page} / {totalPages} {t.common.page}
      </p>
      <div className="d-flex gap-2">
        <button
          type="button"
          className="dash-btn dash-btn--outline dash-btn--sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
          {t.common.prev}
        </button>
        <button
          type="button"
          className="dash-btn dash-btn--outline dash-btn--sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t.common.next}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
