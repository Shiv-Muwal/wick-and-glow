import { normalizeMediaUrl } from '../lib/publicUrl.js';

export function docToStoreProduct(doc) {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  const id = String(o._id);
  return {
    id,
    name: o.name,
    category: o.category,
    fragrance: o.fragrance,
    price: String(Math.round(o.price)),
    originalPrice:
      o.originalPrice != null ? String(Math.round(o.originalPrice)) : undefined,
    emoji: o.emoji,
    imageClass: o.imageClass || '',
    imageUrl: normalizeMediaUrl(o.imageUrl || ''),
    badge: o.badge || '',
    desc: o.description,
    color: o.galleryColor || '#f5cac3',
    stock: o.stock,
  };
}

export function docToAdminProduct(doc) {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(o._id),
    name: o.name,
    price: Math.round(o.price),
    category: o.category,
    fragrance: o.fragrance,
    stock: o.stock,
    description: o.description,
    emoji: o.emoji,
    imageUrl: normalizeMediaUrl(o.imageUrl || ''),
    cloudinaryPublicId: o.cloudinaryPublicId || '',
  };
}

export function formatBlogDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}
