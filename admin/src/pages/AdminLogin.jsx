import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getAdminSessionToken,
  setAdminSessionToken,
  postAdminLogin,
} from '../api/client.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('wickandglow7@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminSessionToken()) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await postAdminLogin(email.trim(), password);
      if (!token) throw new Error('No token from server');
      setAdminSessionToken(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-[20px] py-[40px]">
      <div className="w-full max-w-[400px] rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-[32px] shadow-[var(--shadow-lg)]">
        <div className="mb-[24px] text-center">
          <div className="mx-auto mb-[12px] flex h-[48px] w-[48px] items-center justify-center rounded-[12px] bg-gradient-to-br from-[var(--gold)] to-[#e8a830] text-[22px]">
            🕯️
          </div>
          <h1 className="font-['DM_Serif_Display',serif] text-[22px] text-[var(--text)]">
            Wick &amp; Glow
          </h1>
          <p className="mt-[6px] text-[13px] text-[var(--text2)]">Admin sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-[16px]">
          {error ? (
            <div
              className="rounded-[10px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.08)] px-[12px] py-[10px] text-[12.5px] text-[#b91c1c]"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="admin-email"
              className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[14px] py-[11px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.12)]"
              required
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="admin-password"
              className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[14px] py-[11px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.12)]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-[4px] w-full rounded-[10px] bg-gradient-to-br from-[var(--sage)] to-[#6b9088] py-[12px] text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(132,165,157,0.28)] transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
