// src/services/auth.interceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './api';
import { setAccessToken, clearTokens } from './tokens';
import { useAuthStore } from '@/store/auth.store';
import { queryClient } from '@/providers/query-provider';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: Array<
  (token: string) => void | PromiseLike<void>
> = [];

function processQueue(token: string) {
  failedQueue.forEach((resolve) => resolve(token));
  failedQueue = [];
}

export function setupAuthInterceptor() {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;

      // If 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        // If refresh is in progress, queue this request
        if (isRefreshing) {
          return new Promise((resolve) => {
            failedQueue.push((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          // Dynamic import to avoid circular dependency
          const { authService } = await import('@/features/auth/service');
          // Attempt refresh
          const { accessToken } = await authService.refreshToken();
          setAccessToken(accessToken);

          // Retry queued requests with new token
          processQueue(accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed → logout
          failedQueue.forEach(() => {});
          failedQueue = [];
          clearTokens();
          useAuthStore.getState().clearAuth();
          queryClient.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
