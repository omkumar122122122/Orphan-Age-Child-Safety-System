import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../utils/constants";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] ?? "/login"} replace />;
  }

  return <Outlet />;
}
