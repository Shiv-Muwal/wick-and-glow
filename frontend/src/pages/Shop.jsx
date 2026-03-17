import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CATEGORIES = ['Floral', 'Woody', 'Herbal', 'Decorative', 'Classic'];

export default function Shop() {
  useScrollReveal();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('default');

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    const matchPrice = parseInt(p.price, 10) <= maxPrice;
    return matchSearch && matchCat && matchPrice;
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
      <div className="shop-hero">
        <h1>Our Collection</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>Shop</span>
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

      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-card">
            <h4>Categories</h4>
            <div className="filter-options">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="checkbox"
                    checked={categoryFilter === cat}
                    onChange={() => setCategoryFilter((c) => (c === cat ? '' : cat))}
                  />
                  <span>{cat}</span>
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
            className="btn-primary"
            style={{ width: '100%', marginTop: 10 }}
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
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

      <div style={{ marginTop: 60 }}><Newsletter /></div>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
