import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, getRole, logout, hasRole } from "../utils/auth";

/**
 * ProtectedRoute
 * @param {Array} roles - ruxsat etilgan rollar (["manager"], ["nurse"], ...)
 */
export default function ProtectedRoute({ roles = [] }) {
  // 🔐 Login tekshiruvi
  if (!isLoggedIn()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // 👥 Role tekshiruvi
  if (roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
