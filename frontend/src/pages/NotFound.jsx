import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="px-[60px] py-[120px] text-center max-[768px]:px-6">
      <h1 className="font-['Playfair_Display',serif] text-[3rem] text-[var(--deep)] mb-2">404</h1>
      <p className="text-[var(--light-text)] mb-8 max-w-md mx-auto">
        This page does not exist. The product or link may have moved.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-[999px] bg-[var(--deep)] px-[28px] py-[14px] text-[0.78rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
      >
        Back to home
      </Link>
    </div>
  );
}
