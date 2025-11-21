import React from 'react';

const KPICard = ({ children, status = 'normal', className = '', ...props }) => {
  const statusStyles = {
    normal: 'bg-gradient-to-br from-white to-primary-50 border-2 border-primary-100',
    success: 'bg-gradient-to-br from-white to-success-50 border-2 border-success-100',
    warning: 'bg-gradient-to-br from-white to-warning-50 border-2 border-warning-100',
    danger: 'bg-gradient-to-br from-white to-danger-50 border-2 border-danger-100',
  };

  return (
    <div
      className={`
        rounded-xl p-6 min-h-[140px]
        shadow-card transition-all duration-200
        hover:shadow-card-hover hover:-translate-y-1
        ${statusStyles[status]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default KPICard;
