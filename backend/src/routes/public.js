import { Router } from 'express';
import { nanoid } from 'nanoid';
import {
  Product,
  Coupon,
  Blog,
  ContactMessage,
  NewsletterSubscriber,
  Order,
  Customer,
} from '../models/index.js';
import { docToStoreProduct, formatBlogDate } from '../utils/transforms.js';
import { hashCode } from '../utils/hash.js';

export function publicRouter() {
  const r = Router();

  r.get('/products', async (req, res, next) => {
    try {
      const { search, category, fragrance, maxPrice } = req.query;
      const q = {};
      if (search) {
        const t = String(search);
        q.$or = [
          { name: new RegExp(t, 'i') },
          { fragrance: new RegExp(t, 'i') },
        ];
      }
      if (category) {
        const cats = String(category)
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
        if (cats.length) q.category = { $in: cats };
      }
      if (fragrance) {
        const fr = String(fragrance)
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
        if (fr.length) q.fragrance = { $in: fr };
      }
      if (maxPrice != null && maxPrice !== '') {
        const mp = Number(maxPrice);
        if (Number.isFinite(mp)) q.price = { $lte: mp };
      }
      const rows = await Product.find(q).sort({ name: 1 }).lean();
      res.json(rows.map((row) => docToStoreProduct({ ...row, _id: row._id })));
    } catch (e) {
      next(e);
    }
  });

  r.get('/products/:id', async (req, res, next) => {
    try {
      const row = await Product.findById(req.params.id).lean();
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(docToStoreProduct({ ...row, _id: row._id }));
    } catch (e) {
      next(e);
    }
  });

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
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
      }
      try {
        await NewsletterSubscriber.create({ email });
      } catch {
        /* duplicate */
      }
      res.status(201).json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  r.post('/orders', async (req, res, next) => {
    try {
      const { customerName, customerEmail, items, couponCode } = req.body || {};
      if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order payload' });
      }

      let subtotal = 0;
      const lineDetails = [];

      for (const line of items) {
        const pid = line.productId || line.id;
        const qty = Math.max(1, parseInt(line.qty, 10) || 1);
        const row = await Product.findById(pid).lean();
        if (!row) return res.status(400).json({ error: `Unknown product: ${pid}` });
        if (row.stock < qty) {
          return res.status(400).json({ error: `Insufficient stock: ${row.name}` });
        }
        const lineAmt = row.price * qty;
        subtotal += lineAmt;
        lineDetails.push({ productId: row._id, name: row.name, qty, price: row.price });
      }

      let discountPct = 0;
      if (couponCode) {
        const code = String(couponCode).trim().toUpperCase();
        const c = await Coupon.findOne({ code });
        if (c && c.active) {
          const exp = c.expiry ? new Date(c.expiry + 'T23:59:59') : null;
          if (!exp || exp >= new Date()) discountPct = c.discount;
        }
      }

      const amount = Math.round(subtotal * (1 - discountPct / 100));
      const orderId = `#ORD-${nanoid(8).toUpperCase()}`;
      const date = new Date().toISOString().slice(0, 10);
      const productLabel =
        lineDetails.length === 1
          ? lineDetails[0].name
          : `${lineDetails.length} items (${lineDetails[0].name})`;

      const rolledBack = [];
      try {
        for (const line of lineDetails) {
          const updated = await Product.findOneAndUpdate(
            { _id: line.productId, stock: { $gte: line.qty } },
            { $inc: { stock: -line.qty } },
            { new: true }
          );
          if (!updated) {
            throw new Error(`stock:${line.productId}`);
          }
          rolledBack.push(line);
        }

        await Order.create({
          _id: orderId,
          customerName: String(customerName).trim(),
          customerEmail: String(customerEmail).trim().toLowerCase(),
          productLabel,
          amount,
          status: 'pending',
          date,
          items: lineDetails,
        });

        const email = String(customerEmail).trim().toLowerCase();
        const existing = await Customer.findOne({ email });
        if (existing) {
          existing.ordersCount += 1;
          existing.spend += amount;
          await existing.save();
        } else {
          const colors = ['#84a59d', '#f6bd60', '#f5cac3', '#a78bfa'];
          const color = colors[Math.abs(hashCode(email)) % colors.length];
          await Customer.create({
            name: String(customerName).trim(),
            email,
            color,
            ordersCount: 1,
            spend: amount,
          });
        }
      } catch (err) {
        for (const line of rolledBack.reverse()) {
          await Product.updateOne({ _id: line.productId }, { $inc: { stock: line.qty } });
        }
        console.error(err);
        return res.status(500).json({ error: 'Order failed' });
      }

      res.status(201).json({ id: orderId, amount, status: 'pending', date });
    } catch (e) {
      next(e);
    }
  });

  return r;
}
