import { Router } from 'express';
import multer from 'multer';
import {
  Product,
  Order,
  Customer,
  Blog,
  Coupon,
  Review,
} from '../models/index.js';
import { docToAdminProduct, docToStoreProduct } from '../utils/transforms.js';
import { uploadBuffer, destroyAsset, isCloudinaryConfigured } from '../lib/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WebP, or GIF images are allowed'));
    }
    cb(null, true);
  },
});

export function adminRouter() {
  const r = Router();

  r.get('/state', async (_req, res, next) => {
    try {
      const products = await Product.find().sort({ name: 1 });
      const orders = await Order.find().sort({ date: -1 }).lean();
      const customers = await Customer.find().sort({ spend: -1 }).lean();
      const blogs = await Blog.find().sort({ date: -1 }).lean();
      const coupons = await Coupon.find().sort({ code: 1 }).lean();

      res.json({
        products: products.map((p) => docToAdminProduct(p)),
        orders: orders.map((o) => ({
          id: o._id,
          customer: o.customerName,
          product: o.productLabel,
          amount: o.amount,
          status: o.status,
          date: o.date,
        })),
        customers: customers.map((c) => ({
          id: String(c._id),
          name: c.name,
          email: c.email,
          orders: c.ordersCount,
          spend: c.spend,
          color: c.color,
        })),
        blogs: blogs.map((b) => ({
          id: String(b._id),
          title: b.title,
          date: b.date,
          published: !!b.published,
          excerpt: b.excerpt,
          emoji: b.emoji,
          tag: b.tag,
          coverImageUrl: b.coverImageUrl || '',
        })),
        coupons: coupons.map((c) => ({
          id: String(c._id),
          code: c.code,
          discount: c.discount,
          expiry: c.expiry,
          active: !!c.active,
        })),
      });
    } catch (e) {
      next(e);
    }
  });

  r.get('/reviews', async (_req, res, next) => {
    try {
      const rows = await Review.find().sort({ _id: -1 }).lean();
      res.json(
        rows.map((x) => ({
          id: String(x._id),
          initials: x.initials,
          name: x.customerName,
          bg: x.avatarColor,
          stars: '★'.repeat(x.rating) + '☆'.repeat(5 - x.rating),
          date: x.reviewDate,
          text: x.body,
        }))
      );
    } catch (e) {
      next(e);
    }
  });

  r.patch('/orders/:id', async (req, res, next) => {
    try {
      const { status } = req.body || {};
      if (!status) return res.status(400).json({ error: 'status required' });
      const o = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!o) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  r.post('/products/:id/restock', async (req, res, next) => {
    try {
      const qty = Number(req.body?.quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ error: 'Positive quantity required' });
      }
      const p = await Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { stock: qty } },
        { new: true }
      );
      if (!p) return res.status(404).json({ error: 'Not found' });
      res.json(docToAdminProduct(p));
    } catch (e) {
      next(e);
    }
  });

  r.post(
    '/products/:id/image',
    (req, res, next) => {
      upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
        next();
      });
    },
    async (req, res, next) => {
      try {
        if (!isCloudinaryConfigured()) {
          return res.status(503).json({ error: 'Cloudinary is not configured' });
        }
        if (!req.file?.buffer) {
          return res.status(400).json({ error: 'file field required (multipart)' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Not found' });
        if (product.cloudinaryPublicId) {
          await destroyAsset(product.cloudinaryPublicId);
        }
        const result = await uploadBuffer(req.file.buffer, { folder: 'wicknglow/products' });
        product.imageUrl = result.secure_url;
        product.cloudinaryPublicId = result.public_id;
        await product.save();
        res.json({
          imageUrl: product.imageUrl,
          cloudinaryPublicId: product.cloudinaryPublicId,
          product: docToAdminProduct(product),
        });
      } catch (e) {
        next(e);
      }
    }
  );

  r.post(
    '/blogs/:id/cover',
    (req, res, next) => {
      upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
        next();
      });
    },
    async (req, res, next) => {
      try {
        if (!isCloudinaryConfigured()) {
          return res.status(503).json({ error: 'Cloudinary is not configured' });
        }
        if (!req.file?.buffer) {
          return res.status(400).json({ error: 'file field required' });
        }
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Not found' });
        if (blog.coverCloudinaryPublicId) {
          await destroyAsset(blog.coverCloudinaryPublicId);
        }
        const result = await uploadBuffer(req.file.buffer, { folder: 'wicknglow/blogs' });
        blog.coverImageUrl = result.secure_url;
        blog.coverCloudinaryPublicId = result.public_id;
        await blog.save();
        res.json({
          coverImageUrl: blog.coverImageUrl,
          coverCloudinaryPublicId: blog.coverCloudinaryPublicId,
        });
      } catch (e) {
        next(e);
      }
    }
  );

  r.post('/products', async (req, res, next) => {
    try {
      const b = req.body || {};
      const id = String(b.id || '').trim() || `p-${Date.now()}`;
      const name = String(b.name || '').trim();
      if (!name) return res.status(400).json({ error: 'name required' });
      const price = Number(b.price);
      const stock = Number(b.stock ?? 0);
      if (!Number.isFinite(price)) return res.status(400).json({ error: 'valid price required' });

      try {
        await Product.create({
          _id: id,
          name,
          price,
          originalPrice: b.originalPrice != null ? Number(b.originalPrice) : undefined,
          category: String(b.category || 'Floral'),
          fragrance: String(b.fragrance || ''),
          emoji: String(b.emoji || '🕯️'),
          imageClass: b.imageClass || 'bg-[linear-gradient(135deg,#f5cac3,#f7ede2)]',
          imageUrl: b.imageUrl ? String(b.imageUrl) : '',
          cloudinaryPublicId: b.cloudinaryPublicId ? String(b.cloudinaryPublicId) : '',
          badge: b.badge || '',
          description: String(b.description || b.desc || ''),
          galleryColor: b.color || b.galleryColor || '#f5cac3',
          stock: Number.isFinite(stock) ? stock : 0,
        });
      } catch (e) {
        if (e.code === 11000) return res.status(409).json({ error: 'Product id already exists' });
        throw e;
      }
      const row = await Product.findById(id);
      res.status(201).json(docToAdminProduct(row));
    } catch (e) {
      next(e);
    }
  });

  r.patch('/products/:id', async (req, res, next) => {
    try {
      const p = await Product.findById(req.params.id);
      if (!p) return res.status(404).json({ error: 'Not found' });
      const b = req.body || {};
      if (b.name != null) p.name = String(b.name);
      if (b.price != null) p.price = Number(b.price);
      if (b.originalPrice != null) p.originalPrice = Number(b.originalPrice);
      if (b.category != null) p.category = String(b.category);
      if (b.fragrance != null) p.fragrance = String(b.fragrance);
      if (b.emoji != null) p.emoji = String(b.emoji);
      if (b.imageClass != null) p.imageClass = String(b.imageClass);
      if (b.badge !== undefined) p.badge = b.badge || '';
      if (b.description != null) p.description = String(b.description);
      if (b.desc != null) p.description = String(b.desc);
      if (b.color != null) p.galleryColor = String(b.color);
      if (b.galleryColor != null) p.galleryColor = String(b.galleryColor);
      if (b.stock != null) p.stock = Number(b.stock);
      if (b.imageUrl !== undefined) p.imageUrl = String(b.imageUrl || '');
      if (b.cloudinaryPublicId !== undefined) {
        p.cloudinaryPublicId = String(b.cloudinaryPublicId || '');
      }
      if (b.clearImage === true) {
        if (p.cloudinaryPublicId) await destroyAsset(p.cloudinaryPublicId);
        p.imageUrl = '';
        p.cloudinaryPublicId = '';
      }
      await p.save();
      res.json(docToAdminProduct(p));
    } catch (e) {
      next(e);
    }
  });

  r.delete('/products/:id', async (req, res, next) => {
    try {
      const p = await Product.findByIdAndDelete(req.params.id);
      if (!p) return res.status(404).json({ error: 'Not found' });
      if (p.cloudinaryPublicId) await destroyAsset(p.cloudinaryPublicId);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  r.post('/coupons', async (req, res, next) => {
    try {
      const b = req.body || {};
      const code = String(b.code || '')
        .trim()
        .toUpperCase();
      const discount = Number(b.discount);
      if (!code || !Number.isFinite(discount) || discount <= 0) {
        return res.status(400).json({ error: 'code and discount required' });
      }
      const expiry =
        b.expiry?.trim() ||
        new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
      let row;
      try {
        row = await Coupon.create({
          code,
          discount: Math.min(100, Math.round(discount)),
          expiry,
          active: true,
        });
      } catch (e) {
        if (e.code === 11000) return res.status(409).json({ error: 'Code already exists' });
        throw e;
      }
      res.status(201).json({
        id: String(row._id),
        code: row.code,
        discount: row.discount,
        expiry: row.expiry,
        active: !!row.active,
      });
    } catch (e) {
      next(e);
    }
  });

  r.patch('/coupons/:id', async (req, res, next) => {
    try {
      const c = await Coupon.findById(req.params.id);
      if (!c) return res.status(404).json({ error: 'Not found' });
      if (req.body?.active !== undefined) c.active = !!req.body.active;
      if (req.body?.discount != null) {
        c.discount = Math.min(100, Math.round(Number(req.body.discount)));
      }
      if (req.body?.expiry != null) c.expiry = String(req.body.expiry).trim();
      await c.save();
      res.json({
        id: String(c._id),
        code: c.code,
        discount: c.discount,
        expiry: c.expiry,
        active: !!c.active,
      });
    } catch (e) {
      next(e);
    }
  });

  r.delete('/coupons/:id', async (req, res, next) => {
    try {
      const c = await Coupon.findByIdAndDelete(req.params.id);
      if (!c) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  r.post('/blogs', async (req, res, next) => {
    try {
      const b = req.body || {};
      const title = String(b.title || '').trim();
      if (!title) return res.status(400).json({ error: 'title required' });
      const row = await Blog.create({
        title,
        date: b.date?.trim() || new Date().toISOString().slice(0, 10),
        published: !!b.published,
        excerpt: String(b.excerpt || '').trim(),
        emoji: String(b.emoji || '🕯️'),
        tag: b.tag ? String(b.tag) : 'Journal',
        content: b.content ? String(b.content) : undefined,
      });
      res.status(201).json({
        id: String(row._id),
        title: row.title,
        date: row.date,
        published: !!row.published,
        excerpt: row.excerpt,
        emoji: row.emoji,
        tag: row.tag,
      });
    } catch (e) {
      next(e);
    }
  });

  r.patch('/blogs/:id', async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: 'Not found' });
      const b = req.body || {};
      if (b.title != null) blog.title = String(b.title);
      if (b.date != null) blog.date = String(b.date);
      if (b.published !== undefined) blog.published = !!b.published;
      if (b.excerpt != null) blog.excerpt = String(b.excerpt);
      if (b.emoji != null) blog.emoji = String(b.emoji);
      if (b.tag != null) blog.tag = String(b.tag);
      if (b.content !== undefined) blog.content = b.content;
      if (b.coverImageUrl !== undefined) blog.coverImageUrl = String(b.coverImageUrl || '');
      if (b.clearCover === true) {
        if (blog.coverCloudinaryPublicId) await destroyAsset(blog.coverCloudinaryPublicId);
        blog.coverImageUrl = '';
        blog.coverCloudinaryPublicId = '';
      }
      await blog.save();
      res.json({
        id: String(blog._id),
        title: blog.title,
        date: blog.date,
        published: !!blog.published,
        excerpt: blog.excerpt,
        emoji: blog.emoji,
        tag: blog.tag,
        coverImageUrl: blog.coverImageUrl || '',
      });
    } catch (e) {
      next(e);
    }
  });

  r.delete('/blogs/:id', async (req, res, next) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) return res.status(404).json({ error: 'Not found' });
      if (blog.coverCloudinaryPublicId) await destroyAsset(blog.coverCloudinaryPublicId);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  r.get('/export/products', async (_req, res, next) => {
    try {
      const rows = await Product.find().lean();
      res.json(rows.map((row) => docToStoreProduct({ ...row, _id: row._id })));
    } catch (e) {
      next(e);
    }
  });

  return r;
}
