import { Link, useParams } from "react-router-dom";
import { fetchDoctorById } from "../api/doctors";
import { useFetch } from "../hooks/useFetch";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";
import EmptyState from "../ui/EmptyState";

function DoctorDetail() {
  const { id } = useParams();
  const doctorId = Number(id);

  const { data: doctor, loading, error, retry } = useFetch(
    (signal) => fetchDoctorById(doctorId, { signal }),
    [doctorId]
  );

  if (loading) return <Spinner label="Opening doctor profile…" />;
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
    <section className="card detail-card">
      <p className="eyebrow">{doctor.department}</p>
      <h2>{doctor.name}</h2>
      <p className="muted">
        {doctor.title} · {doctor.years} years · {doctor.fee} ETB consult
        {doctor.doctorId ? ` · ID: ${doctor.doctorId}` : ""}
        {doctor.mobile || doctor.phone ? ` · 📞 ${doctor.mobile || doctor.phone}` : ""}
      </p>
      <p>{doctor.bio}</p>

      <h3>Open slots</h3>
      <ul className="slot-list">
        {doctor.slots.map((slot) => (
          <li key={slot}>{slot}</li>
        ))}
      </ul>

      <div className="card-actions">
        <Link className="btn" to={`/booking/${doctor.id}`}>
          Book this doctor
        </Link>
        <Link className="btn ghost" to={`/doctor-dashboard/${doctor.id}`}>
          View Doctor Schedule
        </Link>
        <Link className="btn ghost" to="/doctors">
          Back to list
        </Link>
      </div>
    </section>
  );
}

export default DoctorDetail;
