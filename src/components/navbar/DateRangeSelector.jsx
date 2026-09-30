import { CalendarDays, ChevronDown } from 'lucide-react';
import { useDateRange } from '@/context/DateRangeContext';
import { RANGE_OPTIONS } from '@/data/analytics';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

/** Global reporting-period picker. */
export function DateRangeSelector({ className }) {
  const { range, setRange, meta } = useDateRange();
  return (
    <DropdownMenu
      label="Reporting period"
      width="w-52"
      items={RANGE_OPTIONS.map((o) => ({
        label: o.label,
        selected: o.id === range,
        onClick: () => setRange(o.id),
      }))}
      trigger={({ props }) => (
        <Button icon={CalendarDays} iconRight={ChevronDown} className={className} {...props}>
          {meta.label}
        </Button>
      )}
    />
  );
}
