import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';
import { hashString } from '@/utils/random';

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-[13px]',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-20 w-20 text-2xl',
};

const dots = { online: 'bg-success', away: 'bg-warning', offline: 'bg-ink-3' };

/** Initials avatar with a deterministic tint drawn from the chart palette, an explicit
 * colorIndex (1-5), or a real uploaded photo via `src` (takes priority over initials). */
export function Avatar({ name, size = 'md', status, className, colorIndex, src }) {
  const n = colorIndex ?? (hashString(name || '?') % 5) + 1;
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name ? `${name}’s photo` : 'Profile photo'}
          className={cn('select-none rounded-full object-cover', sizes[size])}
        />
      ) : (
        <span
          aria-hidden={!!name}
          className={cn(
            'inline-flex select-none items-center justify-center rounded-full font-semibold',
            sizes[size],
          )}
          style={{
            background: `color-mix(in srgb, var(--c${n}) 18%, rgb(var(--surface)))`,
            color: `color-mix(in srgb, var(--c${n}) 60%, rgb(var(--ink)))`,
          }}
        >
          {initials(name)}
        </span>
      )}
      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-surface',
            size === 'xl' || size === 'lg' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5',
            dots[status],
          )}
        >
          <span className="sr-only">{status}</span>
        </span>
      )}
    </span>
  );
}
