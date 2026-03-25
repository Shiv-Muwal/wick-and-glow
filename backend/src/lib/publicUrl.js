/**
 * Production: PUBLIC_BASE_URL=https://wickandglow.in (no trailing slash).
 * Nginx ke peeche sahi absolute URLs + purane localhost DB URLs fix.
 */

function parseOrigin(raw) {
  const t = String(raw || '').trim().replace(/\/$/, '');
  if (!t) return null;
  try {
    const u = new URL(t.includes('://') ? t : `https://${t}`);
    return u.origin;
  } catch {
    return null;
  }
}

/** Naye upload URLs ke liye (disk save). */
export function absoluteBaseForRequest(req) {
  const fromEnv = parseOrigin(process.env.PUBLIC_BASE_URL);
  if (fromEnv) return fromEnv;

  const proto = (req.get('x-forwarded-proto') || req.protocol || 'http').split(',')[0].trim();
  const host = (req.get('x-forwarded-host') || req.get('host') || `localhost:${process.env.PORT || 3000}`)
    .split(',')[0]
    .trim();
  return `${proto}://${host}`;
}

/** API se browser ko bhejne se pehle — DB mein save purane http://localhost:... URLs. */
export function normalizeMediaUrl(url) {
  if (url == null || url === '') return '';
  const s = String(url).trim();
  if (!s) return '';

  const origin = parseOrigin(process.env.PUBLIC_BASE_URL);
  if (!origin) return s;

  if (s.startsWith('/')) {
    return `${origin}${s}`;
  }

  try {
    const u = new URL(s);
    if (/^(localhost|127\.0\.0\.1)$/i.test(u.hostname)) {
      return `${origin}${u.pathname}${u.search}${u.hash}`;
    }
    const baseHost = new URL(origin).hostname;
    if (u.hostname === baseHost) {
      return `${origin}${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    return s;
  }

  return s;
}
