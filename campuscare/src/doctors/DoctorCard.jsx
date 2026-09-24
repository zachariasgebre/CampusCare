import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  return (
    <article className="card doctor-card">
      <p className="eyebrow">{doctor.department}</p>
      <h3>
        <Link to={`/doctors/${doctor.id}`}>{doctor.name}</Link>
      </h3>
      <p className="muted">{doctor.title}</p>
      <p className="price">{doctor.fee} ETB</p>
      <p className="muted">{doctor.years} years experience</p>
      <div className="card-actions">
        <Link className="btn small" to={`/doctors/${doctor.id}`}>
          View profile
        </Link>
        <Link
          className="btn ghost small"
          to={`/booking/${doctor.id}`}
        >
          Book
        </Link>
      </div>
    </article>
  );
}

export default DoctorCard;
