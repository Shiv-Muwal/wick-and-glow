import React from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { INVENTORY_COLUMNS } from '../inventoryConfig.js';

function Inventory() {
  const { state } = useAdmin();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Inventory
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Monitor stock levels
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
              {INVENTORY_COLUMNS.map((h) => (
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
            {state.products.map((p) => {
              const pct = Math.min((p.stock / 60) * 100, 100);
              const color =
                p.stock === 0
                  ? '#ef4444'
                  : p.stock < 15
                  ? '#ef4444'
                  : p.stock < 30
                  ? '#f6bd60'
                  : '#84a59d';

              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface2)]"
                >
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="flex items-center gap-[12px]">
                      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--cream)] to-[var(--blush)] text-[20px]">
                        {p.emoji}
                      </div>
                      <span className="text-[var(--text)]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                    {p.category}
                  </td>
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="flex items-center gap-[8px]">
                      <span className="w-[28px] font-semibold" style={{ color }}>
                        {p.stock}
                      </span>
                      <div className="w-[80px]">
                        <div className="h-[5px] rounded-[3px] bg-[var(--border)]">
                          <div
                            className="h-[5px] rounded-[3px] transition-[width] duration-300 ease-out"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
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

export default Inventory;

