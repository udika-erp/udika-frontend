# API + Auth Strategy Design

**Date**: 2026-03-18
**Project**: Udika ERP Frontend
**Status**: Approved

## Overview

Design a scalable API calling and authentication strategy for the React + TypeScript + Vite ERP frontend. The solution uses class-based services with inheritance, TanStack React Query for data fetching, Zustand for auth state, and localStorage for token persistence.

## Goals

- Use Axios for HTTP with class-based service layer
- Use TanStack React Query for data fetching/mutations
- Store access/refresh tokens in localStorage
- Auto-logout on token expiry with refresh token flow
- Mock refresh logic safely (backend endpoint not yet implemented)
- Keep UI/UX unchanged; only internal logic refactored

## Architecture

### Folder Structure

```
src/
├── services/
│   ├── base/
│   │   └── BaseApiClient.ts      # Base class with GET, POST, PUT, DELETE
│   ├── api.types.ts              # Shared API types
│   ├── tokens.ts                 # Token utilities (get/set/clear from localStorage)
│   ├── auth.interceptor.ts       # 401/refresh logic
│   ├── api.ts                    # Axios instance (existing, enhanced)
│   │
│   └── features/
│       ├── AuthService.ts        # extends BaseApiClient, baseUrl = '/auth'
│       ├── CustomersService.ts   # extends BaseApiClient, baseUrl = '/customers'
│       └── ...                   # Other feature services
│
├── store/
│   └── auth.store.ts             # User data + auth methods (tokens in localStorage)
│
├── lib/
│   ├── error-messages.ts         # Existing (keep)
│   ├── error-types.ts            # New: ErrorType enum, normalizeError
│   └── query-keys.ts             # React Query key factories
│
├── providers/
│   └── query-provider.tsx        # React Query provider (enhanced)
│
└── features/
    ├── auth/
    │   ├── hooks/
    │   │   └── use-login.ts      # Login mutation hook
    │   └── components/           # Existing (no UI changes)
    │
    └── customers/
        └── hooks/
            ├── use-customers.ts              # List query
            ├── use-customer.ts               # Detail query
            └── use-customer-mutations.ts     # CRUD mutations
```

## Migration Strategy

### Current State → Target State

**Current (`store/auth.store.ts`):**
```typescript
interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}
```

**Target:**
- Tokens stored in `localStorage` (source of truth)
- User data stored in `Zustand` auth store
- `useAuthStore` provides convenience access to user state

**Migration steps:**
1. Create new `tokens.ts` for localStorage operations
2. Enhance `auth.store.ts` with user data (remove `token` property)
3. Update axios interceptor to read from `localStorage` instead of Zustand
4. This is a breaking change but isolated to auth layer

### Token Storage Strategy

| Data | Storage | Rationale |
|------|---------|-----------|
| `access_token` | localStorage | Survives page refresh, needed for axios interceptor (outside React) |
| `refresh_token` | localStorage | Survives page refresh, needed for refresh flow |
| `user` data | Zustand | Reactive, easy to access in components, cleared on logout |

**Why localStorage for tokens?**
- Axios interceptor runs outside React context
- Simpler than syncing Zustand → localStorage
- Trade-off: XSS vulnerability (acceptable for internal ERP; consider HttpOnly cookies for public-facing apps)

## Auth Design

### Token Model

```typescript
// localStorage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
```

### Login Flow

```
User submits form
  → useLogin mutation
  → AuthService.login(email, password)
  → POST /auth/login
  → { success: true, data: { accessToken, refreshToken, user }, message }
  → Store tokens in localStorage
  → Store user in Zustand auth store
  → Redirect to dashboard
```

**API Interfaces:**

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: 'ADMIN' | 'USER';
      name: string;
    };
  };
  message: string;
}

interface LogoutResponse {
  success: true;
  message: string;
}
```

### Request Pipeline

```
Request
  → Axios Request Interceptor
    → Read access_token from localStorage
    → Add Authorization: Bearer <access_token>
  → Send to backend

Response
  ← 200-299: Return unwrapped data (response.data.data)
  ← 401: Trigger refresh flow
    → Attempt refresh (single-flight)
    → If success: Retry original request
    → If failure: Logout + redirect /login
  ← 4xx/5xx: Normalize error, throw NormalizedError
```

### Token Expiry Strategy

**401-driven only** (no JWT decoding):
- Send requests normally
- When backend returns 401, trigger refresh
- No proactive refresh based on token expiry time
- Simpler, works with any token format

### 401/Refresh Logic (Single-Flight)

**Implementation:**

```typescript
// services/auth.interceptor.ts
let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
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
        const { accessToken } = await new AuthService().refreshToken();
        // Update localStorage
        setAccessToken(accessToken);
        // Retry queued requests with new token
        failedQueue.forEach((resolve) => resolve(accessToken));
        failedQueue = [];
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        failedQueue.forEach((reject) => reject(refreshError));
        failedQueue = [];
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

### Mock Refresh (Temporary)

```typescript
// AuthService.ts
async refreshToken(): Promise<{ accessToken: string }> {
  // MOCK: Reuse existing access token
  // TODO: Replace with real API call when backend implements /auth/refresh
  const currentToken = getAccessToken();
  if (!currentToken) throw new Error('No token');
  return { accessToken: currentToken };
}
```

### Auth Store Structure (Enhanced)

```typescript
// store/auth.store.ts
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

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

// Note: tokens are NOT stored here anymore
// Use tokens.ts utilities for localStorage operations
```

