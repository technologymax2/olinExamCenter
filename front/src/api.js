import axios from 'axios';

const API_BASE_URL = 'https://olinexamcenter.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ==========================================
// AUTOMATIC AUTHORIZATION
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// HANDLE AUTH ERRORS
// ==========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication failed.');

      // Don't immediately redirect while login itself is running
      const requestUrl = error.config?.url || '';

      if (!requestUrl.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        window.dispatchEvent(new Event('storage'));

        // Redirect only if currently inside a protected page
        if (
          window.location.pathname.startsWith('/admin') ||
          window.location.pathname.startsWith('/hr') ||
          window.location.pathname.startsWith('/teacher') ||
          window.location.pathname.startsWith('/student')
        ) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
