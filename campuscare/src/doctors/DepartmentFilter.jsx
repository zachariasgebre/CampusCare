function DepartmentFilter({ departments = [], value, onChange }) {
  return (
    <div className="filter-bar" role="toolbar" aria-label="Department filters">
      {departments.map((dept) => (
        <button
          key={dept}
          type="button"
          className={`filter-btn ${value === dept ? "active" : ""}`}
          onClick={() => onChange(dept)}
        >
          {dept}
        </button>
      ))}
    </div>
  );
}

export default DepartmentFilter;
