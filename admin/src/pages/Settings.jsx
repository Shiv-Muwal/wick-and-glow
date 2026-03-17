import React from 'react';

function Settings() {
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Settings
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Configure your store
          </p>
        </div>
      </div>

      <section>
        <h3 className="mb-[14px] font-['DM_Serif_Display',serif] text-[17px] text-[var(--text)]">
          🏪 Store Information
        </h3>
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px]">
          <div className="grid gap-[14px] md:grid-cols-2">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Website Name
              </label>
              <input
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                defaultValue="Maeri Candles"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Currency
              </label>
              <select
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                defaultValue="₹ INR — Indian Rupee"
              >
                <option>₹ INR — Indian Rupee</option>
                <option>$ USD — US Dollar</option>
                <option>€ EUR — Euro</option>
              </select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Support Email
              </label>
              <input
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                type="email"
                defaultValue="hello@maericandles.com"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Phone
              </label>
              <input
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
                type="tel"
                defaultValue="+91 98765 43210"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;

