import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ToastViewport } from '@/components/ui/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (type, title, options = {}) => {
      const id = ++counter.current;
      setToasts((list) => [...list.slice(-3), { id, type, title, ...options }]);
      setTimeout(() => dismiss(id), options.duration ?? 4500);
      return id;
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (title, o) => push('success', title, o),
      error: (title, o) => push('error', title, o),
      info: (title, o) => push('info', title, o),
      warning: (title, o) => push('warning', title, o),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
