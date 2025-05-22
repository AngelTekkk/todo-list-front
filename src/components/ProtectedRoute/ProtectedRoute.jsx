import { Navigate } from "react-router-dom";
import { useAuthCheck } from "../../services/hooks/useAuthCheck.js";

const ProtectedRoute = ({ children }) =>  useAuthCheck() ? children : <Navigate to="/" replace />;

export default ProtectedRoute;