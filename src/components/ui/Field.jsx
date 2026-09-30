import { Children, cloneElement, forwardRef, useId } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Field({ label, hint, error, required, children, className }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const child = Children.only(children);
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium text-ink">
          {label}
          {required && (
            <span className="text-danger" aria-hidden>
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {cloneElement(child, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-ink-3">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const Input = forwardRef(function Input({ icon: Icon, className, ...props }, ref) {
  if (!Icon) return <input ref={ref} className={cn('control', className)} {...props} />;
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
        aria-hidden
      />
      <input ref={ref} className={cn('control pl-9', className)} {...props} />
    </div>
  );
});

export const SearchInput = forwardRef(function SearchInput({ className, ...props }, ref) {
  return (
    <Input
      ref={ref}
      type="search"
      icon={Search}
      autoComplete="off"
      className={className}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn('control h-auto min-h-[88px] resize-y py-2', className)}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className, wrapperClassName, children, ...props },
  ref,
) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <select
        ref={ref}
        className={cn('control cursor-pointer appearance-none pr-8', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
        aria-hidden
      />
    </div>
  );
});
