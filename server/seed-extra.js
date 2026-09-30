// User, notification and conversation seed data (mirrors src/data/user.js, notifications.js, messages.js).
const ago = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString();

export function seedUser() {
  return {
    id: 'USR-001',
    name: 'Naveed Ahmed',
    firstName: 'Naveed',
    lastName: 'Ahmed',
    email: 'naveed@meridian.io',
    role: 'Head of Growth',
    company: 'Meridian Commerce',
    phone: '+971 50 555 0142',
    location: 'Dubai, United Arab Emirates',
    timezone: 'GMT+4',
    bio: 'Leads growth and analytics for a portfolio of direct-to-consumer brands. Cares about clear numbers and fast decisions.',
    joinedAt: '2023-02-14',
    avatarColorIndex: 1,
    avatarImage: null,
    stats: [
      { label: 'Orders handled', value: '2,486' },
      { label: 'Reports generated', value: '148' },
      { label: 'Avg. response time', value: '14 min' },
      { label: 'Team members', value: '12' },
    ],
    weeklyActivity: [
      { day: 'Mon', actions: 38 },
      { day: 'Tue', actions: 52 },
      { day: 'Wed', actions: 47 },
      { day: 'Thu', actions: 63 },
      { day: 'Fri', actions: 41 },
      { day: 'Sat', actions: 12 },
      { day: 'Sun', actions: 8 },
    ],
    recentActivity: [
      { id: 1, text: 'Exported the Q3 revenue report', at: ago(22) },
      { id: 2, text: 'Refunded order ORD-4551 for Ethan Brown', at: ago(95) },
      { id: 3, text: 'Added Tariq Hussain as a customer', at: ago(60 * 5) },
      { id: 4, text: 'Updated stock for Prism Light Strip', at: ago(60 * 26) },
      { id: 5, text: 'Connected the Stripe integration', at: ago(60 * 24 * 3) },
    ],
  };
}

export function seedAccount() {
  return {
    plan: {
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
    },
    paymentMethod: { brand: 'Visa', last4: '4242', expires: '08/28', holder: 'Naveed Ahmed' },
    invoices: [
      { id: 'INV-2091', date: '2026-09-14', amount: 149, status: 'Paid' },
      { id: 'INV-2044', date: '2026-08-14', amount: 149, status: 'Paid' },
      { id: 'INV-1998', date: '2026-07-14', amount: 149, status: 'Paid' },
    ],
    integrations: [
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
    ],
    sessions: [
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
    ],
    notificationPrefs: [
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
    ],
  };
}

export function seedNotifications() {
  const RAW = [
    ['n1', 'order', 'New order received', 'Order ORD-4582 from Zoe Adams · $312.84', 6, false],
    [
      'n2',
      'payment',
      'Payment received',
      '$2,940.00 from Brightwave for invoice INV-2091',
      38,
      false,
    ],
    [
      'n3',
      'security',
      'New sign-in from Chrome on macOS',
      'Dubai, UAE · If this wasn’t you, review your active sessions.',
      62,
      false,
    ],
    [
      'n4',
      'customer',
      'New VIP customer',
      'Mohammed Al-Farsi crossed $5,000 in lifetime spend',
      118,
      false,
    ],
    ['n5', 'system', 'Inventory running low', 'Prism Light Strip has 12 units left', 190, false],
    ['n6', 'order', 'Refund requested', 'Ethan Brown asked for a refund on ORD-4551', 260, false],
    ['n7', 'payment', 'Payout scheduled', '$18,420.00 will arrive on Friday', 60 * 6, true],
    [
      'n8',
      'system',
      'Report ready',
      'Your August revenue report is ready to download',
      60 * 9,
      true,
    ],
  ];
  return RAW.map(([id, type, title, body, minutesAgo, read]) => ({
    id,
    type,
    title,
    body,
    at: ago(minutesAgo),
    read,
  }));
}

export function seedConversations() {
  const RAW = [
    {
      id: 'c1',
      name: 'Priya Sharma',
      role: 'Lotus Analytics',
      status: 'online',
      unread: 2,
      messages: [
        ['m1', 'them', 'Hi Naveed, thanks for the quick turnaround on the last shipment.', 190],
        ['m2', 'me', 'Happy to help, Priya. Did everything arrive in good shape?', 184],
        [
          'm3',
          'them',
          'All good. Could you reissue the enterprise invoice with our new billing address?',
          41,
        ],
        ['m4', 'them', 'We need it before Friday for our finance close.', 40],
      ],
    },
    {
      id: 'c2',
      name: 'Marcus Bell',
      role: 'Foundry 42',
      status: 'online',
      unread: 1,
      messages: [
        ['m1', 'me', 'Marcus, the Slate Standing Desk is back in stock next week.', 320],
        ['m2', 'them', 'Great news. Can you hold 6 units for us?', 75],
      ],
    },
    {
      id: 'c8',
      name: 'Ayesha Raza',
      role: 'Indus Traders',
      status: 'online',
      unread: 1,
      messages: [
        [
          'm1',
          'them',
          'Assalam-o-alaikum Naveed, our Lahore shipment cleared customs this morning.',
          52,
        ],
        [
          'm2',
          'me',
          'Wa alaikum assalam Ayesha, great news — I’ll update the order status now.',
          49,
        ],
        [
          'm3',
          'them',
          'Perfect. Also, can we get a quote for 100 units of the Nimbus Keyboard?',
          12,
        ],
      ],
    },
    {
      id: 'c9',
      name: 'Hamza Sheikh',
      role: 'Kohistan Retail',
      status: 'away',
      unread: 0,
      messages: [
        [
          'm1',
          'them',
          'The Atlas Ergonomic Chair order for our Rawalpindi office looks great.',
          60 * 40,
        ],
        ['m2', 'me', 'Glad to hear it! Let me know if you need more for the new branch.', 60 * 39],
      ],
    },
  ];
  return RAW.map((c) => ({
    ...c,
    messages: c.messages.map(([id, from, text, minutesAgo]) => ({
      id,
      from,
      text,
      at: ago(minutesAgo),
    })),
  }));
}
