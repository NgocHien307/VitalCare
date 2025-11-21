import React from 'react';

const Card = ({ children, className = '', onClick, hover = true, ...props }) => {
  const baseStyles = `
    bg-white rounded-xl p-6
    shadow-card border border-gray-200
    transition-all duration-200
  `;

  const hoverStyles = hover
    ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
