import { FileDown, Plus, ShoppingBag, UserPlus } from 'lucide-react';
import { useActions } from '@/context/ActionsContext';
import { Card, CardHeader } from '@/components/ui/Card';

const ACTIONS = [
  { key: 'order', label: 'Create order', icon: ShoppingBag, tone: 1 },
  { key: 'customer', label: 'Add customer', icon: UserPlus, tone: 2 },
  { key: 'product', label: 'Add product', icon: Plus, tone: 3 },
  { key: 'report', label: 'Generate report', icon: FileDown, tone: 4 },
];

export function QuickActionsCard() {
  const actions = useActions();
  const handlers = {
    order: actions.createOrder,
    customer: actions.addCustomer,
    product: actions.addProduct,
    report: () => actions.generateReport('sales'),
  };
  return (
    <Card>
      <CardHeader title="Quick actions" />
      <div className="grid grid-cols-2 gap-3 p-5 pt-3">
        {ACTIONS.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={handlers[a.key]}
            className="group flex min-h-[104px] flex-col items-start gap-3 rounded-card border border-line bg-surface p-3.5 text-left shadow-card transition-colors hover:border-line-strong hover:bg-surface-2"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{
                background: `color-mix(in srgb, var(--c${a.tone}) 15%, rgb(var(--surface)))`,
                color: `color-mix(in srgb, var(--c${a.tone}) 65%, rgb(var(--ink)))`,
              }}
            >
              <a.icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="text-[13px] font-medium leading-snug text-ink">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
