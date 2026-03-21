


















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
  const toggleMenu = () => {
  setMobileOpen(!mobileOpen);
};

  return (
    <nav className={`${scrolled ? 'scrolled' : ''} flex   relative justify-between `}>
      <NavLink to="/" className="nav- logo">
        <div className="logo-flame" />
        Lumière
      </NavLink>
      
      <div  className={`flex items-center lg:gap-[200px] 
  max-lg:w-full max-lg:bg-pink-50 max-lg:h-screen 
  max-lg:top-0 max-lg:left-0 max-lg:absolute 
  max-lg:flex-col max-lg:items-center max-lg:justify-center 
  ${mobileOpen ? 'block' : 'hidden'} lg:flex`}>
        <ul className="flex gap-9 max-lg:flex-col">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/blog">Journal</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
        <div className="flex gap-4">
          <button type="button" className="dark-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button type="button" className="cart-btn" title="Cart" onClick={onCartOpen}>
            🛒 <span className="cart-count">{cartCount}</span>
          </button>
        </div>

      </div>
             <div className='flex flex-col gap-[5px] lg:hidden z-2 relative  '  onClick={toggleMenu}>
        <span className='w-[25px] h-[2px] bg-black block'></span>
        <span className='w-[25px] h-[2px] bg-black block'></span>
        <span className='w-[25px] h-[2px] bg-black block'></span>
       </div>
    </nav>
  );
}
