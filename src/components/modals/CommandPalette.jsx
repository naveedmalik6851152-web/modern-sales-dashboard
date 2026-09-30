import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Package, Search, ShoppingBag, Users } from 'lucide-react';
import { customersApi, ordersApi, productsApi } from '@/services/api';
import { NAV_GROUPS } from '@/components/sidebar/nav';
import { Modal } from '@/components/ui/Overlay';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

const PAGES = NAV_GROUPS.flatMap((g) => g.items).map((i) => ({
  id: `page-${i.to}`,
  group: 'Pages',
  label: i.label,
  hint: 'Go to page',
  icon: i.icon,
  to: i.to,
}));

const includes = (text, q) => text.toLowerCase().includes(q);

/** Global search and navigation (⌘K / Ctrl+K). */
export function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [data, setData] = useState({ customers: [], orders: [], products: [] });
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setQuery('');
    setActive(0);
    Promise.all([customersApi.list(), ordersApi.list(), productsApi.list()])
      .then(
        ([customers, orders, products]) => !cancelled && setData({ customers, orders, products }),
      )
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGES;
    const pages = PAGES.filter((p) => includes(p.label, q));
    const customers = data.customers
      .filter((c) => includes(`${c.name} ${c.email} ${c.company}`, q))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        group: 'Customers',
        label: c.name,
        hint: c.company,
        icon: Users,
        to: `/customers/${c.id}`,
      }));
    const orders = data.orders
      .filter((o) => includes(`${o.id} ${o.customerName}`, q))
      .slice(0, 4)
      .map((o) => ({
        id: o.id,
        group: 'Orders',
        label: `${o.id} · ${o.customerName}`,
        hint: formatCurrency(o.amount, { cents: true }),
        icon: ShoppingBag,
        to: `/orders?open=${o.id}`,
      }));
    const products = data.products
      .filter((p) => includes(`${p.name} ${p.sku}`, q))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        group: 'Products',
        label: p.name,
        hint: p.category,
        icon: Package,
        to: `/products?q=${encodeURIComponent(p.name)}`,
      }));
    return [...pages, ...customers, ...orders, ...products];
  }, [query, data]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (item) => {
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  let lastGroup = null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      bare
      size="lg"
      className="sm:mb-[12vh] sm:mt-[12vh] sm:self-start"
    >
      <div role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-label="Search">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-[18px] w-[18px] shrink-0 text-ink-3" aria-hidden />
          <input
            data-autofocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search customers, orders, products, pages"
            aria-label="Search"
            aria-controls="palette-list"
            className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="hidden rounded-md border border-line bg-surface-2 px-1.5 text-xs text-ink-3 sm:inline">
            Esc
          </kbd>
        </div>
        <div
          ref={listRef}
          id="palette-list"
          role="listbox"
          className="scroll-thin max-h-[52vh] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-[13px] text-ink-2">
              No results for “{query}”. Try a name, order number or product.
            </p>
          ) : (
            results.map((item, i) => {
              const header = item.group !== lastGroup;
              lastGroup = item.group;
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  {header && (
                    <p className="px-3 pb-1 pt-3 text-xs font-medium text-ink-3">{item.group}</p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    data-index={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      i === active ? 'bg-accent-soft text-accent-strong' : 'text-ink',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        'truncate text-xs',
                        i === active ? 'text-accent-strong/80' : 'text-ink-3',
                      )}
                    >
                      {item.hint}
                    </span>
                    {i === active && (
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
