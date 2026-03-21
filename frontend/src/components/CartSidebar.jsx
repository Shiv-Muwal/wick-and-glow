import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { postOrder } from '../api/client';

export default function CartSidebar({ open, onClose }) {
  const { cart, cartTotal, removeFromCart, changeQty, clearCart } = useCart();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coupon, setCoupon] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    if (!name.trim() || !email.trim()) {
      showToast('Please enter your name and email to checkout.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await postOrder({
        customerName: name.trim(),
        customerEmail: email.trim(),
        items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
        couponCode: coupon.trim() || undefined,
      });
      clearCart();
      setName('');
      setEmail('');
      setCoupon('');
      showToast(`Order placed — ${res.id} ✨`);
      onClose();
    } catch (e) {
      showToast(e.message || 'Checkout failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close cart"
      />
      <div className={`cart-sidebar ${open ? 'open' : ''}`}>
        <div className="p-[30px] border-b border-[rgba(132,165,157,0.2)] 
flex items-center justify-between">
          <h3 className="font-['Playfair_Display',serif] text-[1.4rem] text-[var(--deep)]">Your Cart 🕯️</h3>
          <button type="button" className="cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="cart-icon">🕯️</div>
              <p>Your cart is empty</p>
              <Link to="/shop" className="btn-primary" onClick={onClose}>
                Explore Candles
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${item.color || '#f5cac3'}, #f7ede2)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                      }}
                    >
                      {item.emoji || '🕯️'}
                    </div>
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-qty">
                    <button type="button" className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button type="button" className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button type="button" className="remove-item" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          {cart.length > 0 ? (
            <div className="mb-4 flex flex-col gap-2 px-[30px] text-[0.8rem]">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-[rgba(132,165,157,0.35)] px-3 py-2 outline-none focus:border-[var(--sage)]"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-[rgba(132,165,157,0.35)] px-3 py-2 outline-none focus:border-[var(--sage)]"
              />
              <input
                type="text"
                placeholder="Coupon code (optional)"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="rounded-lg border border-[rgba(132,165,157,0.35)] px-3 py-2 outline-none focus:border-[var(--sage)]"
              />
            </div>
          ) : null}
          <div className="cart-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <button
            type="button"
            className="btn-primary checkout-btn"
            onClick={handleCheckout}
            disabled={submitting}
          >
            {submitting ? 'Placing order…' : 'Place order →'}
          </button>
        </div>
      </div>
    </>
  );
}
