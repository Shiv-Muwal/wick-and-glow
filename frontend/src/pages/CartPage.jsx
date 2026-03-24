import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStockCap } from '../utils/stock';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, changeQty } = useCart();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-[120px] text-center max-[1024px]:pt-[150px]">
        <h1 className="font-['Playfair_Display',serif] text-2xl text-[var(--deep)]">Your cart is empty</h1>
        <p className="mt-3 text-[0.9rem] text-[var(--light-text)]">Add candles from the shop — checkout works as a guest.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-[999px] bg-[var(--deep)] px-[28px] py-[14px] text-[0.78rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-[100px] max-[1024px]:pt-[130px]">
      <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[var(--deep)] mb-8">Shopping cart</h1>
      <p className="mb-6 text-[0.85rem] text-[var(--light-text)]">
        Saved on this device only. Clear browser data clears the cart.
      </p>
      <div className="flex flex-col gap-4">
        {cart.map((item) => {
          const cap = getStockCap(item);
          const atMax = item.qty >= cap;
          return (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
            >
              <Link to={`/product/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--cream)]">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${item.color || '#f5cac3'}, #f7ede2)`,
                    }}
                  >
                    {item.emoji || '🕯️'}
                  </div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.id}`} className="font-semibold text-[var(--deep)] no-underline hover:text-[var(--sage)]">
                  {item.name}
                </Link>
                <p className="text-[0.85rem] text-[var(--light-text)]">₹{item.price} each</p>
                {cap < 999 ? (
                  <p className="text-[0.72rem] text-[var(--light-text)]">Max {cap} in stock</p>
                ) : null}
              </div>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--blush)] text-[1rem] text-[var(--text)] transition hover:bg-[var(--sage)] hover:text-white"
                  onClick={() => changeQty(item.id, -1)}
                >
                  −
                </button>
                <span className="min-w-[20px] text-center text-[0.9rem] font-semibold">{item.qty}</span>
                <button
                  type="button"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--blush)] text-[1rem] text-[var(--text)] transition hover:bg-[var(--sage)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={atMax}
                  onClick={() => changeQty(item.id, 1)}
                >
                  +
                </button>
              </div>
              <div className="text-right font-semibold">₹{(parseInt(item.price, 10) * item.qty).toLocaleString('en-IN')}</div>
              <button
                type="button"
                className="text-sm text-red-700 underline-offset-2 hover:underline"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-10 flex flex-col items-end gap-4 border-t border-[rgba(132,165,157,0.25)] pt-8">
        <div className="text-lg font-semibold text-[var(--deep)]">
          Subtotal <span className="ml-4">₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <Link
          to="/checkout"
          className="inline-flex rounded-[999px] bg-[var(--deep)] px-[28px] py-[14px] text-[0.78rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
