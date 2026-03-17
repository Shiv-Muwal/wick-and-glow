import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, msg: '' });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    const t = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
      clearTimeout(t);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && (
        <div className="toast show">
          <span className="toast-icon">🕯️</span>
          <span className="toast-msg">{toast.msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
