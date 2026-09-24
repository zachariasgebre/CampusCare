import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <section className="hero card">
        <p className="eyebrow">Campus Clinic · Student Healthcare</p>
        <h2>Book a student health visit in minutes</h2>
        <p>
          CampusCare helps you browse clinic doctors by department, view credentials,
          select open slots, and confirm your booking — skip the waiting lines.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/doctors">
            Browse doctors
          </Link>
          <Link className="btn ghost" to="/doctors?department=Mental%20Health">
            Mental health counseling
          </Link>
          <Link className="btn ghost" to="/appointments">
            My Appointments
          </Link>
        </div>
        <ol className="journey" aria-label="Student booking journey">
          <li>1. Home</li>
          <li>2. Doctors</li>
          <li>3. Filter</li>
          <li>4. Details</li>
          <li>5. Booking</li>
          <li>6. Confirmation</li>
        </ol>
      </section>

      <section className="feature-cards">
        <div className="card feature-card">
          <div>
            <p className="eyebrow">Primary Care</p>
            <h3>🩺 General Practice</h3>
            <p className="muted">
              Routine check-ups, acute cold/flu care, fever assessments, and student prescription renewals.
            </p>
          </div>
          <Link to="/doctors?department=General%20Practice" className="btn small ghost" style={{ marginTop: "1rem" }}>
            View clinicians &rarr;
          </Link>
        </div>

        <div className="card feature-card">
          <div>
            <p className="eyebrow">Mental Wellness</p>
            <h3>🧠 Mental Health & Counseling</h3>
            <p className="muted">
              Safe, confidential stress relief, exam anxiety management, and academic counseling sessions.
            </p>
          </div>
          <Link to="/doctors?department=Mental%20Health" className="btn small ghost" style={{ marginTop: "1rem" }}>
            View counselors &rarr;
          </Link>
        </div>

        <div className="card feature-card">
          <div>
            <p className="eyebrow">Specialist Care</p>
            <h3>✨ Specialized Clinics</h3>
            <p className="muted">
              Dermatology, Orthopedics, and Women's Health consultations right here on campus.
            </p>
          </div>
          <Link to="/doctors" className="btn small ghost" style={{ marginTop: "1rem" }}>
            Explore specialists &rarr;
          </Link>
        </div>
      </section>

      <section className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem", borderLeft: "4px solid #ef4444" }}>
        <div>
          <h3 style={{ color: "#b91c1c", margin: "0 0 0.35rem" }}>Need urgent medical assistance?</h3>
          <p className="muted" style={{ margin: 0 }}>
            The emergency triage room in Clinic Block A is open 24/7 for acute symptoms.
          </p>
        </div>
        <a href="tel:991" className="btn" style={{ backgroundColor: "#dc2626" }}>
          Emergency Call: 991
        </a>
      </section>
    </div>
  );
}

export default Home;
