import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Shared search + dropdown-filter state for table pages.
 * matcher: (row, search) => boolean
 * filterMatchers: { [key]: (row, value) => boolean }
 */
export function useFilteredTable(rows, { matcher, filterMatchers = {}, initialFilters = {} }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const debounced = useDebounce(search, 200);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = debounced.trim().toLowerCase();
    return rows.filter((row) => {
      if (q && !matcher(row, q)) return false;
      return Object.entries(filters).every(([key, value]) => {
        if (value === 'all' || value == null || value === '') return true;
        return filterMatchers[key]?.(row, value) ?? true;
      });
    });
  }, [rows, debounced, filters, matcher, filterMatchers]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clear = () => {
    setSearch('');
    setFilters(initialFilters);
  };

  return { search, setSearch, filters, setFilter, filtered, clear };
}
