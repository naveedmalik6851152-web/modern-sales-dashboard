import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Package } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/format';

export function TopProductsCard({ data, loading, error, onRetry }) {
  const top = data ? [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 5) : null;
  const max = top?.[0]?.revenue || 1;
  return (
    <Card>
      <CardHeader
        title="Top products"
        description="Best sellers by revenue this period"
        className="items-center"
        actions={
          <Link
            to="/products"
            className="text-[13px] font-medium text-accent-strong hover:underline"
          >
            View all
          </Link>
        }
      />
      <div className="mt-1">
        {loading ? (
          <RowsSkeleton rows={5} />
        ) : error ? (
          <ErrorState compact onRetry={onRetry} />
        ) : !top?.length ? (
          <EmptyState compact icon={Package} title="No product sales yet" />
        ) : (
          <ul className="space-y-4 px-5 pb-5 pt-3">
            {top.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <ProductThumb category={p.category} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink" title={p.name}>
                    {p.name}
                  </p>
                  <ProgressBar
                    value={p.revenue}
                    max={max}
                    className="mt-1.5"
                    label={`${p.name} revenue`}
                  />
                </div>
                <div className="shrink-0 text-right">
                  <p className="tnum text-[13px] font-semibold text-ink">
                    {formatCurrency(p.revenue)}
                  </p>
                  <p className="tnum text-xs text-ink-3">{formatNumber(p.sales)} sold</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
