# API + Auth Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement scalable API calling and authentication with class-based services, React Query integration, token management, and 401/refresh handling.

**Architecture:** Class-based service layer (BaseApiClient → feature services) + localStorage for tokens + Zustand for user state + React Query for data fetching + Axios interceptors for auth/refresh.

**Tech Stack:** React 18, TypeScript, Axios, TanStack React Query v5, Zustand, Vite

---

## File Structure

```
src/
├── services/
│   ├── base/
│   │   └── BaseApiClient.ts          # NEW - Base class with GET, POST, PUT, DELETE
│   ├── api.types.ts                   # NEW - Shared API types
│   ├── tokens.ts                      # NEW - Token utilities (localStorage)
│   ├── auth.interceptor.ts            # NEW - 401/refresh logic
│   ├── api.ts                         # MODIFY - Update interceptor to read from localStorage
│   │
│   └── features/
│       ├── AuthService.ts             # NEW - Auth API calls
│       └── CustomersService.ts        # NEW - Customer CRUD (example pattern)
│
├── store/
│   └── auth.store.ts                  # MODIFY - Replace token with user data
│
├── lib/
│   ├── error-types.ts                 # NEW - ErrorType enum, NormalizedError
│   └── query-keys.ts                  # NEW - React Query key factories
│
├── providers/
│   └── query-provider.tsx             # MODIFY - Enhanced error handling
│
└── features/
    ├── auth/
    │   └── hooks/
    │       └── use-login.ts           # NEW - Login mutation hook
    │
    └── customers/
        └── hooks/
            ├── use-customers.ts       # NEW - List query
            ├── use-customer.ts        # NEW - Detail query
            └── use-customer-mutations.ts  # NEW - CRUD mutations
```

---

## Task 1: Create API Types

**Files:**
- Create: `src/services/api.types.ts`

**Purpose:** Define shared types for API responses, pagination, and common interfaces.

- [ ] **Step 1: Create api.types.ts with shared types**

```typescript
// src/services/api.types.ts

/**
 * Standard backend API response wrapper
 * Backend returns: { success: true, data: T, message: string }
 * BaseApiClient unwraps and returns T
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Standard pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * User data from backend
 */
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response data (unwrapped)
 */
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response data (unwrapped)
 */
export interface RefreshTokenResponseData {
  accessToken: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.types.ts
git commit -m "feat: add shared API types

Define ApiResponse, PaginatedResponse, User, LoginRequest/Response
BaseApiClient will unwrap backend responses to return data directly

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Create Error Types

**Files:**
- Create: `src/lib/error-types.ts`

**Purpose:** Define error type enum and normalized error interface for consistent error handling.

- [ ] **Step 1: Create error-types.ts**

```typescript
// src/lib/error-types.ts

/**
 * Error type classification for toast handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Normalized error structure
 * Used by axios interceptor and React Query error handler
 */
export interface NormalizedError {
  type: ErrorType;
  message: string;      // Vietnamese user-facing message
  code: string;         // Error code from backend or status
  status: number;       // HTTP status or 0 for network errors
  details?: unknown;    // Additional error details (validation errors, etc.)
}

/**
 * Classify HTTP status as ErrorType
 */
export function getStatusErrorType(status: number): ErrorType {
  if (status === 400) return ErrorType.VALIDATION;
  if (status === 401) return ErrorType.UNAUTHORIZED;
  if (status === 403) return ErrorType.FORBIDDEN;
  if (status === 404) return ErrorType.NOT_FOUND;
  if (status === 409) return ErrorType.CONFLICT;
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.UNKNOWN;
}

/**
 * Check if error should show automatic toast
 * Network, server, and auth (after refresh) errors auto-toast
 * Validation and not-found are handled in UI
 */
