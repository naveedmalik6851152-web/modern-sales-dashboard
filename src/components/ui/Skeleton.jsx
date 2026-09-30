import { cn } from '@/utils/cn';

export function Skeleton({ className, style }) {
  return <div className={cn('skeleton', className)} style={style} aria-hidden />;
}

export function CardSkeleton({ className, lines = 3 }) {
  return (
    <div className={cn('card space-y-3 p-5', className)} role="status" aria-label="Loading">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function ChartSkeleton({ className, height = 260 }) {
  return (
    <div
      className={cn('flex items-end gap-2 px-5 pb-5', className)}
      style={{ height }}
      role="status"
      aria-label="Loading chart"
    >
      {[42, 66, 52, 80, 60, 92, 70, 56, 84, 64, 76, 48].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ rows = 5, className }) {
  return (
    <div className={cn('space-y-4 p-5', className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
