import bcrypt from 'bcryptjs';
import { AdminCredentials } from '../models/index.js';

const ADMIN_ID = 'admin';

async function verifyAdminPassword(plain) {
  const row = await AdminCredentials.findById(ADMIN_ID).lean();
  if (row?.passwordHash) {
    return bcrypt.compare(String(plain || ''), row.passwordHash);
  }
  const envPass = process.env.ADMIN_LOGIN_PASSWORD;
  return String(plain || '') === String(envPass || '');
}

/** POST /api/admin/change-password — Bearer admin JWT. Body: { currentPassword, newPassword } */
export async function postAdminChangePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const cur = String(currentPassword || '');
    const nextPw = String(newPassword || '');

    if (!cur || !nextPw) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (nextPw.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const envEmail = process.env.ADMIN_LOGIN_EMAIL;
    const envPass = process.env.ADMIN_LOGIN_PASSWORD;
    if (!envEmail || !envPass) {
      return res.status(503).json({
        error: 'Admin login not configured (set ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD)',
      });
    }

    const ok = await verifyAdminPassword(cur);
    if (!ok) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(nextPw, 10);
    await AdminCredentials.findOneAndUpdate(
      { _id: ADMIN_ID },
      { $set: { passwordHash } },
      { upsert: true }
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Could not update password' });
  }
}
