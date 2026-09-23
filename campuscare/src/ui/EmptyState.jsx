function EmptyState({ title, message, action }) {
  return (
    <div className="state-card card">
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
