# Wicknglow API

Express API for the Lumière storefront and admin panel. Data lives in **MongoDB** (Mongoose). Product and blog images are stored on **Cloudinary**.

## Prerequisites

- [MongoDB](https://www.mongodb.com/) locally (`mongodb://127.0.0.1:27017/wicknglow`) or [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- [Cloudinary](https://cloudinary.com/) account (free tier is enough) for image uploads

## Setup

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, CLOUDINARY_* , ADMIN_API_KEY
npm install
npm run dev
```

On first connection, if the `products` collection is empty, the server **seeds** demo products, orders, customers, blogs, coupons, and reviews.

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Default `3000` |
| `MONGODB_URI` | e.g. `mongodb://127.0.0.1:27017/wicknglow` or Atlas connection string |
| `ADMIN_API_KEY` | Bearer / `x-api-key` for `/api/admin/*` (default `dev-admin-key` if unset) |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |

If Cloudinary vars are missing, the API still runs; **image upload** routes return `503` until you add them.

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
| POST | `/orders` | Guest checkout |

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
