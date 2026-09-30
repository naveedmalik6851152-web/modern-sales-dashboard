// AUTO-DERIVED seed data for the standalone backend (server/).
// Mirrors src/data/*.js so mock mode and real-backend mode show the same people/products.
// Regenerate by re-running the extraction step in the project if the frontend data changes.
import { mulberry32, weighted, int, pick } from './lib.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const CUSTOMERS_RAW = [
  ['Ava Thompson', 'Brightwave', 'United States', 'Austin'],
  ['Liam Carter', 'Northfield Labs', 'United States', 'Seattle'],
  ['Sofia Rossi', 'Studio Lume', 'Italy', 'Milan'],
  ['Noah Kim', 'Kite & Co', 'South Korea', 'Seoul'],
  ['Amara Okafor', 'Tidal Works', 'Nigeria', 'Lagos'],
  ['Mateo García', 'Olivar Foods', 'Spain', 'Valencia'],
  ['Yuki Tanaka', 'Hinode Design', 'Japan', 'Osaka'],
  ['Hannah Müller', 'Rheinwerk', 'Germany', 'Hamburg'],
  ['Omar Farouk', 'Nile & Stone', 'Egypt', 'Cairo'],
  ['Priya Sharma', 'Lotus Analytics', 'India', 'Bengaluru'],
  ['Lucas Martin', 'Atelier Neuf', 'France', 'Lyon'],
  ['Emma Wilson', 'Harbour Goods', 'United Kingdom', 'Bristol'],
  ['Bilal Ahmed', 'Sindhu Supply', 'Pakistan', 'Karachi'],
  ['Ethan Brown', 'Ridgeline', 'Canada', 'Toronto'],
  ['Isabella Silva', 'Costa Verde', 'Brazil', 'São Paulo'],
  ['Mohammed Al-Farsi', 'Gulf Trade Co', 'United Arab Emirates', 'Dubai'],
  ['Ayesha Raza', 'Indus Traders', 'Pakistan', 'Lahore'],
  ['Olivia Nguyen', 'Saigon Studio', 'Vietnam', 'Ho Chi Minh City'],
  ['Daniel Lee', 'Pinecone', 'Australia', 'Melbourne'],
  ['Chloé Dubois', 'Maison Clair', 'France', 'Paris'],
  ['Arjun Mehta', 'Orbit Retail', 'India', 'Mumbai'],
  ['Grace Adeyemi', 'Kora Living', 'Nigeria', 'Abuja'],
  ['Hamza Sheikh', 'Kohistan Retail', 'Pakistan', 'Rawalpindi'],
  ['Jonas Lindqvist', 'Fjord & Co', 'Sweden', 'Stockholm'],
  ['Mei Lin', 'Jade Labs', 'Singapore', 'Singapore'],
  ['Carlos Ramírez', 'Sol Naciente', 'Mexico', 'Mexico City'],
  ['Fatima Zahra', 'Atlas Home', 'Morocco', 'Casablanca'],
  ['Ryan O’Connor', 'Emerald Supply', 'Ireland', 'Dublin'],
  ['Anika Kowalska', 'Vistula Digital', 'Poland', 'Warsaw'],
  ['Tariq Hussain', 'Crescent Mart', 'Pakistan', 'Islamabad'],
  ['Ben Harris', 'Copperline', 'United States', 'Denver'],
  ['Layla Haddad', 'Cedar Trading', 'Lebanon', 'Beirut'],
  ['Victor Costa', 'Tejo Studio', 'Portugal', 'Lisbon'],
  ['Naomi Clarke', 'Wren & Willow', 'United Kingdom', 'London'],
  ['Kenji Sato', 'Sakura Tech', 'Japan', 'Tokyo'],
  ['Elena Popescu', 'Danube Home', 'Romania', 'Bucharest'],
  ['Marcus Bell', 'Foundry 42', 'United States', 'Chicago'],
  ['Aisha Bello', 'Baobab Goods', 'Ghana', 'Accra'],
  ['Sara Iqbal', 'Faisalabad Textiles', 'Pakistan', 'Faisalabad'],
  ['Henrik Larsen', 'Nordhavn', 'Denmark', 'Copenhagen'],
  ['Tomás Herrera', 'Andes Outfitters', 'Chile', 'Santiago'],
  ['Zoe Adams', 'Fieldnote', 'United States', 'Portland'],
  ['Rahul Verma', 'Spice Route', 'India', 'Delhi'],
  ['Usman Tariq', 'Kohat Traders', 'Pakistan', 'Peshawar'],
];

