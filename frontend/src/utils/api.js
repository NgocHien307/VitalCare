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
 * Backend: HealthMetricController.java
 * Returns: HealthMetricResponse DTOs (userId NOT exposed)
 */
export const healthMetricsAPI = {
  // Get all metrics for current user
  // Backend: GET /api/metrics
  getAll: async () => {
    return api.get('/metrics');
  },

  // Get metric by ID
  // Backend: GET /api/metrics/{id}
  getById: async (id) => {
    return api.get(`/metrics/${id}`);
  },

  // Get metrics by type
  // Backend: GET /api/metrics/type/{type}
  // Types: BLOOD_PRESSURE, BLOOD_SUGAR, BMI, HEART_RATE, WEIGHT, TEMPERATURE
  getByType: async (type) => {
    return api.get(`/metrics/type/${type}`);
  },

  // Get recent metrics (since specific date)
  // Backend: GET /api/metrics/recent?since={ISO-date}
  getRecent: async (since) => {
    const params = new URLSearchParams({
      since: since.toISOString(),
    });
    return api.get(`/metrics/recent?${params}`);
  },

  // Create new metric
  // Backend: POST /api/metrics
  create: async (metricData) => {
    return api.post('/metrics', metricData);
  },

  // Update metric
  // Backend: PUT /api/metrics/{id}
  update: async (id, metricData) => {
    return api.put(`/metrics/${id}`, metricData);
  },

  // Delete metric
  // Backend: DELETE /api/metrics/{id}
  delete: async (id) => {
    return api.delete(`/metrics/${id}`);
  },
};

/**
 * Appointments API
 * Backend: AppointmentController.java
 * Returns: AppointmentResponse DTOs (userId NOT exposed)
 */
export const appointmentsAPI = {
  // Get all appointments for current user
  // Backend: GET /api/appointments
  getAll: async () => {
    return api.get('/appointments');
  },

  // Get upcoming appointments only
  // Backend: GET /api/appointments/upcoming
  getUpcoming: async () => {
    return api.get('/appointments/upcoming');
  },

  // Get appointment by ID
  // Backend: GET /api/appointments/{id}
  getById: async (id) => {
    return api.get(`/appointments/${id}`);
  },

  // Create new appointment
  // Backend: POST /api/appointments
  create: async (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },

  // Update appointment
  // Backend: PUT /api/appointments/{id}
  update: async (id, appointmentData) => {
    return api.put(`/appointments/${id}`, appointmentData);
  },

  // Cancel appointment (soft delete)
  // Backend: PATCH /api/appointments/{id}/cancel
  cancel: async (id) => {
    return api.patch(`/appointments/${id}/cancel`);
  },

  // Delete appointment
  // Backend: DELETE /api/appointments/{id}
  delete: async (id) => {
    return api.delete(`/appointments/${id}`);
  },
};

/**
 * Medicines API
 * Backend: MedicineController.java
 * Returns: MedicineResponse DTOs (userId NOT exposed)
 */
export const medicinesAPI = {
  // Get all medicines for current user
  // Backend: GET /api/medicines
  getAll: async () => {
    return api.get('/medicines');
  },

  // Get active medicines only (endDate is null or in future)
  // Backend: GET /api/medicines/active
  getActive: async () => {
    return api.get('/medicines/active');
  },

  // Get medicine by ID
  // Backend: GET /api/medicines/{id}
  getById: async (id) => {
    return api.get(`/medicines/${id}`);
  },

  // Create new medicine
  // Backend: POST /api/medicines
  create: async (medicineData) => {
    return api.post('/medicines', medicineData);
  },

  // Update medicine
  // Backend: PUT /api/medicines/{id}
  update: async (id, medicineData) => {
    return api.put(`/medicines/${id}`, medicineData);
  },

  // Delete medicine
  // Backend: DELETE /api/medicines/{id}
  delete: async (id) => {
    return api.delete(`/medicines/${id}`);
  },

  // Log medicine intake
  // Backend: POST /api/medicines/{id}/log (NOT IMPLEMENTED YET)
  logIntake: async (medicineId) => {
    return api.post(`/medicines/${medicineId}/log`);
  },
};

/**
 * Symptoms API
 * Backend: SymptomController.java
 * Returns: SymptomResponse DTOs (userId NOT exposed)
 */
export const symptomsAPI = {
  // Get all symptoms for current user
  // Backend: GET /api/symptoms
  getAll: async () => {
    return api.get('/symptoms');
  },

  // Get active symptoms only (endDate is null)
  // Backend: GET /api/symptoms/active
  getActive: async () => {
    return api.get('/symptoms/active');
  },

  // Get symptom by ID
  // Backend: GET /api/symptoms/{id}
  getById: async (id) => {
    return api.get(`/symptoms/${id}`);
  },

  // Create new symptom
  // Backend: POST /api/symptoms
  create: async (symptomData) => {
    return api.post('/symptoms', symptomData);
  },

  // Update symptom
  // Backend: PUT /api/symptoms/{id}
  update: async (id, symptomData) => {
    return api.put(`/symptoms/${id}`, symptomData);
  },

  // Mark symptom as ended (set endDate to now)
  // Backend: PUT /api/symptoms/{id}/end
  markAsEnded: async (id) => {
    return api.put(`/symptoms/${id}/end`);
  },

  // Delete symptom
  // Backend: DELETE /api/symptoms/{id}
  delete: async (id) => {
    return api.delete(`/symptoms/${id}`);
  },
};

/**
 * DSS (Decision Support System) API
 * Backend: DSSController.java
 * CORE: Symptom analysis and risk prediction algorithms
 */
export const dssAPI = {
  // Analyze active symptoms and predict possible conditions
  // Backend: POST /api/dss/analyze-symptoms
  // This is the CORE DSS algorithm!
  analyzeSymptoms: async () => {
    return api.post('/dss/analyze-symptoms');
  },

  // Predict health risks (cardiovascular, diabetes, etc.)
  // Backend: POST /api/dss/predict-risks
  predictRisks: async () => {
    return api.post('/dss/predict-risks');
  },

  // Get health insights for current user
  // Backend: GET /api/dss/insights?unreadOnly={boolean}
  getInsights: async (unreadOnly = false) => {
    const params = new URLSearchParams({ unreadOnly });
    return api.get(`/dss/insights?${params}`);
  },

  // Get health predictions for current user
  // Backend: GET /api/dss/predictions?type={type}
  // Types: CARDIOVASCULAR, DIABETES, HYPERTENSION, etc.
  getPredictions: async (type = null) => {
    const params = type ? new URLSearchParams({ type }) : '';
    return api.get(`/dss/predictions${params ? '?' + params : ''}`);
  },

  // Mark insight as read
  // Backend: PATCH /api/dss/insights/{id}/read
  markInsightAsRead: async (insightId) => {
    return api.patch(`/dss/insights/${insightId}/read`);
  },

  // Delete insight
  // Backend: DELETE /api/dss/insights/{id}
  deleteInsight: async (insightId) => {
    return api.delete(`/dss/insights/${insightId}`);
  },

  // Delete prediction
  // Backend: DELETE /api/dss/predictions/{id}
  deletePrediction: async (predictionId) => {
    return api.delete(`/dss/predictions/${predictionId}`);
  },
};

export default api;
