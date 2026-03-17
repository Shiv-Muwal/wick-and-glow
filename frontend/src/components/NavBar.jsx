import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function NavBar({ onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <NavLink to="/" className="nav-logo">
        <div className="logo-flame" />
        Lumière
      </NavLink>
      <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/shop">Shop</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/blog">Journal</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <div className={`nav-actions ${mobileOpen ? 'open' : ''}`}>
        <button type="button" className="dark-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button type="button" className="cart-btn" title="Cart" onClick={onCartOpen}>
          🛒 <span className="cart-count">{cartCount}</span>
        </button>
      </div>
      <button
        type="button"
        className={`hamburger ${mobileOpen ? 'open' : ''}`}
        aria-label="Menu"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
