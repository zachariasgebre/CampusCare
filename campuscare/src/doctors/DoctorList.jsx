import DoctorCard from "./DoctorCard";
import EmptyState from "../ui/EmptyState";

function DoctorList({ doctors }) {
  if (!doctors?.length) {
    return (
      <EmptyState
        title="No doctors found"
        message="Try another department filter — the clinic roster is empty for this choice."
      />
    );
  }

  return (
    <div className="doctor-grid">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

export default DoctorList;
