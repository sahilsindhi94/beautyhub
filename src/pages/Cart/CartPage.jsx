import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import PriceDisplay from '../../components/common/PriceDisplay'
import './CartPage.css'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, itemCount } = useCart()

  const shippingEstimate = cartTotal > 1500 ? 0 : 100
  const grandTotal = cartTotal + (cartTotal > 0 ? shippingEstimate : 0)

  if (cartItems.length === 0) {
    return (
      <section className="page page-cart premium-cart-bg">
        <div className="page-shell">
          <div className="premium-empty-state glass-panel" style={{ marginTop: '40px' }}>
            <div className="empty-icon-wrapper">
              <span className="empty-icon">🛒</span>
            </div>
            <h2 style={{ fontFamily: 'var(--heading)', fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px' }}>Your bag is empty</h2>
            <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginBottom: '32px' }}>Looks like you haven't added any beauty essentials yet.</p>
            <Link to="/products" className="button premium-explore-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-cart premium-cart-bg">
      <div className="page-shell">
        <motion.div 
          className="cart-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="cart-title" style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Your Bag</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginTop: '8px' }}>{itemCount} items</p>
        </motion.div>
        
        <div className="cart-layout premium-layout-split">
          {/* Cart Items List */}
          <div className="cart-items premium-cart-list">
            {cartItems.map((item, index) => (
              <motion.div 
                key={item._id} 
                className="cart-item glass-panel premium-cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="cart-item-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                <div className="cart-item-details">
                  <span className="item-brand">{item.brand}</span>
                  <Link to={`/products/${item._id}`} className="item-name">{item.name}</Link>
                  <PriceDisplay price={item.price} oldPrice={item.oldPrice} />
                </div>
                
                <div className="cart-item-controls">
                  <div className="premium-quantity-control">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.stock}
                    >+</button>
                  </div>
                  <div className="item-subtotal">
                    ₹{item.price * item.quantity}
                  </div>
                  <button 
                    className="premium-remove-button" 
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
            
            <div className="cart-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button className="button button-outline" onClick={clearCart} style={{ borderRadius: '100px', padding: '12px 24px' }}>
                Clear Bag
              </button>
              <Link to="/products" className="continue-shopping" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-wrapper">
            <motion.div 
              className="order-summary glass-panel premium-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3>Order Summary</h3>
              
              <div className="premium-coupon-section">
                <input type="text" placeholder="Promo code" className="premium-coupon-input" />
                <button className="premium-coupon-btn">Apply</button>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ fontWeight: 600 }}>{shippingEstimate === 0 ? 'Free' : `₹${shippingEstimate}`}</span>
              </div>
              {shippingEstimate > 0 && (
                <div className="shipping-notice" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '-8px', marginBottom: '16px' }}>
                  Free shipping on orders over ₹1500
                </div>
              )}
              <div className="summary-row total-row">
                <span>Total</span>
                <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>₹{grandTotal}</span>
              </div>
              
              <Link to="/checkout" className="button premium-checkout-btn">
                Proceed to Checkout
              </Link>

              <div className="trust-badges" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.6 }}>
                <span style={{ fontSize: '1.5rem' }}>🔒</span>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
