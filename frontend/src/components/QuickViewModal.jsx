import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getStockCap, isOutOfStock } from '../utils/stock';

export default function QuickViewModal({ product, open, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setQty(1);
  }, [product?.id]);

  if (!product) return null;

  const cap = getStockCap(product);
  const out = isOutOfStock(product);

  const clampQty = (n) => {
    if (out) return 1;
    return Math.min(Math.max(1, n), cap);
  };

  const handleAdd = () => {
    if (out) {
      showToast('Out of stock');
      return;
    }
    const q = clampQty(qty);
    const ok = addToCart(product, q);
    if (!ok) {
      showToast('Cannot add — check quantity in stock');
      return;
    }
    showToast(`${product.name} added to cart 🕯️`);
    setQty(1);
    onClose();
  };

  const gradColor = product.color || '#f5cac3';

  return (
    <>
      <div
        className={`fixed inset-0 z-[9000] flex items-center justify-center bg-[rgba(44,24,16,0.6)] backdrop-blur-[8px] transition-all ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div
        id="quick-view-modal"
        className={`fixed left-1/2 top-1/2 z-[9001] w-[min(92vw,840px)] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] bg-[var(--cream)] p-[28px] shadow-[var(--shadow-hover)] transition-all ${open ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-95'}`}
      >
        <button
          type="button"
          className="absolute right-[18px] top-[16px] text-[1.45rem] text-[var(--text)] transition-colors hover:text-[var(--sage)]"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="grid grid-cols-2 gap-[34px] max-[900px]:grid-cols-1">
          <div
            className="h-[340px] overflow-hidden rounded-[16px] bg-[var(--blush)]"
            style={
              product.imageUrl
                ? { padding: 0, overflow: 'hidden' }
                : {
                    background: `linear-gradient(135deg, ${gradColor}, #f7ede2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '6rem',
                  }
            }
          >
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              product.emoji
            )}
          </div>
          <div>
            <div className="mb-[10px] text-[0.72rem] font-semibold uppercase tracking-[2px] text-[var(--sage)]">
              {product.category}
            </div>
            <h2 className="mb-[12px] font-['Playfair_Display',serif] text-[1.8rem] text-[var(--deep)]">
              {product.name}
            </h2>
            <div className="mb-[16px] text-[1.45rem] font-bold text-[var(--text)]">
              ₹{product.price}
              {product.originalPrice ? (
                <span className="text-[0.9rem] line-through text-[var(--light-text)] ml-2">₹{product.originalPrice}</span>
              ) : null}
            </div>
            {out ? <p className="text-[0.85rem] font-semibold text-red-800">Out of stock</p> : null}
            {!out && cap < 999 && cap <= 10 ? (
              <p className="text-[0.8rem] text-amber-900">Only {cap} left</p>
            ) : null}
            <p className="mb-[28px] text-[0.9rem] leading-[1.8] text-[var(--light-text)]">{product.desc}</p>
            <div className="mb-[20px] flex items-center gap-[16px]">
              <label className="text-[0.85rem] font-semibold text-[var(--text)]">Qty:</label>
              <button
                type="button"
                className="h-[34px] w-[34px] rounded-[8px] border border-[var(--sage)] text-[1.1rem] text-[var(--text)] disabled:opacity-40"
                disabled={out}
                onClick={() => setQty((n) => clampQty(n - 1))}
              >
                −
              </button>
              <input
                type="number"
                value={qty}
                min={1}
                max={out ? 1 : cap}
                disabled={out}
                onChange={(e) => setQty(clampQty(parseInt(e.target.value, 10) || 1))}
                style={{ width: 50, textAlign: 'center', border: '1.5px solid #84a59d', borderRadius: 8, padding: 6, fontFamily: 'Poppins, sans-serif' }}
              />
              <button
                type="button"
                className="h-[34px] w-[34px] rounded-[8px] border border-[var(--sage)] text-[1.1rem] text-[var(--text)] disabled:opacity-40"
                disabled={out || qty >= cap}
                onClick={() => setQty((n) => clampQty(n + 1))}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="mt-[8px] w-full rounded-[999px] bg-[var(--deep)] px-[28px] py-[14px] text-[0.78rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
              style={{ width: '100%', marginTop: 8, opacity: out ? 0.55 : 1 }}
              onClick={handleAdd}
              disabled={out}
            >
              {out ? 'Sold out' : 'Add to Cart 🕯️'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
