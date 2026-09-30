import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { db, persist, withStats, withStockStatus, nextId, resetDb } from './db.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' })); // generous limit: profile photos travel as base64
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const PORT = process.env.PORT || 4001;
const notFound = (res, what) => res.status(404).json({ message: `${what} not found` });

io.on('connection', (socket) => {
  socket.on('typing', ({ conversationId }) => {
    socket.broadcast.emit('typing', { conversationId });
  });
});

const broadcast = (event, payload) => io.emit(event, payload);

/* ---------------------------- users / account ---------------------------- */
app.get('/api/users/me', (req, res) => res.json(db.user));
app.patch('/api/users/me', (req, res) => {
  db.user = {
    ...db.user,
    ...req.body,
    name: `${req.body.firstName ?? db.user.firstName} ${req.body.lastName ?? db.user.lastName}`,
  };
  persist();
  broadcast('user:updated', db.user);
  res.json(db.user);
});
app.get('/api/account', (req, res) => res.json(db.account));
app.get('/api/activity', (req, res) => res.json(db.user.recentActivity ?? []));

/* -------------------------------- customers -------------------------------- */
app.get('/api/customers', (req, res) => res.json(db.customers.map(withStats)));
app.get('/api/customers/:id', (req, res) => {
  const c = db.customers.find((x) => x.id === req.params.id);
  if (!c) return notFound(res, 'Customer');
  res.json({ ...withStats(c), orders: db.orders.filter((o) => o.customerId === c.id) });
});
app.post('/api/customers', (req, res) => {
  const customer = {
    notes: '',
    status: 'Active',
    tier: 'New',
    ...req.body,
    id: nextId('CUS', db.customers, 1000),
    joinedAt: new Date().toISOString(),
  };
  db.customers.unshift(customer);
  persist();
  broadcast('customers:changed', null);
  res.status(201).json(withStats(customer));
});
app.patch('/api/customers/:id', (req, res) => {
  const i = db.customers.findIndex((c) => c.id === req.params.id);
  if (i < 0) return notFound(res, 'Customer');
  db.customers[i] = { ...db.customers[i], ...req.body };
  persist();
  broadcast('customers:changed', null);
  res.json(withStats(db.customers[i]));
});
app.delete('/api/customers/:id', (req, res) => {
  db.customers = db.customers.filter((c) => c.id !== req.params.id);
  persist();
  broadcast('customers:changed', null);
  res.json({ id: req.params.id });
});

/* ---------------------------------- orders ---------------------------------- */
const PAYMENT_AFTER = {
  Completed: () => 'Paid',
  Refunded: () => 'Refunded',
  Cancelled: (o) => (o.payment === 'Paid' ? 'Refunded' : 'Unpaid'),
  Pending: (o) => o.payment,
};
app.get('/api/orders', (req, res) => res.json(db.orders));
app.get('/api/orders/:id', (req, res) => {
  const o = db.orders.find((x) => x.id === req.params.id);
  if (!o) return notFound(res, 'Order');
  res.json(o);
});
app.post('/api/orders', (req, res) => {
  const customer = db.customers.find((c) => c.id === req.body.customerId);
  if (!customer) return notFound(res, 'Customer');
  const items = req.body.items.map(({ productId, qty }) => {
    const p = db.products.find((x) => x.id === productId);
    if (!p) throw new Error('Product not found');
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
  persist();
  broadcast('orders:changed', null);
  res.status(201).json(order);
});
app.patch('/api/orders/:id/status', (req, res) => {
  const o = db.orders.find((x) => x.id === req.params.id);
  if (!o) return notFound(res, 'Order');
  o.payment = PAYMENT_AFTER[req.body.status](o);
  o.status = req.body.status;
  persist();
  broadcast('orders:changed', null);
  res.json(o);
});

/* --------------------------------- products --------------------------------- */
app.get('/api/products', (req, res) => res.json(db.products.map(withStockStatus)));
app.post('/api/products', (req, res) => {
  const id = nextId('PRD', db.products, 100);
  const product = {
    rating: 0,
    reviews: 0,
    ...req.body,
    id,
    sku: `MRD-${req.body.category.slice(0, 3).toUpperCase()}-${id.split('-')[1]}`,
    sales: 0,
  };
  db.products.unshift(product);
  persist();
  broadcast('products:changed', null);
  res.status(201).json(withStockStatus(product));
});
app.patch('/api/products/:id', (req, res) => {
  const i = db.products.findIndex((p) => p.id === req.params.id);
  if (i < 0) return notFound(res, 'Product');
  db.products[i] = { ...db.products[i], ...req.body };
  persist();
  broadcast('products:changed', null);
  res.json(withStockStatus(db.products[i]));
});
app.delete('/api/products/:id', (req, res) => {
  db.products = db.products.filter((p) => p.id !== req.params.id);
  persist();
  broadcast('products:changed', null);
  res.json({ id: req.params.id });
});

/* ------------------------------- notifications ------------------------------- */
app.get('/api/notifications', (req, res) =>
  res.json([...db.notifications].sort((a, b) => new Date(b.at) - new Date(a.at))),
);
app.patch('/api/notifications/:id', (req, res) => {
  const n = db.notifications.find((x) => x.id === req.params.id);
  if (n) n.read = req.body.read;
  persist();
  res.json(n ?? null);
});
app.post('/api/notifications/read-all', (req, res) => {
  db.notifications.forEach((n) => (n.read = true));
  persist();
  res.json({ ok: true });
});
app.delete('/api/notifications/:id', (req, res) => {
  db.notifications = db.notifications.filter((n) => n.id !== req.params.id);
  persist();
  res.json({ id: req.params.id });
});

/* ------------------------------- conversations ------------------------------- */
// The heart of "real-time": a message saved here is broadcast over the websocket to
// every connected browser tab instantly, instead of only updating the sender's own state.
app.get('/api/conversations', (req, res) => res.json(db.conversations));
app.post('/api/conversations/:id/messages', (req, res) => {
  const c = db.conversations.find((x) => x.id === req.params.id);
  if (!c) return notFound(res, 'Conversation');
  const message = {
    id: `m${Date.now()}`,
    from: req.body.from || 'me',
    text: req.body.text,
    at: new Date().toISOString(),
  };
  c.messages.push(message);
  if (message.from !== 'me') c.unread += 1;
  persist();
  broadcast('message:new', { conversationId: c.id, message });
  res.status(201).json(message);
});
app.post('/api/conversations/:id/read', (req, res) => {
  const c = db.conversations.find((x) => x.id === req.params.id);
  if (c) c.unread = 0;
  persist();
  res.json({ ok: true });
});

/* ------------------------------------ misc ------------------------------------ */
app.post('/api/reset', (req, res) => res.json(resetDb()) && broadcast('reset', null));
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

httpServer.listen(PORT, () => {
  console.log(`Sales Dashboard IG backend running at http://localhost:${PORT}`);
  console.log(`Data persisted to server/db.json — point the frontend at it with:`);
  console.log(`  VITE_API_URL=http://localhost:${PORT}/api`);
});
