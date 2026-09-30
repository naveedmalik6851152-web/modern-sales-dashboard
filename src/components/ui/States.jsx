import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, action, className, compact }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'px-6 py-10' : 'px-6 py-16',
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sunken text-ink-2">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      )}
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] leading-5 text-ink-2">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "We couldn't load this",
  description = 'Check your connection and try again.',
  onRetry,
  className,
  compact,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'px-6 py-10' : 'px-6 py-16',
        className,
      )}
    >
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] leading-5 text-ink-2">{description}</p>
      {onRetry && (
        <Button className="mt-5" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
