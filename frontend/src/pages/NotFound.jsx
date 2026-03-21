import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="px-[60px] py-[120px] text-center max-[768px]:px-6">
      <h1 className="font-['Playfair_Display',serif] text-[3rem] text-[var(--deep)] mb-2">404</h1>
      <p className="text-[var(--light-text)] mb-8 max-w-md mx-auto">
        This page does not exist. The product or link may have moved.
      </p>
      <Link to="/" className="btn-primary inline-block no-underline">
        Back to home
      </Link>
    </div>
  );
}
