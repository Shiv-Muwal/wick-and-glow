import React from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

function Input({ className = '', variant = 'pill', ...props }) {
  const base =
    variant === 'pill'
      ? 'input-pill'
      : 'block w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text2)] focus:border-[var(--sage)] focus:ring-2 focus:ring-[rgba(132,165,157,0.35)]';

  return <input className={cx(base, className)} {...props} />;
}

export default Input;

