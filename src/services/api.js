/**
 * API layer.
 *
 * Every function here returns a promise and hides where the data comes from:
 *   - Mock mode (default): an in-memory database seeded from /src/data, with
 *     simulated latency. Mutations persist for the session and notify
 *     subscribers so lists refresh automatically.
 *   - Real mode: set VITE_API_URL (see .env.example) and the same functions call
 *     your backend through Axios. Expected REST routes are noted on each call.
 *
 * Pages and hooks import from here only — never from /src/data directly.
 */
import axios from 'axios';
import { customers as seedCustomers } from '@/data/customers';
import { orders as seedOrders } from '@/data/orders';
import { products as seedProducts, stockStatus } from '@/data/products';
import { activity as seedActivity } from '@/data/activity';
import { notifications as seedNotifications } from '@/data/notifications';
import { conversations as seedConversations } from '@/data/messages';
import { currentUser } from '@/data/user';
import * as account from '@/data/account';
import { buildAnalytics, customerGrowth, salesMonthly, DEFAULT_FILTERS } from '@/data/analytics';
import { buildReport } from '@/data/reports';

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */
const API_URL = import.meta.env.VITE_API_URL || '/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' && !import.meta.env.VITE_API_URL;

export const http = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('meridian:token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* storage unavailable */
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(error);
  },
);

/* ------------------------------------------------------------------ */
/* Change notifications (drives automatic refetching in useAsync)      */
/* ------------------------------------------------------------------ */
const listeners = new Set();
export const subscribeToChanges = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export const emitChange = () => listeners.forEach((cb) => cb());

/* ------------------------------------------------------------------ */
/* Mock plumbing                                                       */
/* ------------------------------------------------------------------ */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));
const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

async function runMock(fn) {
  await wait(240 + Math.random() * 360);
  try {
    // Set localStorage 'meridian:simulate-error' to "1" to preview error states.
    if (localStorage.getItem('meridian:simulate-error') === '1') {
      throw new Error('Simulated network error');
    }
  } catch (e) {
    if (e.message === 'Simulated network error') throw e;
  }
  return clone(fn());
}

const read = ({ mock, real }) => (USE_MOCK ? runMock(mock) : real().then((r) => r.data));

/** Analytics and reports are synthetic/deterministic by design — always generated
 * client-side, even when a real backend is configured for everything else. */
const readAlways = (mock) => runMock(mock);

const write = async ({ mock, real }) => {
  const result = USE_MOCK ? await runMock(mock) : (await real()).data;
  emitChange();
  return result;
};

const notFound = (what) => Object.assign(new Error(`${what} not found`), { status: 404 });

const db = {
  user: clone(currentUser),
  customers: clone(seedCustomers),
  orders: clone(seedOrders),
  products: clone(seedProducts),
  activity: seedActivity.map((a) => ({ ...a, at: ago(a.minutesAgo) })),
  notifications: seedNotifications.map((n) => ({ ...n, at: ago(n.minutesAgo) })),
  conversations: seedConversations.map((c) => ({
    ...c,
    messages: c.messages.map((m) => ({ ...m, at: ago(m.minutesAgo) })),
  })),
};

const nextId = (prefix, list, start) => {
  const max = list.reduce((m, item) => Math.max(m, Number(item.id.split('-')[1]) || 0), start);
  return `${prefix}-${max + 1}`;
};

const withStats = (c) => {
  const mine = db.orders.filter((o) => o.customerId === c.id);
  const paid = mine.filter((o) => o.status === 'Completed' || o.status === 'Pending');
  return {
    ...c,
    totalOrders: mine.length,
    totalSpent: Math.round(paid.reduce((s, o) => s + o.amount, 0) * 100) / 100,
    lastOrderAt: mine[0]?.date ?? null,
  };
};

