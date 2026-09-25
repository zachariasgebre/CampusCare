import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useAppointmentsStore } from "../appointments/appointmentsStore";
import { fetchDoctors } from "../api/doctors";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";

const DEMO_SEED_APPOINTMENTS = [
  {
    id: 1711200001,
    doctorId: 1,
    doctorName: "Dr. Aster Lemma",
    doctorDepartment: "General Practice",
    slot: "09:00 AM",
    fee: 150,
    studentName: "Abebe Bekele",
    fullName: "Abebe Bekele",
    studentId: "ATR/1042/14",
    phone: "0911223344",
    reason: "Severe cough, fever, and acute headache for the past 3 days.",
    status: "confirmed",
    clinicalNotes: "",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 1711200002,
    doctorId: 1,
    doctorName: "Dr. Aster Lemma",
    doctorDepartment: "General Practice",
    slot: "10:30 AM",
    fee: 150,
    studentName: "Tigist Alemu",
    fullName: "Tigist Alemu",
    studentId: "MED/5012/15",
    phone: "0922334455",
    reason: "Asthma inhaler refill and chest tightness review before exam week.",
    status: "completed",
    clinicalNotes: "Inhaler renewed for 30 days. Peak flow normal (420 L/min).",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 1711200003,
    doctorId: 2,
    doctorName: "Dr. Samuel Tadesse",
    doctorDepartment: "Dermatology",
    slot: "09:30 AM",
    fee: 200,
    studentName: "Dawit Haile",
    fullName: "Dawit Haile",
    studentId: "ENG/8821/13",
    phone: "0933445566",
    reason: "Sudden facial allergic rash and itchy eczema after dorm laundry.",
    status: "confirmed",
    clinicalNotes: "",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 1711200004,
    doctorId: 3,
    doctorName: "Dr. Hana Girma",
    doctorDepartment: "Mental Health",
    slot: "08:30 AM",
    fee: 150,
    studentName: "Selamawit Kebede",
    fullName: "Selamawit Kebede",
    studentId: "BUS/3309/14",
    phone: "0944556677",
    reason: "Exam stress counseling and persistent insomnia management.",
    status: "confirmed",
    clinicalNotes: "",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 1711200005,
    doctorId: 4,
    doctorName: "Dr. Yared Assefa",
    doctorDepartment: "General Practice",
    slot: "11:30 AM",
    fee: 150,
    studentName: "Henok Tesfaye",
    fullName: "Henok Tesfaye",
    studentId: "CS/2045/15",
    phone: "0955667788",
    reason: "Routine sports clearance medical certificate for campus soccer team.",
    status: "completed",
    clinicalNotes: "Vitals normal (BP 118/76). Cleared for sports activities.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 1711200006,
    doctorId: 6,
    doctorName: "Dr. Dawit Kebede",
    doctorDepartment: "Orthopedics",
    slot: "01:30 PM",
    fee: 250,
    studentName: "Yonas Mekonnen",
    fullName: "Yonas Mekonnen",
    studentId: "ENG/9904/14",
    phone: "0966778899",
    reason: "Right ankle sprain during intramural basketball tournament yesterday.",
    status: "confirmed",
    clinicalNotes: "",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

function DoctorDashboard() {
  const { user, isDoctor } = useAuth();
  const { id: urlDoctorId } = useParams();
  const navigate = useNavigate();

  const appointments = useAppointmentsStore((s) => s.appointments);
  const updateAppointmentStatus = useAppointmentsStore(
    (s) => s.updateAppointmentStatus
  );
  const updateAppointmentNotes = useAppointmentsStore(
    (s) => s.updateAppointmentNotes
  );
  const seedDemoAppointments = useAppointmentsStore(
    (s) => s.seedDemoAppointments
  );

  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Search & Filter criteria
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [slotFilter, setSlotFilter] = useState("all");

  // Notes editing state
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState("");

  // Load doctors from API
  useEffect(() => {
    let active = true;
    fetchDoctors()
      .then((data) => {
        if (active) {
          setDoctors(data || []);
          setLoadingDocs(false);
        }
      })
      .catch(() => {
        if (active) {
          setDoctors([]);
          setLoadingDocs(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Selected doctor filter derived from URL or logged-in doctor
  const selectedDoctorId = urlDoctorId
    ? String(urlDoctorId)
    : isDoctor && user?.id
    ? String(user.id)
    : "all";

  // Active doctor object
  const activeDoctor = useMemo(() => {
    if (selectedDoctorId === "all") return null;
    return doctors.find((d) => String(d.id) === String(selectedDoctorId)) || null;
  }, [selectedDoctorId, doctors]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Doctor filter
      if (selectedDoctorId !== "all") {
        if (String(apt.doctorId) !== String(selectedDoctorId)) {
          return false;
        }
      }

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
        const docName = (apt.doctorName || "").toLowerCase();

        return (
          studentName.includes(q) ||
          studentId.includes(q) ||
          phone.includes(q) ||
          reason.includes(q) ||
          docName.includes(q)
        );
      }

      return true;
    });
  }, [appointments, selectedDoctorId, statusFilter, slotFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const list =
      selectedDoctorId === "all"
        ? appointments
        : appointments.filter((a) => String(a.doctorId) === String(selectedDoctorId));

    const total = list.length;
    const confirmed = list.filter((a) => (a.status || "confirmed") === "confirmed").length;
    const completed = list.filter((a) => a.status === "completed").length;
    const cancelled = list.filter((a) => a.status === "cancelled").length;
    const totalRevenue = list
      .filter((a) => a.status !== "cancelled")
      .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

    return { total, confirmed, completed, cancelled, totalRevenue };
  }, [appointments, selectedDoctorId]);

  function handleDoctorChange(e) {
    const val = e.target.value;
    if (val === "all") {
      navigate("/doctor-dashboard", { replace: true });
    } else {
      navigate(`/doctor-dashboard/${val}`, { replace: true });
    }
  }

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

  function handleLoadDemoData() {
    seedDemoAppointments(DEMO_SEED_APPOINTMENTS);
  }

  if (loadingDocs) {
    return <Spinner label="Loading clinic schedule & clinician profiles…" />;
  }

  return (
    <div className="doctor-dashboard-container">
      {/* Clinician Identity Banner */}
      <section className="card doctor-banner">
        <div className="doctor-banner-main">
          <div className="doctor-avatar" aria-hidden="true">
            {activeDoctor ? "👨‍⚕️" : "🏥"}
          </div>
          <div>
            <div className="doctor-banner-tags">
              <span className="badge staff-badge">Staff Clinician</span>
              {activeDoctor && (
                <span className="badge dept-badge">{activeDoctor.department}</span>
              )}
            </div>
            <h2 style={{ margin: "0.25rem 0", fontSize: "1.5rem" }}>
              {activeDoctor ? activeDoctor.name : "Campus Clinic — All Doctors Roster"}
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              {activeDoctor ? (
                <>
                  {activeDoctor.title} · {activeDoctor.years} years experience · ID:{" "}
                  <strong>{activeDoctor.doctorId || `DOC-${activeDoctor.id}`}</strong>
                  {activeDoctor.phone ? ` · 📞 ${activeDoctor.phone}` : ""}
                </>
              ) : (
                "Comprehensive student appointment queue across all clinic practitioners."
              )}
            </p>
          </div>
        </div>

        <div className="doctor-banner-controls">
          <label htmlFor="doctorSelect" className="control-label">
            Switch Doctor View
          </label>
          <select
            id="doctorSelect"
            value={selectedDoctorId}
            onChange={handleDoctorChange}
            className="doctor-select-input"
          >
            <option value="all">🌐 All Clinicians ({appointments.length} total)</option>
            {doctors.map((doc) => {
              const count = appointments.filter(
                (a) => String(a.doctorId) === String(doc.id)
              ).length;
              return (
                <option key={doc.id} value={String(doc.id)}>
                  {doc.name} — {doc.department} ({count} booked)
                </option>
              );
            })}
          </select>

          <div className="banner-quick-actions">
            {appointments.length === 0 && (
              <button
                type="button"
                className="btn small"
                onClick={handleLoadDemoData}
                title="Populate sample student appointments to test dashboard"
              >
                + Seed Demo Appointments
              </button>
            )}
            <Link to="/doctors" className="btn small ghost">
              Browse Doctors
            </Link>
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

        <div className="card metric-card">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <span className="metric-label">Consultation Value</span>
            <span className="metric-value price-metric">
              {metrics.totalRevenue} ETB
            </span>
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
                <option value="08:30 AM">08:30 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
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
            title="No appointments found"
            message={
              appointments.length === 0
                ? "No appointments booked yet. Click 'Seed Demo Appointments' above to load sample patient data."
                : "No appointments match your active search and filter criteria."
            }
            action={
              appointments.length === 0 ? (
                <button
                  type="button"
                  className="btn"
                  onClick={handleLoadDemoData}
                >
                  Load Sample Patient Queue
                </button>
              ) : (
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
              )
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

                  {/* Clinician line if in all doctors view */}
                  {selectedDoctorId === "all" && (
                    <div>
                      <span className="assigned-doctor-line">
                        Assigned Clinician: <strong>{apt.doctorName}</strong> (
                        {apt.doctorDepartment})
                      </span>
                    </div>
                  )}

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
                      Consultation Fee: <strong>{apt.fee || 150} ETB</strong>
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
