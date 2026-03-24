import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AdminCredentials } from '../models/index.js';

const ADMIN_ID = 'admin';

/** POST /api/admin/login — body: { email, password }. Sets no cookie; returns JWT for Bearer. */
export async function postAdminLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    const envEmail = process.env.ADMIN_LOGIN_EMAIL;
    const envPass = process.env.ADMIN_LOGIN_PASSWORD;
    if (!envEmail || !envPass) {
      return res.status(503).json({
        error: 'Admin login not configured (set ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD in .env)',
      });
    }
    if (String(email || '').trim().toLowerCase() !== String(envEmail).trim().toLowerCase()) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const row = await AdminCredentials.findById(ADMIN_ID).lean();
    let passwordOk = false;
    if (row?.passwordHash) {
      passwordOk = await bcrypt.compare(String(password || ''), row.passwordHash);
    } else {
      passwordOk = String(password || '') === String(envPass);
    }

    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
    const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
}
