import { CreditCard, Percent, ShoppingBag, Users, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DeltaBadge } from '@/components/ui/Badge';
import { Sparkline } from '@/components/charts/Sparkline';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';

const ICONS = {
  revenue: CreditCard,
  orders: ShoppingBag,
  customers: Users,
  conversion: Percent,
  sessions: Zap,
};

const format = (kpi) => {
  if (kpi.format === 'currency') return formatCurrency(kpi.value);
  if (kpi.format === 'percent') return formatPercent(kpi.value);
  return formatNumber(Math.round(kpi.value));
};

export function KpiCard({ kpi }) {
  const Icon = ICONS[kpi.icon] ?? Zap;
  const positive = kpi.delta >= 0;
  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-ink-2">{kpi.label}</p>
          <p className="tnum mt-1.5 text-[26px] font-semibold leading-none tracking-tight text-ink">
            {format(kpi)}
          </p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
      </div>
      <div className="flex items-center justify-between px-5 pb-1">
        <DeltaBadge value={kpi.delta} />
        <span className="text-xs text-ink-3">vs. last period</span>
      </div>
      <Sparkline
        values={kpi.spark}
        tone={positive ? 'success' : 'danger'}
        height={48}
        className="mt-1"
      />
    </Card>
  );
}
