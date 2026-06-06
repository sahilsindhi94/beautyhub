import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatOrderDate } from '../../utils/currency'
import './OrdersPage.css'

export default function OrdersPage() {
  const orders = useQuery(api.orders.getOrders)

  if (orders === undefined) {
    return (
      <section className="page page-orders">
        <div className="page-shell">
          <p>Loading your order history…</p>
        </div>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="page page-orders">
        <div className="page-shell orders-empty">
          <div>
            <span className="empty-icon">🛍️</span>
            <h2>No Orders Found</h2>
            <p>Your beauty journey awaits. Begin exploring our curated collections.</p>
          </div>
          <Link to="/products" className="button button-primary button-block luxury-btn">
            Explore Collection
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-orders">
      <div className="page-shell">
        <motion.div
          className="orders-hero luxury-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="section-eyebrow">Your History</span>
          <h1>Purchase Archive</h1>
        </motion.div>

        <div className="orders-grid editorial-grid">
          {orders.map((order) => (
            <motion.article
              key={order._id}
              className="order-ticket luxury-ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <div className="ticket-header">
                <div>
                  <span className="ticket-label">Order No.</span>
                  <p className="order-number">{order.orderNumber}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="ticket-body">
                <div className="ticket-date-price">
                  <div>
                    <span className="ticket-label">Date</span>
                    <p className="order-date">{formatOrderDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className="ticket-label">Total</span>
                    <p className="order-total">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="order-products-preview luxury-preview">
                  {order.orderItems.slice(0, 3).map((item) => (
                    <div key={item.name} className="order-product-pill">
                      <img src={item.image} alt={item.name} />
                      <div className="pill-info">
                        <span className="pill-name">{item.name}</span>
                        <span className="pill-qty">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="order-more">
                      <span>+{order.orderItems.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ticket-footer">
                <Link to={`/orders/${order._id}`} className="button luxury-btn-outline ticket-btn">
                  View Receipt
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
