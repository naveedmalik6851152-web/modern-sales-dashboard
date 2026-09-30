import { mulberry32, hashString } from '@/utils/random';

const DAY = 86400000;

export const RANGE_META = {
  '7d': {
    id: '7d',
    label: 'Last 7 days',
    segment: '7 Days',
    short: '7D',
    compare: 'previous 7 days',
    points: 7,
    unit: 'day',
  },
  '30d': {
    id: '30d',
    label: 'Last 30 days',
    segment: '30 Days',
    short: '30D',
    compare: 'previous 30 days',
    points: 30,
    unit: 'day',
  },
  '3m': {
    id: '3m',
    label: 'Last 3 months',
    segment: '3 Months',
    short: '3M',
    compare: 'previous 3 months',
    points: 13,
    unit: 'week',
  },
  '6m': {
    id: '6m',
    label: 'Last 6 months',
    segment: '6 Months',
    short: '6M',
    compare: 'previous 6 months',
    points: 26,
    unit: 'week',
  },
  '1y': {
    id: '1y',
    label: 'Last 12 months',
    segment: '1 Year',
    short: '1Y',
    compare: 'previous 12 months',
    points: 12,
    unit: 'month',
  },
};
export const RANGE_OPTIONS = Object.values(RANGE_META);

/** [value, % change vs the previous period] */
const KPI_TABLE = {
  '7d': {
    revenue: [30120, 7.4],
    orders: [2014, 5.2],
    customers: [9870, 3.9],
    conversion: [8.11, 2.1],
    sessions: [41200, 4.8],
  },
  '30d': {
    revenue: [128430, 18.4],
    orders: [8549, 12.7],
    customers: [24892, 9.2],
    conversion: [8.42, 3.8],
    sessions: [176840, 8.6],
  },
  '3m': {
    revenue: [392860, 21.7],
    orders: [25871, 16.3],
    customers: [41206, 12.4],
    conversion: [8.63, 4.4],
    sessions: [528300, 11.9],
  },
  '6m': {
    revenue: [761540, 26.3],
    orders: [49220, 21.5],
    customers: [58940, 17.8],
    conversion: [8.29, 5.2],
    sessions: [1041000, 15.3],
  },
  '1y': {
    revenue: [1486200, 31.8],
    orders: [96304, 28.9],
    customers: [83517, 24.6],
    conversion: [7.96, 6.7],
    sessions: [2020500, 19.4],
  },
};

export const SOURCES = [
  { key: 'organic', name: 'Organic', share: 0.342, conv: 9.4, color: 'var(--c1)' },
  { key: 'direct', name: 'Direct', share: 0.238, conv: 10.1, color: 'var(--c2)' },
  { key: 'social', name: 'Social', share: 0.175, conv: 6.7, color: 'var(--c3)' },
  { key: 'paid', name: 'Paid', share: 0.136, conv: 7.4, color: 'var(--c4)' },
  { key: 'referral', name: 'Referral', share: 0.109, conv: 8.8, color: 'var(--c5)' },
];

export const COUNTRY_DATA = [
  ['United States', 'US', 'na', 31, 14.2],
  ['United Kingdom', 'GB', 'eu', 11, 9.8],
  ['Germany', 'DE', 'eu', 8.5, 11.4],
  ['India', 'IN', 'apac', 8, 27.5],
  ['Japan', 'JP', 'apac', 6.5, 6.1],
  ['Canada', 'CA', 'na', 6, 12.9],
  ['France', 'FR', 'eu', 5, 4.3],
  ['Australia', 'AU', 'apac', 4.5, 8.7],
  ['Brazil', 'BR', 'latam', 4, 19.6],
  ['United Arab Emirates', 'AE', 'mea', 3, 23.1],
  ['Singapore', 'SG', 'apac', 2.5, 10.2],
  ['Mexico', 'MX', 'latam', 2, 16.4],
  ['Pakistan', 'PK', 'apac', 2, 31.8],
  ['Nigeria', 'NG', 'mea', 1.5, 22.7],
  ['Spain', 'ES', 'eu', 1.5, 5.9],
  ['Netherlands', 'NL', 'eu', 1, 7.3],
  ['South Africa', 'ZA', 'mea', 1, 12.1],
  ['Egypt', 'EG', 'mea', 1, 18.4],
];

