import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStockCap } from '../utils/stock';

export default function CartSidebar({ open, onClose }) {
  const { cart, cartTotal, removeFromCart, changeQty } = useCart();

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
            cart.map((item) => {
              const cap = getStockCap(item);
              const atMax = item.qty >= cap;
              const finiteCap = cap < 999;
              return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
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
                    <button
                      type="button"
                      className="qty-btn disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={atMax}
                      onClick={() => changeQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  {finiteCap ? (
                    <p className="mt-1 text-[0.65rem] text-[var(--light-text)]">Max {cap} in stock</p>
                  ) : null}
                </div>
                <button type="button" className="remove-item" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
              </div>
            );
            })
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          {cart.length > 0 ? (
            <>
              <Link
                to="/cart"
                className="btn-secondary checkout-btn mb-2 text-center no-underline"
                onClick={onClose}
              >
                View full cart
              </Link>
              <Link
                to="/checkout"
                className="btn-primary checkout-btn text-center no-underline"
                onClick={onClose}
              >
                Proceed to checkout
              </Link>
            </>
          ) : null}
          {cart.length > 0 ? (
            <p className="mt-3 px-[30px] text-center text-[0.72rem] leading-snug text-[var(--light-text)]">
              Guest checkout — no account needed. Sign in later to save your cart on every device (coming soon).
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
