export default function StatusBadge({ status }) {
  const normalized = String(status || 'Pending').toLowerCase().replace(/\s+/g, '-')

  return (
    <span className={`status-badge status-${normalized}`}>
      {status || 'Pending'}
    </span>
  )
}
