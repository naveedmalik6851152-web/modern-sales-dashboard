export const plan = {
  name: 'Growth',
  price: 149,
  interval: 'month',
  renews: '2026-10-14',
  seats: { used: 12, total: 20 },
  usage: [
    { label: 'Tracked orders', used: 86400, total: 120000 },
    { label: 'Report exports', used: 148, total: 500 },
    { label: 'API requests', used: 1240000, total: 2000000 },
  ],
};

export const paymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expires: '08/28',
  holder: 'Naveed Ahmed',
};

export const invoices = [
  { id: 'INV-2091', date: '2026-09-14', amount: 149, status: 'Paid' },
  { id: 'INV-2044', date: '2026-08-14', amount: 149, status: 'Paid' },
  { id: 'INV-1998', date: '2026-07-14', amount: 149, status: 'Paid' },
  { id: 'INV-1951', date: '2026-06-14', amount: 149, status: 'Paid' },
  { id: 'INV-1902', date: '2026-05-14', amount: 129, status: 'Paid' },
];

export const integrations = [
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    description: 'Sync payments, refunds and payouts automatically.',
    connected: true,
    mark: 'S',
    tone: 1,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'Commerce',
    description: 'Import orders, products and customers in real time.',
    connected: true,
    mark: 'Sh',
    tone: 3,
  },
  {
    id: 'ga',
    name: 'Google Analytics',
    category: 'Analytics',
    description: 'Blend traffic and conversion data into your dashboards.',
    connected: true,
    mark: 'GA',
    tone: 4,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Get alerts for large orders and low stock in a channel.',
    connected: false,
    mark: 'Sl',
    tone: 5,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Automation',
    description: 'Connect Sales Dashboard IG to 5,000+ apps without code.',
    connected: false,
    mark: 'Z',
    tone: 4,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Marketing',
    description: 'Send customer segments straight to your campaigns.',
    connected: false,
    mark: 'M',
    tone: 2,
  },
];

export const sessions = [
  {
    id: 's1',
    device: 'MacBook Pro · Chrome',
    location: 'Dubai, UAE',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 's2',
    device: 'iPhone 15 · Sales Dashboard IG app',
    location: 'Dubai, UAE',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: 's3',
    device: 'Windows PC · Edge',
    location: 'Abu Dhabi, UAE',
    lastActive: '3 days ago',
    current: false,
  },
];

export const notificationPrefs = [
  {
    id: 'orders',
    title: 'New orders',
    description: 'When a customer places or cancels an order.',
    email: true,
    push: true,
  },
  {
    id: 'payments',
    title: 'Payments and payouts',
    description: 'Successful payments, refunds and payout schedules.',
    email: true,
    push: false,
  },
  {
    id: 'customers',
    title: 'Customer activity',
    description: 'New sign-ups, VIP upgrades and reactivations.',
    email: false,
    push: true,
  },
  {
    id: 'inventory',
    title: 'Low stock alerts',
    description: 'When a product falls below its stock threshold.',
    email: true,
    push: true,
  },
  {
    id: 'reports',
    title: 'Weekly summary',
    description: 'A Monday recap of revenue, orders and traffic.',
    email: true,
    push: false,
  },
  {
    id: 'security',
    title: 'Security alerts',
    description: 'New sign-ins and password changes. Always on.',
    email: true,
    push: true,
    locked: true,
  },
];
