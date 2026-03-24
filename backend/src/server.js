import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { connectMongo } from './config/mongoose.js';
import { seedIfEmpty } from './seed/seedDatabase.js';
import { publicRouter } from './routes/public.js';
import { authRoutes } from './routes/auth.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { orderRoutes } from './routes/order.routes.js';
import { adminRouter } from './routes/admin.js';
import { postAdminLogin } from './routes/adminLogin.js';
import { postAdminChangePassword } from './routes/adminChangePassword.js';
import { adminAuth } from './middleware/adminAuth.js';
import { configureCloudinary } from './lib/cloudinary.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/wicknglow';

const cloudinaryReady = configureCloudinary();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicUploadsRoot = path.join(__dirname, '..', 'public', 'uploads');

const app = express();

/** Behind AWS ALB / NLB or similar — correct `req.ip` and `X-Forwarded-*` headers. */
const trustProxyEnv = process.env.TRUST_PROXY;
if (
  trustProxyEnv === '1' ||
  trustProxyEnv === 'true' ||
  (/^\d+$/.test(String(trustProxyEnv || '')) && Number(trustProxyEnv) > 0)
) {
  const n = trustProxyEnv === '1' || trustProxyEnv === 'true' ? 1 : Number(trustProxyEnv);
  app.set('trust proxy', n);
} else if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

/** Local product images (fallback when Cloudinary fails or is unset) */
app.use('/uploads', express.static(publicUploadsRoot));

const allowedOriginsList = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function corsOrigin(origin, cb) {
  if (!origin) return cb(null, true);
  if (allowedOriginsList.length > 0) {
    return cb(null, allowedOriginsList.includes(origin));
  }
  if (/^http:\/\/localhost:(5173|5174)$/.test(origin)) return cb(null, true);
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[cors] Missing ALLOWED_ORIGINS — refusing browser Origin (set comma-separated storefront + admin URLs)'
    );
    return cb(null, false);
  }
  return cb(null, true);
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '512kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'wicknglow-api', db: 'mongodb' });
});

app.use('/api/auth', authRoutes());
app.use('/api/cart', cartRoutes());
app.use('/api', orderRoutes());
app.use('/api', publicRouter());
app.post('/api/admin/login', postAdminLogin);
app.post('/api/admin/change-password', adminAuth, postAdminChangePassword);
app.use('/api/admin', adminAuth, adminRouter());

app.use(errorMiddleware);

async function main() {
  await connectMongo(MONGODB_URI);
  await seedIfEmpty();
  app.listen(PORT, () => {
    console.log(`Wick & Glow API http://localhost:${PORT}`);
    console.log(`MongoDB: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
    console.log(`Admin key: ${process.env.ADMIN_API_KEY ? 'set' : 'default dev-admin-key'}`);
    console.log(
      cloudinaryReady
        ? 'Cloudinary: configured'
        : 'Cloudinary: not set (image uploads disabled until env vars are added)'
    );
  });
}

function printMongoHelp(uri) {
  const u = uri || '';
  console.error('\n[MongoDB] Could not connect. Fix one of the following:\n');
  if (/127\.0\.0\.1|localhost/.test(u)) {
    console.error(
      '  • Local URI: start MongoDB on this machine (e.g. run `mongod`), or change MONGODB_URI in backend/.env to Atlas.\n'
    );
  }
  if (u.includes('mongodb+srv')) {
    console.error(
      '  • Atlas: MongoDB Atlas → Network Access → add your current IP (or 0.0.0.0/0 for dev only).\n' +
        '    Also confirm database user password and that the URI includes /dbname?…\n'
    );
  }
  console.error('  • Corrupt node_modules: delete backend/node_modules and package-lock.json, then run npm install again.\n');
}

main().catch((e) => {
  if (e?.name === 'MongooseServerSelectionError') {
    console.error(e.message);
    printMongoHelp(MONGODB_URI);
  } else {
    console.error(e);
  }
  process.exit(1);
});
