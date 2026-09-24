import { Link } from "react-router-dom";
import { useAppointmentsStore } from "./appointmentsStore";
import EmptyState from "../ui/EmptyState";

function AppointmentHistory() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const clearAppointments = useAppointmentsStore((s) => s.clearAppointments);

  function handleClearHistory() {
    if (window.confirm("Are you sure you want to clear your appointment history?")) {
      clearAppointments();
    }
  }

  if (!(appointments || []).length) {
    return (
      <EmptyState
        title="No appointments yet"
        message="Once you book a visit, it will show up here."
        action={
          <div className="card-actions" style={{ justifyContent: "center" }}>
            <Link className="btn small" to="/doctors">
              Find a doctor
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <section aria-labelledby="history-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">History</p>
          <h2 id="history-heading">Your appointments</h2>
          <p className="muted" style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
            Showing <strong>{appointments.length}</strong> booked {appointments.length === 1 ? "visit" : "visits"}
          </p>
        </div>
        <button
          type="button"
          className="btn ghost small"
          onClick={handleClearHistory}
        >
          Clear history
        </button>
      </div>

      <ul className="history-list" aria-label="Appointment history list">
        {appointments.map((item) => (
          <li key={item.id} className="card history-card">
            <div>
              <h3>{item.doctorName}</h3>
              <p className="muted">
                {item.department} · {item.slot}
              </p>
              <p>
                {item.fullName} · {item.studentId}
              </p>
              {item.reason && <p className="muted">{item.reason}</p>}
              {item.createdAt && (
                <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.35rem" }}>
                  Booked: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <p className="price">{item.fee} ETB</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AppointmentHistory;
