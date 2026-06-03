export default function ProductSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="product-thumb skeleton" style={{ minHeight: '280px' }}></div>
      <div className="product-details">
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '12px', marginBottom: '8px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80%', height: '24px', marginBottom: '8px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-button" style={{ height: '40px', borderRadius: '4px' }}></div>
      </div>
    </div>
  )
}
