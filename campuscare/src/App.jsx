import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
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
