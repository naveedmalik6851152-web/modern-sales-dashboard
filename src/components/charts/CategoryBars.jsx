import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/format';

/** Horizontal ranked bars for revenue by category. */
export function CategoryBars({ categories }) {
  const max = Math.max(...categories.map((c) => c.revenue), 1);
  return (
    <ul className="space-y-4 px-5 pb-5 pt-4">
      {categories.map((c, i) => (
        <li key={c.name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="font-medium text-ink">{c.name}</span>
            <span className="tnum text-ink-2">
              <span className="font-semibold text-ink">{formatCurrency(c.revenue)}</span>
              <span className="ml-2 text-ink-3">{c.share.toFixed(0)}%</span>
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-sunken"
            role="img"
            aria-label={`${c.name}: ${c.share.toFixed(0)} percent of revenue`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: c.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(c.revenue / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
