import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const GAP = 8;
const EDGE = 8;

/**
 * Anchored floating panel. Rendered in a portal with fixed positioning so it is
 * never clipped by scroll containers; flips upward when there is no room below.
 * `trigger` receives the props to spread onto the trigger element.
 */
export function Popover({
  trigger,
  children,
  align = 'end',
  role = 'dialog',
  label,
  className,
  panelClassName,
  onOpenChange,
}) {
  const [open, setOpenState] = useState(false);
  const [pos, setPos] = useState(null);
  const anchorRef = useRef(null);
  const panelRef = useRef(null);

  const setOpen = useCallback(
    (value) => {
      setOpenState(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(
    () =>
      setOpenState((v) => {
        onOpenChange?.(!v);
        return !v;
      }),
    [onOpenChange],
  );

  const place = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const t = anchor.getBoundingClientRect();
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    let top = t.bottom + GAP;
    if (top + h > window.innerHeight - EDGE && t.top - GAP - h > EDGE) top = t.top - GAP - h;
    let left = align === 'end' ? t.right - w : t.left;
    left = Math.max(EDGE, Math.min(left, window.innerWidth - w - EDGE));
    setPos({ top, left });
  }, [align]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (anchorRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      close();
      anchorRef.current?.querySelector('button,a,[tabindex]')?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, close, place]);

  return (
    <>
      <span ref={anchorRef} className={cn('inline-flex', className)}>
        {trigger({
          open,
          close,
          props: {
            onClick: toggle,
            'aria-expanded': open,
            'aria-haspopup': role === 'menu' ? 'menu' : 'dialog',
          },
        })}
      </span>
      {createPortal(
        <AnimatePresence>
          {open && (
            <div
              ref={panelRef}
              className="fixed z-[70]"
              style={{
                top: pos?.top ?? 0,
                left: pos?.left ?? 0,
                visibility: pos ? 'visible' : 'hidden',
              }}
            >
              <motion.div
                role={role}
                aria-label={label}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-xl border border-line bg-surface shadow-pop',
                  panelClassName,
                )}
              >
                {typeof children === 'function' ? children({ close }) : children}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
