import { Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";
import EmptyState from "../ui/EmptyState";

/**
 * DoctorList Component
 *
 * Responsibilities:
 * - Renders a responsive grid of DoctorCard items for the active filter.
 * - Handles the empty state gracefully with a one-click reset action (Section 8 of Guide).
 * - Displays a live result count for feedback and accessibility (aria-live).
 * - Implements defensive prop fallback (doctors = []).
 */
function DoctorList({ doctors = [] }) {
  // Graceful empty state when no doctors match the current filter
  if (!doctors || doctors.length === 0) {
    return (
      <EmptyState
        title="No doctors found"
        message="Try another department filter — the clinic roster is empty for this choice."
        action={
          <div className="card-actions" style={{ justifyContent: "center" }}>
            <Link to="/doctors" className="btn small">
              View all doctors
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <div className="doctor-list-wrapper">
      <p className="muted" style={{ margin: "0 0 1rem" }} aria-live="polite">
        Showing <strong>{doctors.length}</strong> {doctors.length === 1 ? "doctor" : "doctors"}
      </p>

      <div className="doctor-grid" role="region" aria-label="Available doctors list">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
