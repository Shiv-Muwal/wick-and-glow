import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initialAdminState } from './adminState';
import {
  fetchAdminState,
  patchOrderStatus,
  restockProductApi,
  postCouponApi,
  patchCouponApi,
  deleteCouponApi,
  patchBlogApi,
  deleteBlogApi,
} from './api/client.js';

const AdminContext = createContext(null);

const dataFallback = {
  products: initialAdminState.products,
  orders: initialAdminState.orders,
  customers: initialAdminState.customers,
  blogs: initialAdminState.blogs,
  coupons: initialAdminState.coupons,
};

export function AdminProvider({ children }) {
  const [state, setState] = useState({
    theme: 'light',
    sidebarCollapsed: false,
    ...dataFallback,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refreshState = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminState();
      setState((s) => ({
        ...s,
        products: data.products,
        orders: data.orders,
        customers: data.customers,
        blogs: data.blogs,
        coupons: data.coupons,
      }));
      setLoadError(null);
    } catch (e) {
      console.error(e);
      setLoadError(e.message || 'Could not load admin data');
      setState((s) => ({
        ...s,
        ...dataFallback,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const setTheme = useCallback((theme) => {
    setState((s) => ({ ...s, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      await patchOrderStatus(id, status);
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const restockProduct = useCallback(async (id, quantity) => {
    try {
      const updated = await restockProductApi(id, quantity);
      setState((s) => ({
        ...s,
        products: s.products.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleCouponActive = useCallback(async (id, nextActive) => {
    try {
      await patchCouponApi(id, { active: nextActive });
      setState((s) => ({
        ...s,
        coupons: s.coupons.map((c) => (c.id === id ? { ...c, active: nextActive } : c)),
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteCoupon = useCallback(async (id) => {
    try {
      await deleteCouponApi(id);
      setState((s) => ({
        ...s,
        coupons: s.coupons.filter((c) => c.id !== id),
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addCoupon = useCallback(async (couponData) => {
    const code = couponData?.code?.trim()?.toUpperCase();
    const discountValue = Number(couponData?.discount);
    const discount =
      Number.isFinite(discountValue) && discountValue > 0 ? discountValue : 10;
    const expiry =
      couponData?.expiry?.trim() ||
      new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    if (!code) return;
    try {
      const created = await postCouponApi({ code, discount, expiry });
      setState((s) => ({
        ...s,
        coupons: [...s.coupons, created],
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const toggleBlogPublished = useCallback(async (id, published) => {
    try {
      const updated = await patchBlogApi(id, { published });
      setState((s) => ({
        ...s,
        blogs: s.blogs.map((x) => (x.id === id ? { ...x, ...updated } : x)),
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const removeBlog = useCallback(async (id) => {
    try {
      await deleteBlogApi(id);
      setState((s) => ({
        ...s,
        blogs: s.blogs.filter((x) => x.id !== id),
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      loading,
      loadError,
      refreshState,
      setTheme,
      toggleTheme,
      updateOrderStatus,
      restockProduct,
      toggleCouponActive,
      deleteCoupon,
      addCoupon,
      toggleBlogPublished,
      removeBlog,
    }),
    [
      state,
      loading,
      loadError,
      refreshState,
      setTheme,
      toggleTheme,
      updateOrderStatus,
      restockProduct,
      toggleCouponActive,
      deleteCoupon,
      addCoupon,
      toggleBlogPublished,
      removeBlog,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
