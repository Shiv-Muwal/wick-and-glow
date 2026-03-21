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
        className={`modal-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div className="modal" id="quick-view-modal">
        <button type="button" className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-grid">
          <div
            className="modal-img"
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
          <div className="modal-info">
            <div className="modal-category">{product.category}</div>
            <h2 className="modal-name">{product.name}</h2>
            <div className="modal-price">
              ₹{product.price}
              {product.originalPrice ? (
                <span className="text-[0.9rem] line-through text-[var(--light-text)] ml-2">₹{product.originalPrice}</span>
              ) : null}
            </div>
            {out ? <p className="text-[0.85rem] font-semibold text-red-800">Out of stock</p> : null}
            {!out && cap < 999 && cap <= 10 ? (
              <p className="text-[0.8rem] text-amber-900">Only {cap} left</p>
            ) : null}
            <p className="modal-desc">{product.desc}</p>
            <div className="qty-selector">
              <label>Qty:</label>
              <button type="button" className="qty-btn" disabled={out} onClick={() => setQty((n) => clampQty(n - 1))}>−</button>
              <input
                type="number"
                value={qty}
                min={1}
                max={out ? 1 : cap}
                disabled={out}
                onChange={(e) => setQty(clampQty(parseInt(e.target.value, 10) || 1))}
                style={{ width: 50, textAlign: 'center', border: '1.5px solid #84a59d', borderRadius: 8, padding: 6, fontFamily: 'Poppins, sans-serif' }}
              />
              <button type="button" className="qty-btn" disabled={out || qty >= cap} onClick={() => setQty((n) => clampQty(n + 1))}>+</button>
            </div>
            <button
              type="button"
              className="btn-primary add-cart modal-add-cart"
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
