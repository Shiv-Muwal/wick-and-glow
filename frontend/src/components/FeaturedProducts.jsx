import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

export default function FeaturedProducts() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const featured = PRODUCTS.slice(0, 4);

  return (
    <>
      <section id="featured">
        <div className="section-header">
          <div className="section-eyebrow reveal">Bestsellers</div>
          <h2 className="section-title reveal">Our Signature Collection</h2>
          <div className="section-line" />
        </div>
        <div className="products-grid">
          {featured.map((p) => (
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
