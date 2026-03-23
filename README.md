# Wick & Glow — Full-stack candle eCommerce

React (Vite) + Tailwind storefront, Node.js + Express + MongoDB (Mongoose) API, JWT auth, and COD checkout.

### Product phases

- **Phase 1 (current):** Guest checkout — cart in **`localStorage`** (`wickglow_cart`, migrates from legacy `lumiere_cart`), order form posts **`items`** + address; **no login required** for cart or checkout.
- **Phase 2 (planned):** Login/signup required for cart, **MongoDB cart** (`/api/cart`), and full **order history** tied to the account. Backend cart routes and dashboard APIs are already there for when you wire Phase 2.

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

## Environment variables

### Backend (`backend/.env`)

Create `backend/.env` in that folder and set real values (file is gitignored):

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Local or Atlas, e.g. `mongodb://127.0.0.1:27017/wicknglow` or `.../wicknglow?...` (`MONGO_URI` also works) |
| `JWT_SECRET` | Long random string for signing user tokens |
| `PORT` | API port (default `3000`) |
| `ADMIN_API_KEY` | Admin panel API key (optional in dev) |
| Cloudinary vars | Optional; for admin image uploads |

### Admin (`admin/.env` optional)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Same as API, e.g. `http://localhost:3000` |
| `VITE_ADMIN_API_KEY` | Must match backend `ADMIN_API_KEY` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL, e.g. `http://localhost:3000` |

## Run the project

**1. MongoDB** — start your database.

**2. API**

```bash
cd backend
npm install
# set .env (at least MONGODB_URI + JWT_SECRET)
npm run dev
```

On first run with an empty database, sample **products**, **orders** (admin demo), **coupons**, and a demo user are seeded:

- Email: `demo@wicknglow.com`  
- Password: `demo12345`

**3. Storefront**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies or uses `VITE_API_URL` for API calls.

## Architecture

### Backend (`backend/src`)

- `config/` — Mongo connection
- `controllers/` — Auth, products, cart, orders
- `middleware/` — `authMiddleware` (JWT), `errorMiddleware`, admin auth
- `models/` — User, Cart, Product, Order, etc.
- `routes/` — `auth.routes`, `cart.routes`, `order.routes`, `public.js`, `admin.js`

### Frontend (`frontend/src`)

- `services/api.js` — Axios instance, token in `localStorage` (`wickglow_auth_token`)
- `context/` — `AuthContext`, `CartContext` (syncs with `/api/cart` when logged in)
- `components/` — `ProtectedRoute` guards `/cart` and `/checkout`
- `pages/` — Home, Shop, product detail, **Cart**, **Checkout**, **Login/Signup**, **Dashboard** (`/account` and `/dashboard`)

## Business rules (Phase 1)

- **Cart** lives in the browser (`localStorage`); anyone can add items and open **/cart** and **/checkout**.
- **Orders** are created with **`POST /api/orders`** using **`items`** from the client; **`optionalUserAuth`** attaches **`userId`** when a JWT is sent (signed-in checkout uses account email).
- **Stock** is validated and decremented on the server.
- **Login** is optional for shopping; **dashboard** (`/account`, `/dashboard`) and **`GET /api/orders/my`** are for signed-in users (Phase 2–style history when `userId` is set on orders).

## Admin panel

Separate Vite app under `admin/` — calls `/api/admin` with `Authorization: Bearer <ADMIN_API_KEY>` (or header `x-api-key`). Set `VITE_ADMIN_API_KEY` to the same value as `ADMIN_API_KEY` in `backend/.env`.

## API quick reference

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/auth/me` | JWT |
| POST | `/api/auth/change-password` | JWT |
| GET | `/api/cart` | JWT |
| POST | `/api/cart/items` | JWT |
| PATCH | `/api/cart/items/:productId` | JWT |
| DELETE | `/api/cart/items/:productId` | JWT |
| POST | `/api/orders` | JWT |
| GET | `/api/orders/my` | JWT |
| GET | `/api/products` | — |
