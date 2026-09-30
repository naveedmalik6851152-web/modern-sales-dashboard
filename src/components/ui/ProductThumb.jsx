import { Cable, Headphones, Lightbulb, Monitor, Package, Watch } from 'lucide-react';
import { cn } from '@/utils/cn';

const CATEGORY = {
  Audio: { icon: Headphones, n: 1 },
  Wearables: { icon: Watch, n: 2 },
  'Home Office': { icon: Monitor, n: 3 },
  Accessories: { icon: Cable, n: 4 },
  'Smart Home': { icon: Lightbulb, n: 5 },
};

export function categoryColorIndex(category) {
  return CATEGORY[category]?.n ?? 1;
}

/** Category-tinted product tile. `cover` renders the larger card image with a soft ring motif. */
export function ProductThumb({ category, size = 'md', className }) {
  const meta = CATEGORY[category] || { icon: Package, n: 1 };
  const Icon = meta.icon;
  const tint = `color-mix(in srgb, var(--c${meta.n}) 14%, rgb(var(--surface)))`;
  const ink = `color-mix(in srgb, var(--c${meta.n}) 70%, rgb(var(--ink)))`;

  if (size === 'cover') {
    return (
      <div
        className={cn(
          'relative flex aspect-[4/3] items-center justify-center overflow-hidden',
          className,
        )}
        style={{ background: tint, color: ink }}
        aria-hidden
      >
        <svg
          viewBox="0 0 200 150"
          className="absolute inset-0 h-full w-full opacity-[0.35]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <circle cx="100" cy="75" r="30" />
          <circle cx="100" cy="75" r="52" />
          <circle cx="100" cy="75" r="76" />
          <circle cx="100" cy="75" r="102" />
        </svg>
        <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface/70 shadow-card backdrop-blur-sm">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </span>
      </div>
    );
  }

  const dims = size === 'sm' ? 'h-9 w-9 rounded-lg' : 'h-11 w-11 rounded-xl';
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', dims, className)}
      style={{ background: tint, color: ink }}
      aria-hidden
    >
      <Icon className={size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5'} strokeWidth={1.7} />
    </span>
  );
}
