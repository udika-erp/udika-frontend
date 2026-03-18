// src/features/auth/hooks/use-logout.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../service';
import { clearTokens } from '@/services/tokens';
import { useAuthStore } from '@/store/auth.store';
import { useAppToast } from '@/hooks/use-app-toast';
import { queryClient } from '@/providers/query-provider';
import { queryKeys } from '@/lib/query-keys';

export function useLogout() {
  const navigate = useNavigate();
  const toast = useAppToast();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationKey: queryKeys.auth.user(),

    mutationFn: async () => {
      return await authService.logout();
    },

    onSuccess: () => {
      clearTokens();
      clearAuth();
      queryClient.clear();
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    },

    onError: (error: { message: string }) => {
      console.error('Logout failed:', error.message);
      // Even if API call fails, clear local auth state
      clearTokens();
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
}
