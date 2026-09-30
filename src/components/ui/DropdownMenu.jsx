import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Popover } from './Popover';

function MenuList({ items, header, close }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current
      ?.querySelector('[role^="menuitem"]:not([disabled])')
      ?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e) => {
    const els = Array.from(ref.current.querySelectorAll('[role^="menuitem"]:not([disabled])'));
    const i = els.indexOf(document.activeElement);
    const go = (n) => {
      e.preventDefault();
      els[(n + els.length) % els.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(els.length - 1);
    else if (e.key === 'Tab') close();
  };

  return (
    <div ref={ref} role="menu" onKeyDown={onKeyDown} className="p-1.5">
      {header && <div className="px-2.5 pb-2 pt-1.5">{header}</div>}
      {header && <div className="-mx-1.5 mb-1.5 border-t border-line" />}
      {items.map((item, i) => {
        if (item.separator)
          return (
            <div
              key={`sep-${i}`}
              role="separator"
              className="-mx-1.5 my-1.5 border-t border-line"
            />
          );
        const Icon = item.icon;
        const cls = cn(
          'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium outline-none transition-colors',
          item.danger
            ? 'text-danger hover:bg-danger-soft focus-visible:bg-danger-soft'
            : 'text-ink hover:bg-sunken focus-visible:bg-sunken',
          item.disabled && 'pointer-events-none opacity-50',
        );
        const content = (
          <>
            {Icon && (
              <Icon
                className={cn('h-4 w-4 shrink-0', item.danger ? 'text-danger' : 'text-ink-3')}
                aria-hidden
              />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate">{item.label}</span>
              {item.description && (
                <span className="block truncate text-xs font-normal text-ink-3">
                  {item.description}
                </span>
              )}
            </span>
            {item.selected && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />}
            {item.shortcut && <kbd className="text-xs font-normal text-ink-3">{item.shortcut}</kbd>}
          </>
        );
        const role = item.selected !== undefined ? 'menuitemradio' : 'menuitem';
        if (item.to) {
          return (
            <Link
              key={item.label}
              to={item.to}
              role={role}
              tabIndex={-1}
              className={cls}
              onClick={close}
            >
              {content}
            </Link>
          );
        }
        return (
          <button
            key={item.label}
            type="button"
            role={role}
            aria-checked={item.selected}
            tabIndex={-1}
            disabled={item.disabled}
            className={cls}
            onClick={() => {
              close();
              item.onClick?.();
            }}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

/**
 * items: [{ label, icon?, onClick?, to?, danger?, disabled?, selected?, description?, shortcut? } | { separator: true }]
 */
export function DropdownMenu({ trigger, items, header, align = 'end', width = 'w-56', label }) {
  return (
    <Popover trigger={trigger} align={align} role="menu" label={label} panelClassName={width}>
      {({ close }) => <MenuList items={items} header={header} close={close} />}
    </Popover>
  );
}
