import { mulberry32, hashString } from '@/utils/random';
import { products } from './products';
import { SOURCES } from './analytics';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '@/utils/format';

const DAY = 86400000;
const DOW = [0.82, 1.0, 1.06, 1.08, 1.04, 1.02, 0.86];

export const REPORT_TYPES = [
  { id: 'sales', label: 'Sales report', description: 'Orders, units and net sales over time.' },
  { id: 'revenue', label: 'Revenue report', description: 'Revenue, expenses and profit margin.' },
  {
    id: 'customers',
    label: 'Customer report',
    description: 'New, returning and churned customers.',
  },
  {
    id: 'products',
    label: 'Product report',
    description: 'Units sold, revenue and stock by product.',
  },
  {
    id: 'traffic',
    label: 'Traffic report',
    description: 'Sessions, bounce rate and conversion by source.',
  },
];

const startOfDay = (iso) => {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d;
};

function buckets(fromISO, toISO) {
  const to = startOfDay(toISO);
  let from = startOfDay(fromISO);
  if (from > to) from = to;
  const maxDays = 380;
  const days = Math.min(maxDays, Math.round((to - from) / DAY) + 1);
  from = new Date(to.getTime() - (days - 1) * DAY);
  const step = days <= 45 ? 1 : 7;
  const list = [];
  for (let t = from.getTime(); t <= to.getTime(); t += step * DAY) {
    const start = new Date(t);
    const span = Math.min(step, Math.round((to.getTime() - t) / DAY) + 1);
    list.push({
      start,
      span,
      label: formatDate(start, {
        month: 'short',
        day: 'numeric',
        year: days > 300 ? '2-digit' : undefined,
      }),
    });
  }
  return { list, days };
}

const factor = (date, salt) => {
  const rand = mulberry32(hashString(`${salt}:${date.toISOString().slice(0, 10)}`));
  return DOW[date.getDay()] * (0.9 + rand() * 0.2);
};

const sum = (rows, key) => rows.reduce((s, r) => s + r[key], 0);

