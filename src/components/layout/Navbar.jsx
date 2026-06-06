import { useEffect, useState, useMemo } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import PriceDisplay from '../common/PriceDisplay'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/categories', label: 'Categories' },
  { to: '/#about', label: 'About' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { itemCount } = useCart()
  const { wishlistItems } = useWishlist()
  const currentUser = useCurrentUser()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const location = useLocation()

  const allProducts = useQuery(api.products.getProducts)
  
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !allProducts) return []
    const q = searchQuery.toLowerCase()
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    ).slice(0, 5)
  }, [searchQuery, allProducts])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await signOut()
    navigate('/')
  }

  return (
    <header className={`site-navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'is-open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setIsOpen(false)}>
          BeautyHub<span style={{color: 'var(--primary)'}}>.</span>
        </Link>
        <nav className="navbar-center" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isHash = item.to.includes('#')
            const isActive = isHash 
              ? (location.pathname === '/' && location.hash === item.to.substring(item.to.indexOf('#')))
              : (location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to.split('?')[0])))
            
            return (
              <Link
                key={item.label}
                to={item.to}
                className={isActive ? 'nav-link active' : 'nav-link'}
                onClick={(e) => {
                  setIsOpen(false)
                  if (isHash) {
                    const el = document.getElementById(item.to.split('#')[1])
                    if (el) {
                      e.preventDefault()
                      if (location.pathname !== '/') {
                        navigate(item.to)
                      } else {
                        el.scrollIntoView({ behavior: 'smooth' })
                        window.history.pushState(null, '', item.to)
                      }
                    }
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="navbar-actions">
          <div className="search-container">
            <button 
              type="button" 
              className="search-toggle icon-btn" 
              aria-label="Search beauty products"
              onClick={() => {
                setShowSearch(!showSearch)
                if(!showSearch) setTimeout(() => document.getElementById('nav-search')?.focus(), 100)
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            
            <AnimatePresence>
              {showSearch && (
                <motion.div 
                  className="search-dropdown-overlay"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="search-input-wrapper">
                    <input 
                      id="nav-search"
                      type="text" 
                      placeholder="Search for products, brands..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {searchQuery.trim() && (
                    <div className="search-results">
                      {searchResults.length > 0 ? (
                        searchResults.map(product => (
                          <Link 
                            key={product._id} 
                            to={`/product/${product._id}`}
                            className="search-result-item glow-effect"
                            onClick={() => {
                              setShowSearch(false)
                              setSearchQuery('')
                            }}
                          >
                            <img src={product.image} alt={product.name} />
                            <div>
                              <h4>{product.name}</h4>
                              <p className="gradient-text">{product.brand}</p>
                              <PriceDisplay price={product.price} oldPrice={product.oldPrice} />
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="search-no-results">
                          No products found for "{searchQuery}"
                        </div>
                      )}
                      {searchResults.length > 0 && (
                        <button 
                          className="view-all-results"
                          onClick={() => {
                            setShowSearch(false)
                            navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
                            setSearchQuery('')
                          }}
                        >
                          View all results
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist" style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlistItems.length > 0 && (
              <motion.span 
                className="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-5px', right: '-8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}
              >
                {wishlistItems.length}
              </motion.span>
            )}
          </Link>

          <Link to="/cart" className="icon-btn" aria-label="Cart" style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {itemCount > 0 && (
              <motion.span 
                className="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-5px', right: '-8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
          
          <div className="auth-buttons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!currentUser ? (
              <>
                <Link to="/login" className="button nav-auth-btn" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="button nav-auth-btn" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                      {currentUser.image ? (
                        <img src={currentUser.image} alt={currentUser.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt={currentUser.name || 'User'} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>Profile</span>
                </Link>
                <button type="button" className="button nav-auth-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
          
          <button
            type="button"
            className="navbar-toggle"
            aria-expanded={isOpen}
            aria-label="Open navigation menu"
            onClick={() => setIsOpen((state) => !state)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-drawer-header">
                <span className="brand">BeautyHub<span style={{color: 'var(--primary)'}}>.</span></span>
                <button type="button" className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
              </div>
              <div className="mobile-drawer-links">
                {navItems.map((item) => {
                  const isHash = item.to.includes('#')
                  const isActive = isHash 
                    ? (location.pathname === '/' && location.hash === item.to.substring(item.to.indexOf('#')))
                    : (location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to.split('?')[0])))
                  
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={isActive ? 'nav-link active' : 'nav-link'}
                      onClick={(e) => {
                        setIsOpen(false)
                        if (isHash) {
                          const el = document.getElementById(item.to.split('#')[1])
                          if (el) {
                            e.preventDefault()
                            if (location.pathname !== '/') {
                              navigate(item.to)
                            } else {
                              el.scrollIntoView({ behavior: 'smooth' })
                              window.history.pushState(null, '', item.to)
                            }
                          }
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                
                {/* Mobile Auth Links */}
                <div className="mobile-auth-divider" style={{ margin: '16px 0', borderTop: '1px solid var(--border)' }}></div>
                {!currentUser ? (
                  <>
                    <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>
                      Profile
                    </Link>
                    <button 
                      type="button" 
                      className="nav-link" 
                      onClick={handleLogout}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', padding: '12px 0' }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
