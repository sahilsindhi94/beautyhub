import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/currency'
import './OrderSuccessPage.css'

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}

  useEffect(() => {
    if (!state.orderNumber) {
      navigate('/orders', { replace: true })
    }
  }, [navigate, state.orderNumber])

  if (!state.orderNumber) {
    return null
  }

  return (
    <section className="page page-order-success">
      <div className="page-shell order-success-shell">
        <motion.div
          className="order-success-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="success-icon">✓</div>
          <h1>Order placed successfully!</h1>
          <p>Your order is confirmed. We'll notify you as soon as it's on its way.</p>

          <div className="success-details">
            <div>
              <span>Order number</span>
              <strong>{state.orderNumber}</strong>
            </div>
            <div>
              <span>Order total</span>
              <strong>{formatCurrency(state.total)}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/products" className="button button-primary">
              Continue shopping
            </Link>
            <Link to="/orders" className="button button-secondary">
              View orders
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
