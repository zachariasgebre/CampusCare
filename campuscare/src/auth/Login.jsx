import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { isValidEthiopianPhone } from "../api/doctors";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/doctors";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    studentId: "",
  });
  const [touched, setTouched] = useState({});

  if (user) {
    return <Navigate to={from} replace />;
  }

  const phoneOk = isValidEthiopianPhone(form.phone);
  const nameOk = form.name.trim().length > 1;
  const idOk = form.studentId.trim().length >= 4;
  const canSubmit = phoneOk && nameOk && idOk;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, phone: true, studentId: true });
    if (!canSubmit) return;
    login(form);
    navigate(from, { replace: true });
  }

  return (
    <section className="card login-card">
      <p className="eyebrow">Student session</p>
      <h2>Sign in to book</h2>
      <p className="muted">
        After login you return to <code>{from}</code>.
      </p>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          required
        />
        {touched.name && !nameOk && (
          <p className="field-error" role="alert">
            Enter your name
          </p>
        )}

        <label htmlFor="studentId">Student ID</label>
        <input
          id="studentId"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, studentId: true }))}
          required
        />
        {touched.studentId && !idOk && (
          <p className="field-error" role="alert">
            Student ID needs at least 4 characters
          </p>
        )}

        <label htmlFor="phone">Mobile (TeleBirr)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          placeholder="09xxxxxxxx"
          required
        />
        {touched.phone && !phoneOk && (
          <p className="field-error" role="alert">
            Use 09xxxxxxxx or +2519xxxxxxxx
          </p>
        )}

        <button type="submit" className="btn" disabled={!canSubmit}>
          Continue
        </button>
      </form>
    </section>
  );
}

export default Login;