export function buildReport(type, fromISO, toISO) {
  const { list, days } = buckets(fromISO, toISO);
  const meta = REPORT_TYPES.find((t) => t.id === type) ?? REPORT_TYPES[0];
  const period = `${formatDate(list[0].start)} – ${formatDate(new Date(list[list.length - 1].start.getTime() + (list[list.length - 1].span - 1) * DAY))}`;
  let columns;
  let rows;
  let summary;

  if (type === 'sales') {
    rows = list.map((b) => {
      const f = factor(b.start, 'sales') * b.span;
      const orders = Math.round(285 * f);
      const gross = Math.round(4540 * f);
      const refunds = Math.round(gross * (0.028 + (f % 0.02)));
      return {
        period: b.label,
        orders,
        units: Math.round(orders * 1.62),
        gross,
        refunds,
        net: gross - refunds,
      };
    });
    columns = [
      { key: 'period', header: 'Period', width: 1.4 },
      { key: 'orders', header: 'Orders', type: 'number' },
      { key: 'units', header: 'Units', type: 'number' },
      { key: 'gross', header: 'Gross sales', type: 'currency' },
      { key: 'refunds', header: 'Refunds', type: 'currency' },
      { key: 'net', header: 'Net sales', type: 'currency' },
    ];
    summary = [
      { label: 'Net sales', value: formatCurrency(sum(rows, 'net')) },
      { label: 'Orders', value: formatNumber(sum(rows, 'orders')) },
      { label: 'Units sold', value: formatNumber(sum(rows, 'units')) },
      { label: 'Refunds', value: formatCurrency(sum(rows, 'refunds')) },
    ];
  } else if (type === 'revenue') {
    rows = list.map((b) => {
      const f = factor(b.start, 'rev') * b.span;
      const revenue = Math.round(4281 * f);
      const expenses = Math.round(revenue * (0.56 + (f % 0.08)));
      return {
        period: b.label,
        revenue,
        expenses,
        profit: revenue - expenses,
        margin: ((revenue - expenses) / revenue) * 100,
      };
    });
    columns = [
      { key: 'period', header: 'Period', width: 1.4 },
      { key: 'revenue', header: 'Revenue', type: 'currency' },
      { key: 'expenses', header: 'Expenses', type: 'currency' },
      { key: 'profit', header: 'Profit', type: 'currency' },
      { key: 'margin', header: 'Margin', type: 'percent' },
    ];
    const rev = sum(rows, 'revenue');
    const profit = sum(rows, 'profit');
    summary = [
      { label: 'Revenue', value: formatCurrency(rev) },
      { label: 'Expenses', value: formatCurrency(sum(rows, 'expenses')) },
      { label: 'Profit', value: formatCurrency(profit) },
      { label: 'Margin', value: formatPercent((profit / rev) * 100) },
    ];
  } else if (type === 'customers') {
    rows = list.map((b) => {
      const f = factor(b.start, 'cust') * b.span;
      const fresh = Math.round(88 * f);
      const returning = Math.round(61 * f);
      const churned = Math.round(17 * f);
      return { period: b.label, fresh, returning, churned, net: fresh - churned };
    });
    columns = [
      { key: 'period', header: 'Period', width: 1.4 },
      { key: 'fresh', header: 'New customers', type: 'number' },
      { key: 'returning', header: 'Returning', type: 'number' },
      { key: 'churned', header: 'Churned', type: 'number' },
      { key: 'net', header: 'Net change', type: 'number' },
    ];
    summary = [
      { label: 'New customers', value: formatNumber(sum(rows, 'fresh')) },
      { label: 'Returning', value: formatNumber(sum(rows, 'returning')) },
      { label: 'Churned', value: formatNumber(sum(rows, 'churned')) },
      { label: 'Net change', value: formatNumber(sum(rows, 'net')) },
    ];
  } else if (type === 'products') {
    rows = products
      .map((p) => {
        const rand = mulberry32(hashString(`prod:${p.id}:${days}`));
        const units = Math.round((p.sales * days * (0.92 + rand() * 0.16)) / 30);
        return {
          name: p.name,
          category: p.category,
          units,
          revenue: units * p.price,
          rating: p.rating,
          stock: p.stock,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
    columns = [
      { key: 'name', header: 'Product', width: 2 },
      { key: 'category', header: 'Category', width: 1.2 },
      { key: 'units', header: 'Units sold', type: 'number' },
      { key: 'revenue', header: 'Revenue', type: 'currency' },
      { key: 'rating', header: 'Rating', type: 'rating' },
      { key: 'stock', header: 'In stock', type: 'number' },
    ];
    summary = [
      { label: 'Products', value: formatNumber(rows.length) },
      { label: 'Units sold', value: formatNumber(sum(rows, 'units')) },
      { label: 'Revenue', value: formatCurrency(sum(rows, 'revenue')) },
      { label: 'Best seller', value: rows[0].name },
    ];
  } else {
    rows = SOURCES.map((s) => {
      const rand = mulberry32(hashString(`traffic:${s.key}:${days}`));
      const sessions = Math.round(5895 * days * s.share * (0.95 + rand() * 0.1));
      return {
        name: s.name,
        sessions,
        users: Math.round(sessions * 0.71),
        bounce: 34 + rand() * 18,
        conversion: s.conv,
        revenue: Math.round(sessions * (s.conv / 100) * 15.02),
      };
    }).sort((a, b) => b.sessions - a.sessions);
    columns = [
      { key: 'name', header: 'Source', width: 1.4 },
      { key: 'sessions', header: 'Sessions', type: 'number' },
      { key: 'users', header: 'Users', type: 'number' },
      { key: 'bounce', header: 'Bounce rate', type: 'percent' },
      { key: 'conversion', header: 'Conversion', type: 'percent' },
      { key: 'revenue', header: 'Revenue', type: 'currency' },
    ];
    summary = [
      { label: 'Sessions', value: formatNumber(sum(rows, 'sessions')) },
      { label: 'Users', value: formatNumber(sum(rows, 'users')) },
      { label: 'Top source', value: rows[0].name },
      { label: 'Revenue', value: formatCurrency(sum(rows, 'revenue')) },
    ];
  }

  return {
    type,
    title: meta.label,
    period,
    days,
    columns,
    rows,
    summary,
    generatedAt: new Date().toISOString(),
  };
}
