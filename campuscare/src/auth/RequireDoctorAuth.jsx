import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireDoctorAuth({ children }) {
  const { user, isDoctor } = useAuth();
  const location = useLocation();

  if (!user || !isDoctor) {
    return (
      <Navigate
        to="/login?role=doctor"
        state={{ from: location, role: "doctor" }}
        replace
      />
    );
  }

  return children;
}

export default RequireDoctorAuth;
