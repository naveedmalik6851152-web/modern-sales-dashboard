import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCompact, formatNumber } from '@/utils/format';
import { ChartTooltip } from './ChartTooltip';

/** Donut with a centred total and a legend listing share and volume. */
export function TrafficDonut({ sources, height = 200 }) {
  const total = sources.reduce((s, x) => s + x.sessions, 0);
  return (
    <div className="px-5 pb-5 pt-2">
      <div className="relative mx-auto" style={{ height, maxWidth: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip formatter={(v) => `${formatNumber(v)} sessions`} />} />
            <Pie
              data={sources}
              dataKey="sessions"
              nameKey="name"
              innerRadius="68%"
              outerRadius="96%"
              paddingAngle={3}
              cornerRadius={5}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {sources.map((s) => (
                <Cell key={s.key} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum text-2xl font-semibold tracking-tight text-ink">
            {formatCompact(total)}
          </span>
          <span className="text-xs text-ink-3">Sessions</span>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {sources.map((s) => (
          <li key={s.key} className="flex items-center gap-3 text-[13px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ background: s.color }}
              aria-hidden
            />
            <span className="flex-1 text-ink">{s.name}</span>
            <span className="tnum text-ink-3">{formatCompact(s.sessions)}</span>
            <span className="tnum w-12 text-right font-semibold text-ink">
              {s.share.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