const withStockStatus = (p) => ({ ...p, revenue: p.price * p.sales, status: stockStatus(p.stock) });

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */
export const usersApi = {
  /** GET /users/me */
  getCurrentUser: () =>
    read({
      mock: () => ({
        ...db.user,
        recentActivity: db.user.recentActivity.map((a) => ({ ...a, at: ago(a.minutesAgo) })),
      }),
      real: () => http.get('/users/me'),
    }),
  /** PATCH /users/me */
  updateCurrentUser: (patch) =>
    write({
      mock: () => {
        db.user = {
          ...db.user,
          ...patch,
          name: `${patch.firstName ?? db.user.firstName} ${patch.lastName ?? db.user.lastName}`,
        };
        return db.user;
      },
      real: () => http.patch('/users/me', patch),
    }),
  /** GET /account (plan, invoices, integrations, sessions, preferences) */
  getAccount: () =>
    read({
      mock: () => ({
        plan: account.plan,
        paymentMethod: account.paymentMethod,
        invoices: account.invoices,
        integrations: account.integrations,
        sessions: account.sessions,
        notificationPrefs: account.notificationPrefs,
      }),
      real: () => http.get('/account'),
    }),
  /** GET /activity */
  getActivity: () =>
    read({
      mock: () => [...db.activity].sort((a, b) => new Date(b.at) - new Date(a.at)),
      real: () => http.get('/activity'),
    }),
};

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */
export const customersApi = {
  /** GET /customers */
  list: () => read({ mock: () => db.customers.map(withStats), real: () => http.get('/customers') }),
  /** GET /customers/:id */
  get: (id) =>
    read({
      mock: () => {
        const c = db.customers.find((x) => x.id === id);
        if (!c) throw notFound('Customer');
        return { ...withStats(c), orders: db.orders.filter((o) => o.customerId === id) };
      },
      real: () => http.get(`/customers/${id}`),
    }),
  /** POST /customers */
  create: (payload) =>
    write({
      mock: () => {
        const customer = {
          notes: '',
          status: 'Active',
          tier: 'New',
          ...payload,
          id: nextId('CUS', db.customers, 1000),
          joinedAt: new Date().toISOString(),
        };
        db.customers.unshift(customer);
        return withStats(customer);
      },
      real: () => http.post('/customers', payload),
    }),
  /** PATCH /customers/:id */
  update: (id, patch) =>
    write({
      mock: () => {
        const i = db.customers.findIndex((c) => c.id === id);
        if (i < 0) throw notFound('Customer');
        db.customers[i] = { ...db.customers[i], ...patch };
        return withStats(db.customers[i]);
      },
      real: () => http.patch(`/customers/${id}`, patch),
    }),
  /** DELETE /customers/:id */
  remove: (id) =>
    write({
      mock: () => {
        db.customers = db.customers.filter((c) => c.id !== id);
        return { id };
      },
      real: () => http.delete(`/customers/${id}`),
    }),
};

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */
const PAYMENT_AFTER = {
  Completed: () => 'Paid',
  Refunded: () => 'Refunded',
  Cancelled: (o) => (o.payment === 'Paid' ? 'Refunded' : 'Unpaid'),
  Pending: (o) => o.payment,
};

export const ordersApi = {
  /** GET /orders */
  list: () => read({ mock: () => db.orders, real: () => http.get('/orders') }),
  /** GET /orders/:id */
  get: (id) =>
    read({
      mock: () => {
        const o = db.orders.find((x) => x.id === id);
        if (!o) throw notFound('Order');
        return o;
      },
      real: () => http.get(`/orders/${id}`),
    }),
  /** POST /orders   body: { customerId, items: [{ productId, qty }] } */
  create: (payload) =>
    write({
      mock: () => {
        const customer = db.customers.find((c) => c.id === payload.customerId);
        if (!customer) throw notFound('Customer');
        const items = payload.items.map(({ productId, qty }) => {
          const p = db.products.find((x) => x.id === productId);
          if (!p) throw notFound('Product');
          p.stock = Math.max(0, p.stock - qty);
          p.sales += qty;
          return { productId, name: p.name, category: p.category, price: p.price, qty };
        });
        const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);
        const shipping = subtotal >= 150 ? 0 : 9;
        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const order = {
          id: nextId('ORD', db.orders, 4000),
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          date: new Date().toISOString(),
          items,
          itemCount: items.reduce((s, l) => s + l.qty, 0),
          subtotal,
          shipping,
          tax,
          amount: Math.round((subtotal + shipping + tax) * 100) / 100,
          status: 'Pending',
          payment: 'Unpaid',
          method: 'Invoice',
          shipTo: `${customer.city}, ${customer.country}`,
        };
        db.orders.unshift(order);
        return order;
      },
      real: () => http.post('/orders', payload),
    }),
  /** PATCH /orders/:id/status   body: { status } */
  updateStatus: (id, status) =>
    write({
      mock: () => {
        const o = db.orders.find((x) => x.id === id);
        if (!o) throw notFound('Order');
        o.payment = PAYMENT_AFTER[status](o);
        o.status = status;
        return o;
      },
      real: () => http.patch(`/orders/${id}/status`, { status }),
    }),
};

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */
export const productsApi = {
  /** GET /products */
  list: () =>
    read({ mock: () => db.products.map(withStockStatus), real: () => http.get('/products') }),
  /** POST /products */
  create: (payload) =>
    write({
      mock: () => {
        const id = nextId('PRD', db.products, 100);
        const product = {
          rating: 0,
          reviews: 0,
          ...payload,
          id,
          sku: `MRD-${payload.category.slice(0, 3).toUpperCase()}-${id.split('-')[1]}`,
          sales: 0,
        };
        db.products.unshift(product);
        return withStockStatus(product);
      },
      real: () => http.post('/products', payload),
    }),
  /** PATCH /products/:id */
  update: (id, patch) =>
    write({
      mock: () => {
        const i = db.products.findIndex((p) => p.id === id);
        if (i < 0) throw notFound('Product');
        db.products[i] = { ...db.products[i], ...patch };
        return withStockStatus(db.products[i]);
      },
      real: () => http.patch(`/products/${id}`, patch),
    }),
  /** DELETE /products/:id */
  remove: (id) =>
    write({
      mock: () => {
        db.products = db.products.filter((p) => p.id !== id);
        return { id };
      },
      real: () => http.delete(`/products/${id}`),
    }),
};

