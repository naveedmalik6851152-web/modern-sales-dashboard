import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchInput, Select } from '@/components/ui/Field';

/**
 * filters: [{ key, value, onChange, options: [{value,label}], placeholder }]
 */
export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters = [],
  onClear,
  actions,
  resultCount,
}) {
  const hasActiveFilters = filters.some((f) => f.value !== 'all' && f.value) || !!search;
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="w-full sm:w-56"
      />
      {filters.map((f) => (
        <Select
          key={f.key}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          aria-label={f.label}
          wrapperClassName="w-auto"
          className="w-auto pr-8"
        >
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ))}
      {hasActiveFilters && onClear && (
        <Button size="sm" variant="ghost" icon={X} onClick={onClear}>
          Clear
        </Button>
      )}
      {resultCount != null && (
        <span className="tnum ml-auto hidden text-[13px] text-ink-3 sm:inline">
          {resultCount} results
        </span>
      )}
      {actions && <div className="ml-auto flex items-center gap-2 sm:ml-2">{actions}</div>}
    </div>
  );
}
