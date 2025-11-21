import React from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', children, className = '', ...props }) => {
  const icons = {
    info: <Info size={24} aria-hidden="true" />,
    success: <CheckCircle size={24} aria-hidden="true" />,
    warning: <AlertTriangle size={24} aria-hidden="true" />,
    danger: <XCircle size={24} aria-hidden="true" />,
  };

  const styles = {
    info: 'bg-info-50 border-info-500 text-info-900',
    success: 'bg-success-50 border-success-500 text-success-900',
    warning: 'bg-warning-50 border-warning-500 text-warning-900',
    danger: 'bg-danger-50 border-danger-500 text-danger-900',
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 p-4 rounded-lg
        border-l-4 mb-4 text-[0.9375rem] leading-relaxed
        ${styles[type]}
        ${className}
      `}
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Alert;
