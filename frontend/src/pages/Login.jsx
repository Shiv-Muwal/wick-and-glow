import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      showToast('Welcome back ✨');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Could not sign in');
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="mx-auto w-full max-w-[360px] rounded-sm border border-[#e0e0e0] bg-white px-6 py-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h1 className="mb-1 text-[1.65rem] font-normal leading-tight text-[var(--deep)]">Sign in</h1>
        <p className="mb-5 text-[0.8rem] text-[var(--light-text)]">
          Sign in to add items to your cart and checkout.
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
              <label htmlFor="login-email" className="mb-1 block text-[0.78rem] font-bold text-[var(--deep)]">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-sm border border-[#c4c4c4] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[var(--sage)] focus:ring-2 focus:ring-[rgba(132,165,157,0.25)]"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-[0.78rem] font-bold text-[var(--deep)]">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-sm border border-[#c4c4c4] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[var(--sage)] focus:ring-2 focus:ring-[rgba(132,165,157,0.25)]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm border border-[#c9a227] bg-[linear-gradient(180deg,#f6bd60_0%,#e8a830_100%)] py-2.5 text-[0.9rem] font-semibold text-[#1a1a1a] shadow-sm transition hover:brightness-[0.98] disabled:opacity-60"
            >
              {submitting ? 'Please wait…' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-[#565959]">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[360px]">
        <div className="relative mb-4">
          <div
            className="absolute left-0 right-0 top-1/2 z-0 h-px -translate-y-1/2 bg-[#d5d9d9]"
            aria-hidden
          />
          <p className="relative z-[1] mx-auto w-fit bg-[#f1f3f6] px-3 text-center text-[12px] text-[#767676]">
            New to Wick &amp; Glow?
          </p>
        </div>
        <Link
          to="/signup"
          className="block w-full rounded-sm border border-[#d5d9d9] bg-[#f7f8fa] py-2.5 text-center text-[0.85rem] font-normal text-[var(--deep)] no-underline shadow-sm transition hover:bg-[#ecedee]"
        >
          Create your account
        </Link>
      </div>

      <div className="mx-auto mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-[#565959]">
        <Link to="/contact" className="text-[var(--sage)] no-underline hover:underline">
          Help
        </Link>
        <Link to="/shop" className="text-[var(--sage)] no-underline hover:underline">
          Shop
        </Link>
        <span className="cursor-default">© {new Date().getFullYear()} Wick &amp; Glow</span>
      </div>
    </div>
  );
}
