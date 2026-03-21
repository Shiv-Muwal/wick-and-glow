import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// Phase 2: auth navbar uncomment karte waqt yeh import wapas lagao
// import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function NavBar({ onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  // Phase 2: const { user, logout, ready } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className={`${scrolled ? 'scrolled' : ''} flex   relative justify-between `}>
      <NavLink to="/" className="nav-logo">
        <div className="logo-flame" />
        Wick &amp; Glow
      </NavLink>

      <div
        className={`flex items-center lg:gap-[200px] 
  max-lg:w-full max-lg:bg-pink-50 max-lg:h-screen 
  max-lg:top-0 max-lg:left-0 max-lg:absolute 
  max-lg:flex-col max-lg:items-center max-lg:justify-center 
  ${mobileOpen ? 'block' : 'hidden'} lg:flex`}
      >
        <ul className="flex gap-9 max-lg:flex-col">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop">Shop</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/blog">Journal</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          {/*
            Phase 1: guest flow — alag page links (cart icon + footer se bhi track ho sakta hai)
            Phase 2: neeche do <li> uncomment karo

          <li><NavLink to="/track-order">Track order</NavLink></li>
          <li><NavLink to="/cart">Cart</NavLink></li>
          */}
        </ul>
        <div className="flex flex-wrap items-center justify-center gap-3 max-lg:flex-col max-lg:gap-4">
          {/*
            Phase 2 — login / signup / dashboard (Phase 1 mein navbar se hide)
            Uncomment karte waqt upar `useAuth` import + hook bhi uncomment karo.

          {!ready ? (
            <span className="min-w-[4rem] text-center text-[0.8rem] text-[var(--light-text)] opacity-50">
              …
            </span>
          ) : user ? (
            <>
              <span className="text-[0.85rem] text-[var(--light-text)] max-lg:text-center">
                Hi, <span className="font-semibold text-[var(--deep)]">{user.name}</span>
              </span>
              <Link
                to="/dashboard"
                className="text-[0.85rem] font-semibold text-[var(--deep)] no-underline hover:text-[var(--sage)]"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="rounded-lg border border-[var(--sage)] px-3 py-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--sage)] transition hover:bg-[var(--sage)] hover:text-white"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[0.85rem] font-semibold text-[var(--deep)] no-underline hover:text-[var(--sage)]"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-[var(--sage)] px-3 py-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-white no-underline shadow-sm transition hover:opacity-90"
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
          */}
          <button type="button" className="dark-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button type="button" className="cart-btn" title="Cart" onClick={onCartOpen}>
            🛒 <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[5px] lg:hidden z-2 relative  " onClick={toggleMenu}>
        <span className="w-[25px] h-[2px] bg-black block" />
        <span className="w-[25px] h-[2px] bg-black block" />
        <span className="w-[25px] h-[2px] bg-black block" />
      </div>
    </nav>
  );
}
