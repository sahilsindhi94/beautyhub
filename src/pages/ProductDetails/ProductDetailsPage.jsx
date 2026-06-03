import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { motion } from 'framer-motion'
import RelatedProducts from './RelatedProducts'
import './ProductDetailsPage.css'

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating || 0)
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < fullStars ? 'star filled' : 'star'}>★</span>
  ))
  return <div className="details-rating-stars">{stars} <span className="rating-num">({rating})</span></div>
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  
  // Use useQuery with conditional skipping/handling or cast id properly
  const product = useQuery(api.products.getProductById, { productId: id })

  useEffect(() => {
    if (product) {
      document.title = `BeautyHub | ${product.name}`
    } else {
      document.title = 'BeautyHub | Loading...'
    }
  }, [product])

  if (product === undefined) {
    return (
      <section className="page page-details">
        <div className="page-shell">
          <div className="details-skeleton">
             <div className="skeleton img-skeleton"></div>
             <div className="info-skeleton">
               <div className="skeleton text-skeleton" style={{width: '30%', height: '20px'}}></div>
               <div className="skeleton text-skeleton" style={{width: '80%', height: '40px'}}></div>
               <div className="skeleton text-skeleton" style={{width: '100%', height: '100px'}}></div>
               <div className="skeleton text-skeleton" style={{width: '40%', height: '40px'}}></div>
             </div>
          </div>
        </div>
      </section>
    )
  }

  if (product === null) {
    return (
      <section className="page page-details">
        <div className="page-shell empty-state" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/products" className="button button-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Back to Products
          </Link>
        </div>
      </section>
    )
  }

  const discountAmount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  return (
    <section className="page page-details">
      <div className="page-shell">
        
        {/* Breadcrumb could go here */}
        <div className="breadcrumb" style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.category}</span> / <span>{product.name}</span>
        </div>

        <div className="product-details-layout">
          {/* Image Gallery */}
          <motion.div 
            className="product-image-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="main-image" style={{ backgroundImage: `url(${product.image})` }}>
              {discountAmount > 0 && <span className="discount-badge badge-large">{discountAmount}% OFF</span>}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="product-info-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="details-brand">{product.brand}</span>
            <h1 className="details-name">{product.name}</h1>
            
            <RatingStars rating={product.rating} />
            
            <div className="details-pricing">
              <span className="details-current-price">₹{product.price}</span>
              {product.oldPrice && <span className="details-old-price">₹{product.oldPrice}</span>}
            </div>

            <div className="details-stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <p className="details-description">{product.description}</p>

            <div className="details-actions">
              <button className="button button-primary button-large" disabled={product.stock === 0}>
                Add to Cart
              </button>
              <button className="button button-outline button-icon" aria-label="Add to Wishlist">
                ♥
              </button>
            </div>
            
            <div className="details-meta">
              <p><strong>Category:</strong> {product.category}</p>
            </div>
          </motion.div>
        </div>

        <RelatedProducts category={product.category} currentProductId={product._id} />
      </div>
    </section>
  )
}
