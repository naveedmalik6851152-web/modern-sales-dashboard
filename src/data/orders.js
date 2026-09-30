import { mulberry32, pick, int, weighted } from '@/utils/random';
import { customers } from './customers';
import { products } from './products';

const NOW = Date.now();
const HOUR = 3600000;

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

function buildOrders(count = 150) {
  const rand = mulberry32(4582);
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

export const orders = buildOrders();
export const ORDER_STATUSES = ['Completed', 'Pending', 'Cancelled', 'Refunded'];
export const PAYMENT_STATUSES = ['Paid', 'Unpaid', 'Failed', 'Refunded'];

export const productSummary = (order) =>
  order.items[0].name + (order.items.length > 1 ? ` +${order.items.length - 1} more` : '');
