// src/services/auth.interceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './api';
import { setAccessToken, clearTokens } from './tokens';
import { useAuthStore } from '@/store/auth.store';
import { queryClient } from '@/providers/query-provider';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type QueueCallback = (token: string | Error) => void | PromiseLike<void>;

let isRefreshing = false;
let failedQueue: Array<{ resolve: QueueCallback; reject: (error: unknown) => void }> = [];

function processQueue(token: string, error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

export function setupAuthInterceptor() {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown, RetryableRequestConfig>) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      // If no config or not 401 or already retrying
      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If refresh is in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token as string}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Dynamic import to avoid circular dependency
        const { authService } = await import('@/features/auth/service');
        const { accessToken } = await authService.refreshToken();
        setAccessToken(accessToken);

        // Retry queued requests with new token
        processQueue(accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout and reject queued requests
        processQueue('', refreshError);
        clearTokens();
        // TODO: Update to clearAuth after Task 5 (auth store refactor)
        useAuthStore.getState().clearToken();
        queryClient.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
