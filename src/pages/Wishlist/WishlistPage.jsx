import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import './WishlistPage.css' // Will create shortly

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item) => {
    addToCart(item)
    removeFromWishlist(item._id)
  }

  if (wishlistItems.length === 0) {
    return (
      <section className="page page-wishlist">
        <div className="page-shell">
          <div className="wishlist-empty-state">
            <div className="empty-icon">♥</div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love here and review them later.</p>
            <Link to="/products" className="button button-primary">
              Discover Products
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-wishlist">
      <div className="page-shell">
        <h1 className="wishlist-title">My Wishlist ({wishlistItems.length} items)</h1>
        
        <div className="wishlist-grid">
          {wishlistItems.map((item, index) => (
            <motion.div 
              key={item._id} 
              className="wishlist-item-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/products/${item._id}`} className="wishlist-item-image-link">
                <div className="wishlist-item-image" style={{ backgroundImage: `url(${item.image})` }}></div>
              </Link>
              
              <div className="wishlist-item-info">
                <span className="item-brand">{item.brand}</span>
                <Link to={`/products/${item._id}`} className="item-name">{item.name}</Link>
                <div className="item-price">
                  <span className="current-price">₹{item.price}</span>
                  {item.oldPrice && <span className="old-price">₹{item.oldPrice}</span>}
                </div>
              </div>

              <div className="wishlist-item-actions">
                <button 
                  className="button button-primary button-block"
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock === 0}
                >
                  {item.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
                <button 
                  className="button button-outline button-block remove-btn"
                  onClick={() => removeFromWishlist(item._id)}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
