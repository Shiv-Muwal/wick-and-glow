import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_TOKEN_KEY = 'wickglow_auth_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const t = getStoredToken();
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

/** —— Auth —— */
export function postRegister(body) {
  return client.post('/api/auth/register', body);
}

export function postLogin(body) {
  return client.post('/api/auth/login', body);
}

export function getMe() {
  return client.get('/api/auth/me');
}

export function postChangePassword(oldPassword, newPassword) {
  return client.post('/api/auth/change-password', { oldPassword, newPassword });
}

/** —— Cart (JWT) —— */
export function fetchCart() {
  return client.get('/api/cart');
}

export function addCartItem(productId, quantity = 1) {
  return client.post('/api/cart/items', { productId, quantity });
}

export function updateCartItem(productId, quantity) {
  return client.patch(`/api/cart/items/${encodeURIComponent(productId)}`, { quantity });
}

export function removeCartItem(productId) {
  return client.delete(`/api/cart/items/${encodeURIComponent(productId)}`);
}

/** —— Orders —— */
export function postOrder(body) {
  return client.post('/api/orders', body);
}

export function getMyOrders() {
  return client.get('/api/orders/my');
}

export function getOrderById(orderId) {
  return client.get(`/api/orders/${encodeURIComponent(orderId)}`);
}

export function postOrderLookup(orderId, email) {
  return client.post('/api/orders/lookup', { orderId, email });
}

/** —— Catalog —— */
export function getProducts(query = {}) {
  const q = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v != null && v !== '') q.set(k, v);
  });
  const s = q.toString();
  return client.get(`/api/products${s ? `?${s}` : ''}`);
}

export function getProduct(id) {
  return client.get(`/api/products/${encodeURIComponent(id)}`);
}

export function getBlogs() {
  return client.get('/api/blogs');
}

export function postContact(body) {
  return client.post('/api/contact', body);
}

export function postNewsletter(email) {
  return client.post('/api/newsletter', { email });
}

export function validateCoupon(code) {
  return client.post('/api/coupons/validate', { code });
}
