import jwt from 'jsonwebtoken';

export function adminAuth(req, res, next) {
  const key = process.env.ADMIN_API_KEY || 'dev-admin-key';
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  const xKey = req.headers['x-api-key'];

  if (xKey && xKey === key) {
    return next();
  }

  if (bearer) {
    if (bearer === key) {
      return next();
    }
    try {
      const secret = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
      const payload = jwt.verify(bearer, secret);
      if (payload?.role === 'admin') {
        return next();
      }
    } catch {
      /* invalid or expired JWT */
    }
  }

  return res.status(401).json({ error: 'Unauthorized' });
}
