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
      <section id="featured" className="px-[60px] py-[100px] max-[1100px]:px-[30px] max-[1100px]:py-[80px]">
        <div className="mb-[52px] text-center">
          <div className="mb-[12px] text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[var(--sage)]">
            Bestsellers
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[clamp(2rem,3.5vw,3rem)] leading-[1.2] text-[var(--deep)]">
            Our Signature Collection
          </h2>
          <div className="mx-auto mt-[20px] h-[2px] w-[60px] rounded-[2px] bg-[linear-gradient(90deg,var(--sage),var(--gold))]" />
        </div>
        <div className="grid grid-cols-4 gap-[30px] max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
        <div className="mt-[50px] text-center">
          <Link
            to="/shop"
            className="inline-flex items-center rounded-[50px] border-[1.5px] border-[rgba(132,165,157,0.35)] bg-transparent px-[36px] py-[14px] text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-[var(--text)] no-underline transition-all hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white"
          >
            View All Candles →
          </Link>
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
