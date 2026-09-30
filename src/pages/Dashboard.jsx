import { RefreshCw } from 'lucide-react';
import { analyticsApi, usersApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useDateRange } from '@/context/DateRangeContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DateRangeSelector } from '@/components/navbar/DateRangeSelector';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { KpiCard } from '@/components/cards/KpiCard';
import { ActivityFeedCard } from '@/components/cards/ActivityFeedCard';
import { TopProductsCard } from '@/components/cards/TopProductsCard';
import { QuickActionsCard } from '@/components/cards/QuickActionsCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { LineSeriesChart } from '@/components/charts/LineSeriesChart';
import { BarSeriesChart } from '@/components/charts/BarSeriesChart';
import { formatCompact, formatCompactCurrency, greeting } from '@/utils/format';
import { products } from '@/data/products';

export default function Dashboard() {
  const { range, meta } = useDateRange();
  const { data, loading, error, refreshing, reload } = useAsync(
    () => analyticsApi.getDashboard(range),
    [range],
  );
  const { data: user } = useAsync(() => usersApi.getCurrentUser(), []);
  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
    reload: reloadActivity,
  } = useAsync(() => usersApi.getActivity(), []);

  return (
    <>
      <PageHeader
        title={`${greeting()}${user ? `, ${user.firstName}` : ''}`}
        description={`Here's how your store performed over the ${meta.label.toLowerCase()}.`}
        actions={
          <>
            {refreshing && (
              <RefreshCw className="h-4 w-4 animate-spin text-ink-3" aria-label="Refreshing" />
            )}
            <DateRangeSelector className="xl:hidden" />
          </>
        }
      />

      {error ? (
        <ErrorState onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <ChartSkeleton key={i} height={150} className="card" />
                ))
              : data.kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader
                title="Revenue overview"
                description="Revenue, expenses and profit"
                actions={
                  <Button icon={RefreshCw} onClick={() => reload()}>
                    Refresh
                  </Button>
                }
              />
              {loading ? (
                <ChartSkeleton height={300} />
              ) : (
                <RevenueChart data={data.revenue} height={280} />
              )}
            </Card>
            <QuickActionsCard />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card>
              <CardHeader title="Sales trend" description="Monthly sales, last 12 months" />
              {loading ? (
                <ChartSkeleton height={220} />
              ) : (
                <BarSeriesChart
                  data={data.salesMonthly}
                  dataKey="sales"
                  name="Sales"
                  formatValue={(v) => formatCompactCurrency(v)}
                  formatTick={formatCompactCurrency}
                  height={220}
                  color="var(--c2)"
                />
              )}
            </Card>
            <Card>
              <CardHeader title="Customer growth" description="Total customers, last 12 months" />
              {loading ? (
                <ChartSkeleton height={220} />
              ) : (
                <LineSeriesChart
                  data={data.customerGrowth}
                  series={[{ key: 'customers', name: 'Customers', color: 'var(--c3)' }]}
                  formatValue={(v) => formatCompact(v)}
                  formatTick={formatCompact}
                  height={220}
                />
              )}
            </Card>
            <TopProductsCard data={loading ? null : products} loading={loading} />
          </div>

          <ActivityFeedCard
            data={activityData}
            loading={activityLoading}
            error={activityError}
            onRetry={reloadActivity}
          />
        </div>
      )}
    </>
  );
}
