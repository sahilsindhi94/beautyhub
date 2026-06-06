import ProductCard from '../product/ProductCard'
import ProductSkeleton from '../ui/ProductSkeleton'

export default function ProductListSection({ title, subtitle, eyebrow, products, isLoading }) {
  return (
    <section className="section">
      <div className="section-header-wrap">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="gradient-text" style={{display: 'inline-block'}}>{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      
      {isLoading ? (
        <div className="product-grid loading-state">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="product-grid empty-state" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>No products found.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}
