import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-column">
          <h3>BeautyHub</h3>
          <p>Luxury beauty destination for curated skincare, makeup, haircare, and fragrances.</p>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <p className="footer-link"><Link to="/">Home</Link></p>
          <p className="footer-link"><Link to="/products">Products</Link></p>
          <p className="footer-link"><Link to="/wishlist">Wishlist</Link></p>
          <p className="footer-link"><Link to="/cart">Cart</Link></p>
        </div>
        <div className="footer-column">
          <h3>Categories</h3>
          <p className="footer-link"><Link to="/products?category=makeup">Makeup</Link></p>
          <p className="footer-link"><Link to="/products?category=skincare">Skincare</Link></p>
          <p className="footer-link"><Link to="/products?category=fragrance">Fragrance</Link></p>
          <p className="footer-link"><Link to="/products?category=beauty-tools">Beauty Tools</Link></p>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <p className="footer-contact">support@beautyhub.com</p>
          <p className="footer-contact">+91 98765 43210</p>
          <div className="footer-social" aria-label="Social media links">
            <Link to="/">F</Link>
            <Link to="/">I</Link>
            <Link to="/">T</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
