import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';

export function NotificationsTab({ prefs }) {
  const toast = useToast();
  const [rows, setRows] = useState(prefs);

  const update = (id, channel, value) => {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, [channel]: value } : r)));
    toast.success('Notification preferences saved');
  };

  return (
    <Card>
      <CardHeader
        title="Notification preferences"
        description="Choose how you want to hear about activity."
      />
      <div className="border-t border-line">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-3 text-xs font-medium text-ink-3">
          <span>Category</span>
          <span className="w-12 text-center">Email</span>
          <span className="w-12 text-center">Push</span>
        </div>
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-3.5"
            >
              <div>
                <p className="text-[13px] font-medium text-ink">{r.title}</p>
                <p className="mt-0.5 text-xs text-ink-3">{r.description}</p>
              </div>
              <div className="flex w-12 justify-center">
                <Toggle
                  checked={r.email}
                  disabled={r.locked}
                  onChange={(v) => update(r.id, 'email', v)}
                  label={`${r.title} email`}
                />
              </div>
              <div className="flex w-12 justify-center">
                <Toggle
                  checked={r.push}
                  disabled={r.locked}
                  onChange={(v) => update(r.id, 'push', v)}
                  label={`${r.title} push`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
