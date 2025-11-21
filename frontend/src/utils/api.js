/**
 * API Utility for making HTTP requests to the backend
 * Base URL is automatically handled by Vite proxy in development
 */

const API_BASE_URL = '/api';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Create headers with auth token if available
 */
const createHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || response.statusText,
      errors: error.errors || {},
    };
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: createHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    // If 401 Unauthorized, clear token and redirect to login
    if (error.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    throw error;
  }
};

/**
 * API Methods
 */
export const api = {
  // GET request
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  // POST request
  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  // PUT request
  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },

  // PATCH request
  patch: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  },

  // DELETE request
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};

/**
 * Authentication API
 */
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};

/**
 * Health Metrics API
 */
export const healthMetricsAPI = {
  // Get all metrics for current user
  getAll: async () => {
    return api.get('/health-metrics');
  },

  // Get metric by ID
  getById: async (id) => {
    return api.get(`/health-metrics/${id}`);
  },

  // Create new metric
  create: async (metricData) => {
    return api.post('/health-metrics', metricData);
  },

  // Update metric
  update: async (id, metricData) => {
    return api.put(`/health-metrics/${id}`, metricData);
  },

  // Delete metric
  delete: async (id) => {
    return api.delete(`/health-metrics/${id}`);
  },

  // Get metrics by type and date range
  getByTypeAndDateRange: async (type, startDate, endDate) => {
    const params = new URLSearchParams({
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return api.get(`/health-metrics/search?${params}`);
  },
};

/**
 * Appointments API
 */
export const appointmentsAPI = {
  // Get all appointments
  getAll: async () => {
    return api.get('/appointments');
  },

  // Get appointment by ID
  getById: async (id) => {
    return api.get(`/appointments/${id}`);
  },

  // Create new appointment
  create: async (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },

  // Update appointment
  update: async (id, appointmentData) => {
    return api.put(`/appointments/${id}`, appointmentData);
  },

  // Cancel appointment
  cancel: async (id) => {
    return api.patch(`/appointments/${id}/cancel`);
  },

  // Delete appointment
  delete: async (id) => {
    return api.delete(`/appointments/${id}`);
  },
};

/**
 * Medicines API
 */
export const medicinesAPI = {
  // Get all medicines
  getAll: async () => {
    return api.get('/medicines');
  },

  // Get medicine by ID
  getById: async (id) => {
    return api.get(`/medicines/${id}`);
  },

  // Create new medicine
  create: async (medicineData) => {
    return api.post('/medicines', medicineData);
  },

  // Update medicine
  update: async (id, medicineData) => {
    return api.put(`/medicines/${id}`, medicineData);
  },

  // Delete medicine
  delete: async (id) => {
    return api.delete(`/medicines/${id}`);
  },

  // Log medicine intake
  logIntake: async (medicineId) => {
    return api.post(`/medicines/${medicineId}/log`);
  },
};

/**
 * Symptoms API
 */
export const symptomsAPI = {
  // Analyze symptoms
  analyze: async (symptoms) => {
    return api.post('/symptoms/analyze', { symptoms });
  },

  // Get symptom history
  getHistory: async () => {
    return api.get('/symptoms/history');
  },
};

/**
 * DSS (Decision Support System) API
 */
export const dssAPI = {
  // Get health insights
  getInsights: async () => {
    return api.get('/dss/insights');
  },

  // Get health predictions
  getPredictions: async () => {
    return api.get('/dss/predictions');
  },

  // Generate health report
  generateReport: async (startDate, endDate) => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return api.get(`/dss/report?${params}`);
  },
};

export default api;
