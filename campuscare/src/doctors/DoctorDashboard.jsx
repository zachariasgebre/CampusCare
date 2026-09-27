import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useAppointmentsStore } from "../appointments/appointmentsStore";
import { fetchDoctorById } from "../api/doctors";
import { useFetch } from "../hooks/useFetch";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";
import EmptyState from "../ui/EmptyState";

function DoctorDashboard() {
  const { user, isDoctor } = useAuth();
  const { id: urlDoctorId } = useParams();

  // Resolve the clinician ID: logged-in doctor takes precedence
  const doctorId = useMemo(() => {
    if (isDoctor && user?.id) return Number(user.id);
    if (urlDoctorId) return Number(urlDoctorId);
    return null;
  }, [isDoctor, user, urlDoctorId]);

  // Fetch clinician profile dynamically from API
  const {
    data: doctor,
    loading,
    error,
    retry,
  } = useFetch(
    (signal) => (doctorId ? fetchDoctorById(doctorId, { signal }) : Promise.resolve(null)),
    [doctorId]
  );

  const appointments = useAppointmentsStore((s) => s.appointments);
  const updateAppointmentStatus = useAppointmentsStore(
    (s) => s.updateAppointmentStatus
  );
  const updateAppointmentNotes = useAppointmentsStore(
    (s) => s.updateAppointmentNotes
  );

  // Search & Filter criteria
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [slotFilter, setSlotFilter] = useState("all");

  // Notes editing state
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState("");

  // Appointments for this clinician
  const doctorAppointments = useMemo(() => {
    if (!doctorId) return appointments;
    return appointments.filter((apt) => Number(apt.doctorId) === doctorId);
  }, [appointments, doctorId]);

  // Filtered appointments according to active filters and search
  const filteredAppointments = useMemo(() => {
    return doctorAppointments.filter((apt) => {
      // Status filter
      if (statusFilter !== "all" && (apt.status || "confirmed") !== statusFilter) {
        return false;
      }

      // Slot filter
      if (slotFilter !== "all" && apt.slot !== slotFilter) {
        return false;
      }

      // Search query (student name, ID, phone, reason)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const studentName = (apt.studentName || apt.fullName || "").toLowerCase();
        const studentId = (apt.studentId || "").toLowerCase();
        const phone = (apt.phone || "").toLowerCase();
        const reason = (apt.reason || "").toLowerCase();

        return (
          studentName.includes(q) ||
          studentId.includes(q) ||
          phone.includes(q) ||
          reason.includes(q)
        );
      }

      return true;
    });
  }, [doctorAppointments, statusFilter, slotFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const total = doctorAppointments.length;
    const confirmed = doctorAppointments.filter(
      (a) => (a.status || "confirmed") === "confirmed"
    ).length;
    const completed = doctorAppointments.filter((a) => a.status === "completed").length;
    const cancelled = doctorAppointments.filter((a) => a.status === "cancelled").length;

    return { total, confirmed, completed, cancelled };
  }, [doctorAppointments]);

  function handleStartEditNotes(apt) {
    setEditingNotesId(apt.id);
    setTempNotes(apt.clinicalNotes || "");
  }

  function handleSaveNotes(aptId) {
    updateAppointmentNotes(aptId, tempNotes.trim());
    setEditingNotesId(null);
    setTempNotes("");
  }

  function handleCancelEditNotes() {
    setEditingNotesId(null);
    setTempNotes("");
  }

  if (loading) {
    return <Spinner label="Loading clinic schedule & clinician profile…" />;
  }

  if (error) {
    return <ErrorNote message={error} onRetry={retry} />;
  }

  if (!doctor) {
    return (
      <EmptyState
        title="Clinician profile not found"
        message="Could not load doctor details for this account."
      />
    );
  }

  return (
    <div className="doctor-dashboard-container">
      {/* Clinician Identity Banner */}
      <section className="card doctor-banner">
        <div className="doctor-banner-main">
          <div className="doctor-avatar" aria-hidden="true">
            👨‍⚕️
          </div>
          <div>
            <div className="doctor-banner-tags">
              <span className="badge staff-badge">Staff Clinician</span>
              <span className="badge dept-badge">{doctor.department}</span>
            </div>
            <h2 style={{ margin: "0.25rem 0", fontSize: "1.5rem" }}>
              {doctor.name}
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              {doctor.title} · {doctor.years} years experience · ID:{" "}
              <strong>{doctor.doctorId || `DOC-${doctor.id}`}</strong>
              {doctor.phone || doctor.mobile ? ` · 📞 ${doctor.phone || doctor.mobile}` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* KPI Metrics Summary Cards */}
      <section className="dashboard-metrics-grid">
        <div className="card metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <span className="metric-label">Total Appointments</span>
            <span className="metric-value">{metrics.total}</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <span className="metric-label">Confirmed / Upcoming</span>
            <span className="metric-value highlight">{metrics.confirmed}</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <span className="metric-label">Completed Consults</span>
            <span className="metric-value success">{metrics.completed}</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="card dashboard-controls-card">
        <div className="controls-row">
          <div className="search-box">
            <input
              type="search"
              className="dashboard-search-input"
              placeholder="Search by student name, ID, phone, or symptoms…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label htmlFor="statusFilter">Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All ({metrics.total})</option>
                <option value="confirmed">Confirmed ({metrics.confirmed})</option>
                <option value="completed">Completed ({metrics.completed})</option>
                <option value="cancelled">Cancelled ({metrics.cancelled})</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="slotFilter">Time Slot:</label>
              <select
                id="slotFilter"
                value={slotFilter}
                onChange={(e) => setSlotFilter(e.target.value)}
              >
                <option value="all">All Slots</option>
                {(doctor.slots || []).map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || statusFilter !== "all" || slotFilter !== "all") && (
              <button
                type="button"
                className="btn small ghost"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setSlotFilter("all");
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Appointment Roster List */}
      <section>
        {filteredAppointments.length === 0 ? (
          <EmptyState
            title="No appointments scheduled"
            message={
              doctorAppointments.length === 0
                ? "You currently have no patient appointments booked."
                : "No appointments match your active search and filter criteria."
            }
            action={
              (searchQuery || statusFilter !== "all" || slotFilter !== "all") ? (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setSlotFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              ) : null
            }
          />
        ) : (
          <div className="roster-list">
            {filteredAppointments.map((apt) => {
              const currentStatus = apt.status || "confirmed";
              const isEditing = editingNotesId === apt.id;

              return (
                <article
                  key={apt.id}
                  className={`card appointment-row-card status-${currentStatus}`}
                >
                  <div className="appointment-header">
                    <div className="patient-identity">
                      <div className="patient-avatar" aria-hidden="true">
                        {(apt.studentName || apt.fullName || "S").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="patient-name">
                          {apt.studentName || apt.fullName || "Anonymous Student"}
                        </h4>
                        <div className="patient-meta">
                          {apt.studentId && (
                            <span className="student-id-tag">
                              ID: {apt.studentId}
                            </span>
                          )}
                          {apt.phone && (
                            <a
                              href={`tel:${apt.phone}`}
                              className="patient-phone"
                              title="Click to call patient"
                            >
                              📞 {apt.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="appointment-status-block">
                      <span className="slot-badge">⏰ {apt.slot}</span>
                      <span className={`status-badge ${currentStatus}`}>
                        {currentStatus === "confirmed" && "⏳ Confirmed"}
                        {currentStatus === "completed" && "✅ Completed"}
                        {currentStatus === "cancelled" && "✕ Cancelled"}
                      </span>
                    </div>
                  </div>

                  {/* Visit Reason and Clinical Notes */}
                  <div className="appointment-body">
                    {apt.reason && (
                      <div>
                        <p className="reason-label">Reason for Visit / Symptoms</p>
                        <p className="reason-text">{apt.reason}</p>
                      </div>
                    )}

                    {/* Clinical Notes Section */}
                    {apt.clinicalNotes && !isEditing && (
                      <div className="clinical-notes-preview">
                        <p className="notes-label">Doctor's Clinical Notes</p>
                        <p className="notes-text">📝 {apt.clinicalNotes}</p>
                      </div>
                    )}

                    {isEditing ? (
                      <div className="notes-editor-box">
                        <label htmlFor={`notes-${apt.id}`} className="notes-label">
                          Doctor Clinical Notes / Diagnosis / Rx
                        </label>
                        <textarea
                          id={`notes-${apt.id}`}
                          className="notes-textarea"
                          rows={3}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Type clinical observations, diagnosis, prescribed medication, or follow-up instructions…"
                        />
                        <div className="notes-editor-actions">
                          <button
                            type="button"
                            className="btn small"
                            onClick={() => handleSaveNotes(apt.id)}
                          >
                            Save Notes
                          </button>
                          <button
                            type="button"
                            className="btn small ghost"
                            onClick={handleCancelEditNotes}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Appointment Actions & Controls */}
                  <div className="appointment-footer">
                    <span className="fee-info">
                      Consultation Fee: <strong>{apt.fee || doctor.fee || 150} ETB</strong>
                    </span>

                    <div className="action-buttons-group">
                      {!isEditing && (
                        <button
                          type="button"
                          className="btn small ghost"
                          onClick={() => handleStartEditNotes(apt)}
                        >
                          {apt.clinicalNotes ? "Edit Notes" : "➕ Add Clinical Note"}
                        </button>
                      )}

                      {currentStatus !== "completed" && (
                        <button
                          type="button"
                          className="btn small status-btn-complete"
                          onClick={() => updateAppointmentStatus(apt.id, "completed")}
                        >
                          Mark Completed
                        </button>
                      )}

                      {currentStatus === "completed" && (
                        <button
                          type="button"
                          className="btn small ghost"
                          onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                        >
                          Reopen Visit
                        </button>
                      )}

                      {currentStatus !== "cancelled" && (
                        <button
                          type="button"
                          className="btn small ghost status-btn-cancel"
                          onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                        >
                          Cancel Appointment
                        </button>
                      )}

                      {currentStatus === "cancelled" && (
                        <button
                          type="button"
                          className="btn small ghost"
                          onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorDashboard;
