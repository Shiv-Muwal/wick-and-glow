import React, { useId } from 'react';

function ToggleSwitch({
  checked,
  onChange,
  id,
  name,
  disabled = false,
  className = '',
  ariaLabel,
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleChange = (event) => {
    onChange?.(event.target.checked);
  };

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center justify-center ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className="peer sr-only"
      />

      <span
        className="
        relative inline-block h-[24px] w-[44px] rounded-[12px]
        bg-[var(--toggle-off)]
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        peer-checked:bg-[var(--sage)]
        peer-focus-visible:ring-2 
        peer-focus-visible:ring-[var(--sage)] 
        peer-focus-visible:ring-offset-2
        after:absolute after:left-[3px] after:top-[3px]
        after:h-[18px] after:w-[18px]
        after:rounded-full after:bg-[var(--bg2)] after:border after:border-[rgba(15,23,42,0.08)]
        after:shadow-[0_1px_4px_rgba(0,0,0,0.2)]
        after:transition-all after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)]
        peer-checked:after:translate-x-[20px]
        after:will-change-transform
      "
      />
    </label>
  );
}

export default ToggleSwitch;

