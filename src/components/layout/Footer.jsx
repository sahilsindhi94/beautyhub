import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer luxury-footer">
      <div className="footer-inner">
        <div className="footer-column brand-col">
          <h3 className="footer-brand">BeautyHub</h3>
          <p className="footer-desc">The ultimate luxury beauty destination for curated skincare, makeup, haircare, and fragrances.</p>
          <div className="social-links">
            <a href="#" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" aria-label="Pinterest">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><circle cx="12" cy="12" r="10"></circle></svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Shop</h3>
          <p className="footer-link"><Link to="/products?category=makeup">Makeup</Link></p>
          <p className="footer-link"><Link to="/products?category=skincare">Skincare</Link></p>
          <p className="footer-link"><Link to="/products?category=fragrance">Fragrance</Link></p>
          <p className="footer-link"><Link to="/products?category=haircare">Haircare</Link></p>
          <p className="footer-link"><Link to="/products?category=gifts">Gifts & Sets</Link></p>
        </div>

        <div className="footer-column">
          <h3>Company</h3>
          <p className="footer-link"><Link to="/#about">About Us</Link></p>
          <p className="footer-link"><Link to="/careers">Careers</Link></p>
          <p className="footer-link"><Link to="/press">Press</Link></p>
          <p className="footer-link"><Link to="/affiliates">Affiliates</Link></p>
        </div>

        <div className="footer-column newsletter-col">
          <h3>Stay in the know</h3>
          <p>Subscribe to receive exclusive offers, early access, and beauty tips.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Email for newsletter" />
            <button type="submit" aria-label="Submit newsletter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BeautyHub. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