const regionShare = (id) =>
  COUNTRY_DATA.filter((c) => c[2] === id).reduce((s, c) => s + c[3], 0) / 100;

export const FILTER_OPTIONS = {
  channel: [
    { value: 'all', label: 'All channels' },
    ...SOURCES.map((s) => ({ value: s.key, label: s.name, weight: s.share })),
  ],
  region: [
    { value: 'all', label: 'All regions' },
    { value: 'na', label: 'North America', weight: regionShare('na') },
    { value: 'eu', label: 'Europe', weight: regionShare('eu') },
    { value: 'apac', label: 'Asia Pacific', weight: regionShare('apac') },
    { value: 'mea', label: 'Middle East & Africa', weight: regionShare('mea') },
    { value: 'latam', label: 'Latin America', weight: regionShare('latam') },
  ],
  device: [
    { value: 'all', label: 'All devices' },
    { value: 'desktop', label: 'Desktop', weight: 0.52, conv: 1.14 },
    { value: 'mobile', label: 'Mobile', weight: 0.4, conv: 0.85 },
    { value: 'tablet', label: 'Tablet', weight: 0.08, conv: 0.76 },
  ],
  segment: [
    { value: 'all', label: 'All customers' },
    { value: 'vip', label: 'VIP', weight: 0.41 },
    { value: 'regular', label: 'Regular', weight: 0.44 },
    { value: 'new', label: 'New', weight: 0.15 },
  ],
};

export const DEFAULT_FILTERS = {
  channel: 'all',
  region: 'all',
  device: 'all',
  segment: 'all',
  compare: false,
};

const optionOf = (group, value) => FILTER_OPTIONS[group].find((o) => o.value === value);

export function filterWeight(filters) {
  return ['channel', 'region', 'device', 'segment'].reduce(
    (w, g) => w * (optionOf(g, filters[g])?.weight ?? 1),
    1,
  );
}

export const activeFilterCount = (filters) =>
  ['channel', 'region', 'device', 'segment'].filter((g) => filters[g] !== 'all').length;

/* ------------------------------------------------------------------ */
/* Curve helpers                                                       */
/* ------------------------------------------------------------------ */
const DOW = [0.82, 1.0, 1.06, 1.08, 1.04, 1.02, 0.86];
const MONTH = [0.92, 0.9, 0.96, 0.98, 1, 0.97, 0.95, 0.98, 1.02, 1.06, 1.16, 1.22];

function seededCurve(key, n, { trend = 0.36, noise = 0.12 } = {}) {
  const rand = mulberry32(hashString(key));
  const phase = rand() * 6;
  return Array.from({ length: n }, (_, i) => {
    const t = n > 1 ? i / (n - 1) : 1;
    const wave = 1 + 0.07 * Math.sin(i * 0.9 + phase) + 0.04 * Math.sin(i * 0.31 + phase * 2);
    return (1 - trend / 2 + trend * t) * wave * (1 - noise / 2 + rand() * noise);
  });
}

const scaleTo = (values, total) => {
  const sum = values.reduce((a, b) => a + b, 0) || 1;
  return values.map((v) => (v * total) / sum);
};

function bucketDates(range) {
  const { points, unit } = RANGE_META[range];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: points }, (_, i) => {
    const back = points - 1 - i;
    if (unit === 'day') return new Date(today.getTime() - back * DAY);
    if (unit === 'week') return new Date(today.getTime() - back * 7 * DAY);
    return new Date(today.getFullYear(), today.getMonth() - back, 1);
  });
}

