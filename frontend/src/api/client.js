const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function parseJsonSafe(r) {
  const text = await r.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function api(path, opts = {}) {
  const r = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts.headers },
  });
  const data = await parseJsonSafe(r);
  if (!r.ok) {
    throw new Error(data?.error || r.statusText || 'Request failed');
  }
  return data;
}

export function getProducts(query = {}) {
  const q = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v != null && v !== '') q.set(k, v);
  });
  const s = q.toString();
  return api(`/api/products${s ? `?${s}` : ''}`);
}

export function getProduct(id) {
  return api(`/api/products/${encodeURIComponent(id)}`);
}

export function getBlogs() {
  return api('/api/blogs');
}

export function postContact(body) {
  return api('/api/contact', { method: 'POST', body: JSON.stringify(body) });
}

export function postNewsletter(email) {
  return api('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
}

export function postOrder(body) {
  return api('/api/orders', { method: 'POST', body: JSON.stringify(body) });
}

export function validateCoupon(code) {
  return api('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code }) });
}
