// src/store/auth.store.ts
import { create } from 'zustand';
import type { User } from '@/features/auth/data/type';

type AuthState = {
  // State (token removed - now in localStorage)
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;

  // Actions
  setUser: (user: User) => void;
  clearAuth: () => void;
  setAuthenticating: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isAuthenticating: false,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
}));
