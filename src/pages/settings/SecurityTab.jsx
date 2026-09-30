import { useState } from 'react';
import { Laptop, Shield, Smartphone } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import { required, useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Field';
import { Toggle } from '@/components/ui/Toggle';

const RULES = {
  current: required('Current password'),
  next: (v) => (v.length >= 8 ? undefined : 'Use at least 8 characters'),
  confirm: (v, all) => (v === all.next ? undefined : 'Passwords do not match'),
};

export function SecurityTab({ sessions }) {
  const toast = useToast();
  const confirm = useConfirm();
  const { values, errors, set, validate, reset } = useForm(
    { current: '', next: '', confirm: '' },
    RULES,
  );
  const [saving, setSaving] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [list, setList] = useState(sessions);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    reset();
    toast.success('Password updated');
  };

  const revoke = async (session) => {
    const ok = await confirm({
      title: 'Sign out this device?',
      description: `${session.device} will be signed out immediately.`,
      confirmLabel: 'Sign out',
      tone: 'danger',
    });
    if (!ok) return;
    setList((l) => l.filter((s) => s.id !== session.id));
    toast.success('Session revoked', { description: session.device });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Password" description="Use at least 8 characters." />
        <form onSubmit={onSubmit} noValidate className="grid gap-4 p-6 pt-4 sm:grid-cols-2">
          <Field label="Current password" required error={errors.current} className="sm:col-span-2">
            <Input
              type="password"
              autoComplete="current-password"
              value={values.current}
              onChange={(e) => set('current', e.target.value)}
            />
          </Field>
          <Field label="New password" required error={errors.next}>
            <Input
              type="password"
              autoComplete="new-password"
              value={values.next}
              onChange={(e) => set('next', e.target.value)}
            />
          </Field>
          <Field label="Confirm new password" required error={errors.confirm}>
            <Input
              type="password"
              autoComplete="new-password"
              value={values.confirm}
              onChange={(e) => set('confirm', e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Button variant="primary" type="submit" loading={saving}>
              Update password
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="Two-factor authentication"
          description="Add an extra layer of security to your account."
        />
        <div className="flex items-center justify-between gap-4 p-6 pt-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-success-soft text-success">
              <Shield className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div>
              <p className="text-[13px] font-medium text-ink">Authenticator app</p>
              <p className="text-xs text-ink-3">{twoFactor ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          <Toggle
            checked={twoFactor}
            onChange={(v) => {
              setTwoFactor(v);
              toast.info(v ? 'Two-factor enabled' : 'Two-factor disabled');
            }}
            label="Two-factor authentication"
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Active sessions"
          description="Devices currently signed in to your account."
        />
        <ul className="divide-y divide-line px-2 pb-2 pt-1">
          {list.map((s) => (
            <li key={s.id} className="flex items-center gap-3.5 px-3 py-3.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-sunken text-ink-2">
                {s.device.toLowerCase().includes('iphone') ? (
                  <Smartphone className="h-[18px] w-[18px]" aria-hidden />
                ) : (
                  <Laptop className="h-[18px] w-[18px]" aria-hidden />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">
                  {s.device}{' '}
                  {s.current && (
                    <span className="ml-1.5 text-xs font-normal text-success">This device</span>
                  )}
                </p>
                <p className="text-xs text-ink-3">
                  {s.location} · {s.lastActive}
                </p>
              </div>
              {!s.current && (
                <Button size="sm" variant="secondary" tone="danger" onClick={() => revoke(s)}>
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
