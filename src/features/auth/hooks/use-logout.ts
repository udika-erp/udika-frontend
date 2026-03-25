// src/features/auth/hooks/use-logout.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../service';
import { clearTokens, getRefreshToken } from '@/services/tokens';
import { useAuthStore } from '@/store/auth.store';
import { useAppToast } from '@/hooks/use-app-toast';
import { queryClient } from '@/providers/query-provider';
import { queryKeys } from '@/lib/query-keys';
import type { NormalizedError } from '@/lib/error-messages';

/**
 * Logout mutation hook.
 * Attempts to call the logout API, but always clears local auth state
 * even if the API call fails to prevent users from being stuck.
 */
export function useLogout() {
  const navigate = useNavigate();
  const toast = useAppToast();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationKey: queryKeys.auth.all,

    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authService.logout({ refreshToken });
      }
    },

    onSuccess: () => {
      toast.success('Đăng xuất thành công!');
      clearTokens();
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },

    onError: (error: NormalizedError) => {
      toast.error(error.message);
      console.error('Logout failed:', error.message, error.code, error.status);
      // Even if API call fails, clear local auth state
      clearTokens();
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
}
