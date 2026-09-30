import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Select } from './Field';

function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const list = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) list.push('…');
  for (let i = start; i <= end; i++) list.push(i);
  if (end < pages - 1) list.push('…');
  list.push(pages);
  return list;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const nav =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-medium tnum transition-colors disabled:opacity-40';

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex items-center gap-4 text-[13px] text-ink-2">
        <p className="tnum">
          {from}–{to} of {total}
        </p>
        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span className="hidden sm:inline">Rows per page</span>
            <span className="sr-only sm:hidden">Rows per page</span>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 w-[68px] text-[13px]"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </label>
        )}
      </div>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          className={cn(nav, 'text-ink-2 hover:bg-sunken')}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <div className="hidden items-center gap-1 sm:flex">
          {pageList(page, pages).map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="px-1 text-ink-3" aria-hidden>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={cn(
                  nav,
                  p === page ? 'bg-accent-soft text-accent-strong' : 'text-ink-2 hover:bg-sunken',
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <span className="tnum px-2 text-[13px] text-ink-2 sm:hidden">
          {page} / {pages}
        </span>
        <button
          type="button"
          className={cn(nav, 'text-ink-2 hover:bg-sunken')}
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </nav>
    </div>
  );
}
