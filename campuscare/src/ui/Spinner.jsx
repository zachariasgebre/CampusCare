function Spinner({ label = "Loading…" }) {
  return (
    <div className="state-card card" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default Spinner;
