import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { signUserToken } from '../lib/jwt.js';

function publicUser(doc) {
  return {
    id: String(doc._id),
    email: doc.email,
    name: doc.name,
    createdAt: doc.createdAt,
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    const nm = String(name || '').trim();
    const em = String(email || '')
      .trim()
      .toLowerCase();
    const pw = String(password || '');

    if (!nm || !em || !pw) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (pw.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const passwordHash = await bcrypt.hash(pw, 10);
    let user;
    try {
      user = await User.create({
        name: nm,
        email: em,
        passwordHash,
      });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      throw e;
    }

    const token = signUserToken(String(user._id), user.email);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const em = String(email || '')
      .trim()
      .toLowerCase();
    const pw = String(password || '');
    if (!em || !pw) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email: em }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const ok = await bcrypt.compare(pw, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signUserToken(String(user._id), user.email);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId).lean();
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body || {};
    const oldPw = String(oldPassword || '');
    const newPw = String(newPassword || '');
    if (!oldPw || !newPw) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }
    if (newPw.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.auth.userId).select('+passwordHash');
    if (!user) return res.status(401).json({ error: 'User not found' });

    const match = await bcrypt.compare(oldPw, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPw, 10);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
