import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getProduct } from '../api/client';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Newsletter from '../components/Newsletter';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const p = await getProduct(id);
        if (!cancelled) setProduct(p);
      } catch {
        const local = PRODUCTS.find((p) => p.id === id);
        if (!cancelled) setProduct(local || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setQty(1);
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail px-[60px] py-[120px] text-center text-[var(--light-text)]">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <p>Product not found.</p>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart 🕯️`);
  };

  return (
    <>
      <div className="product-detail">
        <div className="flex items-center justify-center gap-[10px] mt-[12px] text-[0.82rem] text-[var(--light-text)]" style={{ marginBottom: 40 }}>
          <Link to="/">Home</Link> / <Link to="/shop"  className="text-[var(--sage)] no-underline">Shop</Link> / <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          <div className="product-gallery reveal">
            <div
              className="main-image"
              style={
                product.imageUrl
                  ? { padding: 0, overflow: 'hidden' }
                  : { background: `linear-gradient(135deg,${product.color || '#f5cac3'},#f7ede2)` }
              }
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ minHeight: '100%' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem' }}>
                  {product.emoji}
                </div>
              )}
            </div>
          </div>

          <div className="reveal">
            <div className="product-category" style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#84a59d', fontWeight: 600, marginBottom: 12 }}>
              {product.category} Collection
            </div>
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="detail-price">₹{product.price}</div>
            <p className="detail-desc">{product.desc}</p>
            <div className="product-features">
              <div className="feature-item"><span>🌿</span> Natural Soy Wax</div>
              <div className="feature-item"><span>⏳</span> 40+ Burn Hours</div>
              <div className="feature-item"><span>🌸</span> Premium Fragrance</div>
              <div className="feature-item"><span>♻️</span> Eco Friendly</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Quantity</label>
              <div className="cart-qty">
                <button type="button" className="qty-btn" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button type="button" className="qty-btn" onClick={() => setQty((n) => n + 1)}>+</button>
              </div>
            </div>
            <button type="button" className="btn-primary add-to-bag" onClick={handleAddToCart} style={{ width: '100%', padding: 18 }}>
              Add to Cart 🕯️
            </button>
          </div>
        </div>
      </div>

      <Newsletter style={{ marginTop: 0 }} />
    </>
  );
}
