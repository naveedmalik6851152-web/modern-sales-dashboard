import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useId } from 'react';

/** Tiny trend line for KPI cards and tables. */
export function Sparkline({ values, tone = 'success', height = 40, className }) {
  const id = useId().replace(/:/g, '');
  const color =
    tone === 'danger'
      ? 'rgb(var(--danger))'
      : tone === 'accent'
        ? 'rgb(var(--accent))'
        : 'rgb(var(--success))';
  const data = values.map((v, i) => ({ i, v }));
  return (
    <div className={className} style={{ height }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${id})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
