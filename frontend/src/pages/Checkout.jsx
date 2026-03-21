import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { postOrder, validateCoupon } from '../api/client';

function cartSubtotal(cart) {
  return cart.reduce((s, i) => s + parseInt(i.price, 10) * i.qty, 0);
}

function normalizePhone(s) {
  const d = String(s || '').replace(/\D/g, '');
  if (d.length >= 10) return d.slice(-10);
  return d;
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, ready } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready || !user) return;
    setEmail(user.email);
    setFullName(user.name || '');
  }, [ready, user]);

  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);
  const discountAmount = useMemo(
    () => Math.round((subtotal * discountPct) / 100),
    [subtotal, discountPct]
  );
  const afterDiscount = subtotal - discountAmount;
  const shippingFee = afterDiscount >= 1000 ? 0 : 49;
  const orderTotal = afterDiscount + shippingFee;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      showToast('Enter a coupon code');
      return;
    }
    try {
      const r = await validateCoupon(code);
      if (r.valid) {
        setDiscountPct(r.discount);
        setAppliedCode(code.toUpperCase());
        showToast(`${r.discount}% discount applied`);
      } else {
        setDiscountPct(0);
        setAppliedCode('');
        showToast(r.reason === 'expired' ? 'Coupon expired' : 'Invalid coupon');
      }
    } catch {
      showToast('Could not validate coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const ph = normalizePhone(phone);
    if (ph.length !== 10) {
      showToast('Enter a valid 10-digit mobile number');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      showToast('Enter a valid 6-digit PIN code');
      return;
    }
    setSubmitting(true);
    try {
      /* Phase 1: guest — `items` body mein bhejo, phir localStorage cart clear */
      const res = await postOrder({
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        phone: ph,
        shippingAddress: {
          line1: line1.trim(),
          line2: line2.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
        couponCode: appliedCode || undefined,
        paymentMethod: 'cod',
      });
      clearCart();

      /* Phase 2 (comment — server cart): upar wala postOrder hata kar yeh use karo + CartContext se `refreshCart`
      const res = await postOrder({
        customerName: fullName.trim(),
        phone: ph,
        shippingAddress: {
          line1: line1.trim(),
          line2: line2.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        couponCode: appliedCode || undefined,
        paymentMethod: 'cod',
      });
      await refreshCart();
      */
      navigate('/order-confirmation', { state: { order: res } });
    } catch (err) {
      showToast(err.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-[160px] text-center max-[1024px]:pt-[180px]">
        <h1 className="font-['Playfair_Display',serif] text-2xl text-[var(--deep)]">Your cart is empty</h1>
        <p className="mt-3 text-[0.9rem] text-[var(--light-text)]">Add candles to checkout.</p>
        <Link to="/shop" className="btn-primary mt-8 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20 pt-[120px] max-[1024px]:pt-[140px]">
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[var(--deep)]">Checkout</h1>
          <Link to="/shop" className="text-[0.85rem] font-semibold text-[var(--sage)] no-underline hover:underline">
            ← Back to shop
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--deep)]">
                Delivery details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">Full name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!!user}
                    title={user ? 'Signed-in email' : ''}
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)] read-only:bg-[#f9f9f9]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">Mobile</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">
                    Flat, house no., street
                  </label>
                  <input
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    required
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">
                    Landmark (optional)
                  </label>
                  <input
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">State</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="e.g. Maharashtra"
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.78rem] font-semibold text-[var(--text)]">PIN code</label>
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--deep)]">
                Payment
              </h2>
              <label className="flex cursor-pointer items-start gap-3 rounded border border-[var(--sage)] bg-[rgba(132,165,157,0.08)] p-4">
                <input type="radio" name="pay" checked readOnly className="mt-1" />
                <div>
                  <div className="font-semibold text-[var(--deep)]">Cash on Delivery (COD)</div>
                  <p className="mt-1 text-[0.82rem] text-[var(--light-text)]">
                    Pay when your candles arrive. Online payment (UPI / card) can be added later.
                  </p>
                </div>
              </label>
            </section>
          </div>

          <div className="lg:sticky lg:top-28 h-fit space-y-4">
            <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--deep)]">
                Order summary
              </h2>
              <ul className="mb-4 max-h-[220px] space-y-3 overflow-y-auto border-b border-[#eee] pb-4">
                {cart.map((i) => (
                  <li key={i.id} className="flex justify-between gap-2 text-[0.85rem]">
                    <span className="text-[var(--text)]">
                      {i.name} × {i.qty}
                    </span>
                    <span className="shrink-0 font-medium">₹{(parseInt(i.price, 10) * i.qty).toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-4 flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="min-w-0 flex-1 rounded border border-[#ccc] px-3 py-2 text-[0.85rem] uppercase outline-none focus:border-[var(--sage)]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="shrink-0 rounded border border-[#ccc] bg-[#f3f3f3] px-3 py-2 text-[0.78rem] font-semibold hover:bg-[#e8e8e8]"
                >
                  Apply
                </button>
              </div>
              {appliedCode ? (
                <p className="mb-3 text-[0.78rem] text-[var(--sage)]">Applied: {appliedCode} ({discountPct}%)</p>
              ) : null}
              <div className="space-y-2 text-[0.9rem]">
                <div className="flex justify-between text-[var(--light-text)]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 ? (
                  <div className="flex justify-between text-[var(--sage)]">
                    <span>Discount</span>
                    <span>− ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-[var(--light-text)]">
                  <span>Shipping {afterDiscount >= 1000 ? '(free above ₹1000)' : ''}</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between border-t border-[#eee] pt-3 text-[1.05rem] font-semibold text-[var(--deep)]">
                  <span>Total</span>
                  <span>₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-6 w-full py-3 text-[0.95rem] disabled:opacity-60"
              >
                {submitting ? 'Placing order…' : 'Place order (COD)'}
              </button>
              <p className="mt-3 text-center text-[0.72rem] text-[var(--light-text)]">
                By placing the order you agree to our{' '}
                <Link to="/legal/shipping" className="text-[var(--sage)] no-underline font-medium">
                  shipping
                </Link>{' '}
                and{' '}
                <Link to="/legal/returns" className="text-[var(--sage)] no-underline font-medium">
                  returns
                </Link>{' '}
                policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
