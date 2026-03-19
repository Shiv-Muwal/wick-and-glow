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
      <div className={`product-image ${product.imageClass || ''}`}>
        <div className="flex h-full items-center justify-center text-[6rem]">
          {product.emoji}
        </div>
        {product.badge ? (
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
        <div className="product-meta">
          <div className="product-price">
            ₹{product.price}
            {product.originalPrice ? <span className="original">₹{product.originalPrice}</span> : null}
          </div>
          <button type="button" className={`add-cart ${added ? 'added' : ''}`} onClick={handleAddToCart}>
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
