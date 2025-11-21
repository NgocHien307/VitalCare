import React from 'react';

const HealthStatusBadge = ({ status, value }) => {
  const styles = {
    normal: 'bg-success-100 text-success-700 border-success-300',
    warning: 'bg-warning-100 text-warning-700 border-warning-300',
    danger: 'bg-danger-100 text-danger-700 border-danger-300',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        text-sm font-medium rounded-full border-2
        ${styles[status]}
      `}
      role="status"
      aria-label={`Trạng thái: ${value}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" aria-hidden="true"></span>
      {value}
    </span>
  );
};

export default HealthStatusBadge;
