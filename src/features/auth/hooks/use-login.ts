// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../service';
import { setAccessToken, setRefreshToken } from '@/services/tokens';
import { useAuthStore } from '@/store/auth.store';
import { useAppToast } from '@/hooks/use-app-toast';
import { queryKeys } from '@/lib/query-keys';
import type { LoginRequest } from '../data/type';
import type { NormalizedError } from '@/lib/error-messages';

/**
 * Login mutation hook.
 * Authenticates user with email/password, stores tokens and user data,
 * and navigates to dashboard on success.
 */
export function useLogin() {
  const navigate = useNavigate();
  const toast = useAppToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationKey: queryKeys.auth.user(),

    mutationFn: async (data: LoginRequest) => {
      return await authService.login(data);
    },

    onSuccess: (response) => {
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    },

    onError: (error: NormalizedError) => {
      toast.error(error.message);
      console.error('Login failed:', error.message, error.code, error.status);
    },
  });
}
