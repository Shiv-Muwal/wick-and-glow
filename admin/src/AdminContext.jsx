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

