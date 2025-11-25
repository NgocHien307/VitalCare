import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast Container Component
 * Renders all active toasts
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Individual Toast Component
 */
const Toast = ({ message, type = 'info', onClose }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      borderColor: 'border-success-500',
      textColor: 'text-success-800 dark:text-success-200',
      iconColor: 'text-success-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-error-50 dark:bg-error-900/20',
      borderColor: 'border-error-500',
      textColor: 'text-error-800 dark:text-error-200',
      iconColor: 'text-error-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50 dark:bg-warning-900/20',
      borderColor: 'border-warning-500',
      textColor: 'text-warning-800 dark:text-warning-200',
      iconColor: 'text-warning-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-info-50 dark:bg-info-900/20',
      borderColor: 'border-info-500',
      textColor: 'text-info-800 dark:text-info-200',
      iconColor: 'text-info-500',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } =
    config[type] || config.info;

  return (
    <div
      className={`${bgColor} ${textColor} border-l-4 ${borderColor} p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in-right`}
      role="alert"
    >
      <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ToastContainer;
