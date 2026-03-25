import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { absoluteBaseForRequest } from './publicUrl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** backend/public/uploads/products */
const PRODUCTS_UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'products');

const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Save image buffer to disk and return an absolute URL the browser can load.
 * @param {Buffer} buffer
 * @param {string} productId
 * @param {string} mimetype
 * @param {import('express').Request} req
 */
export async function saveProductImageToDisk(buffer, productId, mimetype, req) {
  await fs.mkdir(PRODUCTS_UPLOAD_DIR, { recursive: true });
  const ext = MIME_EXT[(mimetype || '').toLowerCase()] || 'jpg';
  const safeId = String(productId).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 64);
  const filename = `${safeId}-${Date.now()}.${ext}`;
  const filepath = path.join(PRODUCTS_UPLOAD_DIR, filename);
  await fs.writeFile(filepath, buffer);

  const base = absoluteBaseForRequest(req);
  return `${base}/uploads/products/${filename}`;
}
