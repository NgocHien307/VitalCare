import React from 'react';

const MetricDisplay = ({ label, value, unit, status = 'normal' }) => {
  const statusColors = {
    normal: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <div className="flex items-baseline justify-center gap-2">
        <span
          className={`
            text-4xl font-bold tabular-nums
            ${statusColors[status]}
          `}
          aria-label={`${label}: ${value} ${unit}`}
        >
          {value}
        </span>
        <span className="text-xl text-gray-500 font-medium">{unit}</span>
      </div>
    </div>
  );
};

export default MetricDisplay;
