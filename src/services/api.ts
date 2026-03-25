import axios from 'axios';
import { getAccessToken } from './tokens';
import {
  getStatusMessage,
  getNetworkErrorMessage,
  type NormalizedError,
} from '@/lib/error-messages';
import { setupAuthInterceptor } from './auth.interceptor';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.DEV && { 'ngrok-skip-browser-warning': 'true' }),
  },
});

// Request interceptor: attach auth token if present
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let normalized: NormalizedError;

    if (error.response) {
      const status: number = error.response.status;
      const serverMessage: string =
        error.response.data?.message ?? getStatusMessage(status);
      const code: string = error.response.data?.errorCode ?? String(status);

      normalized = { message: serverMessage, code, status };
    } else if (error.request) {
      normalized = {
        message: getNetworkErrorMessage(),
        code: 'NETWORK_ERROR',
        status: 0,
      };
    } else {
      normalized = {
        message: getStatusMessage(500),
        code: 'UNKNOWN',
        status: 0,
      };
    }

    return Promise.reject(normalized);
  },
);

// Setup 401/refresh interceptor AFTER response interceptor
setupAuthInterceptor();
