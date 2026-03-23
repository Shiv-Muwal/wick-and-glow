import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSessionToken } from '../api/client.js';

export default function RequireAdminAuth({ children }) {
  const loc = useLocation();
  if (!getAdminSessionToken()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
