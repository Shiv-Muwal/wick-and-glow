import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getProducts } from '../api/client';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CATEGORIES = ['Floral', 'Woody', 'Herbal', 'Decorative', 'Classic'];
const FRAGRANCES = ['Rose Petal', 'White Oudh', 'French Lavender', 'Jasmine', 'Sandalwood Vanilla'];

export default function Shop() {
  useScrollReveal();
  const [catalog, setCatalog] = useState(PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [fragranceFilter, setFragranceFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('default');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled && Array.isArray(data) && data.length > 0) setCatalog(data);
      } catch {
        /* keep static PRODUCTS */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = catalog.filter((p) => {
    const term = search.trim().toLowerCase();
    const matchSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.fragrance || '').toLowerCase().includes(term);
    const matchCat = categoryFilter.length === 0 || categoryFilter.includes(p.category);
    const matchFrag =
      fragranceFilter.length === 0 || fragranceFilter.includes(p.fragrance);
    const matchPrice = parseInt(p.price, 10) <= maxPrice;
    return matchSearch && matchCat && matchFrag && matchPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    const pa = parseInt(a.price, 10);
    const pb = parseInt(b.price, 10);
    const na = a.name;
    const nb = b.name;
    switch (sort) {
      case 'price-asc': return pa - pb;
      case 'price-desc': return pb - pa;
      case 'name-asc': return na.localeCompare(nb);
      default: return 0;
    }
  });

  return (
    <>
      <div className="pt-[160px] px-[60px] pb-[80px] 
text-center 
bg-[linear-gradient(135deg,var(--cream)_0%,var(--blush)_100%)]">
        <h1 className="font-['Playfair_Display',serif] text-[3rem] text-[var(--deep)]">Our Collection</h1>
        <div className="flex items-center justify-center gap-[10px] mt-[12px] text-[0.82rem] text-[var(--light-text)]">
          <Link to="/" className="text-[var(--sage)] no-underline">Home</Link> / <span>Shop</span>
        </div>
      </div>

      <div className="mx-[60px] mb-[40px] mt-0 flex items-center rounded-[50px] border-[1.5px] border-transparent bg-white px-[24px] py-[12px] shadow-[0_4px_20px_rgba(44,24,16,0.08)] transition-all focus-within:border-[var(--sage)] max-[1100px]:mx-[30px]">
        <span className="text-[1.1rem] text-[var(--light-text)]">🔍</span>
        <input
          type="text"
          placeholder="Search candles by name, scent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-[12px] w-full border-none bg-transparent text-[0.9rem] text-[var(--text)] outline-none"
        />
      </div>

      <div className="grid 
grid-cols-[260px_1fr] 
gap-[40px] 
p-[60px] 
items-start 
max-[1100px]:grid-cols-1">
        <aside className="lg:sticky lg:top-[100px]">
          <div className="mb-[20px] rounded-[20px] bg-white p-[28px] shadow-[var(--shadow)]">
            <h4 className="mb-[16px] font-['Playfair_Display',serif] text-[1rem] text-[var(--deep)]">Categories</h4>
            <div className="flex flex-col gap-[10px]">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex cursor-pointer items-center gap-[10px]">
                  <input
                    type="checkbox"
                    checked={categoryFilter.includes(cat)}
                    onChange={() =>
                      setCategoryFilter((prev) =>
                        prev.includes(cat)
                          ? prev.filter((value) => value !== cat)
                          : [...prev, cat]
                      )
                    }
                  />
                  <span className="text-[0.88rem] text-[var(--text)]">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-[20px] rounded-[20px] bg-white p-[28px] shadow-[var(--shadow)]">
            <h4 className="mb-[16px] font-['Playfair_Display',serif] text-[1rem] text-[var(--deep)]">Fragrance</h4>
            <div className="flex flex-col gap-[10px]">
              {FRAGRANCES.map((fragrance) => (
                <label key={fragrance} className="flex cursor-pointer items-center gap-[10px]">
                  <input
                    type="checkbox"
                    checked={fragranceFilter.includes(fragrance)}
                    onChange={() =>
                      setFragranceFilter((prev) =>
                        prev.includes(fragrance)
                          ? prev.filter((value) => value !== fragrance)
                          : [...prev, fragrance]
                      )
                    }
                  />
                  <span className="text-[0.88rem] text-[var(--text)]">
                    {fragrance === 'French Lavender' ? 'Lavender' : fragrance}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-[20px] rounded-[20px] bg-white p-[28px] shadow-[var(--shadow)]">
            <h4 className="mb-[16px] font-['Playfair_Display',serif] text-[1rem] text-[var(--deep)]">
              Price: Up to <span id="price-val">₹{maxPrice.toLocaleString('en-IN')}</span>
            </h4>
            <input
              type="range"
              className="w-full accent-[var(--sage)]"
              min={500}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
            />
          </div>
          <button
            type="button"
            className="mt-[10px] w-full rounded-[999px] bg-[var(--deep)] px-[22px] py-[13px] text-[0.78rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
            onClick={() => {
              setSearch('');
              setCategoryFilter([]);
              setFragranceFilter([]);
              setMaxPrice(2000);
            }}
          >
            Clear Filters
          </button>
        </aside>

        <div className="min-w-0">
          <div className="mb-[30px] flex items-center justify-between">
            <span className="text-[0.88rem] text-[var(--light-text)]">Showing {sorted.length} products</span>
            <select
              className="cursor-pointer rounded-[10px] border-[1.5px] border-[rgba(132,165,157,0.3)] bg-white px-[16px] py-[10px] text-[0.85rem] text-[var(--text)] outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-[30px] max-[900px]:grid-cols-2 max-[640px]:grid-cols-1" id="products-grid">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[60px]">
        <Newsletter
          title="Stay in the Loop"
          description="Subscribe for new arrivals, exclusive offers, and candle care tips."
        />
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
