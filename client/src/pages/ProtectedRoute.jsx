import { useAuth } from "context/AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/giris" />;
  }
  return children;
};

export default ProtectedRoute;
