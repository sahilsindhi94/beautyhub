import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import ProductCard from '../../components/product/ProductCard'
import ProductSkeleton from '../../components/ui/ProductSkeleton'

export default function RelatedProducts({ category, currentProductId }) {
  const products = useQuery(api.products.getProductsByCategory, { category })

  if (products === undefined) {
    return (
      <section className="related-products">
        <h3>Related Products</h3>
        <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  // Filter out current product and limit to 4
  const related = products.filter(p => p._id !== currentProductId).slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="related-products" style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>You may also like</h3>
      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {related.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}