export function shouldAutoToast(error: NormalizedError): boolean {
  return [
    ErrorType.NETWORK,
    ErrorType.SERVER,
    ErrorType.UNAUTHORIZED, // Only after refresh fails
  ].includes(error.type);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/error-types.ts
git commit -m "feat: add error type classification

Add ErrorType enum and NormalizedError interface
Helper functions for error classification and toast decision

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Create Token Utilities

**Files:**
- Create: `src/services/tokens.ts`

**Purpose:** Centralized localStorage operations for access/refresh tokens.

- [ ] **Step 1: Create tokens.ts**

```typescript
// src/services/tokens.ts

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store both tokens in localStorage
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Clear both tokens from localStorage
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user has a valid access token
 */
export function hasAccessToken(): boolean {
  return !!getAccessToken();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/tokens.ts
git commit -m "feat: add token utilities

Centralized localStorage operations for access/refresh tokens

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Create BaseApiClient

**Files:**
- Create: `src/services/base/BaseApiClient.ts`

**Purpose:** Base class for all service classes with HTTP methods that unwrap backend responses.

- [ ] **Step 1: Create base directory and BaseApiClient.ts**

```typescript
// src/services/base/BaseApiClient.ts
import { api } from '../api';
import type { ApiResponse } from '../api.types';

/**
 * Base class for API service clients
 * Provides HTTP methods that automatically unwrap backend responses
 *
 * Backend returns: { success: true, data: T, message: string }
 * These methods return: T (the data payload only)
 */
export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * GET request - returns unwrapped data
   */
  protected async GET<T>(url: string, params?: object): Promise<T> {
    const response = await api.get<ApiResponse<T>>(this.baseUrl + url, { params });
    return response.data.data;
  }

  /**
   * POST request - returns unwrapped data
   */
  protected async POST<T>(url: string, data?: object): Promise<T> {
    const response = await api.post<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }

  /**
   * PUT request - returns unwrapped data
   */
  protected async PUT<T>(url: string, data?: object): Promise<T> {
    const response = await api.put<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }

  /**
   * DELETE request - returns unwrapped data
   */
  protected async DELETE<T>(url: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(this.baseUrl + url);
    return response.data.data;
  }

  /**
   * PATCH request - returns unwrapped data
   */
  protected async PATCH<T>(url: string, data?: object): Promise<T> {
    const response = await api.patch<ApiResponse<T>>(this.baseUrl + url, data);
    return response.data.data;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/base/
git commit -m "feat: add BaseApiClient class

Base class with GET, POST, PUT, DELETE, PATCH methods
Auto-unwraps backend { success, data, message } responses

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Update Axios Interceptor (Read from localStorage)

**Files:**
- Modify: `src/services/api.ts`

**Purpose:** Update request interceptor to read token from localStorage instead of Zustand.

- [ ] **Step 1: Update api.ts to read from localStorage**

```typescript
// src/services/api.ts
import axios from 'axios';
import { getAccessToken } from './tokens';
import {
  getStatusMessage,
  getNetworkErrorMessage,
  type NormalizedError,
} from '@/lib/error-messages';
import { getStatusErrorType } from '@/lib/error-types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token from localStorage
api.interceptors.request.use((config) => {
  const token = getAccessToken(); // Read from localStorage, not Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let normalized: NormalizedError;

    if (error.response) {
      const status: number = error.response.status;
      const serverMessage: string =
        error.response.data?.message ?? getStatusMessage(status);
      const code: string = error.response.data?.code ?? String(status);

      normalized = {
        type: getStatusErrorType(status),
        message: serverMessage,
        code,
        status,
        details: error.response.data?.details,
      };
    } else if (error.request) {
      normalized = {
        type: 'NETWORK_ERROR' as const,
        message: getNetworkErrorMessage(),
        code: 'NETWORK_ERROR',
        status: 0,
      };
    } else {
      normalized = {
        type: 'UNKNOWN' as const,
        message: getStatusMessage(500),
        code: 'UNKNOWN',
        status: 0,
      };
    }

    return Promise.reject(normalized);
  },
);
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.ts
git commit -m "refactor: read token from localStorage in axios interceptor

Previous: Read from Zustand useAuthStore.getState().token
New: Read from localStorage via getAccessToken()
Prepares for auth store refactoring (token → user only)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Refactor Auth Store (Remove token, Add user)

**Files:**
- Modify: `src/store/auth.store.ts`

**Purpose:** Refactor auth store to hold user data instead of token. Tokens now in localStorage.

- [ ] **Step 1: Replace auth.store.ts with new structure**

```typescript
// src/store/auth.store.ts
import { create } from 'zustand';
import type { User } from '@/services/api.types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;

  // Actions
  setUser: (user: User) => void;
  clearAuth: () => void;
  setAuthenticating: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isAuthenticating: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false, isAuthenticating: false }),
  setAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/store/auth.store.ts
