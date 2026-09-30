// [name, category, price, stock, units sold (30d), rating]
const RAW = [
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

export const CATEGORIES = ['Audio', 'Wearables', 'Home Office', 'Accessories', 'Smart Home'];

export const stockStatus = (stock) =>
  stock === 0 ? 'Out of stock' : stock <= 20 ? 'Low stock' : 'In stock';

export const products = RAW.map(([name, category, price, stock, sales, rating], i) => ({
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
