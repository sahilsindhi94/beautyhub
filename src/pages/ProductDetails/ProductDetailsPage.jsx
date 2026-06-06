import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { motion } from 'framer-motion'
import RelatedProducts from './RelatedProducts'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import PriceDisplay from '../../components/common/PriceDisplay'
import { useState } from 'react'
import './ProductDetailsPage.css'

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating || 0)
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < fullStars ? 'star filled' : 'star'}>★</span>
  ))
  return <div className="details-rating-stars">{stars} <span className="rating-num">({rating})</span></div>
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const [activeImage, setActiveImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const product = useQuery(api.products.getProductById, { productId: id })

  useEffect(() => {
    if (product) {
      document.title = `BeautyHub | ${product.name}`
    } else {
      document.title = 'BeautyHub | Loading...'
    }
  }, [product])

  if (product === undefined) {
    return (
      <section className="page page-details">
        <div className="page-shell">
          <div className="details-skeleton">
             <div className="skeleton img-skeleton"></div>
             <div className="info-skeleton">
               <div className="skeleton text-skeleton" style={{width: '30%', height: '20px'}}></div>
               <div className="skeleton text-skeleton" style={{width: '80%', height: '40px'}}></div>
               <div className="skeleton text-skeleton" style={{width: '100%', height: '100px'}}></div>
               <div className="skeleton text-skeleton" style={{width: '40%', height: '40px'}}></div>
             </div>
          </div>
        </div>
      </section>
    )
  }

  if (product === null) {
    return (
      <section className="page page-details">
        <div className="page-shell empty-state" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/products" className="button button-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Back to Products
          </Link>
        </div>
      </section>
    )
  }

  const discountAmount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const inWishlist = isInWishlist(product._id)

  const images = product ? [product.image, product.image, product.image, product.image] : []

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  return (
    <section className="page page-details">
      <div className="page-shell">
        
        <div className="breadcrumb" style={{ marginBottom: '2rem', fontSize: '0.95rem', color: 'var(--text-soft)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
          <Link to="/" style={{ color: 'var(--text-soft)', textDecoration: 'none' }}>Home</Link> <span style={{ margin: '0 8px' }}>/</span> <Link to="/products" style={{ color: 'var(--text-soft)', textDecoration: 'none' }}>Products</Link> <span style={{ margin: '0 8px' }}>/</span> <span>{product.category}</span> <span style={{ margin: '0 8px' }}>/</span> <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>

        <div className="product-details-layout premium-layout">
          {/* Image Gallery */}
          <div className="product-gallery-section">
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail-btn ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} />
                </button>
              ))}
            </div>
            
            <motion.div 
              className="product-image-container premium-glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              style={{ overflow: 'hidden', cursor: 'crosshair', position: 'relative' }}
            >
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="main-image-element"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transition: 'transform 0.1s ease-out'
                }} 
              />
              {discountAmount > 0 && <span className="discount-badge premium-badge">-{discountAmount}%</span>}
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div 
            className="product-info-container premium-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="details-brand gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.brand}</span>
            <h1 className="details-name" style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, margin: '12px 0 24px', letterSpacing: '-0.03em' }}>{product.name}</h1>
            
            <div className="details-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border)' }}>
              <RatingStars rating={product.rating} />
              <span style={{ color: 'var(--text-soft)' }}>|</span>
              <span className="details-category" style={{ fontWeight: 600, color: 'var(--text-soft)' }}>{product.category}</span>
            </div>
            
            <div className="details-pricing premium-pricing" style={{ marginBottom: '32px' }}>
              <PriceDisplay price={product.price} oldPrice={product.oldPrice} className="details-price-display" />
            </div>

            <p className="details-description" style={{ fontSize: '1.15rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '40px' }}>{product.description}</p>
            
            <div className="why-love-it-section glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--heading)', fontSize: '1.2rem', marginBottom: '16px' }}>Why You'll Love It</h3>
              <ul className="benefits-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '1.05rem', color: 'var(--text)' }}><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Premium quality formulation</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '1.05rem', color: 'var(--text)' }}><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Cruelty-free and ethically sourced</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '1.05rem', color: 'var(--text)' }}><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Long-lasting radiant finish</li>
              </ul>
            </div>

            <div className="details-actions premium-actions" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <button
                className="button premium-add-to-cart"
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
                style={{ flex: 1, padding: '20px', fontSize: '1.1rem', borderRadius: '100px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              <button
                className={`button glass-wishlist-btn ${inWishlist ? 'active' : ''}`}
                aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                onClick={() =>
                  inWishlist ? removeFromWishlist(product._id) : addToWishlist(product)
                }
                style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--border)', background: inWishlist ? 'var(--primary-soft)' : 'var(--surface)', color: inWishlist ? 'var(--primary)' : 'var(--text)', fontSize: '1.5rem', transition: 'all 0.3s ease' }}
              >
                {inWishlist ? '♥' : '♡'}
              </button>
            </div>
            
            <div className="details-stock-status">
              {product.stock > 0 ? (
                <span className="in-stock" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 600 }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span> Ships within 24 hours ({product.stock} left)</span>
              ) : (
                <span className="out-of-stock" style={{ color: '#EF4444', fontWeight: 600 }}>Currently unavailable</span>
              )}
            </div>
          </motion.div>
        </div>

        <RelatedProducts category={product.category} currentProductId={product._id} />
      </div>
    </section>
  )
}
