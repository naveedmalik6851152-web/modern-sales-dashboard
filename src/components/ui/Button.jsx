import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Tooltip } from './Tooltip';

const variants = {
  primary:
    'bg-accent text-accent-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(16_24_40/0.18)] hover:bg-accent-strong',
  secondary:
    'border border-line bg-surface text-ink shadow-card hover:border-line-strong hover:bg-surface-2',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
  soft: 'bg-accent-soft text-accent-strong hover:bg-accent-soft/60',
  danger:
    'bg-danger text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:opacity-90 dark:text-[#2a0a0c]',
};

// A "tone" recolors an existing variant instead of introducing a whole new visual style —
// e.g. a bordered "secondary" button in the danger palette, without a 6th distinct button style.
const toneOverrides = {
  danger: 'border-danger/30 text-danger hover:border-danger/40 hover:bg-danger-soft',
};

const sizes = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-[13px]',
  md: 'h-9 gap-2 rounded-control px-3.5 text-sm',
  lg: 'h-11 gap-2 rounded-control px-5 text-sm',
};

export const Button = forwardRef(function Button(
  {
    as: Comp = 'button',
    variant = 'secondary',
    tone,
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const isNativeButton = Comp === 'button';
  return (
    <Comp
      ref={ref}
      type={isNativeButton ? (props.type ?? 'button') : undefined}
      disabled={isNativeButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        tone && toneOverrides[tone],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden />
      )}
      {children}
      {IconRight && <IconRight className="h-4 w-4" aria-hidden />}
    </Comp>
  );
});

const iconSizes = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-10 w-10' };

export const IconButton = forwardRef(function IconButton(
  {
    as: Comp = 'button',
    label,
    icon: Icon,
    variant = 'ghost',
    size = 'md',
    tooltip = true,
    className,
    badge,
    children,
    ...props
  },
  ref,
) {
  const button = (
    <Comp
      ref={ref}
      type={Comp === 'button' ? 'button' : undefined}
      aria-label={label}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-control transition-[background-color,color,border-color] duration-150 active:scale-95 disabled:opacity-50',
        variants[variant],
        iconSizes[size],
        className,
      )}
      {...props}
    >
      {children ?? (Icon && <Icon className="h-[18px] w-[18px]" aria-hidden />)}
      {badge}
    </Comp>
  );
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
});
