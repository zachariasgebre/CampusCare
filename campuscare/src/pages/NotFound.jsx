import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="card state-card">
      <h2>Page not found</h2>
      <p>That URL is not part of the CampusCare journey.</p>
      <Link className="btn" to="/">
        Go home
      </Link>
    </section>
  );
}

export default NotFound;