function labelFor(date, range) {
  const { unit, points } = RANGE_META[range];
  if (unit === 'month') return date.toLocaleDateString('en-US', { month: 'short' });
  if (unit === 'day' && points <= 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function seasonal(range, dates, key, total, opts) {
  const { unit } = RANGE_META[range];
  const base = seededCurve(`${range}:${key}`, dates.length, opts).map((v, i) => {
    if (unit === 'day') return v * DOW[dates[i].getDay()];
    if (unit === 'month') return v * MONTH[dates[i].getMonth()];
    return v;
  });
  return scaleTo(base, total);
}

export function sparkline(range, key, delta, n = 16) {
  const positive = delta >= 0;
  return seededCurve(`spark:${range}:${key}`, n, {
    trend: positive ? 0.55 : -0.4,
    noise: 0.22,
  }).map((v) => Math.round(v * 1000) / 1000);
}

/* ------------------------------------------------------------------ */
/* Aggregate builder                                                   */
/* ------------------------------------------------------------------ */
export function buildAnalytics(range = '30d', filters = DEFAULT_FILTERS) {
  const meta = RANGE_META[range] ?? RANGE_META['30d'];
  const r = meta.id;
  const k = KPI_TABLE[r];
  const w = filterWeight(filters);
  const dates = bucketDates(r);
  const labels = dates.map((d) => labelFor(d, r));

  // conversion adjusts with channel/device
  const channel = optionOf('channel', filters.channel);
  const device = optionOf('device', filters.device);
  const channelSource = SOURCES.find((s) => s.key === filters.channel);
  const conversion =
    k.conversion[0] * (channelSource ? channelSource.conv / 8.9 : 1) * (device?.conv ?? 1);

  const revenueTotal = k.revenue[0] * w;
  const ordersTotal = k.orders[0] * w;
  const customersTotal = Math.round(k.customers[0] * w);
  const sessionsTotal = Math.round(k.sessions[0] * w);

  const rev = seasonal(r, dates, 'rev', revenueTotal);
  const prev = seasonal(r, dates, 'rev-prev', revenueTotal / (1 + k.revenue[1] / 100));
  const expRand = mulberry32(hashString(`${r}:exp`));
  const revenue = dates.map((d, i) => {
    const expenses = rev[i] * (0.55 + expRand() * 0.1);
    return {
      label: labels[i],
      date: d.toISOString(),
      revenue: Math.round(rev[i]),
      expenses: Math.round(expenses),
      profit: Math.round(rev[i] - expenses),
      previous: Math.round(prev[i]),
    };
  });

  const ord = seasonal(r, dates, 'orders', ordersTotal);
  const sales = dates.map((d, i) => ({
    label: labels[i],
    orders: Math.round(ord[i]),
    units: Math.round(ord[i] * 1.62),
  }));

  const newTotal = customersTotal * 0.31;
  const newSeries = seasonal(r, dates, 'new', newTotal);
  const retSeries = seasonal(r, dates, 'ret', customersTotal * 0.22);
  const customers = dates.map((d, i) => ({
    label: labels[i],
    newCustomers: Math.round(newSeries[i]),
    returning: Math.round(retSeries[i]),
  }));

  // traffic
  const activeSources = channelSource ? [channelSource] : SOURCES;
  const perSource = activeSources.map((s) => {
    const sessionsForSource = k.sessions[0] * w * (channelSource ? 1 : s.share);
    return {
      s,
      total: sessionsForSource,
      series: seasonal(r, dates, `src:${s.key}`, sessionsForSource),
    };
  });
  const traffic = dates.map((d, i) => {
    const row = { label: labels[i] };
    SOURCES.forEach((s) => {
      const hit = perSource.find((p) => p.s.key === s.key);
      row[s.key] = hit ? Math.round(hit.series[i]) : 0;
    });
    return row;
  });
  const trafficSources = perSource.map(({ s, total }) => {
    const conv = s.conv * (device?.conv ?? 1);
    const sessions = Math.round(total);
    return {
      key: s.key,
      name: s.name,
      color: s.color,
      sessions,
      share: 0,
      conversion: conv,
      revenue: Math.round(
        (sessions * conv * 0.01 * revenueTotal) / (sessionsTotal * (conversion * 0.01) || 1),
      ),
      change: (hashString(`${r}:${s.key}`) % 180) / 10 - 3.2,
      spark: sparkline(r, `src-${s.key}`, 1, 12),
    };
  });
  const srcSum = trafficSources.reduce((sum, s) => sum + s.sessions, 0) || 1;
  trafficSources.forEach((s) => (s.share = (s.sessions / srcSum) * 100));

  // funnel
  const visitors = Math.round(ordersTotal / (conversion / 100));
  const funnel = [
    { key: 'visitors', label: 'Visitors', value: visitors },
    { key: 'views', label: 'Product views', value: Math.round(visitors * 0.612) },
    { key: 'cart', label: 'Added to cart', value: Math.round(visitors * 0.238) },
    { key: 'checkout', label: 'Started checkout', value: Math.round(visitors * 0.131) },
    { key: 'purchase', label: 'Purchased', value: Math.round(ordersTotal) },
  ];

  // geography
  const regionId = filters.region === 'all' ? null : filters.region;
  const countryRows = COUNTRY_DATA.filter((c) => !regionId || c[2] === regionId);
  const shareSum = countryRows.reduce((s, c) => s + c[3], 0);
  const geo = countryRows.map(([name, code, region, share, growth]) => ({
    name,
    code,
    region,
    share: (share / shareSum) * 100,
    revenue: Math.round((revenueTotal * share) / shareSum),
    orders: Math.round((ordersTotal * share) / shareSum),
    growth,
  }));

  // devices
  const deviceRows = [
    { key: 'desktop', name: 'Desktop', share: 52, conv: 1.14, color: 'var(--c1)' },
    { key: 'mobile', name: 'Mobile', share: 40, conv: 0.85, color: 'var(--c2)' },
    { key: 'tablet', name: 'Tablet', share: 8, conv: 0.76, color: 'var(--c3)' },
  ]
    .filter((d) => filters.device === 'all' || d.key === filters.device)
    .map((d) => ({
      ...d,
      sessions: Math.round((sessionsTotal * d.share) / (filters.device === 'all' ? 100 : d.share)),
      conversion: k.conversion[0] * d.conv,
    }));
  const devSum = deviceRows.reduce((s, d) => s + d.share, 0);
  deviceRows.forEach((d) => (d.share = (d.share / devSum) * 100));

  return {
    meta,
    filters,
    weight: w,
    channelLabel: channel?.label,
    kpis: [
      {
        key: 'revenue',
        label: 'Revenue',
        value: revenueTotal,
        delta: k.revenue[1],
        format: 'currency',
        icon: 'revenue',
        spark: sparkline(r, 'revenue', k.revenue[1]),
      },
      {
        key: 'orders',
        label: 'Orders',
        value: ordersTotal,
        delta: k.orders[1],
        format: 'number',
        icon: 'orders',
        spark: sparkline(r, 'orders', k.orders[1]),
      },
      {
        key: 'customers',
        label: 'Customers',
        value: customersTotal,
        delta: k.customers[1],
        format: 'number',
        icon: 'customers',
        spark: sparkline(r, 'customers', k.customers[1]),
      },
      {
        key: 'conversion',
        label: 'Conversion rate',
        value: conversion,
        delta: k.conversion[1],
        format: 'percent',
        icon: 'conversion',
        spark: sparkline(r, 'conversion', k.conversion[1]),
      },
      {
        key: 'sessions',
        label: 'Sessions',
        value: sessionsTotal,
        delta: k.sessions[1],
        format: 'number',
        icon: 'sessions',
        spark: sparkline(r, 'sessions', k.sessions[1]),
      },
    ],
    revenue,
    sales,
    customers,
    traffic,
    trafficSources,
    funnel,
    geo,
    devices: deviceRows,
    categories: buildCategories(revenueTotal),
  };
}

export const CATEGORY_SHARES = [
  ['Audio', 0.31],
  ['Wearables', 0.24],
  ['Home Office', 0.22],
  ['Smart Home', 0.14],
  ['Accessories', 0.09],
];

function buildCategories(revenueTotal) {
  return CATEGORY_SHARES.map(([name, share], i) => ({
    name,
    revenue: Math.round(revenueTotal * share),
    share: share * 100,
    color: `var(--c${[1, 2, 3, 5, 4][i]})`,
  }));
}

/* ------------------------------------------------------------------ */
/* Fixed 12-month series used by the dashboard                         */
/* ------------------------------------------------------------------ */
const SALES_12M = [
  58210, 61480, 66150, 64820, 71340, 78260, 83900, 90410, 97260, 102880, 108470, 128430,
];
const CUSTOMERS_12M = [
  15480, 16120, 16890, 17410, 18260, 19040, 19980, 20870, 21790, 22740, 23860, 24892,
];

function last12Months() {
  const now = new Date();
  return Array.from(
    { length: 12 },
    (_, i) => new Date(now.getFullYear(), now.getMonth() - (11 - i), 1),
  );
}

export const salesMonthly = () =>
  last12Months().map((d, i) => ({
    label: d.toLocaleDateString('en-US', { month: 'short' }),
    sales: SALES_12M[i],
  }));

export const customerGrowth = () =>
  last12Months().map((d, i) => ({
    label: d.toLocaleDateString('en-US', { month: 'short' }),
    customers: CUSTOMERS_12M[i],
  }));
