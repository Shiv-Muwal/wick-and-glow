import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CATEGORIES = ['Floral', 'Woody', 'Herbal', 'Decorative', 'Classic'];
const FRAGRANCES = ['Rose Petal', 'White Oudh', 'French Lavender', 'Jasmine', 'Sandalwood Vanilla'];

export default function Shop() {
  useScrollReveal();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [fragranceFilter, setFragranceFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('default');

  const filtered = PRODUCTS.filter((p) => {
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

      <div className="search-bar-wrap">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search candles by name, scent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid 
grid-cols-[260px_1fr] 
gap-[40px] 
p-[60px] 
items-start 
max-[1100px]:grid-cols-1">
        <aside className="filters">
          <div className="filter-card">
            <h4>Categories</h4>
            <div className="filter-options">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
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
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-card">
            <h4>Fragrance</h4>
            <div className="filter-options">
              {FRAGRANCES.map((fragrance) => (
                <label key={fragrance} className="filter-option">
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
                  <span>{fragrance === 'French Lavender' ? 'Lavender' : fragrance}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-card">
            <h4>Price: Up to <span id="price-val">₹{maxPrice.toLocaleString('en-IN')}</span></h4>
            <input
              type="range"
              className="price-range"
              min={500}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
            />
          </div>
          <button
            type="button"
            className="btn-primary mt-[10px] w-full"
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

        <div>
          <div className="shop-toolbar">
            <span className="product-count">Showing {sorted.length} products</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
          <div className="products-grid" id="products-grid">
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
