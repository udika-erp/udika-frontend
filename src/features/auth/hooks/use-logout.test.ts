// src/features/auth/hooks/use-logout.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogout } from './use-logout';
import { authService } from '../service';
import { clearTokens } from '@/services/tokens';
import { useAuthStore } from '@/store/auth.store';
import * as routerHooks from 'react-router';

// Mock dependencies
vi.mock('../service', () => ({
  authService: {
    logout: vi.fn(),
  },
}));

vi.mock('@/services/tokens', () => ({
  clearTokens: vi.fn(),
}));

vi.mock('@/hooks/use-app-toast', () => ({
  useAppToast: () => ({
    success: vi.fn(),
  }),
}));

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}));

describe('useLogout', () => {
  let queryClient: QueryClient;
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });

    mockNavigate = vi.fn();
    vi.spyOn(routerHooks, 'useNavigate').mockReturnValue(mockNavigate);

    // Reset auth store before each test
    useAuthStore.setState({
      user: { id: '123', email: 'test@example.com', role: 'USER' },
      isAuthenticated: true,
      isAuthenticating: false,
    });

    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should call logout API and clear auth state on success', async () => {
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should clear auth store on success', async () => {
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const clearAuthSpy = vi.spyOn(useAuthStore.getState(), 'clearAuth');

    const { result } = renderHook(() => useLogout(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(clearAuthSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear query client cache on success', async () => {
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const clearSpy = vi.spyOn(queryClient, 'clear');

    const { result } = renderHook(() => useLogout(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('should still clear local auth state even if API call fails', async () => {
    const error = new Error('Network error');
    vi.mocked(authService.logout).mockRejectedValue(error);

    const clearAuthSpy = vi.spyOn(useAuthStore.getState(), 'clearAuth');

    const { result } = renderHook(() => useLogout(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Even on error, local state should be cleared
    expect(clearAuthSpy).toHaveBeenCalledTimes(1);
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should use correct mutation key', async () => {
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), { wrapper });

    expect(result.current.mutationKey).toEqual(['auth', 'user']);
  });
});
