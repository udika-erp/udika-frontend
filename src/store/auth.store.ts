import { create } from 'zustand';
import type { Employee } from '@/features/auth/data/type';

type AuthState = {
  employee: Employee | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  setEmployee: (employee: Employee) => void;
  clearAuth: () => void;
  setAuthenticating: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  employee: null,
  isAuthenticated: false,
  isAuthenticating: false,

  setEmployee: (employee) =>
    set({
      employee,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      employee: null,
      isAuthenticated: false,
    }),

  setAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
}));
