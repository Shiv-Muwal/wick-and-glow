import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getProduct, getProducts } from '../api/client';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { getStockCap, isOutOfStock } from '../utils/stock';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quickProduct, setQuickProduct] = useState(null);
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
    if (!product) {
      setRelated([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await getProducts({ category: product.category });
        if (cancelled) return;
        setRelated(list.filter((p) => p.id !== product.id).slice(0, 4));
      } catch {
        if (cancelled) return;
        const local = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
        setRelated(local);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    setQty(1);
  }, [id]);

  useEffect(() => {
    if (!product || String(product.id) !== String(id)) return;
    const cap = getStockCap(product);
    setQty((q) => {
      if (cap <= 0) return 1;
      return Math.min(Math.max(1, q), cap);
    });
  }, [product, id]);

  if (loading) {
    return (
      <div className="px-[60px] py-[120px] text-center text-[var(--light-text)]">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-[60px] py-[120px] text-center text-[var(--light-text)]">
        <p>Product not found.</p>
        <Link to="/shop" className="mt-6 inline-flex text-[var(--sage)] no-underline">Back to Shop</Link>
      </div>
    );
  }

  const cap = getStockCap(product);
  const out = isOutOfStock(product);

  const handleAddToCart = () => {
    if (out) return;
    const q = Math.min(qty, cap);
    const ok = addToCart(product, q);
    if (!ok) {
      showToast('Cannot add — check stock');
      return;
    }
    showToast(`${product.name} added to cart 🕯️`);
  };

  const bumpQty = (delta) => {
    if (out) return;
    setQty((n) => {
      const next = n + delta;
      if (next < 1) return 1;
      return Math.min(next, cap);
    });
  };

  return (
    <>
      <div className="px-[60px] pb-[80px] pt-[140px] max-[1100px]:px-[30px]">
        <div className="flex items-center justify-center gap-[10px] mt-[12px] text-[0.82rem] text-[var(--light-text)]" style={{ marginBottom: 40 }}>
          <Link to="/">Home</Link> / <Link to="/shop" className="text-[var(--sage)] no-underline">Shop</Link> / <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-2 items-start gap-[80px] max-[1100px]:grid-cols-1">
          <div>
            <div
              className="h-[620px] overflow-hidden rounded-[24px] bg-[var(--blush)]"
              style={
                product.imageUrl
                  ? { padding: 0, overflow: 'hidden' }
                  : { background: `linear-gradient(135deg,${product.color || '#f5cac3'},#f7ede2)` }
              }
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
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

          <div>
            <div className="product-category" style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#84a59d', fontWeight: 600, marginBottom: 12 }}>
              {product.category} Collection
            </div>
            <h1 className="mb-3 font-['Playfair_Display',serif] text-[2.4rem] leading-[1.2] text-[var(--deep)]">{product.name}</h1>
            <div className="mb-4 text-[2.1rem] font-bold text-[var(--text)]">
              ₹{product.price}
              {product.originalPrice ? (
                <span className="original ml-2 text-[1rem] line-through text-[var(--light-text)]">₹{product.originalPrice}</span>
              ) : null}
            </div>
            {out ? (
              <p className="text-[0.9rem] font-semibold text-red-800 mb-4">Currently out of stock</p>
            ) : cap < 999 && cap <= 10 ? (
              <p className="text-[0.85rem] text-amber-900 mb-4">Only {cap} left in stock</p>
            ) : null}
            <p className="mb-[28px] text-[0.95rem] leading-[1.85] text-[var(--light-text)]">{product.desc}</p>
            <div className="mb-[24px] grid grid-cols-2 gap-[12px]">
              <div className="rounded-[10px] bg-[rgba(132,165,157,0.08)] px-[12px] py-[10px] text-[0.82rem] text-[var(--text)]"><span>🌿</span> Natural Soy Wax</div>
              <div className="rounded-[10px] bg-[rgba(132,165,157,0.08)] px-[12px] py-[10px] text-[0.82rem] text-[var(--text)]"><span>⏳</span> 40+ Burn Hours</div>
              <div className="rounded-[10px] bg-[rgba(132,165,157,0.08)] px-[12px] py-[10px] text-[0.82rem] text-[var(--text)]"><span>🌸</span> Premium Fragrance</div>
              <div className="rounded-[10px] bg-[rgba(132,165,157,0.08)] px-[12px] py-[10px] text-[0.82rem] text-[var(--text)]"><span>♻️</span> Eco Friendly</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Quantity</label>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--blush)] text-[1rem] text-[var(--text)] transition hover:bg-[var(--sage)] hover:text-white disabled:opacity-40"
                  disabled={out}
                  onClick={() => bumpQty(-1)}
                >
                  −
                </button>
                <span className="min-w-[24px] text-center text-[0.95rem] font-semibold">{qty}</span>
                <button
                  type="button"
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--blush)] text-[1rem] text-[var(--text)] transition hover:bg-[var(--sage)] hover:text-white disabled:opacity-40"
                  disabled={out || qty >= cap}
                  onClick={() => bumpQty(1)}
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-[999px] bg-[var(--deep)] px-[28px] py-[14px] text-[0.8rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--deep)] disabled:opacity-55"
              onClick={handleAddToCart}
              disabled={out}
              style={{ opacity: out ? 0.55 : 1 }}
            >
              {out ? 'Out of stock' : 'Add to Cart 🕯️'}
            </button>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 px-[60px] max-[768px]:px-6">
            <h2 className="font-['Playfair_Display',serif] text-[1.75rem] text-[var(--deep)] mb-8 text-center">You may also like</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8 justify-items-center">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickProduct} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <Newsletter style={{ marginTop: 0 }} />

      <QuickViewModal
        product={quickProduct}
        open={!!quickProduct}
        onClose={() => setQuickProduct(null)}
      />
    </>
  );
}
