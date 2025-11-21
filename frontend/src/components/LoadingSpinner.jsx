import React from 'react';

const LoadingSpinner = ({ size = 24, className = '' }) => {
  return (
    <div
      className={`inline-block ${className}`}
      role="status"
      aria-label="Đang tải"
    >
      <div
        className="
          border-4 border-primary-200 border-t-primary-500
          rounded-full animate-spin
        "
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: 'spin 1s linear infinite',
        }}
      />
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;
