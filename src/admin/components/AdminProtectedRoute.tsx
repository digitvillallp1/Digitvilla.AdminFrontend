import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "../utils/auth";

type AdminProtectedRouteProps = {
  children: React.ReactNode;
};

export default function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}