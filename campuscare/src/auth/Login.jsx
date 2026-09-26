import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { fetchDoctors, isValidEthiopianPhone } from "../api/doctors";

function normalizePhone(phone) {
  const p = String(phone || "").trim().replace(/[\s-]/g, "");
  if (p.startsWith("+251")) return "0" + p.slice(4);
  return p;
}

function normalizeDocId(id) {
  return String(id || "").trim().toUpperCase();
}

function Login() {
  const { user, isDoctor, login, loginDoctor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role: 'student' | 'doctor'
  const [role, setRole] = useState(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("role") === "doctor" || location.state?.role === "doctor") {
      return "doctor";
    }
    return "student";
  });

  const studentFrom = location.state?.from?.pathname || "/doctors";
  const doctorFrom =
    location.state?.from?.pathname && location.state.from.pathname !== "/login"
      ? location.state.from.pathname
      : "/doctor-dashboard";

  // Doctors list for doctor verification
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let active = true;
    fetchDoctors()
      .then((data) => {
        if (active) setDoctors(data || []);
      })
      .catch(() => {
        if (active) setDoctors([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: "",
    phone: "",
    studentId: "",
  });
  const [studentTouched, setStudentTouched] = useState({});

  // Doctor form state
  const [doctorForm, setDoctorForm] = useState({
    doctorId: "",
    phone: "",
  });
  const [doctorTouched, setDoctorTouched] = useState({});
  const [doctorError, setDoctorError] = useState("");
  const [doctorSubmitting, setDoctorSubmitting] = useState(false);

  // If already logged in, redirect to target
  if (user) {
    return <Navigate to={isDoctor ? doctorFrom : studentFrom} replace />;
  }

  // Validation
  const studentPhoneOk = isValidEthiopianPhone(studentForm.phone);
  const studentNameOk = studentForm.name.trim().length > 1;
  const studentIdOk = studentForm.studentId.trim().length >= 4;
  const canSubmitStudent = studentPhoneOk && studentNameOk && studentIdOk;

  const doctorIdOk = doctorForm.doctorId.trim().length >= 3;
  const doctorPhoneOk = isValidEthiopianPhone(doctorForm.phone);
  const canSubmitDoctor = doctorIdOk && doctorPhoneOk;

  function handleStudentChange(e) {
    const { name, value } = e.target;
    setStudentForm((f) => ({ ...f, [name]: value }));
  }

  function handleDoctorChange(e) {
    const { name, value } = e.target;
    setDoctorForm((f) => ({ ...f, [name]: value }));
    setDoctorError("");
  }

  function handleStudentSubmit(e) {
    e.preventDefault();
    setStudentTouched({ name: true, phone: true, studentId: true });
    if (!canSubmitStudent) return;
    login(studentForm);
    navigate(studentFrom, { replace: true });
  }

  function handleDoctorSubmit(e) {
    e.preventDefault();
    setDoctorTouched({ doctorId: true, phone: true });
    setDoctorError("");
    if (!canSubmitDoctor) return;

    setDoctorSubmitting(true);
    const inputId = normalizeDocId(doctorForm.doctorId);
    const inputPhone = normalizePhone(doctorForm.phone);

    const matched = doctors.find((doc) => {
      const docMatch =
        normalizeDocId(doc.doctorId) === inputId ||
        `DOC-${doc.id}` === inputId ||
        String(doc.id) === inputId;
      const phoneMatch =
        normalizePhone(doc.phone) === inputPhone ||
        normalizePhone(doc.mobile) === inputPhone;
      return docMatch && phoneMatch;
    });

    if (matched) {
      loginDoctor(matched);
      navigate(doctorFrom, { replace: true });
    } else {
      setDoctorError(
        "No clinician found with this Doctor ID and Mobile number. Please verify your credentials."
      );
      setDoctorSubmitting(false);
    }
  }

  function handleRoleSwitch(newRole) {
    setRole(newRole);
    setDoctorError("");
  }

  return (
    <div className="login-page-wrapper">
      <section className="card login-card">
        {/* Segmented Role Selector */}
        <div className="login-role-tabs">
          <button
            type="button"
            className={`login-tab ${role === "student" ? "active" : ""}`}
            onClick={() => handleRoleSwitch("student")}
          >
            🎓 Student
          </button>
          <button
            type="button"
            className={`login-tab ${role === "doctor" ? "active" : ""}`}
            onClick={() => handleRoleSwitch("doctor")}
          >
            🩺 Doctor
          </button>
        </div>

        {role === "student" ? (
          <>
            <p className="eyebrow">Student session</p>
            <h2>Sign in to book</h2>
            <p className="muted">
              Enter your student credentials to continue your appointment booking.
            </p>

            <form className="booking-form" onSubmit={handleStudentSubmit} noValidate>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                value={studentForm.name}
                onChange={handleStudentChange}
                onBlur={() => setStudentTouched((t) => ({ ...t, name: true }))}
                placeholder="e.g. Alazar Tadesse"
                required
              />
              {studentTouched.name && !studentNameOk && (
                <p className="field-error" role="alert">
                  Enter your name
                </p>
              )}

              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                name="studentId"
                value={studentForm.studentId}
                onChange={handleStudentChange}
                onBlur={() => setStudentTouched((t) => ({ ...t, studentId: true }))}
                placeholder="e.g. ATR/4021/14"
                required
              />
              {studentTouched.studentId && !studentIdOk && (
                <p className="field-error" role="alert">
                  Student ID needs at least 4 characters
                </p>
              )}

              <label htmlFor="phone">Mobile (TeleBirr)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={studentForm.phone}
                onChange={handleStudentChange}
                onBlur={() => setStudentTouched((t) => ({ ...t, phone: true }))}
                placeholder="09xxxxxxxx"
                required
              />
              {studentTouched.phone && !studentPhoneOk && (
                <p className="field-error" role="alert">
                  Use 09xxxxxxxx or +2519xxxxxxxx
                </p>
              )}

              <button
                type="submit"
                className="btn login-submit-btn"
                disabled={!canSubmitStudent}
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="eyebrow">Doctor session</p>
            <h2>Sign in as Doctor</h2>
            <p className="muted">
              Enter your Doctor ID and registered mobile number to access your clinic schedule.
            </p>

            <form className="booking-form" onSubmit={handleDoctorSubmit} noValidate>
              <label htmlFor="doctorId">Doctor ID</label>
              <input
                id="doctorId"
                name="doctorId"
                value={doctorForm.doctorId}
                onChange={handleDoctorChange}
                onBlur={() => setDoctorTouched((t) => ({ ...t, doctorId: true }))}
                placeholder="e.g. DOC-4821"
                required
              />
              {doctorTouched.doctorId && !doctorIdOk && (
                <p className="field-error" role="alert">
                  Enter your Doctor ID (e.g. DOC-4821)
                </p>
              )}

              <label htmlFor="doctorPhone">Mobile (TeleBirr)</label>
              <input
                id="doctorPhone"
                name="phone"
                type="tel"
                value={doctorForm.phone}
                onChange={handleDoctorChange}
                onBlur={() => setDoctorTouched((t) => ({ ...t, phone: true }))}
                placeholder="09xxxxxxxx"
                required
              />
              {doctorTouched.phone && !doctorPhoneOk && (
                <p className="field-error" role="alert">
                  Use 09xxxxxxxx or +2519xxxxxxxx
                </p>
              )}

              {doctorError && (
                <p className="field-error" role="alert">
                  {doctorError}
                </p>
              )}

              <button
                type="submit"
                className="btn login-submit-btn"
                disabled={!canSubmitDoctor || doctorSubmitting}
              >
                {doctorSubmitting ? "Verifying…" : "Continue"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default Login;
