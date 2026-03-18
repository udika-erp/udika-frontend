# API + Auth Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scalable API calling and authentication strategy using class-based services with inheritance, TanStack React Query for data fetching, localStorage for tokens, and Zustand for user state.

**Architecture:**
- BaseApiClient abstract class with GET/POST/PUT/DELETE methods
- Feature services extend BaseApiClient (e.g., AuthService)
- Tokens stored in localStorage (source of truth for axios interceptor)
- User data stored in Zustand auth store
- 401 triggers single-flight token refresh with request queuing
- React Query for all data fetching/mutations

**Tech Stack:** Axios, TanStack React Query, Zustand, localStorage, TypeScript

---

## Existing Files (No Action Needed)

These files already exist and match the spec:
- `src/services/api.types.ts` - ApiResponse, PaginatedResponse, PaginationParams
- `src/services/base/BaseApiClient.ts` - Abstract base class with HTTP methods
- `src/features/auth/data/type.ts` - User, LoginRequest, LoginResponseData, LoginResponse, LogoutResponse
- `src/features/auth/data/const.ts` - STORAGE_KEYS (ACCESS_TOKEN, REFRESH_TOKEN)
- `src/features/auth/service/index.ts` - AuthService with login(), logout(), refreshToken() (mock)
- `src/lib/error-messages.ts` - NormalizedError interface, Vietnamese messages
- `src/providers/query-provider.tsx` - React Query provider with error handling

## File Structure Map

```
src/
├── services/
│   ├── api.ts                    # MODIFY: localStorage token + 401 interceptor
│   ├── api.types.ts              # ✓ Existing - no changes
│   ├── base/
│   │   └── BaseApiClient.ts      # ✓ Existing - no changes
│   ├── tokens.ts                 # CREATE: localStorage utilities
│   └── auth.interceptor.ts       # CREATE: 401/refresh logic
│
├── lib/                          # Project-level utilities
│   ├── error-messages.ts         # ✓ Existing - keep
│   ├── error-types.ts            # CREATE: ErrorType enum (optional)
│   └── query-keys.ts             # CREATE: React Query key factories
│
├── store/
│   └── auth.store.ts             # MODIFY: add user data, remove token
│
└── features/auth/
    ├── service/index.ts          # ✓ Existing - minor update
    ├── data/
    │   ├── type.ts               # ✓ Existing - no changes
    │   └── const.ts              # ✓ Existing - no changes
    └── hooks/
        └── use-login.ts          # CREATE: Login mutation hook
```

---

## Task 1: Create Token Utilities

**Files:**
- Create: `src/services/tokens.ts`

**Purpose:** Centralized localStorage operations for access/refresh tokens. This is the single source of truth for token storage.

- [ ] **Step 1: Create tokens.ts with localStorage utilities**

```typescript
// src/services/tokens.ts
import { STORAGE_KEYS } from '@/features/auth/data/const';

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/tokens.ts
git commit -m "feat: add token utilities for localStorage"
```

---

## Task 2: Create Error Types (Optional Enhancement)

**Files:**
- Create: `src/lib/error-types.ts`

**Purpose:** Add ErrorType enum for better error categorization. This is optional since `error-messages.ts` already handles NormalizedError.

- [ ] **Step 1: Create error-types.ts with ErrorType enum**

```typescript
// src/lib/error-types.ts
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export type NormalizedError = {
  type: ErrorType;
  message: string;
  code: string;
  status: number;
  details?: unknown;
};

export function normalizeError(error: unknown): Error {
  // Implementation can be added later if needed
  // For now, existing error-messages.ts handles this
  return error as Error;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/error-types.ts
git commit -m "feat: add ErrorType enum for better error categorization"
```

---

## Task 3: Create Query Keys Factory

**Files:**
- Create: `src/lib/query-keys.ts`

**Purpose:** Centralized React Query key factories for cache management and invalidation.

- [ ] **Step 1: Create query-keys.ts with key factories**

```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },
  employees: {
    all: ['employees'] as const,
    lists: () => [...queryKeys.employees.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.employees.all, 'detail', id] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
  },
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/query-keys.ts
git commit -m "feat: add React Query key factories"
```

---

## Task 4: Create Auth Interceptor with 401/Refresh Logic

**Files:**
- Create: `src/services/auth.interceptor.ts`

**Purpose:** Handle 401 responses with single-flight token refresh and request queuing. Prevents multiple simultaneous refresh attempts.

**Note:** To avoid circular dependency, we use dynamic import for authService inside the refresh handler.

- [ ] **Step 1: Create auth.interceptor.ts with single-flight refresh**

