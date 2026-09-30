import { useState } from 'react';
import { Download, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { analyticsApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useDateRange } from '@/context/DateRangeContext';
import { useToast } from '@/context/ToastContext';
import { DEFAULT_FILTERS, FILTER_OPTIONS, activeFilterCount } from '@/data/analytics';
import { downloadCSV } from '@/utils/csv';
import { formatCompact, formatCurrency, formatNumber, formatPercent } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { DateRangeSelector } from '@/components/navbar/DateRangeSelector';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Field';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { Badge, DeltaBadge } from '@/components/ui/Badge';
import { StatCard } from '@/components/cards/StatCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { LineSeriesChart } from '@/components/charts/LineSeriesChart';
import { TrafficDonut } from '@/components/charts/TrafficDonut';
import { CategoryBars } from '@/components/charts/CategoryBars';
import { FunnelChart } from '@/components/charts/FunnelChart';

const SOURCE_COLORS = {
  organic: 'var(--c1)',
  direct: 'var(--c2)',
  social: 'var(--c3)',
  paid: 'var(--c4)',
  referral: 'var(--c5)',
};

export default function Analytics() {
  const { range, meta } = useDateRange();
  const toast = useToast();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, loading, error, reload } = useAsync(
    () => analyticsApi.getAnalytics(range, filters),
    [range, filters],
  );

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clearFilters = () => setFilters(DEFAULT_FILTERS);
  const activeCount = activeFilterCount(filters);

  const exportCsv = () => {
    if (!data) return;
    downloadCSV(`sales-dashboard-ig-analytics-${meta.id}.csv`, data.revenue, [
      { header: 'Period', value: (r) => r.label },
      { header: 'Revenue', value: (r) => r.revenue },
      { header: 'Expenses', value: (r) => r.expenses },
      { header: 'Profit', value: (r) => r.profit },
    ]);
    toast.success('Analytics exported', { description: `sales-dashboard-ig-analytics-${meta.id}.csv` });
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Traffic, conversion and revenue, broken down by channel, region and device."
        actions={
          <>
            <DateRangeSelector />
            <Button icon={Download} onClick={exportCsv} disabled={!data}>
              Export CSV
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
          </span>
          {['channel', 'region', 'device', 'segment'].map((key) => (
            <Select
              key={key}
              aria-label={key}
              value={filters[key]}
              onChange={(e) => setFilter(key, e.target.value)}
              wrapperClassName="w-auto"
              className="w-auto pr-8"
            >
              {FILTER_OPTIONS[key].map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          ))}
          {activeCount > 0 && (
            <>
              <Badge tone="accent">{activeCount} active</Badge>
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            </>
          )}
        </div>
      </Card>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <ChartSkeleton key={i} height={104} className="card" />
                ))
              : data.kpis.map((k) => (
                  <StatCard
                    key={k.key}
                    label={k.label}
                    value={
                      k.format === 'currency'
                        ? formatCurrency(k.value)
                        : k.format === 'percent'
                          ? formatPercent(k.value)
                          : formatNumber(Math.round(k.value))
                    }
                    sub={<DeltaBadge value={k.delta} />}
                  />
                ))}
          </div>

          <Card>
            <CardHeader
              title="Revenue vs. previous period"
              description={`Compared to the ${meta.compare}`}
              actions={
                <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => reload()}>
                  Refresh
                </Button>
              }
            />
            {loading ? (
              <ChartSkeleton height={300} />
            ) : (
              <RevenueChart data={data.revenue} height={280} compare />
            )}
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title="Traffic by source" description="Sessions over time" />
              {loading ? (
                <ChartSkeleton height={240} />
              ) : (
                <LineSeriesChart
                  data={data.traffic}
                  series={Object.entries(SOURCE_COLORS).map(([key, color]) => ({
                    key,
                    name: FILTER_OPTIONS.channel.find((o) => o.value === key)?.label ?? key,
                    color,
                  }))}
                  formatValue={(v) => formatCompact(v)}
                  formatTick={formatCompact}
                  stacked
                  height={260}
                />
              )}
            </Card>
            <Card>
              <CardHeader title="Sources" description="Share of sessions" />
              {loading ? (
                <ChartSkeleton height={260} />
              ) : (
                <TrafficDonut sources={data.trafficSources} height={180} />
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader title="Conversion funnel" description="From visit to purchase" />
              {loading ? <ChartSkeleton height={260} /> : <FunnelChart steps={data.funnel} />}
            </Card>
            <Card>
              <CardHeader title="Revenue by category" />
              {loading ? (
                <ChartSkeleton height={260} />
              ) : (
                <CategoryBars categories={data.categories} />
              )}
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Revenue by country"
              description={
                filters.region === 'all'
                  ? 'All regions'
                  : FILTER_OPTIONS.region.find((r) => r.value === filters.region)?.label
              }
            />
            {loading ? (
              <ChartSkeleton height={260} />
            ) : (
              <div className="scroll-thin overflow-x-auto px-1 pb-5 pt-2">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs font-medium text-ink-3">
                      <th className="px-4 py-2.5">Country</th>
                      <th className="px-4 py-2.5 text-right">Share</th>
                      <th className="px-4 py-2.5 text-right">Revenue</th>
                      <th className="px-4 py-2.5 text-right">Orders</th>
                      <th className="px-4 py-2.5 text-right">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.geo
                      .slice()
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((c) => (
                        <tr key={c.code} className="border-b border-line last:border-0">
                          <td className="px-4 py-2.5 font-medium text-ink">{c.name}</td>
                          <td className="tnum px-4 py-2.5 text-right text-ink-2">
                            {c.share.toFixed(1)}%
                          </td>
                          <td className="tnum px-4 py-2.5 text-right text-ink">
                            {formatCurrency(c.revenue)}
                          </td>
                          <td className="tnum px-4 py-2.5 text-right text-ink-2">
                            {formatNumber(c.orders)}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <DeltaBadge value={c.growth} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
