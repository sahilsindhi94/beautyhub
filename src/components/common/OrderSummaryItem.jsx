export default function OrderSummaryItem({ item }) {
  return (
    <div className="order-summary-item">
      <div
        className="summary-image"
        role="img"
        aria-label={item.name}
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="summary-copy">
        <p className="summary-name">{item.name}</p>
        <p className="summary-meta">Qty {item.quantity}</p>
      </div>
      <div className="summary-price">₹{item.price * item.quantity}</div>
    </div>
  )
}