git commit -m "refactor: auth store now holds user data, not token

BREAKING CHANGE:
- Removed: token, setToken, clearToken
- Added: user, isAuthenticated, isAuthenticating
- Added: setUser, clearAuth, setAuthenticating

Tokens now stored in localStorage via tokens.ts utilities

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Create AuthService

**Files:**
- Create: `src/services/features/AuthService.ts`

**Purpose:** Auth API calls (login, logout, refreshToken) extending BaseApiClient.

- [ ] **Step 1: Create AuthService.ts**

```typescript
// src/services/features/AuthService.ts
import { BaseApiClient } from '../base/BaseApiClient';
import type {
  LoginRequest,
  LoginResponseData,
  RefreshTokenResponseData,
} from '../api.types';
import { getRefreshToken, setTokens, clearTokens } from '../tokens';
import { useAuthStore } from '@/store/auth.store';

/**
 * Auth API service
 * Base URL: /auth
 */
export class AuthService extends BaseApiClient {
  constructor() {
    super('/auth');
  }

  /**
   * Login with email and password
   * POST /auth/login
   */
  async login(data: LoginRequest): Promise<LoginResponseData> {
    const response = await this.POST<LoginResponseData>('/login', data);

    // Store tokens in localStorage
    setTokens(response.accessToken, response.refreshToken);

    // Store user in Zustand
    useAuthStore.getState().setUser(response.user);

    return response;
  }

  /**
   * Logout current user
   * POST /auth/logout
   * Note: Call this before clearing local state if backend implements logout
   */
  async logout(): Promise<void> {
    try {
      await this.POST<void>('/logout');
    } finally {
      // Always clear local state
      clearTokens();
      useAuthStore.getState().clearAuth();
    }
  }

  /**
   * Refresh access token using refresh token
   * POST /auth/refresh
   *
   * MOCK: Currently reuses existing access token
   * TODO: Replace with real API call when backend implements /auth/refresh
   */
  async refreshToken(): Promise<RefreshTokenResponseData> {
    // MOCK: Reuse existing access token
    // When backend implements /auth/refresh, replace with:
    // return this.POST<RefreshTokenResponseData>('/refresh', { refreshToken });

    const currentToken = getRefreshToken();
    if (!currentToken) {
      throw new Error('No refresh token available');
    }

    // For now, return the same access token
    // This keeps the refresh flow working without backend changes
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token available');
    }

    return { accessToken };
  }
}

// Export singleton instance
export const authService = new AuthService();
```

- [ ] **Step 2: Commit**

```bash
git add src/services/features/AuthService.ts
git commit -m "feat: add AuthService with login, logout, refreshToken

Extends BaseApiClient with /auth baseUrl
login() stores tokens (localStorage) and user (Zustand)
logout() clears local state
refreshToken() mocked - reuses access token until backend implements endpoint

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Create Auth Interceptor (401/Refresh)

**Files:**
- Create: `src/services/auth.interceptor.ts`

**Purpose:** Handle 401 responses with single-flight refresh token flow.

- [ ] **Step 1: Create auth.interceptor.ts**

```typescript
// src/services/auth.interceptor.ts
import { api } from './api';
import { authService } from './features/AuthService';
import { setTokens, clearTokens, getAccessToken } from './tokens';
import { useAuthStore } from '@/store/auth.store';
import { queryClient } from '@/providers/query-provider';

