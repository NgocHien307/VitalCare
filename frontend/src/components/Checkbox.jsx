import React from 'react';

const Checkbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const checkboxStyles = `
    w-5 h-5 rounded border-2 border-gray-300
    text-primary-500 focus:ring-4 focus:ring-primary-200
    disabled:opacity-60 disabled:cursor-not-allowed
    cursor-pointer transition-all duration-200
  `;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={checkboxStyles}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
