import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { motion } from 'framer-motion'
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/clerk-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { isClerkConfigured } from '../../auth/clerkConfig'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/products?category=makeup', label: 'Categories' },
  { to: '/#about', label: 'About' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const { itemCount } = useCart()
  const { wishlistItems } = useWishlist()
  const currentUser = useCurrentUser()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'is-open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setIsOpen(false)}>
          BeautyHub
        </Link>
        <nav className="navbar-center" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="navbar-actions">
          <button type="button" className="search-toggle" aria-label="Search beauty products">
            🔍
          </button>
          
          <Link to="/wishlist" className="icon-link" aria-label="Wishlist" style={{ position: 'relative' }}>
            ♥
            {wishlistItems.length > 0 && (
              <motion.span 
                className="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-5px', right: '-8px', background: 'var(--accent)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}
              >
                {wishlistItems.length}
              </motion.span>
            )}
          </Link>

          <Link to="/cart" className="icon-link" aria-label="Cart" style={{ position: 'relative' }}>
            🛒
            {itemCount > 0 && (
              <motion.span 
                className="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-5px', right: '-8px', background: 'var(--accent)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
          
          {isClerkConfigured ? (
            <>
              <SignedOut>
                <Link to="/login" className="button button-secondary nav-login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="button button-primary nav-login" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </SignedOut>

              <SignedIn>
                {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                  <Link to="/admin" className="button button-secondary nav-login" onClick={() => setIsOpen(false)}>
                    {currentUser.role === 'admin' ? 'Admin Dashboard' : 'Management Panel'}
                  </Link>
                )}
                <Link to="/profile" className="button button-secondary nav-login" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <Link to="/orders" className="button button-secondary nav-login" onClick={() => setIsOpen(false)}>
                  Orders
                </Link>
                <SignOutButton redirectUrl="/login">
                  <button type="button" className="button button-secondary nav-login">
                    Logout
                  </button>
                </SignOutButton>
                <UserButton afterSignOutUrl="/login" />
              </SignedIn>
            </>
          ) : (
            <Link to="/register" className="button button-primary nav-login" onClick={() => setIsOpen(false)}>
              Auth Setup
            </Link>
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
      <div className="mobile-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
        {isClerkConfigured ? (
          <>
            <SignedOut>
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </SignedOut>
            <SignedIn>
              {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>
                  {currentUser.role === 'admin' ? 'Admin Dashboard' : 'Management Panel'}
                </Link>
              )}
              <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <SignOutButton redirectUrl="/login">
                <button type="button" className="nav-link mobile-signout" onClick={() => setIsOpen(false)}>
                  Logout
                </button>
              </SignOutButton>
            </SignedIn>
          </>
        ) : (
          <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>
            Auth Setup
          </Link>
        )}
      </div>
    </header>
  )
}