/**
 * Single-flight refresh token interceptor
 * Prevents multiple simultaneous refresh attempts
 * Queues pending requests during refresh
 * Retries original request after successful refresh
 */

// Track refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Process queued requests with new token
 */
function processQueue(token: string, error: unknown) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Setup 401/refresh interceptor on axios instance
 */
export function setupAuthInterceptor(): void {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only handle 401 errors
      // Skip if already retried or not a 401
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If refresh is in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      // Start refresh flow
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Attempt refresh
        const { accessToken } = await authService.refreshToken();

        // Update stored token
        setTokens(accessToken, getRefreshToken()!);

        // Process queued requests with new token
        processQueue(accessToken, null);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect
        processQueue('', refreshError);

        clearTokens();
        useAuthStore.getState().clearAuth();
        queryClient.clear();

        // Redirect to login
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/auth.interceptor.ts
git commit -m "feat: add 401/refresh interceptor with single-flight pattern

Prevents multiple simultaneous refresh attempts
Queues pending requests during refresh
Retries original request after successful refresh
Logout + redirect on refresh failure

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Wire Auth Interceptor into App

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx` (check if exists, otherwise `src/main.tsx`)

**Purpose:** Initialize auth interceptor when app starts.

- [ ] **Step 1: Check main.tsx and App.tsx structure**

First, let's check the current entry point:

```bash
# Read current main.tsx and App.tsx to understand structure
```

- [ ] **Step 2: Import and call setupAuthInterceptor**

Add to the top of your app initialization (usually in `main.tsx` or `App.tsx`):

```typescript
// Add this import at the top
import { setupAuthInterceptor } from '@/services/auth.interceptor';

// Call this before rendering, right after other setup
setupAuthInterceptor();
```

Example for `main.tsx`:

```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Setup auth interceptor before app renders
import { setupAuthInterceptor } from '@/services/auth.interceptor';
setupAuthInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "feat: initialize auth interceptor on app start

Call setupAuthInterceptor() before app renders
Enables 401/refresh flow for all API requests

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Create Query Keys Factory

**Files:**
- Create: `src/lib/query-keys.ts`

**Purpose:** React Query key factories for type-safe cache management.

- [ ] **Step 1: Create query-keys.ts**

```typescript
// src/lib/query-keys.ts

/**
 * React Query key factories
 * Provides type-safe, hierarchical cache keys
 */
export const queryKeys = {
  /**
   * Auth-related keys
   */
  auth: {
    all: ['auth'] as const,
    user: () => ['auth', 'user'] as const,
  } as const,

  /**
   * Customer-related keys
   */
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.customers.lists(), { filters }] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  } as const,

  /**
   * Event-related keys
   */
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.events.lists(), { filters }] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
  } as const,

  /**
   * Employee-related keys
   */
  employees: {
    all: ['employees'] as const,
    lists: () => [...queryKeys.employees.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.employees.lists(), { filters }] as const,
    details: () => [...queryKeys.employees.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.employees.details(), id] as const,
  } as const,
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/query-keys.ts
git commit -m "feat: add React Query key factories

Type-safe cache keys for auth, customers, events, employees
Hierarchical structure for efficient invalidation

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Enhance Query Provider Error Handling

**Files:**
- Modify: `src/providers/query-provider.tsx`

**Purpose:** Add enhanced error handling with toast logic based on error type.

- [ ] **Step 1: Update query-provider.tsx**

```typescript
// src/providers/query-provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useAppToast } from '@/hooks/use-app-toast';
import type { NormalizedError } from '@/lib/error-types';
import { getDefaultErrorMessage } from '@/lib/error-messages';
import { shouldAutoToast } from '@/lib/error-types';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

const queryClient = makeQueryClient();

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { queryClient };

/**
 * Global error handler hook
 * Call once at app root to enable automatic error toasts
 *
 * Toast behavior:
 * - Auto-toast: Network, Server, Unauthorized (after refresh fails)
 * - Manual handling: Validation (form inline), Not Found (page messaging)
 */
export function useGlobalQueryErrorHandler() {
  const toast = useAppToast();

  queryClient.setDefaultOptions({
    queries: {
      ...queryClient.getDefaultOptions().queries,
      // @ts-expect-error onError is deprecated in RQ v5 but still works
      onError: (error: unknown) => {
        const normalizedError = error as NormalizedError;

        // Only auto-toast for certain error types
        if (shouldAutoToast(normalizedError)) {
          toast.error(normalizedError.message || getDefaultErrorMessage());
        }
        // Validation errors handled in UI (no toast)
      },
    },
    mutations: {
      ...queryClient.getDefaultOptions().mutations,
      onError: (error: unknown) => {
        const normalizedError = error as NormalizedError;

        if (shouldAutoToast(normalizedError)) {
          toast.error(normalizedError.message || getDefaultErrorMessage());
        }
        // Validation errors handled in UI (no toast)
      },
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/providers/query-provider.tsx
git commit -m "refactor: enhance QueryProvider error handling

Add shouldAutoToast logic for selective error toasts
Network/Server/Unauthorized errors auto-toast
Validation errors handled in UI (no toast)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 12: Create Login Mutation Hook

**Files:**
- Create: `src/features/auth/hooks/use-login.ts`

**Purpose:** React Query mutation hook for login with error handling.

- [ ] **Step 1: Create use-login.ts**

```typescript
// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '@/services/features/AuthService';
import type { LoginRequest, LoginResponseData } from '@/services/api.types';
import type { NormalizedError } from '@/lib/error-types';
import { ErrorType } from '@/lib/error-types';
import { useAppToast } from '@/hooks/use-app-toast';
import { queryKeys } from '@/lib/query-keys';

/**
 * Login mutation hook
 * Calls AuthService.login() and handles success/error
 */
export function useLogin() {
  const navigate = useNavigate();
  const toast = useAppToast();

  return useMutation<LoginResponseData, NormalizedError, LoginRequest>({
    mutationKey: queryKeys.auth.user(),
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: (data) => {
      // Auth state already set by AuthService.login()
      // Show success message and navigate
      toast.success('Đăng nhập thành công');
      navigate('/');
    },

    onError: (error) => {
      // Validation errors: don't toast (handled by form)
      // Other errors: handled by global handler
      if (error.type === ErrorType.VALIDATION) {
        // Return error to form for inline display
        return error;
      }
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/hooks/use-login.ts
git commit -m "feat: add useLogin mutation hook

Integrates AuthService.login with React Query
Handles success (toast + navigate) and error (inline for validation)
Auto-toast for other errors via global handler

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 13: Update LoginForm to Use Real Login

**Files:**
- Modify: `src/features/auth/components/LoginForm.tsx`

**Purpose:** Replace mock login with real API call (no UI changes).

- [ ] **Step 1: Update LoginForm.tsx to use useLogin**

```typescript
// src/features/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormValues } from '../forms/login.schema';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    // Call real login API
    await login.mutateAsync(values);
  };

  // Get server error from mutation state
  const serverError = login.error as { message?: string } | null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to EventERP</CardTitle>
          <CardDescription>
            Sign in to manage your events and customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError?.message && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {serverError.message}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@eventco.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={form.formState.isSubmitting || login.isPending}
              >
                {login.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Demo: Use your backend credentials
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/components/LoginForm.tsx
git commit -m "feat: wire LoginForm to real login API

Replace mock login with useLogin mutation
Add loading state during authentication
Display server errors inline
No UI/styling changes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 14: Create Customer Types

**Files:**
- Create: `src/services/features/CustomersService.ts` (types first)

**Purpose:** Define Customer types for the example feature pattern.

- [ ] **Step 1: Create customer types file**

```typescript
// src/lib/customer-types.ts

/**
 * Customer entity
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  status: 'active' | 'inactive' | 'lead';
  totalRevenue?: number;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create customer request
 */
export interface CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'lead';
}

/**
 * Update customer request
 */
export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'lead';
}

/**
 * Customer query parameters
 */
export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/customer-types.ts
git commit -m "feat: add customer types

Define Customer, CreateCustomerDto, UpdateCustomerDto, CustomerQueryParams
Used by CustomersService and customer hooks

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 15: Create CustomersService

**Files:**
- Create: `src/services/features/CustomersService.ts`

**Purpose:** Example service class following the BaseApiClient pattern.

- [ ] **Step 1: Create CustomersService.ts**

```typescript
// src/services/features/CustomersService.ts
import { BaseApiClient } from '../base/BaseApiClient';
import type { PaginatedResponse } from '../api.types';
import type {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryParams,
} from '@/lib/customer-types';

/**
 * Customers API service
 * Base URL: /customers
 */
export class CustomersService extends BaseApiClient {
  constructor() {
    super('/customers');
  }

  /**
   * Get paginated list of customers
   * GET /customers
   */
  async getAll(params?: CustomerQueryParams): Promise<PaginatedResponse<Customer>> {
    return this.GET<PaginatedResponse<Customer>>('', params);
  }

  /**
   * Get customer by ID
   * GET /customers/:id
   */
  async getById(id: string): Promise<Customer> {
    return this.GET<Customer>(`/${id}`);
  }

  /**
   * Create new customer
   * POST /customers
   */
  async create(data: CreateCustomerDto): Promise<Customer> {
    return this.POST<Customer>('', data);
  }

  /**
   * Update customer
   * PUT /customers/:id
   */
  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return this.PUT<Customer>(`/${id}`, data);
  }

  /**
   * Delete customer
   * DELETE /customers/:id
   */
  async delete(id: string): Promise<void> {
    return this.DELETE<void>(`/${id}`);
  }
}

// Export singleton instance
export const customersService = new CustomersService();
```

- [ ] **Step 2: Commit**

```bash
git add src/services/features/CustomersService.ts
git commit -m "feat: add CustomersService example pattern

Extends BaseApiClient with /customers baseUrl
Implements getAll, getById, create, update, delete
Serves as reference for other feature services

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 16: Create Customer Query Hooks

**Files:**
- Create: `src/features/customers/hooks/use-customers.ts`
- Create: `src/features/customers/hooks/use-customer.ts`
- Create: `src/features/customers/hooks/use-customer-mutations.ts`

**Purpose:** React Query hooks for customer data fetching and mutations.

- [ ] **Step 1: Create use-customers.ts (list hook)**

```typescript
// src/features/customers/hooks/use-customers.ts
import { useQuery } from '@tanstack/react-query';
import { customersService } from '@/services/features/CustomersService';
import type { CustomerQueryParams, PaginatedResponse } from '@/lib/customer-types';
import type { Customer } from '@/lib/customer-types';
import { queryKeys } from '@/lib/query-keys';

/**
 * Fetch paginated customers list
 */
export function useCustomers(params?: CustomerQueryParams) {
  return useQuery<PaginatedResponse<Customer>, Error>({
    queryKey: queryKeys.customers.list(JSON.stringify(params || {})),
    queryFn: () => customersService.getAll(params),
  });
}
```

- [ ] **Step 2: Create use-customer.ts (detail hook)**

```typescript
// src/features/customers/hooks/use-customer.ts
import { useQuery } from '@tanstack/react-query';
import { customersService } from '@/services/features/CustomersService';
import type { Customer } from '@/lib/customer-types';
import { queryKeys } from '@/lib/query-keys';

/**
 * Fetch single customer by ID
 */
export function useCustomer(id: string) {
  return useQuery<Customer, Error>({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersService.getById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}
```

- [ ] **Step 3: Create use-customer-mutations.ts**

```typescript
// src/features/customers/hooks/use-customer-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '@/services/features/CustomersService';
import type { CreateCustomerDto, UpdateCustomerDto } from '@/lib/customer-types';
import type { Customer } from '@/lib/customer-types';
import type { NormalizedError } from '@/lib/error-types';
import { ErrorType } from '@/lib/error-types';
import { queryKeys } from '@/lib/query-keys';
import { useAppToast } from '@/hooks/use-app-toast';

/**
 * Create customer mutation
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation<Customer, NormalizedError, CreateCustomerDto>({
    mutationFn: (data) => customersService.create(data),

    onSuccess: (data) => {
      // Invalidate customer list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      toast.success('Khách hàng đã được tạo thành công');
      return data;
    },

    onError: (error) => {
      if (error.type !== ErrorType.VALIDATION) {
        // Non-validation errors already toasted by global handler
        // But we can add specific handling here if needed
      }
    },
  });
}

/**
 * Update customer mutation
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation<
    Customer,
    NormalizedError,
    { id: string; data: UpdateCustomerDto }
  >({
    mutationFn: ({ id, data }) => customersService.update(id, data),

    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.details() });
      toast.success('Khách hàng đã được cập nhật');
      return data;
    },
  });
}

/**
 * Delete customer mutation
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation<Customer, NormalizedError, string>({
    mutationFn: (id) => customersService.delete(id),

    onSuccess: () => {
      // Invalidate customer list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      toast.success('Khách hàng đã được xóa');
    },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/customers/hooks/
git commit -m "feat: add customer query and mutation hooks

useCustomers: paginated list query
useCustomer: detail query by ID
useCreateCustomer, useUpdateCustomer, useDeleteCustomer: mutations
Auto-invalidation of related queries
Success toasts in Vietnamese

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 17: Verify Build and Run Dev Server

**Files:**
- None (verification)

**Purpose:** Ensure everything compiles and runs without errors.

- [ ] **Step 1: Run TypeScript check**

```bash
npm run type-check 2>&1 || npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 2: Run ESLint**

```bash
npm run lint
```

Expected: No new lint errors (may have existing ones)

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:5173, login page loads

- [ ] **Step 4: Test login flow (manual)**

1. Open http://localhost:5173
2. Enter email and password
3. Click Sign In
4. Should see: Loading state → API call → Success/Error

Expected behavior:
- With valid backend credentials: Login succeeds, tokens stored, redirect to dashboard
- With invalid credentials: Error message displayed

- [ ] **Step 5: Check browser console for errors**

Open browser DevTools Console:
- No React errors
- No network errors (except expected 401 if backend not running)

- [ ] **Step 6: Commit verification**

```bash
git add .
git commit -m "chore: verify build and dev server

TypeScript check passed
ESLint check passed
Dev server running successfully
Login flow tested

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Summary

This implementation plan creates:

1. **Service Layer**: BaseApiClient → feature services (AuthService, CustomersService)
2. **Token Management**: localStorage utilities with clear auth/redirect
3. **Auth Flow**: Login → tokens stored → 401 handling → refresh → retry or logout
4. **React Query**: Key factories, hooks, automatic error toasts
5. **Example Pattern**: CustomersService + hooks as template for other features

**Files Created:** 17 new files
**Files Modified:** 4 existing files
**No UI Changes**: LoginForm logic only, styling unchanged

---

## Testing Checklist

After implementation, verify:

- [ ] Login works with real backend API
- [ ] Tokens stored in localStorage (check DevTools Application tab)
- [ ] User data stored in Zustand (use DevTools or console.log)
- [ ] 401 triggers refresh (mock: reuses token)
- [ ] Failed refresh clears tokens and redirects to /login
- [ ] Authorization header sent with requests (check Network tab)
- [ ] Validation errors show inline (no toast for 400)
- [ ] Network/server errors show toast
- [ ] Customer hooks ready for when backend implements endpoints
