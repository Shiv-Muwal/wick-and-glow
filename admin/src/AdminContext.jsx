import React, { createContext, useContext, useMemo, useState } from 'react';
import { initialAdminState } from './adminState';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [state, setState] = useState(initialAdminState);

  const value = useMemo(
    () => ({
      state,
      setTheme: (theme) =>
        setState((s) => ({
          ...s,
          theme,
        })),
      toggleTheme: () =>
        setState((s) => ({
          ...s,
          theme: s.theme === 'light' ? 'dark' : 'light',
        })),
      updateOrderStatus: (id, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      restockProduct: (id, quantity) =>
        setState((s) => ({
          ...s,
          products: s.products.map((p) =>
            p.id === id ? { ...p, stock: p.stock + quantity } : p
          ),
        })),
      toggleCouponActive: (id) =>
        setState((s) => ({
          ...s,
          coupons: s.coupons.map((c) =>
            c.id === id ? { ...c, active: !c.active } : c
          ),
        })),
      deleteCoupon: (id) =>
        setState((s) => ({
          ...s,
          coupons: s.coupons.filter((c) => c.id !== id),
        })),
      addCoupon: (couponData) =>
        setState((s) => {
          const nextId =
            s.coupons.length > 0
              ? Math.max(...s.coupons.map((c) => c.id)) + 1
              : 1;
          const nextCode = `NEW${String(nextId).padStart(2, '0')}`;
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          const code = couponData?.code?.trim()?.toUpperCase() || nextCode;
          const discountValue = Number(couponData?.discount);
          const discount =
            Number.isFinite(discountValue) && discountValue > 0
              ? discountValue
              : 10;
          const expiry =
            couponData?.expiry?.trim() || expiryDate.toISOString().slice(0, 10);

          return {
            ...s,
            coupons: [
              ...s.coupons,
              {
                id: nextId,
                code,
                discount,
                expiry,
                active: true,
              },
            ],
          };
        }),
    }),
    [state]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

