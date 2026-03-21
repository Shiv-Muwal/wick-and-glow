import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import { Product, Coupon, Order, Customer, Cart, User } from '../models/index.js';
import { hashCode } from '../utils/hash.js';

function orderToClient(o) {
  return {
    id: o._id,
    date: o.date,
    status: o.status,
    amount: o.amount,
    productLabel: o.productLabel,
    items: o.items || [],
    subtotal: o.subtotal ?? 0,
    discountPercent: o.discountPercent ?? 0,
    discountAmount: o.discountAmount ?? 0,
    shippingFee: o.shippingFee ?? 0,
    paymentMethod: o.paymentMethod || 'cod',
    phone: o.phone || '',
    shippingAddress: o.shippingAddress || null,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
  };
}

export async function listMyOrders(req, res, next) {
  try {
    const uid = new mongoose.Types.ObjectId(req.auth.userId);
    const rows = await Order.find({ userId: uid }).sort({ date: -1 }).lean();
    res.json(rows.map(orderToClient));
  } catch (e) {
    next(e);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const o = await Order.findById(req.params.orderId).lean();
    if (!o) return res.status(404).json({ error: 'Order not found' });
    const uid = String(req.auth.userId);
    if (!o.userId || String(o.userId) !== uid) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.json(orderToClient(o));
  } catch (e) {
    next(e);
  }
}

export async function lookupOrder(req, res, next) {
  try {
    let orderId = String(req.body?.orderId || '').trim();
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }
    if (!orderId.startsWith('#')) orderId = `#${orderId.replace(/^#+/, '')}`;
    const o = await Order.findById(orderId).lean();
    if (!o || o.customerEmail !== email) {
      return res.status(404).json({ error: 'No order found for this email and order ID' });
    }
    res.json({
      id: o._id,
      date: o.date,
      status: o.status,
      amount: o.amount,
      productLabel: o.productLabel,
      paymentMethod: o.paymentMethod || 'cod',
      itemCount: (o.items || []).reduce((s, i) => s + (i.qty || 0), 0),
      city: o.shippingAddress?.city || '',
      state: o.shippingAddress?.state || '',
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Phase 1: guest checkout — `items` from client. Optional JWT links order to user and clears server cart.
 */
export async function createOrder(req, res, next) {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      items,
      couponCode,
      paymentMethod,
    } = req.body || {};

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    const addr = shippingAddress || {};
    const line1 = String(addr.line1 || '').trim();
    const city = String(addr.city || '').trim();
    const state = String(addr.state || '').trim();
    const pincode = String(addr.pincode || '').trim();
    if (!line1 || !city || !state || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        error: 'Valid shipping address required (line1, city, state, 6-digit pincode)',
      });
    }
    const phoneStr = String(phone || '').trim();
    if (!/^\d{10}$/.test(phoneStr.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
    }
    const phoneClean = phoneStr.replace(/\D/g, '').slice(-10);

    const pm = String(paymentMethod || 'cod').toLowerCase();
    if (pm !== 'cod') {
      return res.status(400).json({ error: 'Only Cash on Delivery (COD) is available right now' });
    }

    const emailNorm = String(customerEmail).trim().toLowerCase();
    const storeUserId = req.storeUserId || null;
    const storeUserEmail = req.storeUserEmail || null;

    if (storeUserId && storeUserEmail && emailNorm !== storeUserEmail) {
      return res.status(403).json({ error: 'Use the email on your signed-in account' });
    }
    if (storeUserId) {
      const u = await User.findById(storeUserId).lean();
      if (!u) return res.status(401).json({ error: 'Invalid session' });
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

    subtotal = Math.round(subtotal);

    let discountPct = 0;
    if (couponCode) {
      const code = String(couponCode).trim().toUpperCase();
      const c = await Coupon.findOne({ code });
      if (c && c.active) {
        const exp = c.expiry ? new Date(c.expiry + 'T23:59:59') : null;
        if (!exp || exp >= new Date()) discountPct = c.discount;
      }
    }

    const discountAmount = Math.round((subtotal * discountPct) / 100);
    const afterDiscount = subtotal - discountAmount;
    const shippingFee = afterDiscount >= 1000 ? 0 : 49;
    const amount = afterDiscount + shippingFee;

    const orderId = `#ORD-${nanoid(8).toUpperCase()}`;
    const date = new Date().toISOString().slice(0, 10);
    const productLabel =
      lineDetails.length === 1
        ? lineDetails[0].name
        : `${lineDetails.length} items (${lineDetails[0].name})`;

    const shipDoc = {
      line1,
      line2: String(addr.line2 || '').trim(),
      city,
      state,
      pincode,
    };

    const userIdForOrder = storeUserId ? new mongoose.Types.ObjectId(storeUserId) : null;

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
        userId: userIdForOrder,
        customerName: String(customerName).trim(),
        customerEmail: emailNorm,
        phone: phoneClean,
        shippingAddress: shipDoc,
        productLabel,
        subtotal,
        discountPercent: discountPct,
        discountAmount,
        shippingFee,
        amount,
        paymentMethod: 'cod',
        status: 'pending',
        date,
        items: lineDetails,
      });

      if (storeUserId) {
        const uid = new mongoose.Types.ObjectId(storeUserId);
        await Cart.updateOne(
          { userId: uid },
          { $set: { items: [] }, $setOnInsert: { userId: uid } },
          { upsert: true }
        );
      }

      const existing = await Customer.findOne({ email: emailNorm });
      if (existing) {
        existing.ordersCount += 1;
        existing.spend += amount;
        await existing.save();
      } else {
        const colors = ['#84a59d', '#f6bd60', '#f5cac3', '#a78bfa'];
        const color = colors[Math.abs(hashCode(emailNorm)) % colors.length];
        await Customer.create({
          name: String(customerName).trim(),
          email: emailNorm,
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

    res.status(201).json({
      id: orderId,
      amount,
      status: 'pending',
      date,
      subtotal,
      discountPercent: discountPct,
      discountAmount,
      shippingFee,
      paymentMethod: 'cod',
      items: lineDetails,
      shippingAddress: shipDoc,
      phone: phoneClean,
      customerName: String(customerName).trim(),
      customerEmail: emailNorm,
    });
  } catch (e) {
    next(e);
  }
}
