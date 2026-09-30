import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { customersApi, ordersApi, productsApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { Button, IconButton } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Overlay';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/format';

const FORM_ID = 'order-form';
let lineId = 0;
const newLine = () => ({ key: ++lineId, productId: '', qty: '1' });

export function CreateOrderModal({ open, onClose }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { data, error, reload } = useAsync(
    () => (open ? Promise.all([customersApi.list(), productsApi.list()]) : Promise.resolve(null)),
    [open],
    { refreshOnChange: false },
  );
  const [customerId, setCustomerId] = useState('');
  const [lines, setLines] = useState([newLine()]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCustomerId('');
      setLines([newLine()]);
      setErrors({});
    }
  }, [open]);

  const [customers, products] = data ?? [[], []];
  const available = useMemo(() => products.filter((p) => p.stock > 0), [products]);
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (s, l) => s + (byId[l.productId]?.price ?? 0) * (Number(l.qty) || 0),
      0,
    );
    const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 9;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  }, [lines, byId]);

  const updateLine = (key, patch) => {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
    setErrors((e) => ({ ...e, [key]: undefined, customer: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!customerId) next.customer = 'Choose a customer';
    lines.forEach((l) => {
      const p = byId[l.productId];
      const qty = Number(l.qty);
      if (!p) next[l.key] = 'Choose a product';
      else if (!Number.isInteger(qty) || qty < 1) next[l.key] = 'Enter a quantity of 1 or more';
      else if (qty > p.stock) next[l.key] = `Only ${p.stock} in stock`;
    });
    setErrors(next);
    if (Object.keys(next).some((k) => next[k])) return;

    setSaving(true);
    try {
      const order = await ordersApi.create({
        customerId,
        items: lines.map((l) => ({ productId: l.productId, qty: Number(l.qty) })),
      });
      toast.success('Order created', {
        description: `${order.id} for ${order.customerName} · ${formatCurrency(order.amount, { cents: true })}`,
        action: { label: 'View order', onClick: () => navigate(`/orders?open=${order.id}`) },
      });
      onClose();
    } catch (err) {
      toast.error('Could not create order', { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const chosen = new Set(lines.map((l) => l.productId));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create order"
      description="Add products for a customer. The order starts as pending."
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form={FORM_ID} loading={saving} disabled={!data}>
            Create order
          </Button>
        </>
      }
    >
      {error ? (
        <div className="p-6 text-center">
          <p className="text-[13px] text-ink-2">We couldn’t load customers and products.</p>
          <Button size="sm" className="mt-3" onClick={() => reload()}>
            Try again
          </Button>
        </div>
      ) : !data ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <form id={FORM_ID} onSubmit={onSubmit} noValidate className="space-y-5 p-6">
          <Field label="Customer" required error={errors.customer}>
            <Select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setErrors((x) => ({ ...x, customer: undefined }));
              }}
              data-autofocus
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.company}
                </option>
              ))}
            </Select>
          </Field>

          <fieldset className="space-y-3">
            <legend className="mb-1.5 text-[13px] font-medium text-ink">Items</legend>
            {lines.map((l, i) => (
              <div key={l.key}>
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      aria-label={`Product ${i + 1}`}
                      aria-invalid={errors[l.key] ? true : undefined}
                      value={l.productId}
                      onChange={(e) => updateLine(l.key, { productId: e.target.value })}
                    >
                      <option value="">Select a product</option>
                      {available.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={chosen.has(p.id) && p.id !== l.productId}
                        >
                          {p.name} · {formatCurrency(p.price)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    aria-label={`Quantity ${i + 1}`}
                    aria-invalid={errors[l.key] ? true : undefined}
                    value={l.qty}
                    onChange={(e) => updateLine(l.key, { qty: e.target.value })}
                    className="w-20 text-center"
                  />
                  <IconButton
                    label="Remove item"
                    icon={Trash2}
                    disabled={lines.length === 1}
                    onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}
                  />
                </div>
                {errors[l.key] && <p className="mt-1 text-xs text-danger">{errors[l.key]}</p>}
              </div>
            ))}
            <Button size="sm" icon={Plus} onClick={() => setLines((ls) => [...ls, newLine()])}>
              Add another item
            </Button>
          </fieldset>

          <dl className="space-y-1.5 rounded-xl bg-sunken p-4 text-[13px]">
            {[
              ['Subtotal', totals.subtotal],
              ['Shipping', totals.shipping],
              ['Tax (8%)', totals.tax],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-ink-2">
                <dt>{label}</dt>
                <dd className="tnum">
                  {label === 'Shipping' && value === 0 && totals.subtotal > 0
                    ? 'Free'
                    : formatCurrency(value, { cents: true })}
                </dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
              <dt>Total</dt>
              <dd className="tnum">{formatCurrency(totals.total, { cents: true })}</dd>
            </div>
          </dl>
        </form>
      )}
    </Modal>
  );
}