```typescript
// src/services/auth.interceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './api';
import { setAccessToken, clearTokens } from './tokens';
import { useAuthStore } from '@/store/auth.store';
import { queryClient } from '@/providers/query-provider';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: Array<
  (token: string) => void | PromiseLike<void>
> = [];

function processQueue(token: string) {
  failedQueue.forEach((resolve) => resolve(token));
  failedQueue = [];
}

export function setupAuthInterceptor() {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;

      // If 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        // If refresh is in progress, queue this request
        if (isRefreshing) {
          return new Promise((resolve) => {
            failedQueue.push((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          // Dynamic import to avoid circular dependency
          const { authService } = await import('@/features/auth/service');
          // Attempt refresh
          const { accessToken } = await authService.refreshToken();
          setAccessToken(accessToken);

          // Retry queued requests with new token
          processQueue(accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed → logout
          failedQueue.forEach(() => {
            // Reject queued requests
          });
          failedQueue = [];
          clearTokens();
          useAuthStore.getState().clearAuth();
          queryClient.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/auth.interceptor.ts
git commit -m "feat: add 401 auth interceptor with single-flight refresh"
```

---

## Task 5: Update Auth Store (Add User Data)

**Files:**
- Modify: `src/store/auth.store.ts`

**Purpose:** Store user data in Zustand while tokens remain in localStorage. Remove `token` property since tokens are now in localStorage.

**Breaking Change:** After this task, any code using `useAuthStore.getState().token` will break. Search codebase for this usage before proceeding.

- [ ] **Step 1: Update auth.store.ts to include user data**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/store/auth.store.ts
git commit -m "refactor: move user to auth store, token to localStorage"
```

---

## Task 6: Update API Client (Use localStorage + Interceptor)

**Files:**
- Modify: `src/services/api.ts`

**Purpose:** Read token from localStorage instead of Zustand, attach auth interceptor.

- [ ] **Step 1: Update api.ts to use localStorage and auth interceptor**

```typescript
// src/services/api.ts
import axios from 'axios';
import { getAccessToken } from './tokens';
import {
  getStatusMessage,
  getNetworkErrorMessage,
  type NormalizedError,
} from '@/lib/error-messages';
import { setupAuthInterceptor } from './auth.interceptor';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token from localStorage
api.interceptors.request.use((config) => {
  const token = getAccessToken();
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

      normalized = { message: serverMessage, code, status };
    } else if (error.request) {
      normalized = {
        message: getNetworkErrorMessage(),
        code: 'NETWORK_ERROR',
        status: 0,
      };
    } else {
      normalized = {
        message: getStatusMessage(500),
        code: 'UNKNOWN',
        status: 0,
      };
    }

    return Promise.reject(normalized);
  },
);

// Setup 401/refresh interceptor AFTER response interceptor
setupAuthInterceptor();
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.ts
git commit -m "refactor: api reads token from localStorage, adds 401 interceptor"
```

---

## Task 6.5: Enable Global Query Error Handler

**Files:**
- Modify: `src/App.tsx` or `src/main.tsx`

**Purpose:** Call `useGlobalQueryErrorHandler()` hook to enable automatic error toasts for React Query errors.

- [ ] **Step 1: Find where QueryProvider is used**

```bash
grep -r "QueryProvider" src/
```

Expected: Find where `<QueryProvider>` wraps the app

- [ ] **Step 2: Add useGlobalQueryErrorHandler call**

Find the root component or layout where QueryProvider is used, and add the hook call:

```typescript
// Example in App.tsx or root layout
import { useGlobalQueryErrorHandler } from '@/providers/query-provider';

