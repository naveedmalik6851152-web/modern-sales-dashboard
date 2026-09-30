import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';

export function IntegrationsTab({ integrations }) {
  const toast = useToast();
  const [rows, setRows] = useState(integrations);

  const toggle = (id) => {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, connected: !r.connected } : r)));
    const item = rows.find((r) => r.id === id);
    toast.success(item.connected ? `Disconnected ${item.name}` : `Connected ${item.name}`);
  };

  return (
    <Card>
      <CardHeader title="Integrations" description="Connect the tools you already use." />
      <div className="grid gap-3 p-6 pt-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-start gap-3 rounded-xl border border-line p-4">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-sm font-semibold"
              style={{
                background: `color-mix(in srgb, var(--c${r.tone}) 15%, rgb(var(--surface)))`,
                color: `color-mix(in srgb, var(--c${r.tone}) 65%, rgb(var(--ink)))`,
              }}
            >
              {r.mark}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink">{r.name}</p>
              <p className="text-xs text-ink-3">{r.category}</p>
              <p className="mt-1.5 text-[13px] leading-5 text-ink-2">{r.description}</p>
              <Button
                size="sm"
                variant={r.connected ? 'secondary' : 'primary'}
                className="mt-3"
                onClick={() => toggle(r.id)}
              >
                {r.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
