import React, { useState } from 'react';

const Tooltip = ({ children, content, delay = 300, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            bg-gray-700 text-white text-sm
            px-4 py-2 rounded-lg whitespace-nowrap
            fade-in pointer-events-none z-50
            after:content-[''] after:absolute after:top-full after:left-1/2
            after:-ml-1 after:border-4 after:border-transparent
            after:border-t-gray-700
          "
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
