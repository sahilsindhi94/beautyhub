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
          className="orders-hero premium-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Purchase Archive</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem' }}>Track your premium beauty acquisitions.</p>
        </motion.div>

        <div className="orders-timeline premium-timeline">
          {orders.map((order, index) => (
            <motion.article
              key={order._id}
              className="order-ticket glass-panel premium-ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.1 }}
            >
              <div className="timeline-dot"></div>
              <div className="ticket-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="ticket-label" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order No.</span>
                  <p className="order-number" style={{ fontFamily: 'var(--heading)', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{order.orderNumber}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span className="ticket-label" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</span>
                  <p className="order-date" style={{ fontWeight: 600, margin: 0 }}>{formatOrderDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="ticket-body">
                <div className="order-products-preview premium-preview">
                  {order.orderItems.map((item) => (
                    <div key={item.name} className="order-product-pill">
                      <img src={item.image} alt={item.name} />
                      <div className="pill-info">
                        <span className="pill-name">{item.name}</span>
                        <span className="pill-qty">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ticket-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="ticket-label" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                    <p className="order-total" style={{ fontFamily: 'var(--heading)', fontWeight: 800, fontSize: '1.2rem', margin: 0, color: 'var(--primary)' }}>{formatCurrency(order.total)}</p>
                  </div>
                  <span className={`order-status-badge premium-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <Link to={`/orders/${order._id}`} className="button button-primary ticket-btn" style={{ borderRadius: '100px', padding: '10px 24px', fontWeight: 600 }}>
                  View Details
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