### Global Logout

```typescript
// services/tokens.ts
export function clearAuthAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  useAuthStore.getState().clearAuth();
  queryClient.clear(); // Clear React Query cache
  window.location.href = '/login';
}

// Optionally call logout endpoint if backend implements it
// AuthService.logout() before clearing local state
```

## Base Service Class

```typescript
// services/base/BaseApiClient.ts
import { api } from '../api';

export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Unwrap backend response: { success, data, message } → returns data
  protected async GET<T>(url: string, params?: object): Promise<T> {
    const response = await api.get(this.baseUrl + url, { params });
    return response.data.data; // Unwrap
  }

  protected async POST<T>(url: string, data?: object): Promise<T> {
    const response = await api.post(this.baseUrl + url, data);
    return response.data.data; // Unwrap
  }

  protected async PUT<T>(url: string, data?: object): Promise<T> {
    const response = await api.put(this.baseUrl + url, data);
    return response.data.data; // Unwrap
  }

  protected async DELETE<T>(url: string): Promise<T> {
    const response = await api.delete(this.baseUrl + url);
    return response.data.data; // Unwrap
  }
}

// Example usage:
class AuthService extends BaseApiClient {
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
    // Mock implementation
    const currentToken = getAccessToken();
    if (!currentToken) throw new Error('No token');
    return { accessToken: currentToken };
  }
}

// Type returned after unwrapping
interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

## Error Handling

### Error Types

```typescript
// lib/error-types.ts
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface NormalizedError {
  type: ErrorType;
  message: string;      // Vietnamese
  code: string;
  status: number;
  details?: unknown;
}
```

### Toast Strategy

**Automatic toast (global handler):**
- Network errors
- 5xx server errors
- 401 (after refresh fails)

**Manual handling (suppress toast, handle in UI):**
- 400 validation errors (form inline)
- 404 not found (page messaging)
- 409 conflicts (user notification)

```typescript
// Hook-level error handling
const loginMutation = useMutation({
  mutationFn: AuthService.login,
  onError: (error: NormalizedError) => {
    if (error.type === ErrorType.VALIDATION) {
      // Suppress global toast, show inline
      form.setError('email', { message: error.message });
    }
    // Other errors handled by global toast
  },
});
```

## API Types

### Shared Types

```typescript
// services/api.types.ts
export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// For customer queries
export interface CustomerQueryParams extends PaginationParams {
  search?: string;
  status?: string;
}
```

## Environment Configuration

```bash
# .env.dev
VITE_API_BASE_URL=http://localhost:3000/api

# .env.prod
VITE_API_BASE_URL=https://api.udika.vn/api
```

**Branch mapping:**
- `dev` branch → `.env.dev` → `npm run dev` (uses `vite --mode dev`)
- `main` branch → `.env.prod` → `vite build --mode prod`

Vite automatically loads `.env.{mode}` files based on the `--mode` flag.

## React Query Integration

### Query Keys Factory

```typescript
// lib/query-keys.ts
export const queryKeys = {
  auth: ['auth'] as const,
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.customers.lists(), { filters }] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },
  events: {
    all: ['events'] as const,
    // ...
  },
};
```

### Hook Examples

```typescript
// features/customers/hooks/use-customers.ts
export function useCustomers(params?: CustomerQueryParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(JSON.stringify(params || {})),
    queryFn: () => CustomersService.getAll(params),
  });
}

// features/customers/hooks/use-customer.ts
export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => CustomersService.getById(id),
    enabled: !!id,
  });
}

// features/customers/hooks/use-customer-mutations.ts
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) => CustomersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      toast.success('Khách hàng đã được tạo thành công');
    },
  });
}
```

## Implementation Steps

1. Create `services/base/BaseApiClient.ts` with GET, POST, PUT, DELETE (with response unwrapping)
2. Create `services/tokens.ts` for localStorage operations (getAccessToken, setTokens, clearTokens)
3. Enhance `store/auth.store.ts` with user data (remove token property, add user, isAuthenticated)
4. Create `services/AuthService.ts` extending BaseApiClient (login, logout, refreshToken mock)
5. Create `services/api.types.ts` (ApiResponse, PaginatedResponse, CustomerQueryParams)
6. Create `services/auth.interceptor.ts` with 401 handling and single-flight refresh
7. Update `services/api.ts` axios interceptor to read from localStorage instead of Zustand
8. Wire auth.interceptor into axios response interceptor
9. Create `features/auth/hooks/use-login.ts` mutation hook
10. Update `features/auth/components/LoginForm.tsx` to call useLogin (no UI changes)
11. Create `services/CustomersService.ts` as example pattern (getAll, getById, create, update, delete)
12. Create `lib/query-keys.ts` with customer key factories
13. Create `features/customers/hooks/` (use-customers, use-customer, use-customer-mutations)
14. Enhance `providers/query-provider.tsx` with error handling and toast logic

## Constraints

- No UI/styling changes
- Use existing Vietnamese error messages from `lib/error-messages.ts`
- Follow feature-based folder structure
- Mock refresh until backend implements endpoint
- Support both dev and prod environments

## Success Criteria

- Login works with real backend API (`POST /auth/login`)
- Tokens stored in localStorage, user data in Zustand
- Token auto-refreshes on 401 (mocked, easy to swap)
- Auto-logout when refresh fails
- Customers page uses real API (when backend implements)
- Error toasts show correctly
- Form validation errors display inline (no toast)
