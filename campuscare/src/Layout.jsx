import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useAppointmentsStore } from "./appointments/appointmentsStore";

function ProfilePopup({ user, isDoctor, onClose, onLogout }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className="profile-popup" ref={ref} role="dialog" aria-label="Profile details">
      <div className="profile-popup-avatar">
        {isDoctor ? "🩺" : "🎓"}
      </div>
      <p className="profile-popup-name">{user.name}</p>
      <span className={`profile-popup-badge ${isDoctor ? "doctor" : "student"}`}>
        {isDoctor ? "Doctor" : "Student"}
      </span>

      <dl className="profile-popup-grid">
        {isDoctor ? (
          <>
            <dt>Title</dt>
            <dd>{user.title || "—"}</dd>
            <dt>Department</dt>
            <dd>{user.department || "—"}</dd>
            <dt>Doctor ID</dt>
            <dd>{user.doctorId || "—"}</dd>
            <dt>Phone</dt>
            <dd>{user.phone || "—"}</dd>
          </>
        ) : (
          <>
            <dt>Student ID</dt>
            <dd>{user.studentId || "—"}</dd>
            <dt>Phone</dt>
            <dd>{user.phone || "—"}</dd>
          </>
        )}
      </dl>

      <button
        type="button"
        className="btn ghost small profile-popup-logout"
        onClick={() => { onLogout(); onClose(); }}
      >
        Log out
      </button>
    </div>
  );
}

function Layout() {
  const { user, isDoctor, logout } = useAuth();
  const appointments = useAppointmentsStore((s) => s.appointments);
  const count = (appointments || []).length;
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <Link to="/"> 
            <span className="brand-mark" aria-hidden="true">
              🏥
            </span>
            <div>
              <p className="brand-kicker">Student clinic</p>
              <h1>CampusCare</h1>
            </div>
          </Link>
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
            <div className="profile-anchor">
              <button
                type="button"
                className={`user-chip user-chip-btn ${isDoctor ? "doctor-chip" : ""}`}
                onClick={() => setShowProfile((v) => !v)}
                aria-expanded={showProfile}
                aria-haspopup="dialog"
              >
                {isDoctor ? `🩺 ${user.name}` : `Hi, ${user.name}`}
                <span className="chip-caret">{showProfile ? "▲" : "▼"}</span>
              </button>

              {showProfile && (
                <ProfilePopup
                  user={user}
                  isDoctor={isDoctor}
                  onClose={() => setShowProfile(false)}
                  onLogout={logout}
                />
              )}
            </div>
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
        <div className="footer-content">
          <p>
            <strong>CampusCare</strong> · Student Healthcare Clinic · Fees in ETB
          </p>
          <p className="footer-subtext">
            Block B, Student Center | Hours: Mon–Fri 8AM–6PM | Emergency: 911 / 933
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} CampusCare System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
