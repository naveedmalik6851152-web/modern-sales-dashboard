/** Shared Recharts tooltip styled like the rest of the UI. */
export function ChartTooltip({ active, payload, label, formatter, title, hideZero }) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value != null && !(hideZero && p.value === 0));
  return (
    <div className="min-w-[168px] rounded-xl border border-line bg-surface p-3 shadow-pop">
      <p className="mb-1.5 text-xs font-medium text-ink-3">
        {title ? title(label, payload) : label}
      </p>
      {rows.map((p) => (
        <div
          key={p.dataKey ?? p.name}
          className="flex items-center justify-between gap-6 py-0.5 text-[13px]"
        >
          <span className="flex items-center gap-2 text-ink-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color || p.stroke || p.fill }}
              aria-hidden
            />
            {p.name}
          </span>
          <span className="tnum font-semibold text-ink">
            {formatter ? formatter(p.value, p) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export const AXIS_TICK = { fill: 'rgb(var(--ink-3))', fontSize: 12 };
export const CURSOR = { stroke: 'rgb(var(--line-strong))', strokeDasharray: '3 3' };
