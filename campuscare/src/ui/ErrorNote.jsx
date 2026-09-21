function ErrorNote({ message, onRetry }) {
  return (
    <div className="state-card card error-card" role="alert">
      <h2>Could not load data</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorNote;
