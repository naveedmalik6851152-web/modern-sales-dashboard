const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const usdCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const num = new Intl.NumberFormat('en-US');
const compactNum = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatCurrency = (v, { cents = false } = {}) => (cents ? usdCents : usd).format(v);
export const formatCompactCurrency = (v) => compactUsd.format(v);
export const formatNumber = (v) => num.format(v);
export const formatCompact = (v) => compactNum.format(v);
export const formatPercent = (v, digits = 1) => `${v.toFixed(digits)}%`;
export const formatDelta = (v, digits = 1) =>
  `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(digits)}%`;

const toDate = (d) => (d instanceof Date ? d : new Date(d));

export const formatDate = (d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-US', opts).format(toDate(d));

export const formatDateTime = (d) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(toDate(d));

export const formatTime = (d) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(toDate(d));

/** "3 min ago", "2 h ago", "Yesterday", or a short date. */
export function formatRelative(d, now = Date.now()) {
  const diff = Math.max(0, now - toDate(d).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Yesterday';
  if (day < 7) return `${day} days ago`;
  return formatDate(d, { month: 'short', day: 'numeric' });
}

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

export const greeting = (date = new Date()) => {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Format a report cell by its declared column type. */
export function formatByType(type, value) {
  switch (type) {
    case 'number':
      return formatNumber(value);
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    case 'rating':
      return Number(value).toFixed(1);
    default:
      return value;
  }
}
