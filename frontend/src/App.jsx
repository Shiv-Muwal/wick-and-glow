import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
// Phase 2 (jab cart/checkout login-only chahiye): neeche wale routes ko comment karo aur ProtectedRoute wala block uncomment karo.
// import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
// Temporarily disabled auth pages
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import CartPage from './pages/CartPage';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';
import LegalPage from './pages/LegalPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="contact" element={<Contact />} />
              {/*
                Temporary disable: login/signup routes
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              */}
              <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="account" element={<Account />} />
              <Route path="dashboard" element={<Account />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="legal/:topic" element={<LegalPage />} />
              {/* Phase 1: guest cart + checkout (bina login) */}
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<Checkout />} />
              {/*
                Phase 2 — yeh block uncomment karo; upar ke do <Route path="cart|checkout" /> hata do / comment karo:

              <Route element={<ProtectedRoute />}>
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>
              */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
