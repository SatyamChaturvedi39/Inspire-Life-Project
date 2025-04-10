import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./AuthContext"; // adjust path based on your structure

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { accessToken, role } = useAuth();

  if (accessToken) {
    if (role === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (role === "agent") return <Navigate to="/dashboard/agent" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
