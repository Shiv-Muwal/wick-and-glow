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

  const badgeLabelMap = {
    bestseller: 'Bestseller',
    new: 'New',
    premium: 'Premium',
    limited: 'Limited',
  };
  const badgeUi = out
    ? 'bg-red-600 text-white'
    : product.badge === 'new'
      ? 'bg-[var(--sage)] text-white'
      : product.badge === 'limited'
        ? 'bg-[#ef4444] text-white'
        : product.badge === 'premium'
          ? 'bg-[#84a59d] text-white'
          : 'bg-[var(--deep)] text-[var(--cream)]';

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative block overflow-hidden rounded-[20px] bg-white shadow-[var(--shadow)] transition-all hover:-translate-y-[10px] hover:shadow-[var(--shadow-hover)]"
    >
      <div
        className={`relative flex h-[280px] items-center justify-center overflow-hidden bg-[var(--blush)] ${
          product.imageUrl ? '' : product.imageClass || ''
        }`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[6rem]">
            {product.emoji}
          </div>
        )}
        {out ? (
          <span
            className={`absolute left-[16px] top-[16px] rounded-[20px] px-[12px] py-[4px] text-[0.68rem] font-semibold uppercase tracking-[1px] ${badgeUi}`}
          >
            Out of stock
          </span>
        ) : product.badge ? (
          <span
            className={`absolute left-[16px] top-[16px] rounded-[20px] px-[12px] py-[4px] text-[0.68rem] font-semibold uppercase tracking-[1px] ${badgeUi}`}
          >
            {badgeLabelMap[product.badge] || product.badge}
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-[16px] top-[16px] z-[2] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/90 text-[15px] text-[var(--light-text)] shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-colors hover:text-[var(--sage)]"
          onClick={handleWishlist}
          aria-label="Wishlist"
        >
          {wishlisted ? '♥' : '♡'}
        </button>
        <div
          className="absolute bottom-[14px] left-1/2 z-[2] w-[calc(100%-28px)] -translate-x-1/2 rounded-[999px] bg-white/92 px-[14px] py-[9px] text-center text-[0.72rem] font-semibold uppercase tracking-[1px] text-[var(--text)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={handleQuickView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleQuickView(e)}
        >
          Quick View
        </div>
      </div>
      <div className="p-[18px]">
        <div className="mb-[6px] text-[0.66rem] font-semibold uppercase tracking-[2px] text-[var(--light-text)]">
          {product.category}
          {product.fragrance ? ` · ${product.fragrance}` : ''}
        </div>
        <div className="mb-[10px] font-['Playfair_Display',serif] text-[1.55rem] leading-[1.2] text-[var(--deep)]">
          {product.name}
        </div>
        {lowStock ? (
          <div className="mb-1 text-[0.68rem] font-semibold uppercase tracking-wide text-amber-800">
            Only {cap} left
          </div>
        ) : null}
        <div className="mt-[2px] flex items-center justify-between gap-[10px]">
          <div className="text-[1.65rem] font-bold text-[var(--text)]">
            ₹{product.price}
            {product.originalPrice ? (
              <span className="ml-[8px] text-[0.95rem] font-medium text-[var(--light-text)] line-through">
                ₹{product.originalPrice}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className={`rounded-[999px] bg-[var(--deep)] px-[20px] py-[10px] text-[0.74rem] font-semibold uppercase tracking-[1.2px] text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--deep)] ${added ? 'bg-[var(--sage)] text-white' : ''} ${out ? 'pointer-events-none opacity-50' : ''}`}
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
