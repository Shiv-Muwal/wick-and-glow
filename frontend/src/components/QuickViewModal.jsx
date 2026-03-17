import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function QuickViewModal({ product, open, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart 🕯️`);
    setQty(1);
    onClose();
  };

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
            style={{
              background: `linear-gradient(135deg, ${product.color}, #f7ede2)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6rem',
            }}
          >
            {product.emoji}
          </div>
          <div className="modal-info">
            <div className="modal-category">{product.category}</div>
            <h2 className="modal-name">{product.name}</h2>
            <div className="modal-price">₹{product.price}</div>
            <p className="modal-desc">{product.desc}</p>
            <div className="qty-selector">
              <label>Qty:</label>
              <button type="button" className="qty-btn" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
              <input
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                style={{ width: 50, textAlign: 'center', border: '1.5px solid #84a59d', borderRadius: 8, padding: 6, fontFamily: 'Poppins, sans-serif' }}
              />
              <button type="button" className="qty-btn" onClick={() => setQty((n) => n + 1)}>+</button>
            </div>
            <button type="button" className="btn-primary add-cart modal-add-cart" style={{ width: '100%', marginTop: 8 }} onClick={handleAdd}>
              Add to Cart 🕯️
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
