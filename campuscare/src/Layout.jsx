import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout-container">
      <nav className="navbar">
        <NavLink to="/" className="nav-logo">CampusCare</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/doctors" className={({ isActive }) => (isActive ? "active" : "")}>
            Doctors
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => (isActive ? "active" : "")}>
            My Appointments
          </NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}