/* ------------------------------------------------------------------ */
/* Analytics & reports                                                 */
/* ------------------------------------------------------------------ */
export const analyticsApi = {
  /** Always generated client-side — synthetic, deterministic data with no backend route. */
  getDashboard: (range) =>
    readAlways(() => ({
      ...buildAnalytics(range, DEFAULT_FILTERS),
      salesMonthly: salesMonthly(),
      customerGrowth: customerGrowth(),
    })),
  getAnalytics: (range, filters) => readAlways(() => buildAnalytics(range, filters)),
  getReport: ({ type, from, to }) => readAlways(() => buildReport(type, from, to)),
};

/* ------------------------------------------------------------------ */
/* Notifications & messages                                            */
/* ------------------------------------------------------------------ */
export const notificationsApi = {
  /** GET /notifications */
  list: () =>
    read({
      mock: () => [...db.notifications].sort((a, b) => new Date(b.at) - new Date(a.at)),
      real: () => http.get('/notifications'),
    }),
  /** PATCH /notifications/:id   body: { read } */
  markRead: (id, readState = true) =>
    read({
      mock: () => {
        const n = db.notifications.find((x) => x.id === id);
        if (n) n.read = readState;
        return n;
      },
      real: () => http.patch(`/notifications/${id}`, { read: readState }),
    }),
  /** POST /notifications/read-all */
  markAllRead: () =>
    read({
      mock: () => {
        db.notifications.forEach((n) => (n.read = true));
        return { ok: true };
      },
      real: () => http.post('/notifications/read-all'),
    }),
  /** DELETE /notifications/:id */
  remove: (id) =>
    read({
      mock: () => {
        db.notifications = db.notifications.filter((n) => n.id !== id);
        return { id };
      },
      real: () => http.delete(`/notifications/${id}`),
    }),
};

export const messagesApi = {
  /** GET /conversations */
  listConversations: () =>
    read({ mock: () => db.conversations, real: () => http.get('/conversations') }),
  /** POST /conversations/:id/messages   body: { text } */
  send: (conversationId, text, from = 'me') =>
    read({
      mock: () => {
        const c = db.conversations.find((x) => x.id === conversationId);
        if (!c) throw notFound('Conversation');
        const message = { id: `m${Date.now()}`, from, text, at: new Date().toISOString() };
        c.messages.push(message);
        return message;
      },
      real: () => http.post(`/conversations/${conversationId}/messages`, { text, from }),
    }),
  /** POST /conversations/:id/read */
  markRead: (conversationId) =>
    read({
      mock: () => {
        const c = db.conversations.find((x) => x.id === conversationId);
        if (c) c.unread = 0;
        return { ok: true };
      },
      real: () => http.post(`/conversations/${conversationId}/read`),
    }),
};
