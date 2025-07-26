// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("UserLoggedIn");

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
