import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDoctorById } from "../api/doctors";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../auth/AuthContext";
import { useAppointmentsStore } from "../appointments/appointmentsStore";
import { validateBooking } from "./validate";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";
import EmptyState from "../ui/EmptyState";

const INITIAL = {
  fullName: "",
  studentId: "",
  phone: "",
  slot: "",
  reason: "",
};

function Booking() {
  const { id } = useParams();
  const doctorId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const { data: doctor, loading, error, retry } = useFetch(
    (signal) => fetchDoctorById(doctorId, { signal }),
    [doctorId]
  );

  const [form, setForm] = useState(() => ({
    ...INITIAL,
    fullName: user?.name || "",
    studentId: user?.studentId || "",
    phone: user?.phone || "",
  }));
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => validateBooking(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function markTouched(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      fullName: true,
      studentId: true,
      phone: true,
      slot: true,
      reason: true,
    });

    if (!isValid || submitting || !doctor) return;

    setSubmitting(true);
    try {
      // Simulate a short submit delay (clinic desk stamp)
      await new Promise((r) => setTimeout(r, 400));

      const appointment = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        fee: doctor.fee,
        fullName: form.fullName.trim(),
        studentId: form.studentId.trim(),
        phone: form.phone.trim(),
        slot: form.slot,
        reason: form.reason.trim(),
      };

      addAppointment(appointment);
      navigate("/confirmation", { replace: true, state: { appointment } });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner label="Preparing booking form…" />;
  if (error) return <ErrorNote message={error} onRetry={retry} />;

  if (!doctor) {
    return (
      <EmptyState
        title="Cannot book this doctor"
        message={`No clinician matches id ${id}.`}
        action={
          <Link className="btn" to="/doctors">
            Choose another doctor
          </Link>
        }
      />
    );
  }

  return (
    <section className="card booking-card">
      <p className="eyebrow">Booking</p>
      <h2>Book {doctor.name}</h2>
      <p className="muted">
        {doctor.department} · consult fee {doctor.fee} ETB
      </p>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <Field
          id="fullName"
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          onBlur={() => markTouched("fullName")}
          error={touched.fullName && errors.fullName}
        />

        <Field
          id="studentId"
          label="Student ID"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          onBlur={() => markTouched("studentId")}
          error={touched.studentId && errors.studentId}
        />

        <Field
          id="phone"
          label="TeleBirr / mobile number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          onBlur={() => markTouched("phone")}
          error={touched.phone && errors.phone}
          hint="09xxxxxxxx or +2519xxxxxxxx"
        />

        <label htmlFor="slot">Appointment slot</label>
        <select
          id="slot"
          name="slot"
          value={form.slot}
          onChange={handleChange}
          onBlur={() => markTouched("slot")}
          aria-invalid={!!(touched.slot && errors.slot)}
          aria-describedby={touched.slot && errors.slot ? "slot-error" : undefined}
        >
          <option value="">Select a slot</option>
          {doctor.slots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {touched.slot && errors.slot && (
          <p id="slot-error" className="field-error" role="alert">
            {errors.slot}
          </p>
        )}

        <label htmlFor="reason">Reason for visit</label>
        <textarea
          id="reason"
          name="reason"
          rows={4}
          value={form.reason}
          onChange={handleChange}
          onBlur={() => markTouched("reason")}
          aria-invalid={!!(touched.reason && errors.reason)}
          aria-describedby={
            touched.reason && errors.reason ? "reason-error" : undefined
          }
        />
        {touched.reason && errors.reason && (
          <p id="reason-error" className="field-error" role="alert">
            {errors.reason}
          </p>
        )}

        <button
          type="submit"
          className="btn"
          disabled={!isValid || submitting}
        >
          {submitting ? "Submitting…" : "Confirm booking"}
        </button>
      </form>
    </section>
  );
}

function Field({
  id,
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  hint,
}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export default Booking;
