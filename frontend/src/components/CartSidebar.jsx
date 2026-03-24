import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStockCap } from '../utils/stock';

export default function CartSidebar({ open, onClose }) {
  const { cart, cartTotal, removeFromCart, changeQty } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[9000] bg-[rgba(44,24,16,0.5)] backdrop-blur-[4px] transition-all ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close cart"
      />
      <div
        className={`fixed bottom-0 right-0 top-0 z-[9001] flex w-[420px] max-w-[92vw] flex-col bg-[var(--cream)] shadow-[-20px_0_60px_rgba(44,24,16,0.2)] transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-[rgba(132,165,157,0.2)] p-[30px]">
          <h3 className="font-['Playfair_Display',serif] text-[1.4rem] text-[var(--deep)]">Your Cart 🕯️</h3>
          <button
            type="button"
            className="text-[1.5rem] text-[var(--text)] transition-all hover:rotate-90 hover:text-[var(--sage)]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[30px] py-[20px]">
          {cart.length === 0 ? (
            <div className="px-[30px] py-[60px] text-center text-[var(--light-text)]">
              <div className="mb-[16px] text-[3rem]">🕯️</div>
              <p className="mb-[20px]">Your cart is empty</p>
              <Link
                to="/shop"
                className="inline-flex rounded-[999px] bg-[var(--deep)] px-[26px] py-[12px] text-[0.8rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
                onClick={onClose}
              >
                Explore Candles
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const cap = getStockCap(item);
              const atMax = item.qty >= cap;
              const finiteCap = cap < 999;
              return (
              <div
                key={item.id}
                className="flex gap-[16px] border-b border-[rgba(132,165,157,0.15)] py-[16px]"
              >
                <div className="h-[70px] w-[70px] flex-shrink-0 overflow-hidden rounded-[12px] bg-[var(--blush)]">
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
                <div className="flex-1">
                  <div className="mb-[4px] text-[0.9rem] font-semibold text-[var(--deep)]">{item.name}</div>
                  <div className="text-[0.9rem] font-semibold text-[var(--sage)]">₹{item.price}</div>
                  <div className="mt-[8px] flex items-center gap-[10px]">
                    <button
                      type="button"
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--blush)] text-[1rem] text-[var(--text)] transition hover:bg-[var(--sage)] hover:text-white"
                      onClick={() => changeQty(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="min-w-[20px] text-center text-[0.9rem] font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--blush)] text-[1rem] text-[var(--text)] transition hover:bg-[var(--sage)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
                <button
                  type="button"
                  className="text-[1rem] text-[var(--light-text)] transition hover:scale-110 hover:text-[#e74c3c]"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            );
            })
          )}
        </div>
        <div className="border-t border-[rgba(132,165,157,0.2)] p-[24px]">
          <div className="mb-[20px] flex items-center justify-between">
            <span className="text-[0.85rem] uppercase tracking-[1px] text-[var(--light-text)]">Subtotal</span>
            <span className="font-['Playfair_Display',serif] text-[1.3rem] font-bold text-[var(--deep)]">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>
          {cart.length > 0 ? (
            <>
              <Link
                to="/cart"
                className="mb-2 block w-full rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[22px] py-[12px] text-center text-[0.75rem] font-semibold uppercase tracking-[1.4px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white"
                onClick={onClose}
              >
                View full cart
              </Link>
              <Link
                to="/checkout"
                className="block w-full rounded-[999px] bg-[var(--deep)] px-[22px] py-[12px] text-center text-[0.75rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
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
