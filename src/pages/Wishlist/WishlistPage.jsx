import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import PriceDisplay from '../../components/common/PriceDisplay'
import './WishlistPage.css'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item, e) => {
    e.preventDefault()
    addToCart(item)
    removeFromWishlist(item._id)
  }

  const handleRemove = (id, e) => {
    e.preventDefault()
    removeFromWishlist(id)
  }

  if (wishlistItems.length === 0) {
    return (
      <section className="page page-wishlist premium-wishlist-bg">
        <div className="page-shell">
          <div className="premium-empty-state glass-panel">
            <div className="empty-icon-wrapper">
              <span className="empty-icon">💖</span>
            </div>
            <h2 style={{ fontFamily: 'var(--heading)', fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px' }}>Nothing to love yet</h2>
            <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginBottom: '32px' }}>Your curated collection of premium beauty awaits.</p>
            <Link to="/products" className="button premium-explore-btn">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-wishlist premium-wishlist-bg">
      <div className="page-shell">
        <motion.div 
          className="wishlist-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="wishlist-title" style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Curated Collection</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginTop: '8px' }}>{wishlistItems.length} items saved</p>
        </motion.div>
        
        <div className="wishlist-masonry">
          {wishlistItems.map((item, index) => (
            <motion.div 
              key={item._id} 
              className="wishlist-masonry-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link to={`/products/${item._id}`} className="wishlist-masonry-link">
                <div className="wishlist-image-wrapper">
                  <img src={item.image} alt={item.name} className="wishlist-image" />
                  
                  {/* Overlay Actions */}
                  <div className="wishlist-item-overlay">
                    <button 
                      className="wishlist-action-btn remove-btn"
                      onClick={(e) => handleRemove(item._id, e)}
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                    
                    <button 
                      className={`wishlist-quick-add ${item.stock === 0 ? 'disabled' : ''}`}
                      onClick={(e) => handleMoveToCart(item, e)}
                      disabled={item.stock === 0}
                    >
                      {item.stock === 0 ? 'Out of Stock' : 'Quick Add to Bag'}
                    </button>
                  </div>
                </div>
                
                <div className="wishlist-item-info">
                  <span className="item-brand">{item.brand}</span>
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-price-wrapper">
                    <PriceDisplay price={item.price} oldPrice={item.oldPrice} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
