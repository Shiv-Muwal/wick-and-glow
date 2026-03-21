import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getStockCap, isOutOfStock } from '../utils/stock';

export default function ProductCard({ product, onQuickView }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const out = isOutOfStock(product);
  const cap = getStockCap(product);
  const lowStock = !out && cap > 0 && cap <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (out) {
      showToast('Out of stock');
      return;
    }
    const ok = addToCart(product);
    if (!ok) {
      showToast('Cannot add more — stock limit reached');
      return;
    }
    setAdded(true);
    showToast(`${product.name} added to cart 🕯️`);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
    if (!wishlisted) showToast('Added to wishlist ♥');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  const badgeClass = product.badge === 'new' ? 'new' : product.badge === 'limited' ? 'sale' : '';
  const badgeTone = product.badge === 'premium' ? 'bg-[#84a59d]' : '';
  const badgeLabelMap = {
    bestseller: 'Bestseller',
    new: 'New',
    premium: 'Premium',
    limited: 'Limited',
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card reveal">
      <div className={`product-image ${product.imageUrl ? '' : product.imageClass || ''}`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[6rem]">
            {product.emoji}
          </div>
        )}
        {out ? (
          <span className="product-badge sale">Out of stock</span>
        ) : product.badge ? (
          <span className={`product-badge ${badgeClass} ${badgeTone}`}>
            {badgeLabelMap[product.badge] || product.badge}
          </span>
        ) : null}
        <button type="button" className="wishlist-btn" onClick={handleWishlist} aria-label="Wishlist">
          {wishlisted ? '♥' : '♡'}
        </button>
        <div className="quick-view" onClick={handleQuickView} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleQuickView(e)}>
          Quick View
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">
          {product.category}
          {product.fragrance ? ` · ${product.fragrance}` : ''}
        </div>
        <div className="product-name">{product.name}</div>
        {lowStock ? (
          <div className="text-[0.68rem] font-semibold uppercase tracking-wide text-amber-800 mb-1">
            Only {cap} left
          </div>
        ) : null}
        <div className="product-meta">
          <div className="product-price">
            ₹{product.price}
            {product.originalPrice ? <span className="original">₹{product.originalPrice}</span> : null}
          </div>
          <button
            type="button"
            className={`add-cart ${added ? 'added' : ''} ${out ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={handleAddToCart}
            disabled={out}
          >
            {out ? 'Sold out' : added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
