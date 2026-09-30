import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';

/** Conversion funnel: bar width is the share of the first step; drop-off is shown between steps. */
export function FunnelChart({ steps }) {
  const top = steps[0]?.value || 1;
  return (
    <ol className="space-y-1 px-5 pb-5 pt-4">
      {steps.map((s, i) => {
        const pct = (s.value / top) * 100;
        const prev = steps[i - 1];
        const drop = prev ? ((prev.value - s.value) / prev.value) * 100 : null;
        return (
          <li key={s.key}>
            {drop != null && (
              <p className="tnum py-1 pl-1 text-xs text-ink-3">
                <span aria-hidden>↓ </span>
                {drop.toFixed(1)}% drop-off
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="w-32 shrink-0 text-[13px] font-medium text-ink sm:w-40">
                {s.label}
              </div>
              <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-sunken">
                <motion.div
                  className="h-full rounded-lg bg-accent"
                  style={{ opacity: 1 - i * 0.16 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(pct, 1.5)}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="tnum w-28 shrink-0 text-right text-[13px]">
                <span className="font-semibold text-ink">{formatNumber(s.value)}</span>
                <span className="ml-2 text-ink-3">{pct.toFixed(pct < 10 ? 1 : 0)}%</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
