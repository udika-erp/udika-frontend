import { useEffect } from 'react';
import { authService } from '@/features/auth/service';
import { clearTokens, getAccessToken } from '@/services/tokens';
import { useAuthStore } from '@/store/auth.store';

/**
 * Bootstraps the auth session on app startup.
 *
 * Checks for a stored accessToken in localStorage.
 * If present, validates it by calling GET /auth/me and
 * hydrates the auth store with the employee data.
 * If validation fails (token invalid/expired), redirects to /login.
 *
 * Runs once on mount. Safe to use on both authenticated and
 * unauthenticated entry points.
 */
export function useAuthInit() {
  const { setEmployee, setAuthenticating, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setAuthenticating(false);
      return;
    }

    setAuthenticating(true);

    authService
      .me()
      .then((employee) => {
        setEmployee(employee);
      })
      .catch(() => {
        // Token invalid/expired — clear local auth state and force login
        clearTokens();
        clearAuth();
        window.location.replace('/login');
      })
      .finally(() => {
        setAuthenticating(false);
      });
  }, [clearAuth, setEmployee, setAuthenticating]);
}
