import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useState, useEffect } from 'react'

const FALLBACK_IMAGE = 'https://placehold.co/600x600/f5f0ee/b76e79?text=Image+Not+Found'

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
      className="product-card"
      custom={index}
      variants={productVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/products/${product._id}`} className="product-thumb-link" style={{ display: 'block' }}>
        <div className="product-thumb" style={{ backgroundImage: `url(${imgUrl})` }}>
          {product.oldPrice && (
            <span className="discount-badge">
              {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
            </span>
          )}
          <motion.button 
            type="button" 
            className={`wishlist-button ${inWishlist ? 'active' : ''}`}
            aria-label="Add to wishlist"
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlistToggle}
            style={{ color: inWishlist ? '#ef4444' : '' }}
          >
            {inWishlist ? '♥' : '♡'}
          </motion.button>
        </div>
      </Link>
      <div className="product-details">
        <span className="product-brand">{product.brand}</span>
        <h3>
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="product-rating">{stars}</div>
        <div className="product-pricing">
          <span className="current-price">₹{product.price}</span>
          {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
        </div>
        <motion.button 
          type="button" 
          className={`button product-action ${added ? 'button-success' : 'button-secondary'}`}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.article>
  )
}
