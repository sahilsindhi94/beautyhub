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
      <section className="page page-cart">
        <div className="page-shell">
          <div className="cart-empty-state">
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80" alt="Empty Cart" className="empty-state-image" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any beauty essentials to your cart yet.</p>
            <Link to="/products" className="button button-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-cart">
      <div className="page-shell">
        <h1 className="cart-title">Your Cart ({itemCount} items)</h1>
        
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <motion.div 
                key={item._id} 
                className="cart-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="cart-item-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                <div className="cart-item-details">
                  <span className="item-brand">{item.brand}</span>
                  <Link to={`/products/${item._id}`} className="item-name">{item.name}</Link>
                  <PriceDisplay price={item.price} oldPrice={item.oldPrice} />
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-control">
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
                    className="remove-button" 
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
            
            <div className="cart-actions">
              <button className="button button-outline" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-wrapper">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingEstimate === 0 ? 'Free' : `₹${shippingEstimate}`}</span>
              </div>
              {shippingEstimate > 0 && (
                <p className="shipping-hint">Free shipping on orders over ₹1500</p>
              )}
              
              <div className="summary-row grand-total">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <Link to="/checkout" className="button button-primary button-block">
                Proceed to Checkout
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
