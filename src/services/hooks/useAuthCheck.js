import { useSelector } from "react-redux";
import { getIsAuthenticated } from "../../redux/auth/authSlice.js";

export const useAuthCheck = () => useSelector(getIsAuthenticated);