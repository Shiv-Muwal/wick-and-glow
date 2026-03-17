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

