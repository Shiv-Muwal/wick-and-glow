# Wicknglow API

Express API for the Lumière storefront and admin panel. Data lives in **MongoDB** (Mongoose). Product and blog images are stored on **Cloudinary**.

## Prerequisites

- [MongoDB](https://www.mongodb.com/) locally (`mongodb://127.0.0.1:27017/wicknglow`) or [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- [Cloudinary](https://cloudinary.com/) account (free tier is enough) for image uploads

## Setup

```bash
cd backend
# Create .env here with MONGODB_URI, JWT_SECRET, ADMIN_API_KEY, etc. (see table below)
npm install
npm run dev
```

On first connection, if the `products` collection is empty, the server **seeds** demo products, orders, customers, blogs, coupons, and reviews.

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Default `3000` — set storefront/admin `VITE_API_URL` to the same host:port |
| `MONGODB_URI` | Local or Atlas; include DB name in path, e.g. `.../wicknglow?...` (`MONGO_URI` also read as alias) |
| `JWT_SECRET` | Signs customer JWTs; use a long random string in production |
| `JWT_EXPIRE` | Optional, default `7d` (`jsonwebtoken` `expiresIn` format) |
| `ADMIN_API_KEY` | Bearer / `x-api-key` for `/api/admin/*` (default `dev-admin-key` if unset). Optional if admins use **login JWT** |
| `ADMIN_LOGIN_EMAIL`, `ADMIN_LOGIN_PASSWORD` | `POST /api/admin/login` — returns JWT (`role: admin`, 7d). Admin UI stores it and sends `Authorization: Bearer <jwt>` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | Nodemailer (e.g. Gmail + [App Password](https://support.google.com/accounts/answer/185833)); required to send **newsletter welcome** emails |
| `EMAIL_FROM` | Optional `From` header, e.g. `Wick & Glow <you@gmail.com>` |
| `NEWSLETTER_WELCOME_CODE` | Optional coupon code text in the welcome email body |

If Cloudinary vars are missing, the API still runs; **image upload** routes return `503` until you add them.

Newsletter `POST /api/newsletter` still saves subscribers without email vars; the response includes `emailSent: false` until SMTP is configured.

## Auth (store customers)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | `email`, `password` (min 8), `firstName`, `lastName` | Creates account, returns `{ token, user }` |
| POST | `/api/auth/login` | `email`, `password` | Returns `{ token, user }` |
| GET | `/api/auth/me` | Header `Authorization: Bearer <token>` | Returns `{ user }` |

Set a strong `JWT_SECRET` in `.env` for production.

## Public API (`/api`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health + `db: mongodb` |
| GET | `/products` | List (optional: `search`, `category`, `fragrance`, `maxPrice`) — includes `imageUrl` when set |
| GET | `/products/:id` | Single product |
| GET | `/blogs` | Published posts — includes `coverImageUrl` when set |
| POST | `/coupons/validate` | `{ "code" }` |
| POST | `/contact` | Contact form |
| POST | `/newsletter` | `{ "email" }` |
| POST | `/orders` | Full checkout (see below). Optional `Authorization: Bearer` links order to signed-in user. |
| GET | `/orders/my` | **Auth required** — orders placed while logged in |
| GET | `/orders/:orderId` | **Auth required** — single order (owner only) |

**`POST /orders` body:** `customerName`, `customerEmail`, `phone` (10 digits), `shippingAddress` (`line1`, `line2?`, `city`, `state`, `pincode` 6 digits), `items` (`productId`, `qty`), optional `couponCode`, `paymentMethod` (`cod` only for now). Totals: item subtotal → coupon % off → **₹49 shipping** (waived if discounted subtotal ≥ ₹1000).

## Admin API (`/api/admin`)

Header: `Authorization: Bearer <ADMIN_API_KEY>` or `x-api-key`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/state` | Snapshot: products (with `imageUrl`, `cloudinaryPublicId`), orders, customers, blogs (`coverImageUrl`), coupons |
| GET | `/reviews` | Reviews |
| POST | `/products/:id/image` | Multipart field **`file`** — uploads to Cloudinary, updates product |
| POST | `/blogs/:id/cover` | Multipart **`file`** — blog cover image |
| PATCH | `/products/:id` | JSON; `clearImage: true` removes image + deletes Cloudinary asset |
| PATCH | `/blogs/:id` | JSON; `clearCover: true` removes cover + deletes asset |
| DELETE | `/products/:id` | Deletes product; removes Cloudinary image if present |
| DELETE | `/blogs/:id` | Deletes blog; removes cover from Cloudinary if present |
| … | (rest) | Same as before: orders, restock, coupons CRUD, blogs CRUD |

## Frontends

- `frontend/.env` — `VITE_API_URL=http://localhost:3000`
- `admin/.env` — `VITE_API_URL`, `VITE_ADMIN_API_KEY` (match server `ADMIN_API_KEY`)

Admin **Products** table: **Upload image** per row (Cloudinary). **Blogs**: **Cover** upload per card.

## Removed

SQLite (`better-sqlite3`) and `data/wicknglow.db` are no longer used.
