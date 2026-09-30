import { CreditCard } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';

export function AccountTab({ account, onUpgrade }) {
  const { plan, paymentMethod, invoices } = account;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Plan"
          description={`${plan.name} plan · ${formatCurrency(plan.price)} / ${plan.interval}`}
          actions={
            <Button variant="primary" onClick={onUpgrade}>
              Upgrade plan
            </Button>
          }
        />
        <div className="space-y-5 p-6 pt-4">
          <p className="text-[13px] text-ink-2">
            Renews on <span className="font-medium text-ink">{formatDate(plan.renews)}</span> ·{' '}
            {plan.seats.used} of {plan.seats.total} seats used
          </p>
          {plan.usage.map((u) => (
            <div key={u.label}>
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="text-ink-2">{u.label}</span>
                <span className="tnum text-ink-3">
                  {formatNumber(u.used)} / {formatNumber(u.total)}
                </span>
              </div>
              <ProgressBar
                value={u.used}
                max={u.total}
                tone={u.used / u.total > 0.85 ? 'warning' : 'accent'}
                label={u.label}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Payment method" />
        <div className="flex items-center justify-between gap-4 p-6 pt-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-12 items-center justify-center rounded-md bg-sunken text-ink-2">
              <CreditCard className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-[13px] font-medium text-ink">
                {paymentMethod.brand} •••• {paymentMethod.last4}
              </p>
              <p className="text-xs text-ink-3">Expires {paymentMethod.expires}</p>
            </div>
          </div>
          <Button size="sm">Update</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Billing history" />
        <div className="scroll-thin overflow-x-auto px-1 pb-2 pt-2">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-medium text-ink-3">
                <th className="px-5 py-2.5">Invoice</th>
                <th className="px-5 py-2.5">Date</th>
                <th className="px-5 py-2.5 text-right">Amount</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{inv.id}</td>
                  <td className="px-5 py-3 text-ink-2">{formatDate(inv.date)}</td>
                  <td className="tnum px-5 py-3 text-right text-ink">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      className="text-[13px] font-medium text-accent-strong hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
