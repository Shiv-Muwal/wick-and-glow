import { Link, useLocation } from 'react-router-dom';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order?.id) {
    return (
      <div className="mx-auto max-w-lg px-6 py-[160px] text-center max-[1024px]:pt-[180px]">
        <h1 className="font-['Playfair_Display',serif] text-2xl text-[var(--deep)]">No order to show</h1>
        <p className="mt-3 text-[0.9rem] text-[var(--light-text)]">
          Open this page right after checkout, track with order ID + email, or sign in to see all orders.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="inline-flex rounded-[999px] bg-[var(--deep)] px-[26px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]">
            Shop
          </Link>
          <Link to="/track-order" className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[26px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white">
            Track order
          </Link>
          <Link to="/dashboard" className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[26px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white">
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] px-6 py-[120px] max-[1024px]:pt-[150px]">
      <div className="rounded-2xl border border-[rgba(132,165,157,0.35)] bg-white p-10 text-center shadow-[var(--shadow)]">
        <div className="mb-4 text-4xl" aria-hidden>
          ✅
        </div>
        <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[var(--deep)]">Thank you!</h1>
        <p className="mt-2 text-[0.95rem] text-[var(--light-text)]">Your order has been placed.</p>
        <p className="mt-6 font-mono text-[1.1rem] font-semibold text-[var(--sage)]">{order.id}</p>
        <p className="mt-2 text-[0.9rem] text-[var(--text)]">
          Total paid (COD):{' '}
          <span className="font-semibold">₹{order.amount?.toLocaleString('en-IN')}</span>
        </p>
        {order.shippingAddress ? (
          <p className="mx-auto mt-6 max-w-sm text-left text-[0.85rem] leading-relaxed text-[var(--light-text)]">
            <span className="font-semibold text-[var(--deep)]">Deliver to:</span>
            <br />
            {order.customerName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            <br />
            Phone: {order.phone}
          </p>
        ) : null}
        <p className="mt-6 text-[0.8rem] text-[var(--light-text)]">
          Save your order ID — track delivery on{' '}
          <Link to="/track-order" className="text-[var(--sage)] font-semibold no-underline">
            Track order
          </Link>{' '}
          or open your{' '}
          <Link to="/dashboard" className="text-[var(--sage)] font-semibold no-underline">
            dashboard
          </Link>
          .
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[26px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white">
            Continue shopping
          </Link>
          <Link to="/track-order" className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[26px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white">
            Track this order
          </Link>
          <Link to="/dashboard" className="inline-flex rounded-[999px] bg-[var(--deep)] px-[26px] py-[12px] text-[0.76rem] font-semibold uppercase tracking-[1.3px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]">
            My orders
          </Link>
        </div>
      </div>
    </div>
  );
}
