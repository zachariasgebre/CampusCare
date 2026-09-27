import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useAppointmentsStore } from "./appointments/appointmentsStore";

function Layout() {
  const { user, isDoctor, logout } = useAuth();
  const appointments = useAppointmentsStore((s) => s.appointments);
  const count = (appointments || []).length;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            🏥
          </span>
          <div>
            <p className="brand-kicker">Student clinic</p>
            <h1>CampusCare</h1>
          </div>
        </div>

        <nav className="site-nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/appointments">
            History{count > 0 ? ` (${count})` : ""}
          </NavLink>
          <NavLink to="/doctor-dashboard">
            Doctor Portal
          </NavLink>
        </nav>

        <div className="auth-slot">
          {user ? (
            <>
              <span className={`user-chip ${isDoctor ? "doctor-chip" : ""}`}>
                {isDoctor ? `🩺 ${user.name}` : `Hi, ${user.name}`}
              </span>
              <button type="button" className="btn ghost small" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn small">
              Sign in
            </NavLink>
          )}
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
<<<<<<< HEAD
        <p>CampusCare · React mini-project · fees in ETB</p>
=======
        <p>CampusCare · Student Healthcare Clinic · Fees in ETB</p>
>>>>>>> 1047e92cb2015561cf82aea6c803646b6f45365d
      </footer>
    </div>
  );
}

export default Layout;
