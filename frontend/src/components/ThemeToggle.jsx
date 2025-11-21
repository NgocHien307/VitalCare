import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center gap-2 px-4 py-2
        bg-white border-2 border-primary-500 text-primary-600
        hover:bg-primary-50 rounded-lg
        transition-all duration-200
        font-medium text-sm
      "
      aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
    >
      {theme === 'light' ? (
        <>
          <Moon size={20} aria-hidden="true" />
          <span className="hidden sm:inline">Chế độ tối</span>
        </>
      ) : (
        <>
          <Sun size={20} aria-hidden="true" />
          <span className="hidden sm:inline">Chế độ sáng</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
