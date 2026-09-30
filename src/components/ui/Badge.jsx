import { cn } from '@/utils/cn';

const tones = {
  neutral: 'bg-sunken text-ink-2',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  accent: 'bg-accent-soft text-accent-strong',
};

export function Badge({ tone = 'neutral', dot = false, icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {Icon && <Icon className="h-3 w-3" aria-hidden />}
      {children}
    </span>
  );
}

const STATUS_TONES = {
  // orders
  Completed: 'success',
  Pending: 'warning',
  Cancelled: 'danger',
  Refunded: 'info',
  // payments
  Paid: 'success',
  Unpaid: 'warning',
  Failed: 'danger',
  // customers
  Active: 'success',
  Inactive: 'neutral',
  VIP: 'accent',
  Regular: 'neutral',
  New: 'info',
  // stock
  'In stock': 'success',
  'Low stock': 'warning',
  'Out of stock': 'danger',
};

export function StatusBadge({ status, className }) {
  return (
    <Badge tone={STATUS_TONES[status] || 'neutral'} dot className={className}>
      {status}
    </Badge>
  );
}

/** Percentage change pill used on KPI cards. */
export function DeltaBadge({ value, className }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        'tnum inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
        positive ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
        className,
      )}
    >
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {positive ? <path d="M3 8.5 8.5 3M4.5 3H8.5v4" /> : <path d="M3 3.5 8.5 9M4.5 9H8.5V5" />}
      </svg>
      <span className="sr-only">{positive ? 'Up' : 'Down'} </span>
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
