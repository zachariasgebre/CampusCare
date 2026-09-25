import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="card state-card">
      <h2>Page not found</h2>
      <p>The requested page could not be found.</p>
      <Link className="btn" to="/">
        Go home
      </Link>
    </section>
  );
}

export default NotFound;
