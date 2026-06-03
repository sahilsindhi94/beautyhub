import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import ProductCard from '../product/ProductCard'
import ProductSkeleton from '../ui/ProductSkeleton'

export default function FeaturedProducts() {
  const featuredProducts = useQuery(api.products.getFeaturedProducts)

  return (
    <section className="section featured-products">
      <div className="section-header-wrap">
        <p className="section-eyebrow">Featured products</p>
        <h2>Curated beauty essentials made for luxury conditions.</h2>
      </div>
      
      {featuredProducts === undefined ? (
        <div className="product-grid loading-state">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : featuredProducts.length === 0 ? (
        <div className="product-grid empty-state" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>No featured products found.</p>
        </div>
      ) : (
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}
