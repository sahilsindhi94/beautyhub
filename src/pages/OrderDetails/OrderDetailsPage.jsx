import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatOrderDate } from '../../utils/currency'
import './OrderDetailsPage.css'

const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered']

export default function OrderDetailsPage() {
  const { id } = useParams()
  const order = useQuery(api.orders.getOrderById, { orderId: id })

  if (order === undefined) {
    return (
      <section className="page page-order-details">
        <div className="page-shell">
          <p>Loading order details…</p>
        </div>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="page page-order-details">
        <div className="page-shell orders-not-found">
          <h2>Order not found</h2>
          <p>We couldn’t locate the requested order. Please check your order number.</p>
          <Link to="/orders" className="button button-primary button-block">
            Back to orders
          </Link>
        </div>
      </section>
    )
  }

  const timeline = order.status === 'Cancelled' ? ['Pending', 'Cancelled'] : statusSteps
  const currentIndex = timeline.indexOf(order.status)

  return (
    <section className="page page-order-details">
      <div className="page-shell">
        <motion.div
          className="order-details-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1>Order details</h1>
          <p>Everything you need to know about your delivery and shipping information.</p>
        </motion.div>

        <div className="order-details-grid">
          <div className="order-summary-card">
            <div className="detail-header">
              <div>
                <p className="order-label">Order number</p>
                <h2>{order.orderNumber}</h2>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="detail-row">
              <span>Placed on</span>
              <span>{formatOrderDate(order.createdAt)}</span>
            </div>
            <div className="detail-row">
              <span>Payment</span>
              <span>{order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="shipping-card">
            <h2>Shipping information</h2>
            <p>{order.address.fullName}</p>
            <p>{order.address.mobile}</p>
            <p>{order.address.email}</p>
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
          </div>
        </div>

        <div className="timeline-card">
          <h2>Order timeline</h2>
          <div className="timeline-list">
            {timeline.map((step, index) => (
              <div key={step} className={`timeline-step ${index <= currentIndex ? 'active' : ''}`}>
                <span className="timeline-marker" />
                <div>
                  <p>{step}</p>
                  {index === currentIndex && <small>Current status</small>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-products-panel">
          <div className="panel-header">
            <h2>Products in this order</h2>
            <Link to="/orders" className="button button-secondary">
              Back to orders
            </Link>
          </div>
          <div className="order-products-list">
            {order.orderItems.map((item, index) => (
              <div key={`${item.productId || item.name}-${index}`} className="order-product-row">
                <div className="product-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="product-copy">
                  <p className="product-name">{item.name}</p>
                  <p className="product-meta">Qty {item.quantity}</p>
                </div>
                <div className="product-price">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
