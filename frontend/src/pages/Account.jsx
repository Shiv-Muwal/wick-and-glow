import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getMyOrders, postChangePassword } from '../services/api.js';

export default function Account() {
  const { user, ready, isLoggedIn, logout } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

  useEffect(() => {
    if (!ready || !isLoggedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyOrders();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load orders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, isLoggedIn]);

  const handlePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPw) {
      showToast('New passwords do not match');
      return;
    }
    setPwSubmitting(true);
    try {
      await postChangePassword(oldPassword, newPassword);
      showToast('Password updated');
      setOldPassword('');
      setNewPassword('');
      setConfirmPw('');
    } catch (err) {
      showToast(err.message || 'Could not update password');
    } finally {
      setPwSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="py-[160px] text-center text-[var(--light-text)] max-[1024px]:pt-[180px]">Loading…</div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-6 py-[160px] text-center max-[1024px]:pt-[180px]">
        <h1 className="font-['Playfair_Display',serif] text-2xl text-[var(--deep)]">Dashboard</h1>
        <p className="mt-3 text-[0.9rem] text-[var(--light-text)]">
          Sign in to view your profile, orders, and saved cart.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/login" className="inline-flex rounded-[999px] bg-[var(--deep)] px-[24px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]">
            Sign in
          </Link>
          <Link to="/signup" className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[24px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 py-[120px] max-[1024px]:pt-[150px]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(132,165,157,0.25)] pb-8">
        <div>
          <h1 className="font-['Playfair_Display',serif] text-[2.2rem] text-[var(--deep)]">My dashboard</h1>
          <p className="mt-2 text-[0.9rem] text-[var(--light-text)]">
            {user.name} · {user.email}
          </p>
          {user.createdAt ? (
            <p className="mt-1 text-[0.75rem] text-[var(--light-text)]">
              Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-lg border border-[var(--sage)] px-4 py-2 text-[0.8rem] font-semibold text-[var(--sage)] transition hover:bg-[var(--sage)] hover:text-white"
        >
          Log out
        </button>
      </div>

      <section className="mb-12 rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-['Playfair_Display',serif] text-[1.25rem] text-[var(--deep)]">Change password</h2>
        <form onSubmit={handlePassword} className="grid max-w-md gap-3">
          <label className="text-[0.78rem] font-semibold text-[var(--deep)]">
            Current password
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
            />
          </label>
          <label className="text-[0.78rem] font-semibold text-[var(--deep)]">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
            />
          </label>
          <label className="text-[0.78rem] font-semibold text-[var(--deep)]">
            Confirm new password
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[#ccc] px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--sage)]"
            />
          </label>
          <button type="submit" disabled={pwSubmitting} className="mt-2 w-fit rounded-[999px] bg-[var(--deep)] px-[24px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--deep)] disabled:opacity-60">
            {pwSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>

      <h2 className="mb-4 font-['Playfair_Display',serif] text-[1.35rem] text-[var(--deep)]">Your orders</h2>
      {loading ? (
        <p className="text-[0.9rem] text-[var(--light-text)]">Loading orders…</p>
      ) : error ? (
        <p className="text-[0.9rem] text-red-700">{error}</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[rgba(132,165,157,0.4)] bg-[rgba(132,165,157,0.06)] p-10 text-center">
          <p className="text-[0.95rem] text-[var(--light-text)]">No orders yet.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-[999px] bg-[var(--deep)] px-[24px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full min-w-[520px] border-collapse text-left text-[0.85rem]">
            <thead>
              <tr className="border-b border-[#eee] bg-[#fafafa] text-[0.7rem] font-bold uppercase tracking-wider text-[var(--light-text)]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="px-4 py-3 font-mono text-[0.8rem]">{o.id}</td>
                  <td className="px-4 py-3 text-[var(--light-text)]">{o.date}</td>
                  <td className="px-4 py-3 text-[var(--text)]">{o.productLabel}</td>
                  <td className="px-4 py-3 font-semibold">₹{o.amount?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 capitalize text-[var(--sage)]">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
