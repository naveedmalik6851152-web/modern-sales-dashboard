import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useOverlay } from '@/hooks/useOverlay';
import { cn } from '@/utils/cn';
import { IconButton } from './Button';

const EASE = [0.22, 1, 0.36, 1];

function Backdrop({ onClick }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 bg-[rgb(6_9_16/0.5)] backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
    />
  );
}

function PanelHeader({ id, title, description, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
      <div className="min-w-0">
        <h2 id={id} className="font-display text-xl leading-6 text-ink">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-[13px] text-ink-2">{description}</p>}
      </div>
      <IconButton label="Close" icon={X} size="sm" onClick={onClose} className="-mr-2 -mt-0.5" />
    </div>
  );
}

const modalSizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  children,
  className,
  bare,
}) {
  const ref = useRef(null);
  const titleId = useId();
  useOverlay({ open, onClose, containerRef: ref });

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <Backdrop onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={bare ? undefined : titleId}
            tabIndex={-1}
            className={cn(
              'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-pop outline-none sm:rounded-2xl',
              modalSizes[size],
              className,
            )}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {!bare && (
              <PanelHeader id={titleId} title={title} description={description} onClose={onClose} />
            )}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <div className="flex flex-col-reverse gap-2 border-t border-line bg-surface-2 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-end">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  footer,
  side = 'right',
  width = 'max-w-[520px]',
  bare,
  children,
  className,
}) {
  const ref = useRef(null);
  const titleId = useId();
  useOverlay({ open, onClose, containerRef: ref });
  const from = side === 'right' ? 40 : -40;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            'fixed inset-0 z-[60] flex',
            side === 'right' ? 'justify-end' : 'justify-start',
          )}
        >
          <Backdrop onClick={onClose} />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={bare ? undefined : titleId}
            aria-label={bare ? title : undefined}
            tabIndex={-1}
            className={cn(
              'relative flex h-full w-full flex-col bg-surface shadow-pop outline-none',
              side === 'right' ? 'border-l border-line' : 'border-r border-line',
              width,
              className,
            )}
            initial={{ x: from, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: from, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            {!bare && (
              <PanelHeader id={titleId} title={title} description={description} onClose={onClose} />
            )}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-2 px-6 py-3.5">
                {footer}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
