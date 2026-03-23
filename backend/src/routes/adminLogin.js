import jwt from 'jsonwebtoken';

/** POST /api/admin/login — body: { email, password }. Sets no cookie; returns JWT for Bearer. */
export function postAdminLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    const envEmail = process.env.ADMIN_LOGIN_EMAIL;
    const envPass = process.env.ADMIN_LOGIN_PASSWORD;
    if (!envEmail || !envPass) {
      return res.status(503).json({
        error: 'Admin login not configured (set ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD in .env)',
      });
    }
    if (
      String(email || '').trim().toLowerCase() !== String(envEmail).trim().toLowerCase() ||
      String(password || '') !== String(envPass)
    ) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
    const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '7d' });
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
}
