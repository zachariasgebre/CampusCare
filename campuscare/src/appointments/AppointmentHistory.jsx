import { Link } from "react-router-dom";
import { useAppointmentsStore } from "./appointmentsStore";
import EmptyState from "../ui/EmptyState";

function AppointmentHistory() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const clearAppointments = useAppointmentsStore((s) => s.clearAppointments);

  if (!(appointments || []).length) {
    return (
      <EmptyState
        title="No appointments yet"
        message="Once you book a visit, it will show up here."
        action={
          <Link className="btn" to="/doctors">
            Find a doctor
          </Link>
        }
      />
    );
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="eyebrow">History</p>
          <h2>Your appointments</h2>
        </div>
        <button
          type="button"
          className="btn ghost small"
          onClick={clearAppointments}
        >
          Clear history
        </button>
      </div>

      <ul className="history-list">
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
              <p className="muted">{item.reason}</p>
            </div>
            <p className="price">{item.fee} ETB</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AppointmentHistory;
