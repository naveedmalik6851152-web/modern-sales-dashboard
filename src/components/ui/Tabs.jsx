import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/** Compact segmented control with a sliding thumb (used for ranges, view toggles). */
export function SegmentedControl({ options, value, onChange, ariaLabel, className, size = 'md' }) {
  const id = useId();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('inline-flex rounded-control bg-sunken p-0.5', className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.ariaLabel}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors',
              size === 'sm' ? 'h-7' : 'h-8',
              active ? 'text-ink' : 'text-ink-2 hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-lg bg-surface shadow-card ring-1 ring-line"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {o.icon && <o.icon className="h-4 w-4" aria-hidden />}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Underline tabs. items: [{ value, label, count?, icon? }] */
export function Tabs({ items, value, onChange, ariaLabel, className }) {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('no-scrollbar flex gap-1 overflow-x-auto border-b border-line', className)}
    >
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative inline-flex h-10 shrink-0 items-center gap-2 px-3 text-[13px] font-medium transition-colors',
              active ? 'text-ink' : 'text-ink-2 hover:text-ink',
            )}
          >
            {t.icon && <t.icon className="h-4 w-4" aria-hidden />}
            {t.label}
            {t.count != null && (
              <span
                className={cn(
                  'tnum rounded-full px-1.5 text-2xs font-semibold leading-4',
                  active ? 'bg-accent-soft text-accent-strong' : 'bg-sunken text-ink-3',
                )}
              >
                {t.count}
              </span>
            )}
            {active && (
              <motion.span
                layoutId={`tab-${id}`}
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 520, damping: 42 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
