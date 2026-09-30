import { Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { ordersApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button, IconButton } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { formatCurrency, formatDateTime } from '@/utils/format';

export function OrderDrawer({ order: o, onClose }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  const updateStatus = async (status) => {
    if (status !== 'Cancelled' && status !== 'Refunded') {
      setBusy(true);
      try {
        await ordersApi.updateStatus(o.id, status);
        toast.success(`Order marked ${status.toLowerCase()}`, { description: o.id });
      } catch (err) {
        toast.error('Could not update order', { description: err.message });
      } finally {
        setBusy(false);
      }
      return;
    }
    const ok = await confirm({
      title: `${status === 'Cancelled' ? 'Cancel' : 'Refund'} ${o.id}?`,
      description:
        status === 'Cancelled'
          ? 'The customer will be notified that their order was cancelled.'
          : `${formatCurrency(o.amount, { cents: true })} will be refunded to the original payment method.`,
      confirmLabel: status === 'Cancelled' ? 'Cancel order' : 'Refund order',
      tone: 'danger',
    });
    if (!ok) return;
    setBusy(true);
    try {
      await ordersApi.updateStatus(o.id, status);
      toast.success(`Order ${status.toLowerCase()}`, { description: o.id });
    } catch (err) {
      toast.error('Could not update order', { description: err.message });
    } finally {
      setBusy(false);
    }
  };

  const canProgress = o.status === 'Pending';
  const canCancel = o.status === 'Pending';
  const canRefund = o.status === 'Completed';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-line p-6">
        <div>
          <h2 className="text-base font-semibold text-ink">{o.id}</h2>
          <p className="mt-0.5 text-[13px] text-ink-2">{formatDateTime(o.date)}</p>
        </div>
        <IconButton label="Close" icon={X} onClick={onClose} />
      </div>

      <div className="scroll-thin flex-1 space-y-6 overflow-y-auto p-6">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={o.status} />
          <StatusBadge status={o.payment} />
        </div>

        <div>
          <h3 className="mb-2 text-[13px] font-semibold text-ink">Customer</h3>
          <Link
            to={`/customers/${o.customerId}`}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-sunken"
          >
            <Avatar name={o.customerName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-ink">{o.customerName}</p>
              <p className="truncate text-xs text-ink-3">{o.customerEmail}</p>
            </div>
          </Link>
        </div>

        <div>
          <h3 className="mb-2 text-[13px] font-semibold text-ink">Items</h3>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {o.items.map((it) => (
              <li key={it.productId} className="flex items-center gap-3 p-3">
                <ProductThumb category={it.category} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{it.name}</p>
                  <p className="text-xs text-ink-3">Qty {it.qty}</p>
                </div>
                <span className="tnum text-[13px] font-medium text-ink">
                  {formatCurrency(it.price * it.qty)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="space-y-1.5 rounded-xl bg-sunken p-4 text-[13px]">
          {[
            ['Subtotal', o.subtotal],
            ['Shipping', o.shipping],
            ['Tax', o.tax],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-ink-2">
              <dt>{label}</dt>
              <dd className="tnum">
                {label === 'Shipping' && value === 0
                  ? 'Free'
                  : formatCurrency(value, { cents: true })}
              </dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
            <dt>Total</dt>
            <dd className="tnum">{formatCurrency(o.amount, { cents: true })}</dd>
          </div>
        </dl>

        <div className="space-y-1.5 text-[13px] text-ink-2">
          <p>
            <span className="text-ink-3">Payment method </span>
            {o.method}
          </p>
          <p>
            <span className="text-ink-3">Ships to </span>
            {o.shipTo}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface-2 px-6 py-3.5">
        {canCancel && (
          <Button
            variant="secondary" tone="danger"
            icon={XCircle}
            loading={busy}
            onClick={() => updateStatus('Cancelled')}
          >
            Cancel order
          </Button>
        )}
        {canRefund && (
          <Button
            variant="secondary" tone="danger"
            icon={XCircle}
            loading={busy}
            onClick={() => updateStatus('Refunded')}
          >
            Refund
          </Button>
        )}
        {canProgress && (
          <Button
            variant="primary"
            icon={CheckCircle2}
            loading={busy}
            onClick={() => updateStatus('Completed')}
          >
            Mark completed
          </Button>
        )}
        {!canProgress && !canCancel && !canRefund && (
          <span className="flex items-center gap-1.5 text-[13px] text-ink-3">
            {o.status === 'Refunded' ? (
              <Package className="h-4 w-4" aria-hidden />
            ) : (
              <Truck className="h-4 w-4" aria-hidden />
            )}
            No further actions available
          </span>
        )}
      </div>
    </div>
  );
}
