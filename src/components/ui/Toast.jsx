import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const icons = { success: CheckCircle2, error: AlertCircle, info: Info, warning: AlertTriangle };
const tones = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-info',
  warning: 'text-warning',
};

export function ToastViewport({ toasts, onDismiss }) {
  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-pop"
            >
              <Icon
                className={cn('mt-0.5 h-[18px] w-[18px] shrink-0', tones[t.type])}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-5 text-ink">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-[13px] leading-5 text-ink-2">{t.description}</p>
                )}
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action.onClick();
                      onDismiss(t.id);
                    }}
                    className="mt-1.5 text-[13px] font-semibold text-accent-strong hover:underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                aria-label="Dismiss notification"
                className="-mr-1 -mt-1 rounded-md p-1 text-ink-3 transition-colors hover:bg-sunken hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
