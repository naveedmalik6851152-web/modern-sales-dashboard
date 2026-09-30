import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function Preview({ dark }) {
  return (
    <div
      className={cn(
        'h-16 w-full overflow-hidden rounded-lg border',
        dark ? 'border-[#2a3247] bg-[#0f1420]' : 'border-line bg-white',
      )}
    >
      <div
        className={cn('flex h-4 items-center gap-1 px-2', dark ? 'bg-[#151b2b]' : 'bg-[#f3f4f7]')}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#5B4FE9]" />
        <span className={cn('h-1.5 w-8 rounded-full', dark ? 'bg-[#2a3247]' : 'bg-[#e3e5ea]')} />
      </div>
      <div className="flex gap-1.5 p-2">
        <span className={cn('h-8 w-4 rounded', dark ? 'bg-[#151b2b]' : 'bg-[#f3f4f7]')} />
        <span className={cn('h-8 flex-1 rounded', dark ? 'bg-[#151b2b]' : 'bg-[#f3f4f7]')} />
      </div>
    </div>
  );
}

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  return (
    <Card>
      <CardHeader title="Appearance" description="Choose how Sales Dashboard IG looks on this device." />
      <div className="grid gap-3 p-6 pt-4 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const active = theme === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => setTheme(o.value)}
              aria-pressed={active}
              className={cn(
                'relative rounded-xl border p-3 text-left transition-colors',
                active
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-line hover:border-line-strong',
              )}
            >
              <Preview dark={o.value === 'dark'} />
              <div className="mt-3 flex items-center gap-2">
                <o.icon className="h-4 w-4 text-ink-2" aria-hidden />
                <span className="text-[13px] font-medium text-ink">{o.label}</span>
                {active && <Check className="ml-auto h-4 w-4 text-accent" aria-hidden />}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
