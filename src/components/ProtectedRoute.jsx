import { Navigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";

// Wraps pages that require login. If no token, redirects to /login.
function ProtectedRoute({ children }) {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

