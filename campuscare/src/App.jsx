import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import RequireDoctorAuth from "./auth/RequireDoctorAuth";
import ErrorBoundary from "./ui/ErrorBoundary";
import Spinner from "./ui/Spinner";
import Layout from "./Layout";
import Home from "./pages/Home";
import Doctors from "./doctors/Doctors";
import DoctorDetail from "./doctors/DoctorDetail";
import Booking from "./booking/Booking";
import Confirmation from "./booking/Confirmation";
import Login from "./auth/Login";
import NotFound from "./pages/NotFound";

const AppointmentHistory = lazy(
  () => import("./appointments/AppointmentHistory")
);
const DoctorDashboard = lazy(
  () => import("./doctors/DoctorDashboard")
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctors/:id" element={<DoctorDetail />} />
              <Route
                path="booking/:id"
                element={
                  <RequireAuth>
                    <Booking />
                  </RequireAuth>
                }
              />
              <Route path="confirmation" element={<Confirmation />} />
              <Route
                path="appointments"
                element={
                  <Suspense fallback={<Spinner label="Loading history…" />}>
                    <AppointmentHistory />
                  </Suspense>
                }
              />
              <Route
                path="doctor-dashboard"
                element={
                  <RequireDoctorAuth>
                    <Suspense fallback={<Spinner label="Loading doctor dashboard…" />}>
                      <DoctorDashboard />
                    </Suspense>
                  </RequireDoctorAuth>
                }
              />
              <Route
                path="doctor-dashboard/:id"
                element={
                  <RequireDoctorAuth>
                    <Suspense fallback={<Spinner label="Loading doctor dashboard…" />}>
                      <DoctorDashboard />
                    </Suspense>
                  </RequireDoctorAuth>
                }
              />
              <Route
                path="doctor-login"
                element={<Navigate to="/login?role=doctor" replace />}
              />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
