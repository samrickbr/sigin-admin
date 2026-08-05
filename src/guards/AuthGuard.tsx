import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../auth/store/authStore";

export function AuthGuard() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}