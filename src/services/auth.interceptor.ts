// src/services/auth.interceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './api';
import { setAccessToken, clearTokens, getAccessToken } from './tokens';
import { useAuthStore } from '@/store/auth.store';
import { queryClient } from '@/providers/query-provider';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type QueueCallback = (token: string) => void | PromiseLike<void>;

let isRefreshing = false;
let failedQueue: Array<{ resolve: QueueCallback; reject: (error: unknown) => void }> = [];

function processQueue(token: string | null, error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error || new Error('No token available'));
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

export function setupAuthInterceptor() {
  // REQUEST interceptor: attach JWT token
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE interceptor: handle 401 & token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown, RetryableRequestConfig>) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

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
        const { authService } = await import('@/features/auth/service');
        const { accessToken } = await authService.refreshToken();
        setAccessToken(accessToken);
        processQueue(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        processQueue(null, refreshError);
        clearTokens();
        useAuthStore.getState().clearAuth();
        queryClient.clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
