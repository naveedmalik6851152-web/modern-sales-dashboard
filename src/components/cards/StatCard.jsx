import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

/** Compact metric tile — used on Analytics/Reports summaries. */
export function StatCard({ label, value, sub, className }) {
  return (
    <Card className={cn('p-5', className)}>
      <p className="text-[13px] font-medium text-ink-2">{label}</p>
      <p className="tnum mt-1.5 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-3">{sub}</p>}
    </Card>
  );
}
