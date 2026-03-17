import React from 'react';
import { useAdmin } from '../AdminContext.jsx';

function Coupons() {
  const { state } = useAdmin();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Coupons
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Manage discount codes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3">
        {state.coupons.map((c) => (
          <div
            key={c.id}
            className="relative overflow-hidden rounded-[16px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-[20px] transition-transform hover:-translate-y-[3px] hover:shadow-[var(--shadow)]"
          >
            <div className="font-['DM_Serif_Display',serif] text-[21px] tracking-[1px] text-[var(--gold)]">
              {c.code}
            </div>
            <div className="mt-[5px] text-[30px] font-bold text-[var(--text)] leading-none">
              {c.discount}%
              <span className="text-[16px] font-normal text-[var(--text2)]"> off</span>
            </div>
            <div className="mt-[4px] text-[12px] text-[var(--text2)]">
              Expires: {c.expiry}
            </div>
            <div className="mt-[5px] text-[12px] text-[var(--text2)]">
              <span
                className={`inline-flex items-center rounded-[20px] px-[10px] py-[4px] text-[11px] font-semibold capitalize ${
                  c.active
                    ? 'bg-[rgba(132,165,157,0.15)] text-[#065f46]'
                    : 'bg-[rgba(156,163,175,0.2)] text-[var(--text2)]'
                }`}
              >
                {c.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coupons;

