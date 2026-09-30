import { createContext, useContext, useMemo } from 'react';
import { RANGE_META } from '@/data/analytics';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DateRangeContext = createContext(null);

/** The global reporting period shared by the navbar, dashboard and analytics. */
export function DateRangeProvider({ children }) {
  const [range, setRange] = useLocalStorage('meridian:range', '30d');
  const safe = RANGE_META[range] ? range : '30d';
  const value = useMemo(
    () => ({ range: safe, setRange, meta: RANGE_META[safe] }),
    [safe, setRange],
  );
  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error('useDateRange must be used within DateRangeProvider');
  return ctx;
}
