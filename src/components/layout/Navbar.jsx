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
import { useTheme } from '../../context/ThemeContext'

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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  
  const { itemCount } = useCart()
  const { wishlistItems } = useWishlist()
  const currentUser = useCurrentUser()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

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
          
          <button 
            type="button" 
            className="icon-btn" 
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

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
              <div className="profile-dropdown-container" style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className="icon-btn" 
                  aria-label="Account"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="account-text" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Account</span>
                </button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="glass-panel"
                      style={{ 
                        position: 'absolute', 
                        top: 'calc(100% + 12px)', 
                        right: 0, 
                        minWidth: '200px', 
                        borderRadius: '16px', 
                        padding: '8px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px',
                        zIndex: 100,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '4px' }}>
                        <p style={{ fontWeight: 600, margin: 0, color: 'var(--text)' }}>Welcome</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: '4px 0 0' }}>Sign in to access your BeautyHub account</p>
                      </div>
                      <Link 
                        to="/login" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="nav-link"
                        style={{ padding: '10px 12px', borderRadius: '8px', display: 'block', textDecoration: 'none', fontWeight: 600, color: 'var(--primary)' }}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="nav-link"
                        style={{ padding: '10px 12px', borderRadius: '8px', display: 'block', textDecoration: 'none' }}
                      >
                        Create Account
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
              <div className="profile-dropdown-container" style={{ position: 'relative' }}>
                <button 
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  {currentUser.image ? (
                    <img src={currentUser.image} alt={currentUser.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-soft)' }} />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt={currentUser.name || 'User'} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-soft)' }} />
                  )}
                </button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="glass-panel"
                      style={{ 
                        position: 'absolute', 
                        top: 'calc(100% + 12px)', 
                        right: 0, 
                        minWidth: '220px', 
                        borderRadius: '16px', 
                        padding: '8px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px',
                        zIndex: 100,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '4px' }}>
                        <p style={{ fontWeight: 600, margin: 0, color: 'var(--text)' }}>{currentUser.name || 'Beauty Insider'}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>{currentUser.email || 'Welcome back!'}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="nav-link"
                        style={{ padding: '10px 12px', borderRadius: '8px', display: 'block', textDecoration: 'none' }}
                      >
                        Profile Settings
                      </Link>
                      <button 
                        type="button" 
                        onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                        className="nav-link"
                        style={{ padding: '10px 12px', borderRadius: '8px', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--primary)' }}
                      >
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                {/* Additional Mobile Links */}
                <div className="mobile-auth-divider" style={{ margin: '8px 0', borderTop: '1px solid var(--border)' }}></div>
                <Link to="/wishlist" className="nav-link" onClick={() => setIsOpen(false)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="nav-link" onClick={() => setIsOpen(false)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Cart
                  {itemCount > 0 && (
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {itemCount}
                    </span>
                  )}
                </Link>
                
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
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', padding: '12px 0' }}
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
