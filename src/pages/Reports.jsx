import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { analyticsApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/context/ToastContext';
import { REPORT_TYPES } from '@/data/reports';
import { downloadCSV } from '@/utils/csv';
import { buildPdf } from '@/utils/pdf';
import { downloadBlob } from '@/utils/csv';
import { formatByType } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Input, Select } from '@/components/ui/Field';
import { StatCard } from '@/components/cards/StatCard';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

const iso = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const monthAgo = new Date(today.getTime() - 29 * 86400000);

export default function Reports() {
  const [params] = useSearchParams();
  const toast = useToast();
  const [type, setType] = useState(params.get('generate') || 'sales');
  const [from, setFrom] = useState(iso(monthAgo));
  const [to, setTo] = useState(iso(today));
  const [query, setQuery] = useState({ type, from, to });

  useEffect(() => {
    if (params.get('generate')) setType(params.get('generate'));
  }, [params]);

  const { data, loading, error, reload } = useAsync(() => analyticsApi.getReport(query), [query]);

  const generate = (e) => {
    e.preventDefault();
    if (new Date(from) > new Date(to)) {
      toast.error('Invalid date range', {
        description: 'The start date must be before the end date.',
      });
      return;
    }
    setQuery({ type, from, to });
  };

  const filenameBase = () => `sales-dashboard-ig-${type}-report-${from}-to-${to}`;

  const exportCsv = () => {
    if (!data) return;
    downloadCSV(
      `${filenameBase()}.csv`,
      data.rows,
      data.columns.map((c) => ({
        header: c.header,
        value: (r) => (c.type ? formatByType(c.type, r[c.key]) : r[c.key]),
      })),
    );
    toast.success('Report exported', { description: `${filenameBase()}.csv` });
  };

  const exportPdf = () => {
    if (!data) return;
    const pdf = buildPdf({
      title: data.title,
      subtitle: `${data.period}  ·  Generated ${new Date(data.generatedAt).toLocaleDateString()}`,
      columns: data.columns.map((c) => ({
        header: c.header,
        value: (r) => (c.type ? formatByType(c.type, r[c.key]) : r[c.key]),
        width: c.width,
      })),
      rows: data.rows,
    });
    downloadBlob(`${filenameBase()}.pdf`, pdf);
    toast.success('Report exported', { description: `${filenameBase()}.pdf` });
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate a report for any date range and export it."
      />

      <Card className="mb-6">
        <form onSubmit={generate} className="flex flex-wrap items-end gap-3 p-4">
          <Field label="Report type" className="w-48">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {REPORT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="From">
            <Input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To">
            <Input
              type="date"
              value={to}
              min={from}
              max={iso(today)}
              onChange={(e) => setTo(e.target.value)}
            />
          </Field>
          <div className="flex flex-col justify-end">
            <span
              aria-hidden="true"
              className="mb-1.5 block select-none text-[13px] font-medium text-transparent"
            >
              Generate
            </span>
            <Button type="submit" variant="primary">
              Generate report
            </Button>
          </div>
        </form>
      </Card>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <ChartSkeleton key={i} height={96} className="card" />
            ))}
          </div>
          <ChartSkeleton height={360} className="card" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {data.summary.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>

          <Card>
            <CardHeader
              title={data.title}
              description={data.period}
              className="px-0"
              actions={
                <DropdownMenu
                  label="Export report"
                  items={[
                    { label: 'Export as CSV', onClick: exportCsv },
                    { label: 'Export as PDF', onClick: exportPdf },
                  ]}
                  trigger={({ props }) => (
                    <Button icon={Download} {...props}>
                      Export
                    </Button>
                  )}
                />
              }
            />
            <div className="scroll-thin overflow-x-auto px-1 pb-5 pt-3">
              {data.rows.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <FileText className="mx-auto mb-3 h-8 w-8 text-ink-3" aria-hidden />
                  <p className="text-[13px] text-ink-2">No data in this date range.</p>
                </div>
              ) : (
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs font-medium text-ink-3">
                      {data.columns.map((c) => (
                        <th key={c.key} className={`px-4 py-3 ${c.type ? 'text-right' : ''}`}>
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, i) => (
                      <tr key={i} className="border-b border-line last:border-0">
                        {data.columns.map((c) => (
                          <td
                            key={c.key}
                            className={`px-4 py-3 ${c.type ? 'tnum text-right text-ink' : 'font-medium text-ink'}`}
                          >
                            {c.type ? formatByType(c.type, row[c.key]) : row[c.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