function App() {
  // Enable global error handling for React Query
  useGlobalQueryErrorHandler();

  return (
    <QueryProvider>
      {/* ... rest of app */}
    </QueryProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
# or src/main.tsx depending on where you added it
git commit -m "feat: enable global query error handler"
```

---

## Task 7: Create Logout Mutation Hook (Optional)

**Files:**
- Create: `src/features/auth/hooks/use-logout.ts`

**Purpose:** React Query mutation hook for logout. Clears tokens from localStorage, user from Zustand, redirects to login.

**Note:** This task is optional if logout UI isn't implemented yet. Skip if not needed.

- [ ] **Step 1: Create use-logout.ts hook**

```typescript
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
      // Clear tokens from localStorage
      clearTokens();

      // Clear user from Zustand
      clearAuth();

      // Clear React Query cache
      queryClient.clear();

      // Show success message
      toast.success('Đăng xuất thành công!');

      // Redirect to login
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
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/hooks/use-logout.ts
git commit -m "feat: add logout mutation hook"
```

---

## Task 8: Create Login Mutation Hook

**Files:**
- Create: `src/features/auth/hooks/use-login.ts`

**Purpose:** React Query mutation hook for login. Stores tokens in localStorage, user in Zustand, handles success/error.

- [ ] **Step 1: Create use-login.ts hook**

```typescript
// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../service';
import { setAccessToken, setRefreshToken } from '@/services/tokens';
import { useAuthStore } from '@/store/auth.store';
import { useAppToast } from '@/hooks/use-app-toast';
import { queryKeys } from '@/lib/query-keys';
import type { LoginRequest } from '../data/type';

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
      // Store tokens in localStorage
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      // Store user in Zustand
      setUser(response.user);

      // Show success message
      toast.success('Đăng nhập thành công!');

      // Redirect to dashboard
      navigate('/');
    },

    onError: (error: { message: string }) => {
      // Error toast is handled by React Query global error handler
      // in query-provider.tsx, but we can add specific handling here if needed
      console.error('Login failed:', error.message);
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/hooks/use-login.ts
git commit -m "feat: add login mutation hook"
```

---

## Task 9: Integrate Login Hook in LoginForm

**Files:**
- Modify: `src/features/auth/components/LoginForm.tsx`

**Purpose:** Replace mock login with real API call using useLogin hook.

- [ ] **Step 1: Update LoginForm to use useLogin hook**

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

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values);
  };

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
                disabled={login.isPending}
              >
                {login.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/components/LoginForm.tsx
git commit -m "feat: integrate login hook in LoginForm"
```

---

## Task 10: Update AuthService Mock Refresh

**Files:**
- Modify: `src/features/auth/service/index.ts`

**Purpose:** Update refreshToken mock to use the new tokens.ts utilities instead of direct localStorage access.

- [ ] **Step 1: Update AuthService refreshToken to use tokens.ts**

```typescript
// src/features/auth/service/index.ts
import { BaseApiClient } from '@/services/base/BaseApiClient';
import { getAccessToken } from '@/services/tokens';
import type { LoginRequest, LoginResponseData } from '../data/type';

export class AuthService extends BaseApiClient {
  constructor() {
    super('/auth');
  }

  async login(data: LoginRequest): Promise<LoginResponseData> {
    return this.POST<LoginResponseData>('/login', data);
  }

  async logout(): Promise<void> {
    return this.POST<void>('/logout');
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    // Mock implementation: Reuse existing access token
    // TODO: Replace with real API call when backend implements /auth/refresh
    const currentToken = getAccessToken();
    if (!currentToken) throw new Error('No token');
    return { accessToken: currentToken };
  }
}

export const authService = new AuthService();
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/service/index.ts
git commit -m "refactor: use tokens.ts in AuthService refreshToken"
```

---

## Task 11: Verify Build and Type Check

**Files:**
- Run: Type check, build

**Purpose:** Ensure all changes compile without errors.

- [ ] **Step 1: Run TypeScript type check**

```bash
npx tsc --noEmit
```

Expected: No type errors

**Note:** Project doesn't have `npm run type-check` script. Use `npx tsc --noEmit` directly.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 3: Fix any issues found**

Address any type errors or build failures.

- [ ] **Step 4: Commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve type errors and build issues"
```

---

## Task 12: Manual Testing

**Purpose:** Verify the login flow works end-to-end.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test login flow**

1. Navigate to `/login`
2. Enter valid credentials (use backend test user or mock)
3. Click "Sign In"
4. Verify:
   - Loading state shows
   - On success, redirected to `/`
   - Check localStorage for `access_token` and `refresh_token`
   - Check auth store has `user` data
5. Make an authenticated request (e.g., fetch dashboard data)
6. Verify token is sent in Authorization header

- [ ] **Step 3: Test 401/refresh flow**

1. Manually expire access token or use expired token
2. Make an authenticated request
3. Verify refresh is triggered (check network tab)
4. Verify original request is retried with new token

- [ ] **Step 4: Test logout**

1. Implement logout hook similar to login (if not already done)
2. Verify tokens are cleared from localStorage
3. Verify user is cleared from auth store
4. Verify redirect to `/login`

---

## Success Criteria

All tasks complete when:
- [ ] Folder structure matches spec (`src/features/[feature]/service/`, `src/features/[feature]/data/`)
- [ ] Project-level utilities in `src/lib/`
- [ ] Project-level stores in `src/store/`
- [ ] Login works with real backend API
- [ ] Tokens stored in localStorage (`access_token`, `refresh_token`)
- [ ] User data stored in Zustand auth store
- [ ] Token auto-refreshes on 401 (single-flight)
- [ ] Error toasts show correctly
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

---

## Notes for Agentic Workers

1. **Follow existing patterns** - The codebase uses `src/lib/` for utilities. Follow this convention.

2. **No UI changes** - Only internal logic changes. LoginForm UI should look identical.

3. **Vietnamese error messages** - Use existing messages from `src/lib/error-messages.ts`.

4. **Mock refresh** - The `refreshToken()` method in AuthService is mocked until backend implements `/auth/refresh`.

5. **Import paths** - Use `@/` alias for all imports from `src/`.

6. **TDD not required** - This is infrastructure refactoring. Test manually after implementation.

7. **Frequent commits** - Commit after each task to enable easy rollback.

8. **Existing files** - Many files already exist (api.types.ts, BaseApiClient.ts, auth service, etc.). Only create files marked as "CREATE" and modify files marked as "MODIFY".
