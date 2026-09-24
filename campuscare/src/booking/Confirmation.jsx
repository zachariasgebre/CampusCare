import { Link, useLocation } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const appointment = location.state?.appointment;

  if (!appointment) {
    return (
      <section className="card state-card">
        <h2>No confirmation to show</h2>
        <p>Book a doctor first to see your receipt here.</p>
        <Link className="btn" to="/doctors">
          Browse doctors
        </Link>
      </section>
    );
  }

  return (
    <section className="card confirmation-card">
      <p className="eyebrow">Confirmed</p>
      <h2>Your visit is booked</h2>
      <p>
        <strong>{appointment.fullName}</strong>, you are scheduled with{" "}
        <strong>{appointment.doctorName}</strong>.
      </p>

      <dl className="confirm-grid">
        <div>
          <dt>Department</dt>
          <dd>{appointment.department}</dd>
        </div>
        <div>
          <dt>Slot</dt>
          <dd>{appointment.slot}</dd>
        </div>
        <div>
          <dt>Student ID</dt>
          <dd>{appointment.studentId}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{appointment.phone}</dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd>{appointment.fee} ETB</dd>
        </div>
        <div>
          <dt>Reason</dt>
          <dd>{appointment.reason}</dd>
        </div>
      </dl>

      <div className="card-actions">
        <Link className="btn" to="/appointments">
          View appointment history
        </Link>
        <Link className="btn ghost" to="/doctors">
          Book another visit
        </Link>
      </div>
    </section>
  );
}

export default Confirmation;