const DIAL = {
  'United States': '+1',
  Canada: '+1',
  Italy: '+39',
  'South Korea': '+82',
  Nigeria: '+234',
  Spain: '+34',
  Japan: '+81',
  Germany: '+49',
  Egypt: '+20',
  India: '+91',
  France: '+33',
  'United Kingdom': '+44',
  Pakistan: '+92',
  Brazil: '+55',
  'United Arab Emirates': '+971',
  Vietnam: '+84',
  Australia: '+61',
  Sweden: '+46',
  Singapore: '+65',
  Mexico: '+52',
  Morocco: '+212',
  Ireland: '+353',
  Poland: '+48',
  Lebanon: '+961',
  Portugal: '+351',
  Romania: '+40',
  Ghana: '+233',
  Denmark: '+45',
  Chile: '+56',
};

const PRODUCTS_RAW = [
  ['Aurora Studio Headphones', 'Audio', 249, 64, 1284, 4.8],
  ['Pebble Wireless Earbuds', 'Audio', 129, 212, 2310, 4.6],
  ['Cobalt Bluetooth Speaker', 'Audio', 89, 18, 1745, 4.5],
  ['Halo Soundbar', 'Audio', 329, 41, 486, 4.7],
  ['Ember Turntable', 'Audio', 379, 0, 212, 4.4],
  ['Halo Smart Watch', 'Wearables', 299, 96, 1520, 4.7],
  ['Pulse Fitness Band', 'Wearables', 79, 340, 2890, 4.4],
  ['Orbit Smart Ring', 'Wearables', 199, 27, 640, 4.3],
  ['Trail GPS Watch', 'Wearables', 349, 52, 388, 4.8],
  ['Nimbus Mechanical Keyboard', 'Home Office', 159, 133, 1655, 4.9],
  ['Atlas Ergonomic Chair', 'Home Office', 529, 22, 412, 4.7],
  ['Lumen Desk Lamp', 'Home Office', 69, 181, 1120, 4.5],
  ['Slate Standing Desk', 'Home Office', 649, 9, 236, 4.6],
  ['Vertex 4K Monitor', 'Home Office', 479, 37, 520, 4.6],
  ['Drift Wireless Mouse', 'Home Office', 59, 275, 2105, 4.5],
  ['Arc Laptop Sleeve', 'Accessories', 49, 420, 1380, 4.3],
  ['Tether USB-C Hub', 'Accessories', 79, 0, 1210, 4.2],
  ['Volt 100W Charger', 'Accessories', 59, 164, 1760, 4.6],
  ['Grain Leather Cable Kit', 'Accessories', 39, 15, 860, 4.4],
  ['Fold Phone Stand', 'Accessories', 29, 305, 990, 4.1],
  ['Beacon Smart Speaker', 'Smart Home', 99, 148, 1435, 4.4],
  ['Hearth Smart Thermostat', 'Smart Home', 179, 63, 570, 4.6],
  ['Prism Light Strip', 'Smart Home', 45, 12, 1920, 4.3],
  ['Sentry Video Doorbell', 'Smart Home', 149, 74, 704, 4.5],
  ['Mist Air Purifier', 'Smart Home', 219, 31, 362, 4.7],
];

const NOW = Date.now();
const DAY = 86400000;

