import axios from 'axios';
import { tokenStorage, refreshTokenStorage } from './storage';

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
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Do not trigger global logout or retry if the 401 came from the login or refresh-token endpoint itself
      if (!originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh-token')) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = refreshTokenStorage.getToken();
          if (refreshToken) {
            const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, {
              refreshToken: refreshToken
            });
            
            if (response.data && response.data.token && response.data.refreshToken) {
              tokenStorage.setToken(response.data.token);
              refreshTokenStorage.setToken(response.data.refreshToken);
              
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          tokenStorage.removeToken();
          refreshTokenStorage.removeToken();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
        
        tokenStorage.removeToken();
        refreshTokenStorage.removeToken();
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
