import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchAdminOrder } from '../api/client.js';
import { useAdmin } from '../AdminContext.jsx';
import { ORDER_STATUS_OPTIONS } from '../ordersConfig.js';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { updateOrderStatus } = useAdmin();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminOrder(orderId);
        if (!cancelled) setOrder(data);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Could not load order');
          setOrder(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const onStatusChange = async (e) => {
    const next = e.target.value;
    if (!order) return;
    try {
      await updateOrderStatus(order.id, next);
      setOrder((o) => (o ? { ...o, status: next } : o));
    } catch {
      /* context logs */
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Link
          to="/orders"
          className="inline-block text-[13px] font-medium text-[var(--sage)] no-underline hover:underline"
        >
          ← Back to orders
        </Link>
        <p className="text-[13px] text-[var(--text2)]">Loading order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link
          to="/orders"
          className="inline-block text-[13px] font-medium text-[var(--sage)] no-underline hover:underline"
        >
          ← Back to orders
        </Link>
        <p className="text-[13px] text-red-700">{error || 'Order not found'}</p>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to="/orders"
            className="mb-3 inline-block text-[13px] font-medium text-[var(--sage)] no-underline hover:underline"
          >
            ← Back to orders
          </Link>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Order {order.id}
          </h2>
          <p className="mt-[4px] text-[12.5px] text-[var(--text2)]">
            Placed on {order.date} ·{' '}
            {order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
            Status
          </label>
          <select
            className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[9px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
            value={order.status}
            onChange={onStatusChange}
          >
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status[0].toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text2)]">
            Customer
          </h3>
          <dl className="space-y-3 text-[13px]">
            <div>
              <dt className="text-[11px] font-medium text-[var(--text2)]">Name</dt>
              <dd className="text-[var(--text)]">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium text-[var(--text2)]">Email</dt>
              <dd className="break-all text-[var(--text)]">{order.customerEmail}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium text-[var(--text2)]">Phone</dt>
              <dd className="text-[var(--text)]">{order.phone || '—'}</dd>
            </div>
            {order.userId ? (
              <div>
                <dt className="text-[11px] font-medium text-[var(--text2)]">Store user ID</dt>
                <dd className="break-all font-mono text-[12px] text-[var(--text)]">{order.userId}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text2)]">
            Shipping address
          </h3>
          {addr ? (
            <address className="not-italic text-[13px] leading-relaxed text-[var(--text)]">
              {addr.line1}
              {addr.line2 ? (
                <>
                  <br />
                  {addr.line2}
                </>
              ) : null}
              <br />
              {addr.city}, {addr.state} {addr.pincode}
            </address>
          ) : (
            <p className="text-[13px] text-[var(--text2)]">No address on file</p>
          )}
        </section>
      </div>

      <section className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text2)]">
          Line items
        </h3>
        <p className="mb-3 text-[12px] text-[var(--text2)]">Summary: {order.productLabel}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 text-right">Line</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((line, i) => (
                <tr key={`${line.productId}-${i}`} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 pr-3 text-[var(--text)]">{line.name || line.productId}</td>
                  <td className="py-3 pr-3 text-[var(--text)]">{line.qty}</td>
                  <td className="py-3 pr-3 text-[var(--text)]">₹{Number(line.price).toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right font-medium text-[var(--text)]">
                    ₹{(Number(line.price) * Number(line.qty)).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[12px] border border-[var(--border)] bg-[var(--surface2)] p-5">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text2)]">
          Totals
        </h3>
        <dl className="max-w-sm space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-[var(--text2)]">Subtotal</dt>
            <dd className="text-[var(--text)]">₹{Number(order.subtotal).toLocaleString('en-IN')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text2)]">Discount ({order.discountPercent}%)</dt>
            <dd className="text-[var(--text)]">− ₹{Number(order.discountAmount).toLocaleString('en-IN')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text2)]">Shipping</dt>
            <dd className="text-[var(--text)]">
              {order.shippingFee === 0 ? 'FREE' : `₹${Number(order.shippingFee).toLocaleString('en-IN')}`}
            </dd>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-2 text-[15px] font-semibold">
            <dt className="text-[var(--text)]">Total</dt>
            <dd className="text-[var(--text)]">₹{Number(order.amount).toLocaleString('en-IN')}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
