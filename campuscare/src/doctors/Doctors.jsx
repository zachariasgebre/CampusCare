import { useSearchParams } from "react-router-dom";
import { fetchDoctors, getDepartments } from "../api/doctors";
import { useFetch } from "../hooks/useFetch";
import DepartmentFilter from "./DepartmentFilter";
import DoctorList from "./DoctorList";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";

function Doctors() {
  const [params, setParams] = useSearchParams();
  const department = params.get("department") ?? "All";
  const fail = params.get("fail") === "1";

  const { data: doctors, loading, error, retry } = useFetch(
    (signal) => fetchDoctors({ fail, signal }),
    [fail]
  );

  function chooseDepartment(next) {
    const nextParams = {};
    if (next !== "All") nextParams.department = next;
    if (fail) nextParams.fail = "1";
    setParams(nextParams);
  }

  if (loading) return <Spinner label="Loading campus doctors…" />;
  if (error) return <ErrorNote message={error} onRetry={retry} />;

  const visible =
    department === "All"
      ? doctors || []
      : (doctors || []).filter((d) => d.department === department);

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="eyebrow">Doctors</p>
          <h2>Find a campus clinician</h2>
        </div>
        
      </div>

      <DepartmentFilter
        departments={getDepartments()}
        value={department}
        onChange={chooseDepartment}
      />

      <DoctorList doctors={visible} />
    </section>
  );
}

export default Doctors;
