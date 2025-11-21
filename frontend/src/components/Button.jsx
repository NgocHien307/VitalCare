import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    cursor-pointer transition-all duration-200
    touch-target
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0 active:shadow-sm
      shadow-sm
    `,
    secondary: `
      bg-white text-primary-600 border-2 border-primary-500
      hover:bg-primary-50 hover:border-primary-600
      active:bg-primary-100
    `,
    danger: `
      bg-danger-500 text-white
      hover:bg-danger-600 hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0 active:shadow-sm
      shadow-sm
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
