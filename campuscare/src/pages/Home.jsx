import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero card">
      <p className="eyebrow">Campus clinic · Addis Ababa</p>
      <h2>Book a student health visit in minutes</h2>
      <p>
        CampusCare helps you browse doctors by department, open a profile, pick
        a slot, and confirm a validated booking — no queue queue on a busy day.
      </p>
      <div className="hero-actions">
        <Link className="btn" to="/doctors">
          Browse doctors
        </Link>
        <Link
          className="btn ghost"
          to="/doctors?department=Mental%20Health"
        >
          Mental health
        </Link>
      </div>
      <ol className="journey">
        <li>Home</li>
        <li>Doctors</li>
        <li>Filter</li>
        <li>Details</li>
        <li>Booking</li>
        <li>Confirmation</li>
      </ol>
    </section>
  );
}

export default Home;
