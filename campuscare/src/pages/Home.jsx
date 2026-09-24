import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <p className="eyebrow">Student Health & Wellness</p>
        <h1>CampusCare Clinic Portal</h1>
        <p>
          Book confidential on-campus consultations with certified doctors. Skip the lines and access quality student healthcare.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.25rem" }}>
          <Link to="/doctors" className="btn">
            Browse Doctors & Book
          </Link>
          <Link to="/appointments" className="btn ghost">
            My Appointments
          </Link>
        </div>
      </section>

      <section className="feature-cards">
        <div className="card feature-card">
          <p className="eyebrow">Primary Care</p>
          <h3>🩺 General Practice</h3>
          <p className="muted">
            Routine check-ups, acute cold/flu care, fever assessments, and prescription renewals.
          </p>
          <Link to="/doctors?department=General+Practice" className="btn small ghost">
            View clinicians &rarr;
          </Link>
        </div>

        <div className="card feature-card">
          <p className="eyebrow">Mental Wellness</p>
          <h3>🧠 Mental Health & Counseling</h3>
          <p className="muted">
            Safe, confidential stress relief, anxiety management, and academic counseling sessions.
          </p>
          <Link to="/doctors?department=Mental+Health" className="btn small ghost">
            View counselors &rarr;
          </Link>
        </div>

        <div className="card feature-card">
          <p className="eyebrow">Specialist Care</p>
          <h3>✨ Specialized Clinics</h3>
          <p className="muted">
            Dermatology, Orthopedics, and Women's Health consultations right here on campus.
          </p>
          <Link to="/doctors" className="btn small ghost">
            Explore specialists &rarr;
          </Link>
        </div>
      </section>

      <section className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <h3>Emergency assistance on campus</h3>
          <p className="muted" style={{ margin: 0 }}>
            Triage room in Clinic Block A is available for urgent medical needs.
          </p>
        </div>
        <a href="tel:991" className="btn" style={{ backgroundColor: "#dc2626" }}>
          Emergency Hotline: 991
        </a>
      </section>
    </div>
  );
}

export default Home;
