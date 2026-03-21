import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getProducts } from '../api/client';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

export default function FeaturedProducts() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [list, setList] = useState(PRODUCTS.slice(0, 4));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setList(data.slice(0, 4));
        }
      } catch {
        /* static slice */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section id="featured">
        <div className="section-header">
          <div className="section-eyebrow reveal">Bestsellers</div>
          <h2 className="section-title reveal">Our Signature Collection</h2>
          <div className="section-line" />
        </div>
        <div className="products-grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Link to="/shop" className="btn-secondary">View All Candles →</Link>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
