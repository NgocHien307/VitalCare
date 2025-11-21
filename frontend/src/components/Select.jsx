import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  options = [],
  value,
  onChange,
  disabled = false,
  placeholder = 'Chọn...',
  className = '',
  id,
  ...props
}) => {
  const baseStyles = `
    w-full bg-white border rounded-lg
    px-4 py-3 pr-10 text-base
    font-sans text-gray-800
    transition-all duration-200
    min-h-[44px]
    appearance-none
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
    border-gray-200 hover:border-gray-300
    focus:border-primary-500 focus:ring-4 focus:ring-primary-100
    cursor-pointer
  `;

  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <ChevronDown size={20} aria-hidden="true" />
      </div>
    </div>
  );
};

export default Select;
