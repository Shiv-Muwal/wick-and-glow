const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const KEY = import.meta.env.VITE_ADMIN_API_KEY || 'dev-admin-key';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${KEY}`,
  };
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

export function patchOrderStatus(orderId, status) {
  return adminApi(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
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

export function postCouponApi(body) {
  return adminApi('/api/admin/coupons', { method: 'POST', body: JSON.stringify(body) });
}

export function patchCouponApi(id, body) {
  return adminApi(`/api/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deleteCouponApi(id) {
  return adminApi(`/api/admin/coupons/${id}`, { method: 'DELETE' });
}

export function patchBlogApi(id, body) {
  return adminApi(`/api/admin/blogs/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deleteBlogApi(id) {
  return adminApi(`/api/admin/blogs/${id}`, { method: 'DELETE' });
}

export function fetchAdminReviews() {
  return adminApi('/api/admin/reviews');
}

export async function uploadProductImage(productId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch(
    `${BASE}/api/admin/products/${encodeURIComponent(productId)}/image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}` },
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
    headers: { Authorization: `Bearer ${KEY}` },
    body: fd,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText || 'Upload failed');
  return data;
}
