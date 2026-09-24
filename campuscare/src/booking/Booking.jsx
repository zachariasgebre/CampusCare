import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDoctorById } from "../api/doctors";
import { useAuth } from "../auth/AuthContext";
import { useAppointmentsStore } from "../appointments/appointmentsStore";
import { useFetch } from "../hooks/useFetch";
import { validateBooking } from "./validate";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";
import EmptyState from "../ui/EmptyState";

function Booking() {
  const { id } = useParams();
  const doctorId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const {
    data: doctor,
    loading,
    error,
    retry,
  } = useFetch((signal) => fetchDoctorById(doctorId, { signal }), [doctorId]);

  const [form, setForm] = useState(() => ({
    fullName: user?.name || "",
    studentId: user?.studentId || "",
    phone: user?.phone || "",
    slot: "",
    reason: "",
  }));

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (touched[name]) {
      setErrors(validateBooking(nextForm));
    }
  }

  function handleSlotSelect(slot) {
    const nextForm = { ...form, slot };
    setForm(nextForm);
    setTouched((t) => ({ ...t, slot: true }));
    setErrors(validateBooking(nextForm));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateBooking(form);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      studentId: true,
      phone: true,
      slot: true,
      reason: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    const apt = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      slot: form.slot,
      fullName: form.fullName.trim(),
      studentId: form.studentId.trim(),
      phone: form.phone.trim(),
      reason: form.reason.trim(),
      fee: doctor.fee,
    };

    addAppointment(apt);
    navigate("/confirmation", { state: { appointment: apt } });
  }

  if (loading) return <Spinner label="Loading clinic booking form…" />;
  if (error) return <ErrorNote message={error} onRetry={retry} />;

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        message={`No clinician matches id ${id}.`}
        action={
          <Link className="btn" to="/doctors">
            Back to doctors
          </Link>
        }
      />
    );
  }

  return (
    <section className="card booking-card">
      <p className="eyebrow">Booking appointment</p>
      <h2>Schedule visit with {doctor.name}</h2>
      <p className="muted">
        {doctor.department} · Consultation fee:{" "}
        <strong>{doctor.fee} ETB</strong>
      </p>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="fullName">Student full name</label>
        <input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
          required
        />
        {touched.fullName && errors.fullName && (
          <p className="field-error" role="alert">
            {errors.fullName}
          </p>
        )}

        <label htmlFor="studentId">Student ID</label>
        <input
          id="studentId"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, studentId: true }))}
          placeholder="e.g. ETS-1234/15"
          required
        />
        {touched.studentId && errors.studentId && (
          <p className="field-error" role="alert">
            {errors.studentId}
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
        {touched.phone && errors.phone && (
          <p className="field-error" role="alert">
            {errors.phone}
          </p>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "0.4rem" }}>
            Available time slot
          </label>
          <div className="slots-grid">
            {(doctor.slots || []).map((s) => (
              <button
                key={s}
                type="button"
                className={`slot-btn ${form.slot === s ? "selected" : ""}`}
                onClick={() => handleSlotSelect(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {touched.slot && errors.slot && (
            <p
              className="field-error"
              style={{ marginTop: "0.5rem" }}
              role="alert"
            >
              {errors.slot}
            </p>
          )}
        </div>

        <label htmlFor="reason">Reason for visit</label>
        <textarea
          id="reason"
          name="reason"
          rows="3"
          value={form.reason}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, reason: true }))}
          placeholder="Describe your symptoms (8+ characters)…"
          required
        />
        {touched.reason && errors.reason && (
          <p className="field-error" role="alert">
            {errors.reason}
          </p>
        )}

        <div className="card-actions" style={{ marginTop: "1rem" }}>
          <button type="submit" className="btn">
            Confirm & Book ({doctor.fee} ETB)
          </button>
          <Link className="btn ghost" to={`/doctors/${doctor.id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Booking;
