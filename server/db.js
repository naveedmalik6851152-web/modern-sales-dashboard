// Tiny JSON-file database. Real persistence across restarts — not just in-memory —
// so the "Known limitations" of the pure-frontend mock (data resets on reload) go away
// once this server is running.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { seedCustomers, seedProducts, seedOrders, stockStatus } from './seed-data.js';
import { seedUser, seedAccount, seedNotifications, seedConversations } from './seed-extra.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'db.json');

function seed() {
  const customers = seedCustomers();
  const products = seedProducts();
  const orders = seedOrders(customers, products);
  return {
    user: seedUser(),
    account: seedAccount(),
    customers,
    products,
    orders,
    notifications: seedNotifications(),
    conversations: seedConversations(),
  };
}

function load() {
  if (existsSync(FILE)) {
    try {
      return JSON.parse(readFileSync(FILE, 'utf-8'));
    } catch {
      console.warn('db.json was unreadable, reseeding.');
    }
  }
  const fresh = seed();
  save(fresh);
  return fresh;
}

export function save(db) {
  writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export const db = load();
export const persist = () => save(db);
export const withStockStatus = (p) => ({
  ...p,
  revenue: p.price * p.sales,
  status: stockStatus(p.stock),
});
export const withStats = (c) => {
  const mine = db.orders.filter((o) => o.customerId === c.id);
  const paid = mine.filter((o) => o.status === 'Completed' || o.status === 'Pending');
  return {
    ...c,
    totalOrders: mine.length,
    totalSpent: Math.round(paid.reduce((s, o) => s + o.amount, 0) * 100) / 100,
    lastOrderAt: mine[0]?.date ?? null,
  };
};
export const nextId = (prefix, list, start) => {
  const max = list.reduce((m, item) => Math.max(m, Number(item.id.split('-')[1]) || 0), start);
  return `${prefix}-${max + 1}`;
};

export function resetDb() {
  const fresh = seed();
  Object.keys(db).forEach((k) => delete db[k]);
  Object.assign(db, fresh);
  persist();
  return db;
}
