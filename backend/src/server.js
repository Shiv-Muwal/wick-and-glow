import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongo } from './config/mongoose.js';
import { seedIfEmpty } from './seed/seedDatabase.js';
import { publicRouter } from './routes/public.js';
import { authRoutes } from './routes/auth.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { orderRoutes } from './routes/order.routes.js';
import { adminRouter } from './routes/admin.js';
import { adminAuth } from './middleware/adminAuth.js';
import { configureCloudinary } from './lib/cloudinary.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wicknglow';

const cloudinaryReady = configureCloudinary();

const app = express();

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (/^http:\/\/localhost:(5173|5174)$/.test(origin)) return cb(null, true);
      cb(null, true);
    },
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
