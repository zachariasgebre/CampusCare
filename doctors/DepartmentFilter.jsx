function DepartmentFilter({ departments, value, onChange }) {
  return (
    <div className="chip-row" role="group" aria-label="Filter by department">
      {departments.map((dept) => (
        <button
          key={dept}
          type="button"
          className={`chip ${value === dept ? "active" : ""}`}
          onClick={() => onChange(dept)}
        >
          {dept}
        </button>
      ))}
    </div>
  );
}

export default DepartmentFilter;
