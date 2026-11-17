// Shows loading / error / info messages in a consistent way
function StatusMessage({ type = 'info', children, onRetry }) {
  return (
    <div className={`status status-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {type === 'loading' && <span className="spinner" aria-hidden="true" />}
      <span>{children}</span>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Bandyti dar kartą
        </button>
      )}
    </div>
  );
}

export default StatusMessage;