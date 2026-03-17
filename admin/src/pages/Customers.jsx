import React from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { CUSTOMER_COLUMNS } from '../customersConfig.js';

function Customers() {
  const { state } = useAdmin();

  return (
    <div className="space-y-5">
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

      <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
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
                        <div className="text-[11px] text-[var(--text2)]">
                          {c.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                    {c.orders}
                  </td>
                  <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                    ₹{c.spend.toLocaleString()}
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

