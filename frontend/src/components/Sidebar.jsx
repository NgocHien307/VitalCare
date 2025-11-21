import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Calendar,
  Pill,
  FileText,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { authAPI } from '../utils/api';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
    { icon: Activity, label: 'Chỉ số sức khỏe', path: '/dashboard/records' },
    { icon: Calendar, label: 'Lịch hẹn', path: '/dashboard/appointments' },
    { icon: Pill, label: 'Thuốc', path: '/dashboard/medications' },
    { icon: FileText, label: 'Báo cáo', path: '/dashboard/reports' },
    { icon: Bell, label: 'Thông báo', path: '/dashboard/notifications' },
    { icon: User, label: 'Hồ sơ', path: '/dashboard/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X size={24} className="text-gray-800 dark:text-white" />
        ) : (
          <Menu size={24} className="text-gray-800 dark:text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                Health Tracker
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Decision Support
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Chế độ tối
            </span>
            <ThemeToggle />
          </div>

          {/* Settings */}
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <Settings size={20} aria-hidden="true" />
            <span>Cài đặt</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
