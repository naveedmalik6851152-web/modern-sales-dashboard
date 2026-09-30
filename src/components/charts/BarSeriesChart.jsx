import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AXIS_TICK, ChartTooltip } from './ChartTooltip';

/** Single-series bar chart. The latest (or hovered) bar is emphasised; the rest are muted. */
export function BarSeriesChart({
  data,
  dataKey,
  name,
  height = 240,
  formatValue,
  formatTick,
  color = 'var(--c1)',
}) {
  const [active, setActive] = useState(null);
  const highlight = active ?? data.length - 1;
  return (
    <div className="px-2 pb-4 pt-3 sm:px-3" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          onMouseMove={(s) => setActive(s?.activeTooltipIndex ?? null)}
          onMouseLeave={() => setActive(null)}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            tickMargin={10}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            width={48}
            tickFormatter={formatTick}
          />
          <Tooltip
            cursor={{ fill: 'rgb(var(--sunken) / 0.6)' }}
            content={<ChartTooltip formatter={formatValue} />}
          />
          <Bar name={name} dataKey={dataKey} radius={[6, 6, 2, 2]} maxBarSize={30}>
            {data.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={i === highlight ? 1 : 0.32} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
