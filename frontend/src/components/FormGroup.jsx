import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormGroup = ({ label, children, error, helper, required = false, id }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-sm text-gray-500" id={`${id}-helper`}>
          {helper}
        </p>
      )}
      {error && (
        <p
          className="text-sm text-danger-500 flex items-center gap-1"
          role="alert"
          id={`${id}-error`}
        >
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormGroup;
