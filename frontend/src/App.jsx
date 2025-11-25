import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import HealthRecords from './pages/dashboard/HealthRecords';
import Appointments from './pages/dashboard/Appointments';
import Medications from './pages/dashboard/Medications';
import Reports from './pages/dashboard/Reports';
import Notifications from './pages/dashboard/Notifications';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';

// Utility Pages
import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="records" element={<HealthRecords />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="medications" element={<Medications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Global Toast Container */}
        <ToastContainer />
      </Router>
    </ToastProvider>
  );
}

export default App;
