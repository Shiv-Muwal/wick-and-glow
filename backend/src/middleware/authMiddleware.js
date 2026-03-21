import { verifyUserToken } from '../lib/jwt.js';

/** JWT bearer auth — attach `req.auth = { userId, email }`. */
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = verifyUserToken(token);
    req.auth = { userId: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export const userAuth = authMiddleware;
