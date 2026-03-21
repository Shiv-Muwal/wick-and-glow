import mongoose from 'mongoose';
import { Cart, Product } from '../models/index.js';
import { docToStoreProduct } from '../utils/transforms.js';

async function getOrCreateCartDoc(userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  let cart = await Cart.findOne({ userId: uid });
  if (!cart) {
    cart = await Cart.create({ userId: uid, items: [] });
  }
  return cart;
}

function lineFromProduct(p, qty) {
  const base = docToStoreProduct({ ...p, _id: p._id });
  return { ...base, qty };
}

async function buildSummary(userId) {
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();
  const items = [];
  if (!cart?.items?.length) return { items: [], cartCount: 0, cartTotal: 0 };
  for (const row of cart.items) {
    const p = await Product.findById(row.productId).lean();
    if (!p) continue;
    const stock = Number(p.stock) || 0;
    if (stock <= 0) continue;
    const qty = Math.min(row.quantity, stock);
    items.push(lineFromProduct(p, qty));
  }
  const cartCount = items.reduce((s, l) => s + l.qty, 0);
  const cartTotal = items.reduce((s, l) => s + parseInt(l.price, 10) * l.qty, 0);
  return { items, cartCount, cartTotal };
}

/** Merge DB cart with live product data; drop missing products; clamp qty to stock. */
export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCartDoc(req.auth.userId);
    const nextItems = [];
    const lines = [];

    for (const row of cart.items) {
      const p = await Product.findById(row.productId).lean();
      if (!p) continue;
      const stock = Number(p.stock) || 0;
      const qty = Math.min(Math.max(1, row.quantity), Math.max(0, stock));
      if (stock <= 0) continue;
      nextItems.push({ productId: row.productId, quantity: qty });
      lines.push(lineFromProduct(p, qty));
    }

    const prev = cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    if (JSON.stringify(nextItems) !== JSON.stringify(prev)) {
      cart.items = nextItems;
      await cart.save();
    }

    const cartCount = lines.reduce((s, l) => s + l.qty, 0);
    const cartTotal = lines.reduce((s, l) => s + parseInt(l.price, 10) * l.qty, 0);
    res.json({ items: lines, cartCount, cartTotal });
  } catch (e) {
    next(e);
  }
}

export async function addCartItem(req, res, next) {
  try {
    const productId = String(req.body?.productId || req.body?.id || '').trim();
    const addQty = Math.max(1, parseInt(req.body?.quantity ?? req.body?.qty, 10) || 1);
    if (!productId) {
      return res.status(400).json({ error: 'productId required' });
    }

    const p = await Product.findById(productId).lean();
    if (!p) return res.status(404).json({ error: 'Product not found' });
    const stock = Number(p.stock) || 0;
    if (stock <= 0) return res.status(400).json({ error: 'Out of stock' });

    const cart = await getOrCreateCartDoc(req.auth.userId);
    const idx = cart.items.findIndex((i) => i.productId === productId);
    const current = idx >= 0 ? cart.items[idx].quantity : 0;
    const newQty = Math.min(current + addQty, stock);

    if (idx >= 0) cart.items[idx].quantity = newQty;
    else cart.items.push({ productId, quantity: newQty });

    await cart.save();
    const line = lineFromProduct(p, newQty);
    const summary = await buildSummary(req.auth.userId);
    res.status(201).json({ ok: true, item: line, cartCount: summary.cartCount, cartTotal: summary.cartTotal });
  } catch (e) {
    next(e);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const productId = String(req.params.productId || '').trim();
    const qty = parseInt(req.body?.quantity ?? req.body?.qty, 10);
    if (!productId || !Number.isFinite(qty)) {
      return res.status(400).json({ error: 'productId and quantity required' });
    }

    const p = await Product.findById(productId).lean();
    if (!p) return res.status(404).json({ error: 'Product not found' });
    const stock = Number(p.stock) || 0;

    const cart = await getOrCreateCartDoc(req.auth.userId);
    const idx = cart.items.findIndex((i) => i.productId === productId);
    if (idx < 0) return res.status(404).json({ error: 'Item not in cart' });

    if (qty <= 0 || stock <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = Math.min(qty, stock);
    }
    await cart.save();

    const summary = await buildSummary(req.auth.userId);
    res.json({ ok: true, items: summary.items, cartCount: summary.cartCount, cartTotal: summary.cartTotal });
  } catch (e) {
    next(e);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const productId = String(req.params.productId || '').trim();
    const cart = await getOrCreateCartDoc(req.auth.userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();
    const summary = await buildSummary(req.auth.userId);
    res.json({ ok: true, items: summary.items, cartCount: summary.cartCount, cartTotal: summary.cartTotal });
  } catch (e) {
    next(e);
  }
}
