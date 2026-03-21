import React, { useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import Modal from '../components/ui/Modal.jsx';

function Coupons() {
  const { state, addCoupon, toggleCouponActive, deleteCoupon } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiry: '',
  });

  const openAddCoupon = () => {
    setFormData({ code: '', discount: '', expiry: '' });
    setIsModalOpen(true);
  };

  const closeAddCoupon = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = formData.code.trim().toUpperCase();
    const discount = Number(formData.discount);

    if (!code || !discount) return;

    try {
      await addCoupon({
        code,
        discount,
        expiry: formData.expiry,
      });
      closeAddCoupon();
    } catch {
      /* duplicate code / network — modal stays open */
    }
  };

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
        <button
          type="button"
          onClick={openAddCoupon}
          className="inline-flex items-center gap-2 rounded-[12px] border border-[#e9b949] bg-[#f6bd60] px-[16px] py-[9px] text-[13px] font-semibold text-[#2f2f2f] shadow-[0_8px_20px_rgba(246,189,96,0.28)] transition-all hover:-translate-y-[1px] hover:brightness-[0.98]"
        >
          <span className="text-[15px] leading-none">+</span>
          <span>New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[16px]">
        {state.coupons.map((c) => (
          <div key={c.id}>
            <div className="relative overflow-hidden rounded-[16px] border border-[#f0ece8] bg-[var(--surface)] p-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
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
              <div className="mt-[8px] text-[12px] text-[var(--text2)]">
                <span
                  className={`inline-flex items-center rounded-[6px] px-[10px] py-[3px] text-[11px] font-semibold capitalize ${
                    c.active
                      ? 'bg-[rgba(132,165,157,0.18)] text-[#1f6f63]'
                      : 'bg-[rgba(156,163,175,0.2)] text-[var(--text2)]'
                  }`}
                >
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-[12px] flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => toggleCouponActive(c.id, !c.active)}
                  className={`rounded-[8px] border px-[12px] py-[6px] text-[12px] font-semibold transition-colors ${
                    c.active
                      ? 'border-[#dedede] bg-[#f8f8f8] text-[var(--text2)] hover:bg-[#efefef]'
                      : 'border-[#8ec2b7] bg-[#84a59d] text-white hover:bg-[#77968f]'
                  }`}
                >
                  {c.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  aria-label={`Delete coupon ${c.code}`}
                  onClick={() => deleteCoupon(c.id)}
                  className="inline-flex h-[31px] w-[31px] items-center justify-center rounded-[8px] border border-[#f1d7d7] bg-[#faecec] text-[#8f6b6b] transition-colors hover:bg-[#f5dfdf]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-[14px] w-[14px]"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={closeAddCoupon}>
        <div className="w-full max-w-[540px] rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-[30px] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
            <div className="mb-[22px] flex items-center justify-between">
              <h3 className="font-['DM_Serif_Display',serif] text-[19px] text-[var(--text)]">
                Create Coupon
              </h3>
              <button
                type="button"
                onClick={closeAddCoupon}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[var(--surface2)] text-[16px] text-[var(--text2)] transition-colors hover:bg-[#ef4444] hover:text-white"
                aria-label="Close coupon modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-[14px]">
              <div>
                <label className="mb-[6px] block text-[11.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text2)]">
                  Coupon Code *
                </label>
                <input
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] uppercase text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                  placeholder="e.g. WELCOME10"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-[14px]">
                <div>
                  <label className="mb-[6px] block text-[11.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text2)]">
                    Discount % *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                    placeholder="10"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-[6px] block text-[11.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text2)]">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                    value={formData.expiry}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, expiry: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="mt-[6px] flex justify-end gap-[9px]">
                <button
                  type="button"
                  onClick={closeAddCoupon}
                  className="rounded-[10px] border border-[var(--border)] bg-transparent px-[17px] py-[9px] text-[13px] font-medium text-[var(--text2)] transition-colors hover:bg-[rgba(132,165,157,0.05)] hover:text-[var(--sage)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[10px] bg-[linear-gradient(135deg,var(--gold),#e8a830)] px-[17px] py-[9px] text-[13px] font-medium text-[#1f2937] shadow-[0_4px_14px_rgba(246,189,96,0.28)] transition-transform hover:-translate-y-[1px]"
                >
                  Create Coupon
                </button>
              </div>
            </form>
        </div>
      </Modal>
    </div>
  );
}

export default Coupons;

