import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AXIS_TICK, ChartTooltip, CURSOR } from './ChartTooltip';

/** One or more smooth series. `series: [{ key, name, color }]`. First series gets a soft area fill. */
export function LineSeriesChart({
  data,
  series,
  height = 240,
  formatValue,
  formatTick,
  domain,
  stacked = false,
}) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="px-2 pb-4 pt-3 sm:px-3" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`${id}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={stacked ? 0.55 : 0.2} />
                <stop offset="100%" stopColor={s.color} stopOpacity={stacked ? 0.12 : 0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            tickMargin={10}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            width={48}
            tickFormatter={formatTick}
            domain={domain}
          />
          <Tooltip cursor={CURSOR} content={<ChartTooltip formatter={formatValue} />} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              name={s.name}
              type="monotone"
              dataKey={s.key}
              stackId={stacked ? 'a' : undefined}
              stroke={s.color}
              strokeWidth={2.25}
              fill={stacked || i === 0 ? `url(#${id}-${i})` : 'transparent'}
              dot={false}
              activeDot={{ r: 4.5, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
