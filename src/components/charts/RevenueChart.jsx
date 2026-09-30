import { useId, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/utils/cn';
import { formatCompactCurrency, formatCurrency } from '@/utils/format';
import { AXIS_TICK, ChartTooltip, CURSOR } from './ChartTooltip';

const SERIES = [
  { key: 'revenue', name: 'Revenue', color: 'var(--c1)' },
  { key: 'expenses', name: 'Expenses', color: 'var(--c4)' },
  { key: 'profit', name: 'Profit', color: 'var(--c3)' },
];

/** Revenue, expenses and profit over time. Legend items double as series toggles. */
export function RevenueChart({ data, height = 300, compare = false }) {
  const id = useId().replace(/:/g, '');
  const [hidden, setHidden] = useState(() => new Set());
  const totals = Object.fromEntries(
    SERIES.map((s) => [s.key, data.reduce((sum, r) => sum + r[s.key], 0)]),
  );

  const toggle = (key) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < SERIES.length - 1) next.add(key);
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 px-5 pt-6">
        {SERIES.map((s) => {
          const off = hidden.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={!off}
              onClick={() => toggle(s.key)}
              className={cn('group text-left transition-opacity', off && 'opacity-45')}
            >
              <span className="flex items-center gap-2 text-[13px] text-ink-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: s.color }}
                  aria-hidden
                />
                {s.name}
              </span>
              <span className="tnum mt-0.5 block text-xl font-semibold tracking-tight text-ink">
                {formatCurrency(totals[s.key])}
              </span>
            </button>
          );
        })}
        {compare && (
          <span className="flex items-center gap-2 self-end pb-1 text-[13px] text-ink-2">
            <span className="h-0 w-4 border-t-2 border-dashed border-ink-3" aria-hidden />
            Previous period
          </span>
        )}
      </div>
      <div className="mt-2 px-2 pb-4 sm:px-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`${id}-rev`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c1)" stopOpacity={0.24} />
                <stop offset="100%" stopColor="var(--c1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
              tickMargin={10}
              minTickGap={28}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
              width={52}
              tickFormatter={formatCompactCurrency}
            />
            <Tooltip
              cursor={CURSOR}
              content={<ChartTooltip formatter={(v) => formatCurrency(v)} />}
            />
            {!hidden.has('revenue') && (
              <Area
                name="Revenue"
                type="monotone"
                dataKey="revenue"
                stroke="var(--c1)"
                strokeWidth={2.25}
                fill={`url(#${id}-rev)`}
                dot={false}
                activeDot={{ r: 4.5, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
              />
            )}
            {!hidden.has('expenses') && (
              <Line
                name="Expenses"
                type="monotone"
                dataKey="expenses"
                stroke="var(--c4)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
              />
            )}
            {!hidden.has('profit') && (
              <Line
                name="Profit"
                type="monotone"
                dataKey="profit"
                stroke="var(--c3)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
              />
            )}
            {compare && (
              <Line
                name="Previous period"
                type="monotone"
                dataKey="previous"
                stroke="rgb(var(--ink-3))"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
