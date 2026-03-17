import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Loader from './Loader';
import Cursor from './Cursor';
import NavBar from './NavBar';
import CartSidebar from './CartSidebar';
import Footer from './Footer';

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Loader />
      <Cursor />
      <NavBar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <Outlet />
      <Footer />
    </>
  );
}
