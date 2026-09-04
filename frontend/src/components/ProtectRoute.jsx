import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = window.localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;