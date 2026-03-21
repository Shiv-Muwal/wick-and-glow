import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getStockCap } from '../utils/stock';

const STORAGE_KEY = 'wickglow_cart';
const LEGACY_CART_KEY = 'lumiere_cart';

function readStoredCart() {
  try {
    const cur = localStorage.getItem(STORAGE_KEY);
    if (cur) return JSON.parse(cur);
    const leg = localStorage.getItem(LEGACY_CART_KEY);
    if (leg) {
      localStorage.setItem(STORAGE_KEY, leg);
      return JSON.parse(leg);
    }
  } catch {
    /* ignore */
  }
  return [];
}

const CartContext = createContext(null);

/** Phase 1: guest cart in localStorage. Phase 2: server cart + login-only flows. */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readStoredCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  const refreshCart = useCallback(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      setCart([]);
    }
  }, []);

  const addToCart = (product, qty = 1) => {
    const cap = getStockCap(product);
    if (cap <= 0) return false;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const current = existing?.qty || 0;
      const merged = { ...product, qty: Math.min(current + qty, cap) };
      if (existing) {
        return prev.map((i) => (i.id === product.id ? merged : i));
      }
      return [...prev, { ...merged, qty: Math.min(qty, cap) }];
    });
    return true;
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const cap = getStockCap(item);
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(newQty, cap) } : i));
    });
  };

  const setLineQty = (id, qty) => {
    const q = Math.max(0, parseInt(qty, 10) || 0);
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const cap = getStockCap(item);
      if (q <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(q, cap) } : i));
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + parseInt(i.price, 10) * i.qty, 0);

  const value = useMemo(
    () => ({
      cart,
      cartLoading: false,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      changeQty,
      setLineQty,
      clearCart,
      refreshCart,
    }),
    [cart, cartCount, cartTotal, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

/*
 * =============================================================================
 * PHASE 2 — CartProvider ka purana version (comment mein rakha: remove nahi kiya)
 * Server cart: GET/POST/PATCH/DELETE `/api/cart`, JWT required.
 * `addToCart` bina user ke `/login` redirect + `'redirect'` return.
 * =============================================================================
 *
 * import {
 *   createContext, useContext, useState, useEffect, useMemo, useCallback,
 * } from 'react';
 * import { useNavigate, useLocation } from 'react-router-dom';
 * import { useAuth } from './AuthContext';
 * import {
 *   fetchCart, addCartItem, updateCartItem, removeCartItem,
 * } from '../services/api.js';
 * import { getStockCap } from '../utils/stock';
 *
 * const CartContext = createContext(null);
 *
 * export function CartProvider({ children }) {
 *   const [cart, setCart] = useState([]);
 *   const [cartLoading, setCartLoading] = useState(false);
 *   const { user, ready } = useAuth();
 *   const navigate = useNavigate();
 *   const location = useLocation();
 *
 *   const refreshCart = useCallback(async () => {
 *     if (!user) {
 *       setCart([]);
 *       setCartLoading(false);
 *       return;
 *     }
 *     setCartLoading(true);
 *     try {
 *       const data = await fetchCart();
 *       setCart(Array.isArray(data.items) ? data.items : []);
 *     } catch {
 *       setCart([]);
 *     } finally {
 *       setCartLoading(false);
 *     }
 *   }, [user]);
 *
 *   useEffect(() => {
 *     if (!ready) return;
 *     refreshCart();
 *   }, [ready, user?.id, refreshCart]);
 *
 *   // Returns Promise<true | false | 'redirect'>
 *   const addToCart = async (product, qty = 1) => {
 *     if (!user) {
 *       navigate('/login', { state: { from: location }, replace: false });
 *       return 'redirect';
 *     }
 *     const cap = getStockCap(product);
 *     if (cap <= 0) return false;
 *     const q = Math.min(Math.max(1, qty), cap);
 *     try {
 *       await addCartItem(product.id, q);
 *       await refreshCart();
 *       return true;
 *     } catch {
 *       return false;
 *     }
 *   };
 *
 *   const removeFromCart = async (id) => {
 *     if (!user) return;
 *     try {
 *       await removeCartItem(id);
 *       await refreshCart();
 *     } catch {
 *       // ignore
 *     }
 *   };
 *
 *   const changeQty = async (id, delta) => {
 *     if (!user) return;
 *     const item = cart.find((i) => i.id === id);
 *     if (!item) return;
 *     const cap = getStockCap(item);
 *     const next = item.qty + delta;
 *     try {
 *       if (next <= 0) await removeCartItem(id);
 *       else await updateCartItem(id, Math.min(next, cap));
 *       await refreshCart();
 *     } catch {
 *       // ignore
 *     }
 *   };
 *
 *   const setLineQty = async (id, qty) => { ... same pattern with updateCartItem ... };
 *   const clearCartLocal = () => setCart([]);
 *   // value: { cart, cartLoading, cartCount, cartTotal, addToCart, removeFromCart, changeQty, setLineQty, clearCart: clearCartLocal, refreshCart }
 * }
 *
 * =============================================================================
 * PHASE 2 checkout: `postOrder` mein `items` mat bhejo — backend server cart se banata hai.
 * =============================================================================
 */
