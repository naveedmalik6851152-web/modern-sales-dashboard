import { useEffect, useRef } from 'react';

const stack = [];
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Shared behaviour for modals and drawers: Escape closes only the top-most
 * overlay, Tab is trapped inside, and focus returns to the trigger on close.
 */
export function useOverlay({ open, onClose, containerRef }) {
  const idRef = useRef({});
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const id = idRef.current;
    const container = containerRef.current;
    if (!container) return undefined;
    stack.push(id);
    const previous = document.activeElement;

    const focusables = () => Array.from(container.querySelectorAll(FOCUSABLE));
    const initial = container.querySelector('[data-autofocus]') || focusables()[0] || container;
    initial.focus({ preventScroll: true });

    const onKey = (e) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current?.();
      } else if (e.key === 'Tab') {
        const els = focusables();
        if (!els.length) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(id), 1);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [open, containerRef]);
}
