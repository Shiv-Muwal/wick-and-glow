import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo">
            <div className="logo-flame" />
            Lumière
          </Link>
          <p style={{ marginTop: 16 }}>
            Handcrafted candles made with natural soy wax and premium fragrances. Each candle brings
            warmth, relaxation, and beauty to your home.
          </p>
          <div className="footer-social">
            <a href="#" className="social-btn">📘</a>
            <a href="#" className="social-btn">📸</a>
            <a href="#" className="social-btn">🐦</a>
            <a href="#" className="social-btn">📌</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/blog">Journal</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Customer Care</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Candle Care</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Us</h4>
          <ul>
            <li><a href="mailto:hello@lumiere.in">hello@lumiere.in</a></li>
            <li><a href="tel:+919876543210">+91 98765 43210</a></li>
            <li><a href="#">12 Artisan Lane, Mumbai 400001</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 Lumière Candle Co. All rights reserved.</span>
        <div className="footer-payments">💳 🔒 ✅</div>
      </div>
    </footer>
  );
}
