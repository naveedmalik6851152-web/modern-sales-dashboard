import { useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const GAP = 8;

function coordsFor(rect, side) {
  switch (side) {
    case 'right':
      return {
        left: rect.right + GAP,
        top: rect.top + rect.height / 2,
        transform: 'translateY(-50%)',
      };
    case 'bottom':
      return {
        left: rect.left + rect.width / 2,
        top: rect.bottom + GAP,
        transform: 'translateX(-50%)',
      };
    case 'left':
      return {
        left: rect.left - GAP,
        top: rect.top + rect.height / 2,
        transform: 'translate(-100%, -50%)',
      };
    default:
      return {
        left: rect.left + rect.width / 2,
        top: rect.top - GAP,
        transform: 'translate(-50%, -100%)',
      };
  }
}

/** Lightweight tooltip rendered in a portal so it is never clipped by overflow containers. */
export function Tooltip({ content, side = 'top', disabled = false, className, children }) {
  const [rect, setRect] = useState(null);
  const id = useId();

  const show = (e) => {
    if (disabled || !content) return;
    setRect(e.currentTarget.getBoundingClientRect());
  };
  const hide = () => setRect(null);

  return (
    <>
      <span
        className={cn('inline-flex', className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={hide}
        aria-describedby={rect ? id : undefined}
      >
        {children}
      </span>
      {createPortal(
        <AnimatePresence>
          {rect && (
            <div className="pointer-events-none fixed z-[80]" style={coordsFor(rect, side)}>
              <motion.div
                id={id}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-canvas shadow-lift"
              >
                {content}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
