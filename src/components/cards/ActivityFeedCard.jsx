import { Card, CardHeader } from '@/components/ui/Card';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { TypeIcon } from './TypeIcon';
import { Activity } from 'lucide-react';
import { formatRelative } from '@/utils/format';

export function ActivityFeedCard({ data, loading, error, onRetry }) {
  return (
    <Card>
      <CardHeader title="Recent activity" description="What's happened across your store" />
      <div className="mt-1">
        {loading ? (
          <RowsSkeleton rows={6} />
        ) : error ? (
          <ErrorState compact onRetry={onRetry} />
        ) : !data?.length ? (
          <EmptyState compact icon={Activity} title="No recent activity" />
        ) : (
          <ul className="divide-y divide-line px-2 pb-2">
            {data.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-3 py-3">
                <TypeIcon type={a.type} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium leading-5 text-ink">{a.title}</p>
                  <p className="mt-0.5 truncate text-[13px] leading-5 text-ink-2">{a.detail}</p>
                </div>
                <span className="shrink-0 whitespace-nowrap pt-0.5 text-xs text-ink-3">
                  {formatRelative(a.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
