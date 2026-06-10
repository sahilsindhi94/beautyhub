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
  const { cartItems, cartTotal, clearCart } = useCart()
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
  const [checkoutStep, setCheckoutStep] = useState(1)

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

  const validateStep1 = () => {
    const nextErrors = {}
    if (!isValidName(formValues.fullName)) nextErrors.fullName = 'Enter a valid full name.'
    if (!isValidPhone(formValues.mobile)) nextErrors.mobile = 'Enter a valid 10-digit mobile number.'
    if (!isValidEmail(formValues.email)) nextErrors.email = 'Enter a valid email address.'
    if (!isRequired(formValues.addressLine1)) nextErrors.addressLine1 = 'Address line 1 is required.'
    if (!isRequired(formValues.city)) nextErrors.city = 'City is required.'
    if (!isRequired(formValues.state)) nextErrors.state = 'State is required.'
    if (!isValidPincode(formValues.pincode)) nextErrors.pincode = 'Enter a valid 6-digit pincode.'
    
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const nextStep = () => {
    if (checkoutStep === 1) {
      if (validateStep1()) setCheckoutStep(2)
    } else if (checkoutStep === 2) {
      setCheckoutStep(3)
    }
  }

  const prevStep = () => {
    setCheckoutStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!cartItems.length) {
      setApiError('Add at least one item to your cart before placing an order.')
      return
    }

    setIsSubmitting(true)
    setApiError('')

    try {
      const { orderNumber } = await placeOrder({
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
    } catch {
      setApiError('Unable to place your order. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="page page-checkout premium-checkout-bg">
        <div className="page-shell">
          <div className="premium-empty-state glass-panel" style={{ marginTop: '40px' }}>
            <div className="empty-icon-wrapper">
              <span className="empty-icon">🛍️</span>
            </div>
            <h2 style={{ fontFamily: 'var(--heading)', fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginBottom: '32px' }}>Add beauty essentials to your cart before checking out.</p>
            <Link to="/products" className="button premium-explore-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page-checkout premium-checkout-bg">
      <div className="page-shell">
        <motion.div
          className="checkout-intro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 800, margin: '0 0 32px', textAlign: 'center', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Secure Checkout</h1>
          <div className="checkout-progress premium-progress">
            <div className={`progress-step ${checkoutStep >= 1 ? 'active' : ''}`} onClick={() => checkoutStep > 1 && setCheckoutStep(1)}>
              <span className="step-num">1</span> Shipping
            </div>
            <div className={`progress-line ${checkoutStep >= 2 ? 'active' : ''}`} />
            <div className={`progress-step ${checkoutStep >= 2 ? 'active' : ''}`} onClick={() => checkoutStep > 2 && setCheckoutStep(2)}>
              <span className="step-num">2</span> Payment
            </div>
            <div className={`progress-line ${checkoutStep >= 3 ? 'active' : ''}`} />
            <div className={`progress-step ${checkoutStep >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span> Review
            </div>
          </div>
        </motion.div>

        <div className="checkout-grid premium-checkout-grid">
          <motion.form
            className="checkout-form glass-panel premium-checkout-panel"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            {checkoutStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="section-header premium-section-header">
                  <h2>1. Shipping information</h2>
                  <p>Tell us where to deliver your beauty essentials.</p>
                </div>

                <div className="field-grid premium-field-grid">
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
                <div className="form-actions">
                  <button type="button" className="button premium-continue-btn" onClick={nextStep}>
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {checkoutStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="section-header premium-section-header">
                  <h2>2. Payment Method</h2>
                  <p>Choose how you want to pay for your order.</p>
                </div>

                <div className="payment-options">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`payment-option ${option.disabled ? 'disabled' : ''} ${paymentMethod === option.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={option.disabled}
                      />
                      <div className="payment-option-details">
                        <span className="payment-option-label">{option.label}</span>
                        <span className="payment-option-desc">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="form-actions" style={{ marginTop: '2rem' }}>
                  <button type="button" className="button premium-back-btn" onClick={prevStep} style={{flex: 1, marginTop: 0}}>
                    Back
                  </button>
                  <button type="button" className="button premium-continue-btn" onClick={nextStep} style={{flex: 2, marginTop: 0}}>
                    Continue to Review
                  </button>
                </div>
              </motion.div>
            )}

            {checkoutStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="section-header premium-section-header">
                  <h2>3. Review & Submit</h2>
                  <p>Confirm your details and place your order.</p>
                </div>
                
                <div className="review-block glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--heading)', fontSize: '1.2rem', color: 'var(--text)' }}>Shipping To:</h4>
                  <p style={{ margin: 0, color: 'var(--text-soft)', lineHeight: 1.6 }}>{formValues.fullName}<br/>{formValues.addressLine1}, {formValues.city}, {formValues.state} - {formValues.pincode}</p>
                </div>
                
                <div className="review-block glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--heading)', fontSize: '1.2rem', color: 'var(--text)' }}>Payment Method:</h4>
                  <p style={{ margin: 0, color: 'var(--text-soft)', fontWeight: 600 }}>{paymentOptions.find(o => o.value === paymentMethod)?.label}</p>
                </div>

                {apiError && <div className="field-error" style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1rem' }}>{apiError}</div>}
                
                <div className="form-actions space-between">
                  <button type="button" className="button premium-back-btn" onClick={prevStep} disabled={isSubmitting}>
                    ← Back
                  </button>
                  <button type="submit" className="button premium-continue-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Placing Order...' : 'Place Order Now'}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.form>

          <motion.aside
            className="checkout-summary-wrapper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="premium-summary glass-panel">
              <div className="section-header premium-section-header">
                <h2>Order summary</h2>
              </div>

              <div className="summary-items">
                {cartItems.map((item) => (
                  <OrderSummaryItem key={item._id} item={item} />
                ))}
              </div>

              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-soft)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-soft)' }}>Shipping charge</span>
                <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ color: 'var(--text-soft)' }}>Discount</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>{discount === 0 ? '₹0' : `-${formatCurrency(discount)}`}</span>
              </div>
              
              <div className="summary-row total-row" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px dashed var(--border)', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--heading)', fontWeight: 800, fontSize: '1.2rem' }}>Grand Total</span>
                <span style={{ fontFamily: 'var(--heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>{formatCurrency(total)}</span>
              </div>

              <div className="trust-badges" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', opacity: 0.6 }}>
                <span style={{ fontSize: '1.5rem' }}>🔒</span>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}

