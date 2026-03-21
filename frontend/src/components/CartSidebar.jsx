import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartSidebar({ open, onClose }) {
  const { cart, cartTotal, removeFromCart, changeQty } = useCart();
  const { showToast } = useToast();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    showToast('🎉 Redirecting to checkout…');
    onClose();
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
          <div className="cart-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <button type="button" className="btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </>
  );
}
