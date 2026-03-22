import { Router } from 'express';
import {
  Coupon,
  Blog,
  ContactMessage,
  NewsletterSubscriber,
} from '../models/index.js';
import { formatBlogDate } from '../utils/transforms.js';
import * as products from '../controllers/productController.js';
import { sendNewsletterWelcome } from '../lib/mailer.js';

export function publicRouter() {
  const r = Router();

  r.get('/products', products.listProducts);
  r.get('/products/:id', products.getProduct);

  r.get('/blogs', async (_req, res, next) => {
    try {
      const rows = await Blog.find({ published: true }).sort({ date: -1 }).lean();
      const formatted = rows.map((b) => ({
        id: String(b._id),
        tag: b.tag || 'Journal',
        title: b.title,
        excerpt: b.excerpt,
        date: formatBlogDate(b.date),
        emoji: b.emoji,
        coverImageUrl: b.coverImageUrl || '',
      }));
      res.json(formatted);
    } catch (e) {
      next(e);
    }
  });

  r.post('/coupons/validate', async (req, res, next) => {
    try {
      const code = String(req.body?.code || '')
        .trim()
        .toUpperCase();
      if (!code) return res.status(400).json({ error: 'Code required' });
      const row = await Coupon.findOne({ code });
      if (!row || !row.active) {
        return res.json({ valid: false, discount: 0 });
      }
      const exp = row.expiry ? new Date(row.expiry + 'T23:59:59') : null;
      if (exp && exp < new Date()) {
        return res.json({ valid: false, discount: 0, reason: 'expired' });
      }
      res.json({ valid: true, discount: row.discount, code: row.code });
    } catch (e) {
      next(e);
    }
  });

  r.post('/contact', async (req, res, next) => {
    try {
      const { firstName, lastName, email, phone, subject, message } = req.body || {};
      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      await ContactMessage.create({
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : undefined,
        subject: subject ? String(subject).trim() : undefined,
        message: String(message).trim(),
      });
      res.status(201).json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  r.post('/newsletter', async (req, res, next) => {
    try {
      const email = String(req.body?.email || '')
        .trim()
        .toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email required' });
      }

      try {
        await NewsletterSubscriber.create({ email });
      } catch (e) {
        if (e?.code === 11000) {
          return res.status(200).json({ ok: true, alreadySubscribed: true });
        }
        throw e;
      }

      const { sent: emailSent } = await sendNewsletterWelcome(email);
      res.status(201).json({ ok: true, emailSent });
    } catch (e) {
      next(e);
    }
  });

  return r;
}
