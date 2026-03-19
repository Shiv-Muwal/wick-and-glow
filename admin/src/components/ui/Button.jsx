import React from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const VARIANT_CLASS = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
};

function Button({ variant = 'primary', className = '', children, ...props }) {
  const variantClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary;

  return (
    <button type="button" className={cx(variantClass, className)} {...props}>
      {children}
    </button>
  );
}

export default Button;

