import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Phase 2: JWT-protected layout route — children render only when logged in.
 * Phase 1: unused; enable by wrapping `/cart` + `/checkout` in App.jsx (see comments there).
 */
export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="py-[160px] text-center text-[var(--light-text)] max-[1024px]:pt-[180px]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
