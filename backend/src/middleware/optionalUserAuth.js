import { verifyUserToken } from '../lib/jwt.js';

/** Sets req.storeUserId and req.storeUserEmail when a valid Bearer token is sent; never 401. */
export function optionalUserAuth(req, _res, next) {
  req.storeUserId = null;
  req.storeUserEmail = null;
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = verifyUserToken(token);
      req.storeUserId = payload.sub;
      req.storeUserEmail = payload.email ? String(payload.email).toLowerCase() : null;
    } catch {
      /* invalid token — treat as guest */
    }
  }
  next();
}
