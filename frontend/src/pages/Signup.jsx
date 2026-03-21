import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      showToast('Welcome to Wick & Glow 🕯️');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-sm border border-[#c4c4c4] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[var(--sage)] focus:ring-2 focus:ring-[rgba(132,165,157,0.25)]';
  const labelClass = 'mb-1 block text-[0.78rem] font-bold text-[var(--deep)]';

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f1f3f6] pt-[100px] pb-16 px-4 max-[1024px]:pt-[140px]">
      <div className="mx-auto mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-['Playfair_Display',serif] text-2xl font-semibold tracking-wide text-[var(--deep)] no-underline hover:text-[var(--sage)]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--gold)]" aria-hidden />
          Wick &amp; Glow
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[400px] rounded-sm border border-[#e0e0e0] bg-white px-6 py-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-[1.65rem] font-normal leading-tight text-[var(--deep)]">Create account</h1>
        </div>
        <p className="mb-1 text-[0.8rem] text-[var(--light-text)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--sage)] no-underline hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mb-5 text-[0.8rem] text-[var(--light-text)]">
          Sign up to save your cart and place orders.
        </p>

        {isLoggedIn ? (
          <p className="text-[0.9rem] text-[var(--light-text)]">
            You&apos;re already signed in.{' '}
            <Link to="/" className="font-semibold text-[var(--sage)] no-underline">
              Continue to home
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="su-name" className={labelClass}>
                Full name
              </label>
              <input
                id="su-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="su-email" className={labelClass}>
                Email
              </label>
              <input
                id="su-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="su-password" className={labelClass}>
                Password
              </label>
              <input
                id="su-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="su-confirm" className={labelClass}>
                Re-enter password
              </label>
              <input
                id="su-confirm"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm border border-[#c9a227] bg-[linear-gradient(180deg,#f6bd60_0%,#e8a830_100%)] py-2.5 text-[0.9rem] font-semibold text-[#1a1a1a] shadow-sm transition hover:brightness-[0.98] disabled:opacity-60"
            >
              {submitting ? 'Please wait…' : 'Create your Wick & Glow account'}
            </button>
          </form>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-[#565959]">
          We use your email for orders and updates. Passwords are hashed on the server.
        </p>
      </div>

      <div className="mx-auto mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-[#565959]">
        <Link to="/login" className="text-[var(--sage)] no-underline hover:underline">
          Sign in instead
        </Link>
        <Link to="/shop" className="text-[var(--sage)] no-underline hover:underline">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
