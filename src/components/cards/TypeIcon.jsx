import {
  CreditCard,
  Info,
  LifeBuoy,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
} from 'lucide-react';

const TYPES = {
  order: { icon: ShoppingBag, n: 1 },
  payment: { icon: CreditCard, n: 3 },
  customer: { icon: UserPlus, n: 2 },
  security: { icon: ShieldCheck, n: 5 },
  system: { icon: Info, n: 4 },
  inventory: { icon: Package, n: 4 },
  support: { icon: LifeBuoy, n: 5 },
};

/** Tinted icon tile for notification and activity types. */
export function TypeIcon({ type, size = 'md' }) {
  const meta = TYPES[type] || TYPES.system;
  const Icon = meta.icon;
  return (
    <span
      aria-hidden
      className={
        size === 'sm'
          ? 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'
          : 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]'
      }
      style={{
        background: `color-mix(in srgb, var(--c${meta.n}) 15%, rgb(var(--surface)))`,
        color: `color-mix(in srgb, var(--c${meta.n}) 65%, rgb(var(--ink)))`,
      }}
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
    </span>
  );
}
