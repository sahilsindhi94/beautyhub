import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useCart } from '../../context/CartContext'
import OrderSummaryItem from '../../components/common/OrderSummaryItem'
import {
  isValidName,
  isValidPhone,
  isValidEmail,
  isValidPincode,
  isRequired,
} from '../../utils/validators'
import { formatCurrency } from '../../utils/currency'
import './CheckoutPage.css'

const paymentOptions = [
  {
    value: 'cod',
    label: 'Cash On Delivery',
    description: 'Pay when your order arrives. The safest choice for now.',
  },
  {
    value: 'razorpay',
    label: 'Razorpay',
    description: 'Coming soon. Save your card details for a faster checkout.',
    disabled: true,
  },
  {
    value: 'stripe',
    label: 'Stripe',
    description: 'Coming soon. Secure card checkout will be available here.',
    disabled: true,
  },
]

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, deviceId } = useCart()
  const navigate = useNavigate()
  const placeOrder = useMutation(api.orders.createOrder)

  const [formValues, setFormValues] = useState({
    fullName: '',
    mobile: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shipping = cartTotal > 1500 ? 0 : cartTotal > 0 ? 100 : 0
  const discount = 0
  const total = cartTotal + shipping - discount

  const orderItems = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
    [cartItems]
  )

  const handleChange = (field) => (event) => {
    setFormValues((current) => ({
      ...current,
      [field]: event.target.value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!isValidName(formValues.fullName)) {
      nextErrors.fullName = 'Enter a valid full name.'
    }
    if (!isValidPhone(formValues.mobile)) {
      nextErrors.mobile = 'Enter a valid 10-digit mobile number.'
    }
    if (!isValidEmail(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!isRequired(formValues.addressLine1)) {
      nextErrors.addressLine1 = 'Address line 1 is required.'
    }
    if (!isRequired(formValues.city)) {
      nextErrors.city = 'City is required.'
    }
    if (!isRequired(formValues.state)) {
      nextErrors.state = 'State is required.'
    }
    if (!isValidPincode(formValues.pincode)) {
      nextErrors.pincode = 'Enter a valid 6-digit pincode.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!cartItems.length) {
      setApiError('Add at least one item to your cart before placing an order.')
      return
    }

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setApiError('')

    try {
      const { orderNumber } = await placeOrder({
        userId: deviceId,
        orderItems,
        subtotal: cartTotal,
        shipping,
        discount,
        total,
        address: {
          fullName: formValues.fullName,
          mobile: formValues.mobile,
          email: formValues.email,
          line1: formValues.addressLine1,
          line2: formValues.addressLine2,
          city: formValues.city,
          state: formValues.state,
          pincode: formValues.pincode,
          street: formValues.addressLine1,
          country: 'India',
          zipCode: formValues.pincode,
        },
        paymentMethod,
        status: 'Pending',
        createdAt: Date.now(),
      })

      clearCart()
      navigate('/order-success', {
        state: {
          orderNumber,
          total,
        },
      })
    } catch (error) {
      setApiError('Unable to place your order. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="page page-checkout">
        <div className="page-shell">
          <div className="checkout-empty">
            <div>
              <span className="empty-icon">🛍️</span>
              <h2>Your cart is empty</h2>
              <p>Add beauty essentials to your cart before checking out.</p>
            </div>
            <Link to="/products" className="button button-primary button-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-checkout">
      <div className="page-shell">
        <motion.div
          className="checkout-intro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>Checkout</h1>
          <p>Review your shipping address, payment method, and order before completing the purchase.</p>
        </motion.div>

        <div className="checkout-grid">
          <motion.form
            className="checkout-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="section-header">
              <h2>Shipping information</h2>
              <p>Tell us where to deliver your beauty essentials.</p>
            </div>

            <div className="field-grid">
              <div className="field-group full-width">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  value={formValues.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Priya Sharma"
                  type="text"
                />
                {errors.fullName && <div className="field-error">{errors.fullName}</div>}
              </div>

              <div className="field-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  id="mobile"
                  value={formValues.mobile}
                  onChange={handleChange('mobile')}
                  placeholder="9876543210"
                  type="tel"
                />
                {errors.mobile && <div className="field-error">{errors.mobile}</div>}
              </div>

              <div className="field-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={formValues.email}
                  onChange={handleChange('email')}
                  placeholder="example@mail.com"
                  type="email"
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className="field-group full-width">
                <label htmlFor="addressLine1">Address Line 1</label>
                <input
                  id="addressLine1"
                  value={formValues.addressLine1}
                  onChange={handleChange('addressLine1')}
                  placeholder="House number, street, colony"
                  type="text"
                />
                {errors.addressLine1 && <div className="field-error">{errors.addressLine1}</div>}
              </div>

              <div className="field-group full-width">
                <label htmlFor="addressLine2">Address Line 2</label>
                <textarea
                  id="addressLine2"
                  value={formValues.addressLine2}
                  onChange={handleChange('addressLine2')}
                  placeholder="Landmark, nearby locality (optional)"
                />
              </div>

              <div className="field-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  value={formValues.city}
                  onChange={handleChange('city')}
                  placeholder="Mumbai"
                  type="text"
                />
                {errors.city && <div className="field-error">{errors.city}</div>}
              </div>

              <div className="field-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  value={formValues.state}
                  onChange={handleChange('state')}
                  placeholder="Maharashtra"
                  type="text"
                />
                {errors.state && <div className="field-error">{errors.state}</div>}
              </div>

              <div className="field-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  value={formValues.pincode}
                  onChange={handleChange('pincode')}
                  placeholder="400001"
                  type="text"
                />
                {errors.pincode && <div className="field-error">{errors.pincode}</div>}
              </div>
            </div>

            <div className="section-header">
              <h2>Payment method</h2>
              <p>Select the best option for your order today.</p>
            </div>

            <div className="payment-row">
              {paymentOptions.map((option) => (
                <label
                  key={option.value}
                  className={`payment-label ${paymentMethod === option.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    disabled={option.disabled}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  <span>
                    <div className="payment-name">{option.label}</div>
                    <div className="payment-description">{option.description}</div>
                  </span>
                </label>
              ))}
            </div>

            {apiError && <div className="form-error">{apiError}</div>}

            <button type="submit" className="button button-primary button-block" disabled={isSubmitting}>
              {isSubmitting ? 'Placing your order…' : 'Place Order'}
            </button>
          </motion.form>

          <motion.aside
            className="summary-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="section-header">
              <h2>Order summary</h2>
              <p>Verify every item, quantity, and final price before completing checkout.</p>
            </div>

            <div className="order-summary-list">
              {cartItems.map((item) => (
                <OrderSummaryItem key={item._id} item={item} />
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping charge</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span>{discount === 0 ? '₹0' : `-${formatCurrency(discount)}`}</span>
            </div>
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