export function seedCustomers() {
  return CUSTOMERS_RAW.map(([name, company, country, city], i) => {
    const rand = mulberry32(9100 + i * 17);
    const first = slugify(name.split(' ')[0]);
    const last = slugify(name.split(' ').slice(1).join(' '));
    const tier = weighted(rand, [
      ['VIP', 20],
      ['Regular', 58],
      ['New', 22],
    ]);
    const joinedDaysAgo = tier === 'New' ? int(rand, 4, 45) : int(rand, 60, 900);
    return {
      id: `CUS-${1001 + i}`,
      name,
      email: `${first}.${last}@${slugify(company)}.com`,
      phone: `${DIAL[country] || '+1'} ${int(rand, 200, 999)} ${int(rand, 100, 999)} ${int(rand, 1000, 9999)}`,
      company,
      country,
      city,
      status: weighted(rand, [
        ['Active', 76],
        ['Inactive', 24],
      ]),
      tier,
      joinedAt: new Date(NOW - joinedDaysAgo * DAY).toISOString(),
      notes: '',
    };
  });
}

export const stockStatus = (stock) =>
  stock === 0 ? 'Out of stock' : stock <= 20 ? 'Low stock' : 'In stock';

export function seedProducts() {
  return PRODUCTS_RAW.map(([name, category, price, stock, sales, rating], i) => ({
    id: `PRD-${101 + i}`,
    sku: `MRD-${category.slice(0, 3).toUpperCase()}-${String(101 + i)}`,
    name,
    category,
    price,
    stock,
    sales,
    revenue: price * sales,
    rating,
    reviews: Math.round(sales * 0.18 + 24),
    description: `${name} — part of the ${category} range.`,
  }));
}

const METHODS = [
  'Visa •••• 4242',
  'Mastercard •••• 5510',
  'PayPal',
  'Apple Pay',
  'Bank transfer',
  'Visa •••• 1881',
];
const PAYMENT_BY_STATUS = {
  Completed: () => 'Paid',
  Pending: (r) => (r() > 0.55 ? 'Paid' : 'Unpaid'),
  Cancelled: (r) => (r() > 0.5 ? 'Failed' : 'Unpaid'),
  Refunded: () => 'Refunded',
};

export function seedOrders(customers, products, count = 150) {
  const rand = mulberry32(4582);
  const HOUR = 3600000;
  let t = NOW - 11 * 60000;
  const list = [];
  for (let i = 0; i < count; i++) {
    const customer = pick(rand, customers);
    const lineCount = weighted(rand, [
      [1, 46],
      [2, 32],
      [3, 15],
      [4, 7],
    ]);
    const chosen = new Set();
    const items = [];
    while (items.length < lineCount) {
      const p = pick(rand, products);
      if (chosen.has(p.id)) continue;
      chosen.add(p.id);
      items.push({
        productId: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        qty: weighted(rand, [
          [1, 72],
          [2, 22],
          [3, 6],
        ]),
      });
    }
    const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);
    const shipping = subtotal >= 150 ? 0 : 9;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const status =
      i < 7
        ? weighted(rand, [
            ['Pending', 52],
            ['Completed', 40],
            ['Cancelled', 8],
          ])
        : weighted(rand, [
            ['Completed', 66],
            ['Pending', 14],
            ['Cancelled', 8],
            ['Refunded', 12],
          ]);
    list.push({
      id: `ORD-${4582 - i}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      date: new Date(t).toISOString(),
      items,
      itemCount: items.reduce((s, l) => s + l.qty, 0),
      subtotal,
      shipping,
      tax,
      amount: Math.round((subtotal + shipping + tax) * 100) / 100,
      status,
      payment: PAYMENT_BY_STATUS[status](rand),
      method: pick(rand, METHODS),
      shipTo: `${customer.city}, ${customer.country}`,
    });
    t -= (1 + rand() * 29) * HOUR + int(rand, 0, 59) * 60000;
  }
  return list;
}
