import React from 'react';

const Textarea = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  rows = 4,
  className = '',
  id,
  ...props
}) => {
  const baseStyles = `
    w-full bg-white border rounded-lg
    px-4 py-3 text-base
    font-sans text-gray-800
    transition-all duration-200
    min-h-[100px]
    resize-vertical
    placeholder:text-gray-400
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
    border-gray-200 hover:border-gray-300
    focus:border-primary-500 focus:ring-4 focus:ring-primary-100
  `;

  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default Textarea;
