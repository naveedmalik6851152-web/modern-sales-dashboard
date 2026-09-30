import { cn } from '@/utils/cn';

export function Card({ as: Comp = 'section', className, ...props }) {
  return <Comp className={cn('card', className)} {...props} />;
}

export function CardHeader({ title, description, actions, className, titleAs: Title = 'h2' }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 p-5 pb-0', className)}>
      <div className="min-w-0">
        <Title className="font-display text-[19px] leading-6 text-ink">{title}</Title>
        {description && <p className="mt-0.5 text-[13px] leading-5 text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
