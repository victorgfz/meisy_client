import axios from 'axios';
import { tokenStorage } from './storage';

/**
 * Global Axios instance configured with the base API URL and default headers.
 * You can also attach request/response interceptors here for handling tokens or specific status codes.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle global unauthorized errors (e.g., token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Do not trigger global logout if the 401 came from the login endpoint itself
      const originalRequest = error.config;
      if (originalRequest && originalRequest.url && !originalRequest.url.includes('/auth/login')) {
        tokenStorage.removeToken();
        // Redirect to login using window.location to quickly clear application state
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
