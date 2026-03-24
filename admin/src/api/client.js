const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const KEY = import.meta.env.VITE_ADMIN_API_KEY || 'dev-admin-key';
const SESSION_KEY = 'wickglow_admin_jwt';
const PROFILE_EMAIL_KEY = 'wickglow_admin_profile_email';

export function setAdminProfileEmail(email) {
  try {
    if (email) localStorage.setItem(PROFILE_EMAIL_KEY, String(email));
    else localStorage.removeItem(PROFILE_EMAIL_KEY);
  } catch {
    /* ignore */
  }
}

export function getAdminProfileEmail() {
  try {
    return localStorage.getItem(PROFILE_EMAIL_KEY) || '';
  } catch {
    return '';
  }
}

export function getAdminSessionToken() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setAdminSessionToken(token) {
  try {
    if (token) localStorage.setItem(SESSION_KEY, token);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function clearAdminSessionToken() {
  setAdminSessionToken(null);
  try {
    localStorage.removeItem(PROFILE_EMAIL_KEY);
  } catch {
    /* ignore */
  }
}

function bearerForAdmin() {
  return getAdminSessionToken() || KEY;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${bearerForAdmin()}`,
  };
}

export function postAdminChangePassword(body) {
  return adminApi('/api/admin/change-password', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function postAdminLogin(email, password) {
  const r = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const text = await r.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }
  if (!r.ok) {
    throw new Error(data?.error || r.statusText || 'Login failed');
  }
  return data;
}

async function parseJsonSafe(r) {
  const text = await r.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function adminApi(path, opts = {}) {
  const r = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { ...authHeaders(), ...opts.headers },
  });
  const data = await parseJsonSafe(r);
  if (!r.ok) {
    throw new Error(data?.error || r.statusText || 'Request failed');
  }
  return data;
}

export function fetchAdminState() {
  return adminApi('/api/admin/state');
}

export function fetchAdminDashboard() {
  return adminApi('/api/admin/dashboard');
}

/** Order IDs are like `#ORD-…` — query string avoids `#` in URL path (path often 404). */
export function fetchAdminOrder(orderId) {
  const q = new URLSearchParams({ id: orderId });
  return adminApi(`/api/admin/orders/detail?${q.toString()}`);
}

export function patchOrderStatus(orderId, status) {
  const q = new URLSearchParams({ id: orderId });
  return adminApi(`/api/admin/orders/detail?${q.toString()}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function restockProductApi(productId, quantity) {
  return adminApi(`/api/admin/products/${encodeURIComponent(productId)}/restock`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  });
}

export function postAdminProductApi(body) {
  return adminApi('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function patchAdminProductApi(productId, body) {
  return adminApi(`/api/admin/products/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteAdminProductApi(productId) {
  return adminApi(`/api/admin/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  });
}

export function postCouponApi(body) {
  return adminApi('/api/admin/coupons', { method: 'POST', body: JSON.stringify(body) });
}

export function patchCouponApi(id, body) {
  return adminApi(`/api/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deleteCouponApi(id) {
  return adminApi(`/api/admin/coupons/${id}`, { method: 'DELETE' });
}

export function fetchBlogApi(id) {
  return adminApi(`/api/admin/blogs/${encodeURIComponent(id)}`);
}

export function postBlogApi(body) {
  return adminApi('/api/admin/blogs', { method: 'POST', body: JSON.stringify(body) });
}

export function patchBlogApi(id, body) {
  return adminApi(`/api/admin/blogs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteBlogApi(id) {
  return adminApi(`/api/admin/blogs/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function fetchAdminReviews() {
  return adminApi('/api/admin/reviews');
}

export function fetchAdminContacts() {
  return adminApi('/api/admin/contacts');
}

export async function uploadProductImage(productId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch(
    `${BASE}/api/admin/products/${encodeURIComponent(productId)}/image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${bearerForAdmin()}` },
      body: fd,
    }
  );
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText || 'Upload failed');
  return data;
}

export async function uploadBlogCover(blogId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch(`${BASE}/api/admin/blogs/${encodeURIComponent(blogId)}/cover`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${bearerForAdmin()}` },
    body: fd,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText || 'Upload failed');
  return data;
}
