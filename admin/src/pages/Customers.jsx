import React from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { CUSTOMER_COLUMNS } from '../customersConfig.js';

function Customers() {
  const { state } = useAdmin();

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Customers
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            View and manage customer profiles
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
              {CUSTOMER_COLUMNS.map((h) => (
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
            {state.customers.map((c) => {
              const initials = c.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();
              return (
                <tr
                  key={c.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface2)]"
                >
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="flex items-center gap-[12px]">
                      <div
                        className="flex h-[37px] w-[37px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                        style={{ background: c.color }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="text-[var(--text)]">{c.name}</div>
                        <div className="text-[11px] text-[var(--text2)]">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                    {c.orders}
                  </td>
                  <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                    ₹{c.spend.toLocaleString()}
                  </td>
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="flex gap-[8px]">
                      <button
                        type="button"
                        className="inline-flex items-center gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] px-[10px] py-[6px] text-[12px] text-[var(--text2)] transition-colors hover:border-[var(--sage)] hover:text-[var(--sage)]"
                      >
                        <span className="text-[13px]">👤</span>
                        View
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[13px] text-[#dc2626] transition-colors hover:bg-[#dc2626] hover:text-white"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;

