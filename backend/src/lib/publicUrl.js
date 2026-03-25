/**
 * Production: PUBLIC_BASE_URL=https://wickandglow.in (no trailing slash).
 * Nginx ke peeche sahi absolute URLs + purane localhost / http DB URLs fix.
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

function hostKey(hostname) {
  return String(hostname || '').replace(/^www\./i, '').toLowerCase();
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

/** API se browser ko bhejne se pehle — DB mein save purane http://... URLs. */
export function normalizeMediaUrl(url) {
  if (url == null || url === '') return '';
  const s = String(url).trim();
  if (!s) return '';

  const origin = parseOrigin(process.env.PUBLIC_BASE_URL);

  if (s.startsWith('/')) {
    if (origin) return `${origin}${s}`;
    return s;
  }

  try {
    const u = new URL(s);

    if (/^(localhost|127\.0\.0\.1)$/i.test(u.hostname)) {
      if (origin) return `${origin}${u.pathname}${u.search}${u.hash}`;
      return s;
    }

    if (origin) {
      const baseHost = new URL(origin).hostname;
      if (hostKey(u.hostname) === hostKey(baseHost)) {
        return `${origin}${u.pathname}${u.search}${u.hash}`;
      }
    }

    if (process.env.NODE_ENV === 'production' && u.protocol === 'http:' && !/^(localhost|127\.0\.0\.1)$/i.test(u.hostname)) {
      return `https://${u.hostname}${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    return s;
  }

  return s;
}
