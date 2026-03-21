import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../AdminContext.jsx';
import { ORDER_COLUMNS, ORDER_STATUS_OPTIONS } from '../ordersConfig.js';

function Orders() {
  const { state, updateOrderStatus } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(
    () =>
      state.orders.filter(
        (o) => !statusFilter || o.status === statusFilter
      ),
    [state.orders, statusFilter]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Orders
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Track and manage all orders
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[11px]">
        <select
          className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[9px] text-[13px] text-[var(--text)] outline-none transition-colors focus:border-[var(--sage)]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status[0].toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
              {ORDER_COLUMNS.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface2)]"
              >
                <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                  <Link
                    to={`/orders/${encodeURIComponent(o.id)}`}
                    className="font-mono text-[12.5px] font-semibold text-[var(--sage)] no-underline hover:underline"
                  >
                    {o.id}
                  </Link>
                </td>
                <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                  {o.customer}
                </td>
                <td className="px-[15px] py-[13px] align-middle text-[13px] text-[var(--text)]">
                  {o.product}
                </td>
                <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                  ₹{o.amount.toLocaleString()}
                </td>
                <td className="px-[15px] py-[13px] align-middle text-[12px] text-[var(--text2)]">
                  {o.pincode || '—'}
                </td>
                <td className="px-[15px] py-[13px] align-middle text-[11px] uppercase text-[var(--text2)]">
                  {o.payment || '—'}
                </td>
                <td className="px-[15px] py-[13px] align-middle">
                  <select
                    className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[10px] py-[5px] text-[12px] text-[var(--text)] outline-none transition-colors focus:border-[var(--sage)]"
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  >
                    {ORDER_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-[15px] py-[13px] align-middle text-[12px] text-[var(--text2)]">
                  {o.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;

