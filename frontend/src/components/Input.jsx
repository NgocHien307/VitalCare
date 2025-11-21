import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  success = false,
  className = '',
  id,
  ...props
}) => {
  const baseStyles = `
    w-full bg-white border rounded-lg
    px-4 py-3 text-base
    font-sans text-gray-800
    transition-all duration-200
    min-h-[44px]
    placeholder:text-gray-400
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
  `;

  const stateStyles = error
    ? 'border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-100'
    : success
      ? 'border-success-500 focus:border-success-500 focus:ring-4 focus:ring-success-100'
      : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100';

  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseStyles} ${stateStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;
