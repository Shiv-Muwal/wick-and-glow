import { Product } from '../models/index.js';
import { docToStoreProduct } from '../utils/transforms.js';

export async function listProducts(req, res, next) {
  try {
    const { search, category, fragrance, maxPrice } = req.query;
    const q = {};
    if (search) {
      const t = String(search);
      q.$or = [{ name: new RegExp(t, 'i') }, { fragrance: new RegExp(t, 'i') }];
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
}

export async function getProduct(req, res, next) {
  try {
    const row = await Product.findById(req.params.id).lean();
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(docToStoreProduct({ ...row, _id: row._id }));
  } catch (e) {
    next(e);
  }
}
