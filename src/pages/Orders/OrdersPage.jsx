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
            <span className="empty-icon">📦</span>
            <h2>No orders yet</h2>
            <p>Once you place an order, it will appear here with delivery updates and order details.</p>
          </div>
          <Link to="/products" className="button button-primary button-block">
            Shop beauty essentials
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-orders">
      <div className="page-shell">
        <motion.div
          className="orders-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>My Orders</h1>
          <p>Track recent purchases, review order totals, and open any order for more detail.</p>
        </motion.div>

        <div className="orders-grid">
          {orders.map((order) => (
            <motion.article
              key={order._id}
              className="order-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <div className="order-card-header">
                <div>
                  <p className="order-number">{order.orderNumber}</p>
                  <p className="order-date">{formatOrderDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="order-card-body">
                <div className="order-detail-row">
                  <span>{order.orderItems.length} products</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>

                <div className="order-products-preview">
                  {order.orderItems.slice(0, 3).map((item) => (
                    <div key={item.name} className="order-product-pill">
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <span className="order-more">+{order.orderItems.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="order-card-footer">
                <Link to={`/orders/${order._id}`} className="button button-secondary">
                  View details
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
