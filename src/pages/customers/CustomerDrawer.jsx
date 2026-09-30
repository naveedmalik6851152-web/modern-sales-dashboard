import { Link } from 'react-router-dom';
import { Mail, Pencil, Phone, Trash2, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button, IconButton } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';
import { formatCurrency, formatDate, formatRelative } from '@/utils/format';

export function CustomerDrawer({ customer: c, onClose, onEdit, onDelete }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-line p-6">
        <div className="flex items-center gap-3">
          <Avatar name={c.name} size="lg" />
          <div>
            <h2 className="text-base font-semibold text-ink">{c.name}</h2>
            <p className="text-[13px] text-ink-2">{c.company}</p>
          </div>
        </div>
        <IconButton label="Close" icon={X} onClick={onClose} />
      </div>

      <div className="scroll-thin flex-1 space-y-6 overflow-y-auto p-6">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={c.status} />
          <StatusBadge status={c.tier} />
        </div>

        <dl className="grid grid-cols-2 gap-4 text-[13px]">
          <div>
            <dt className="text-ink-3">Total spent</dt>
            <dd className="tnum mt-0.5 text-lg font-semibold text-ink">
              {formatCurrency(c.totalSpent)}
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Orders</dt>
            <dd className="tnum mt-0.5 text-lg font-semibold text-ink">{c.totalOrders}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Customer since</dt>
            <dd className="mt-0.5 text-ink">{formatDate(c.joinedAt)}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Last order</dt>
            <dd className="mt-0.5 text-ink">
              {c.lastOrderAt ? formatRelative(c.lastOrderAt) : '—'}
            </dd>
          </div>
        </dl>

        <div className="space-y-2 border-t border-line pt-4 text-[13px]">
          <a
            href={`mailto:${c.email}`}
            className="flex items-center gap-2.5 text-ink-2 hover:text-ink"
          >
            <Mail className="h-4 w-4 text-ink-3" aria-hidden />
            {c.email}
          </a>
          <a
            href={`tel:${c.phone}`}
            className="flex items-center gap-2.5 text-ink-2 hover:text-ink"
          >
            <Phone className="h-4 w-4 text-ink-3" aria-hidden />
            {c.phone}
          </a>
          <p className="flex items-center gap-2.5 text-ink-2">
            <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
            {c.city}, {c.country}
          </p>
        </div>

        <div className="border-t border-line pt-4">
          <h3 className="mb-2 text-[13px] font-semibold text-ink">Recent orders</h3>
          {c.orders?.length ? (
            <ul className="divide-y divide-line rounded-xl border border-line">
              {c.orders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <Link
                    to={`/orders?open=${o.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-sunken"
                  >
                    <span>
                      <span className="block text-[13px] font-medium text-ink">{o.id}</span>
                      <span className="text-xs text-ink-3">{formatDate(o.date)}</span>
                    </span>
                    <span className="tnum text-[13px] font-medium text-ink">
                      {formatCurrency(o.amount, { cents: true })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact title="No orders yet" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-2 px-6 py-3.5">
        <Button variant="secondary" tone="danger" icon={Trash2} onClick={onDelete}>
          Delete
        </Button>
        <Button variant="primary" icon={Pencil} onClick={onEdit}>
          Edit customer
        </Button>
      </div>
    </div>
  );
}
