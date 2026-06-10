import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useState, useEffect } from 'react'
import PriceDisplay from '../common/PriceDisplay'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'

export default function ProductCard({ product, index }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [added, setAdded] = useState(false)
  const [imgUrl, setImgUrl] = useState(product.image)
  const inWishlist = isInWishlist(product._id)

  useEffect(() => {
    const img = new Image();
    img.src = product.image;
    img.onerror = () => {
      setImgUrl(FALLBACK_IMAGE)
    };
  }, [product.image])

  const productVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08 } }),
  }

  const fullStars = Math.floor(product.rating || 0)
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < fullStars ? 'star filled' : 'star'}>★</span>
  ))

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (added) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <motion.article
      className="product-card glass-panel glow-effect"
      custom={index}
      variants={productVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
    >
      <div className="product-thumb-container">
        <Link to={`/products/${product._id}`} className="product-thumb-link" style={{ display: 'block' }}>
          <div className="product-thumb" style={{ backgroundImage: `url(${imgUrl})` }}>
            <div className="product-badges">
              {product.oldPrice && (
                <span className="badge-discount">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              )}
              {product.rating >= 4.8 && (
                <span className="badge-bestseller">Trending</span>
              )}
            </div>
            
            <motion.button 
              type="button" 
              className={`wishlist-button trendy ${inWishlist ? 'active' : ''}`}
              aria-label="Add to wishlist"
              whileTap={{ scale: 0.8 }}
              onClick={handleWishlistToggle}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "var(--primary)" : "none"} stroke={inWishlist ? "var(--primary)" : "currentColor"} strokeWidth="1.5">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          </div>
        </Link>
        <div className="product-hover-actions">
          <motion.button 
            type="button" 
            className={`button button-primary quick-add-btn ${added ? 'added' : ''}`}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
      <div className="product-details trendy">
        <span className="product-brand gradient-text">{product.brand}</span>
        <h3>
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="product-price-row">
          <PriceDisplay price={product.price} oldPrice={product.oldPrice} />
          <div className="product-rating-compact" style={{ background: 'var(--bg-soft)', color: 'var(--primary)' }}>
            <span className="star-icon">★</span> {product.rating || '5.0'}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
