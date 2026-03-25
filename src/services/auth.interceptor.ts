import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './api';
import { setAccessToken, setRefreshToken, clearTokens, getRefreshToken } from './tokens';
import { useAuthStore } from '@/store/auth.store';
import { queryClient } from '@/providers/query-provider';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(token: string | null, error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error ?? new Error('No token available'));
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

export function setupAuthInterceptor() {
  // RESPONSE interceptor: handle 401 & token refresh with rotation
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown, RetryableRequestConfig>) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { authService } = await import('@/features/auth/service');
        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh({ refreshToken });

        setAccessToken(accessToken);
        setRefreshToken(newRefreshToken);
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
