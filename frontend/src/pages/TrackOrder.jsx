import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postOrderLookup } from '../api/client';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await postOrderLookup(orderId.trim(), email.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-[60px] py-[100px] max-[768px]:px-6">
      <div className="mx-auto max-w-lg">
        <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[var(--deep)] mb-2">
          Track your order
        </h1>
        <p className="text-[0.9rem] text-[var(--light-text)] mb-8">
          Enter the order ID from your confirmation email and the email you used at checkout.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--deep)]">
            Order ID
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="#ORD-XXXXXXXX"
              className="rounded-lg border border-[rgba(132,165,157,0.35)] px-4 py-3 font-normal normal-case"
              autoComplete="off"
            />
          </label>
          <label className="flex flex-col gap-1 text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--deep)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-[rgba(132,165,157,0.35)] px-4 py-3 font-normal normal-case"
              autoComplete="email"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          ) : null}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Checking…' : 'Track order'}
          </button>
        </form>
        {result ? (
          <div className="mt-8 rounded-xl border border-[rgba(132,165,157,0.25)] bg-[var(--cream)]/40 p-6">
            <p className="text-[0.72rem] uppercase tracking-wider text-[var(--sage)] font-semibold mb-1">Order</p>
            <p className="font-mono text-lg text-[var(--deep)] mb-4">{result.id}</p>
            <ul className="text-[0.9rem] text-[var(--light-text)] space-y-2">
              <li>
                <span className="text-[var(--deep)] font-medium">Status:</span> {result.status}
              </li>
              <li>
                <span className="text-[var(--deep)] font-medium">Placed:</span> {result.date}
              </li>
              <li>
                <span className="text-[var(--deep)] font-medium">Total:</span> ₹{Number(result.amount).toLocaleString('en-IN')}
              </li>
              <li>
                <span className="text-[var(--deep)] font-medium">Payment:</span>{' '}
                {result.paymentMethod === 'cod' ? 'Cash on delivery' : result.paymentMethod}
              </li>
              {result.productLabel ? (
                <li>
                  <span className="text-[var(--deep)] font-medium">Items:</span> {result.productLabel}
                </li>
              ) : null}
              {result.city ? (
                <li>
                  <span className="text-[var(--deep)] font-medium">Ship to:</span> {result.city}
                  {result.state ? `, ${result.state}` : ''}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
        <p className="mt-8 text-center text-[0.85rem] text-[var(--light-text)]">
          <Link to="/dashboard" className="text-[var(--sage)] font-semibold no-underline">
            Signed in?
          </Link>{' '}
          View all orders in your dashboard.
        </p>
      </div>
    </div>
  );
}
