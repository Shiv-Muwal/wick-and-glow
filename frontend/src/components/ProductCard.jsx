import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product, onQuickView }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
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

  const badgeClass = product.badge === 'new' ? 'new' : product.badge === 'premium' ? '' : '';
  const badgeStyle = product.badge === 'premium' ? { background: '#84a59d' } : {};

  return (
    <Link to={`/product/${product.id}`} className="product-card reveal">
      <div className="product-image" style={{ background: `linear-gradient(135deg,${product.color},#f7ede2)` }}>
        <div style={{ fontSize: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {product.emoji}
        </div>
        {product.badge && (
          <span className={`product-badge ${badgeClass}`} style={badgeStyle}>
            {product.badge}
          </span>
        )}
        <button type="button" className="wishlist-btn" onClick={handleWishlist} aria-label="Wishlist">
          {wishlisted ? '♥' : '♡'}
        </button>
        <div className="quick-view" onClick={handleQuickView} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleQuickView(e)}>
          Quick View
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-meta">
          <div className="product-price">₹{product.price}</div>
          <button type="button" className={`add-cart ${added ? 'added' : ''}`} onClick={handleAddToCart}>
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
