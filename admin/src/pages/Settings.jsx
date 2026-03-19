import React, { useState } from 'react';
import Modal from '../components/ui/Modal.jsx';
import ToggleSwitch from '../components/ui/ToggleSwitch.jsx';

function Settings() {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState(true);

  const closePasswordModal = () => setPasswordModalOpen(false);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordModalOpen(false);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Settings
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">Configure your store</p>
        </div>
      </div>

      <section>
        <h3 className="mb-[14px] font-['DM_Serif_Display',serif] text-[17px] text-[var(--text)]">
          🔒 Security
        </h3>
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px]">
          <div className="flex items-center justify-between gap-[12px] border-b border-[var(--border)] py-[13px]">
            <div>
              <h4 className="text-[14px] font-medium text-[var(--text)]">Change Admin Password</h4>
              <p className="mt-[2px] text-[12px] text-[var(--text2)]">
                Update your login credentials
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="rounded-[8px] border border-[var(--border)] bg-transparent px-[12px] py-[6px] text-[12px] text-[var(--text2)] transition-colors hover:bg-[rgba(132,165,157,0.05)] hover:text-[var(--sage)]"
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-[14px] font-['DM_Serif_Display',serif] text-[17px] text-[var(--text)]">
          📦 Orders
        </h3>
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px]">
          <div className="flex items-center justify-between gap-[12px] py-[13px]">
            <div>
              <h4 className="text-[14px] font-medium text-[var(--text)]">Order Notifications</h4>
              <p className="mt-[2px] text-[12px] text-[var(--text2)]">Email alerts for new orders</p>
            </div>
            <ToggleSwitch
              checked={orderNotifications}
              onChange={setOrderNotifications}
              ariaLabel="Toggle order notifications"
            />
          </div>
        </div>
      </section>

      <Modal open={passwordModalOpen} onClose={closePasswordModal}>
        <div className="w-full max-w-[540px] rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-[30px] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="mb-[22px] flex items-center justify-between">
            <h3 className="font-['DM_Serif_Display',serif] text-[19px] text-[var(--text)]">
              Change Password
            </h3>
            <button
              type="button"
              onClick={closePasswordModal}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[var(--surface2)] text-[16px] text-[var(--text2)] transition-colors hover:bg-[#ef4444] hover:text-white"
              aria-label="Close password modal"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="grid gap-[14px] md:grid-cols-2">
            <div className="flex flex-col gap-[6px] md:col-span-2">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none transition-all focus:border-[var(--sage)] focus:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]"
              />
            </div>
            <div className="mt-[2px] flex justify-end gap-[9px] md:col-span-2">
              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-[10px] border border-[var(--border)] bg-transparent px-[17px] py-[9px] text-[13px] font-medium text-[var(--text2)] transition-colors hover:bg-[rgba(132,165,157,0.05)] hover:text-[var(--sage)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[10px] bg-[linear-gradient(135deg,var(--sage),#6b9088)] px-[17px] py-[9px] text-[13px] font-medium text-white shadow-[0_4px_14px_rgba(132,165,157,0.28)] transition-transform hover:-translate-y-[1px]"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;

