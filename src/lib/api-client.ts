import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { refreshTokenStorage, tokenStorage, userStorage } from './storage';

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

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

let refreshPromise: Promise<RefreshTokenResponse> | null = null;
let isRedirectingToLogin = false;

const clearSessionAndRedirectToLogin = () => {
  tokenStorage.removeToken();
  refreshTokenStorage.removeToken();
  userStorage.removeUser();

  if (!isRedirectingToLogin) {
    isRedirectingToLogin = true;
    window.location.href = '/auth/login';
  }
};

const refreshSession = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = refreshTokenStorage.getToken();

  if (!refreshToken) {
    throw new Error('Refresh token not found.');
  }

  const response = await axios.post<RefreshTokenResponse>(
    `${apiClient.defaults.baseURL}/auth/refresh-token`,
    { refreshToken },
  );

  const tokens = response.data;

  if (!tokens?.token || !tokens.refreshToken) {
    throw new Error('Invalid refresh token response.');
  }

  tokenStorage.setToken(tokens.token);
  refreshTokenStorage.setToken(tokens.refreshToken);

  return tokens;
};

const getRefreshedSession = (): Promise<RefreshTokenResponse> => {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

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
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isAuthenticationRequest =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthenticationRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const tokens = await getRefreshedSession();
      originalRequest.headers.Authorization = `Bearer ${tokens.token}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearSessionAndRedirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);
