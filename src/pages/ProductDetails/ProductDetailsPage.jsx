import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { motion } from 'framer-motion'
import RelatedProducts from './RelatedProducts'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import PriceDisplay from '../../components/common/PriceDisplay'
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
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
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
  const inWishlist = isInWishlist(product._id)

  return (
    <section className="page page-details">
      <div className="page-shell">
        
        {/* Breadcrumb could go here */}
        <div className="breadcrumb" style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.category}</span> / <span>{product.name}</span>
        </div>

        <div className="product-details-layout split-screen">
          {/* Image Gallery */}
          <div className="product-gallery-sticky">
            <motion.div 
              className="product-image-container luxury"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="main-image" style={{ backgroundImage: `url(${product.image})` }}>
                {discountAmount > 0 && <span className="discount-badge luxury-badge">-{discountAmount}%</span>}
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div 
            className="product-info-container luxury-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="details-brand">{product.brand}</span>
            <h1 className="details-name">{product.name}</h1>
            
            <div className="details-meta-row">
              <RatingStars rating={product.rating} />
              <span className="details-category">· {product.category}</span>
            </div>
            
            <div className="details-pricing luxury-pricing">
              <PriceDisplay price={product.price} oldPrice={product.oldPrice} className="details-price-display" />
            </div>

            <p className="details-description">{product.description}</p>
            
            <div className="why-love-it-section">
              <h3>Why You'll Love It</h3>
              <ul className="benefits-list">
                <li><span className="check">✓</span> Premium quality formulation</li>
                <li><span className="check">✓</span> Cruelty-free and ethically sourced</li>
                <li><span className="check">✓</span> Long-lasting radiant finish</li>
              </ul>
            </div>

            <div className="details-actions luxury-actions">
              <button
                className="button luxury-btn-full"
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              <button
                className={`button luxury-wishlist-btn ${inWishlist ? 'active' : ''}`}
                aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                onClick={() =>
                  inWishlist ? removeFromWishlist(product._id) : addToWishlist(product)
                }
              >
                {inWishlist ? '♥' : '♡'}
              </button>
            </div>
            
            <div className="details-stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">Ships within 24 hours ({product.stock} left)</span>
              ) : (
                <span className="out-of-stock">Currently unavailable</span>
              )}
            </div>
          </motion.div>
        </div>

        <RelatedProducts category={product.category} currentProductId={product._id} />
      </div>
    </section>
  )
}
