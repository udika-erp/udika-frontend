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
│   └── api.ts                    # Axios instance (existing, enhanced)
│
├── data/                         # Project-level constants, enums
│   ├── error-messages.ts         # Existing (keep)
│   ├── error-types.ts            # New: ErrorType enum, normalizeError
│   └── query-keys.ts             # React Query key factories
│
├── store/                        # Project-level stores
│   └── auth.store.ts             # User data (tokens in localStorage)
│
├── providers/
│   └── query-provider.tsx        # React Query provider (enhanced)
│
└── features/
    ├── auth/
    │   ├── service/
    │   │   └── index.ts          # AuthService (extends BaseApiClient)
    │   ├── data/
    │   │   ├── type.ts           # Auth specific types
    │   │   └── const.ts          # Auth constants
    │   ├── store/                # Feature-specific store (if needed)
    │   ├── hooks/
    │   │   └── use-login.ts      # Login mutation hook
    │   └── components/           # Existing (no UI changes)
    │
    └── [feature]/
        ├── service/
        │   └── index.ts          # Feature service (extends BaseApiClient)
        ├── data/
        │   ├── type.ts           # Feature specific types
        │   └── const.ts          # Feature constants
        ├── store/                # Feature-specific store (if needed)
        └── hooks/                # React Query hooks
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
1. Create new `services/tokens.ts` for localStorage operations
2. Enhance `src/store/auth.store.ts` with user data (remove `token` property)
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
// src/features/auth/data/const.ts
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;
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
// src/features/auth/data/type.ts
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface LoginResponse {
  success: true;
  data: LoginResponseData;
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
// src/services/auth.interceptor.ts
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
        const { accessToken } = await authService.refreshToken();
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
// src/features/auth/service/index.ts
async refreshToken(): Promise<{ accessToken: string }> {
  // MOCK: Reuse existing access token
  const currentToken = getAccessToken();
  if (!currentToken) throw new Error('No token');
  return { accessToken: currentToken };
}
```

### Auth Store Structure (Enhanced)

```typescript
// src/store/auth.store.ts
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
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
```

### Global Logout

```typescript
// src/services/tokens.ts
export function clearAuthAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  useAuthStore.getState().clearAuth();
  queryClient.clear(); // Clear React Query cache
  window.location.href = '/login';
}
```

## Base Service Class

```typescript
// src/services/base/BaseApiClient.ts
import { api } from '../api';

export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async GET<T>(url: string, params?: object): Promise<T> {
    const response = await api.get(this.baseUrl + url, { params });
    return response.data.data;
  }

  protected async POST<T>(url: string, data?: object): Promise<T> {
    const response = await api.post(this.baseUrl + url, data);
    return response.data.data;
  }

  protected async PUT<T>(url: string, data?: object): Promise<T> {
    const response = await api.put(this.baseUrl + url, data);
    return response.data.data;
  }

  protected async DELETE<T>(url: string): Promise<T> {
    const response = await api.delete(this.baseUrl + url);
    return response.data.data;
  }
}

// Example usage:
// src/features/auth/service/index.ts
class AuthService extends BaseApiClient {
  constructor() {
    super('/auth');
  }

  async login(data: LoginRequest): Promise<LoginResponseData> {
    return this.POST<LoginResponseData>('/login', data);
  }
  // ...
}
```

## Error Handling

### Error Types

```typescript
// src/data/error-types.ts
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

## API Types

### Shared Types

```typescript
// src/services/api.types.ts
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
```

## React Query Integration

### Query Keys Factory

```typescript
// src/data/query-keys.ts
export const queryKeys = {
  auth: ['auth'] as const,
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    // ...
  },
};
```

## Implementation Steps

1. Create `src/services/api.types.ts` (ApiResponse, PaginatedResponse)
2. Create `src/services/base/BaseApiClient.ts` (GET, POST, PUT, DELETE)
3. For each feature (e.g., `auth`):
   - Create `src/features/auth/data/type.ts` (Specific types)
   - Create `src/features/auth/data/const.ts` (Specific constants)
   - Create `src/features/auth/service/index.ts` (Extends BaseApiClient)
4. Create `src/services/tokens.ts` for localStorage operations
5. Enhance `src/store/auth.store.ts` with user data
6. Create `src/services/auth.interceptor.ts` with 401 handling
7. Update `src/services/api.ts` to use localStorage and interceptor
8. Create feature hooks in `src/features/[feature]/hooks/`

## Constraints

- No UI/styling changes
- Use existing Vietnamese error messages from `src/data/error-messages.ts`
- **Follow feature-based folder structure (service/ and data/ in each feature)**
- Mock refresh until backend implements endpoint

## Success Criteria

- Folder structure matches `src/features/[feature]/service/` and `src/features/[feature]/data/`
- Project-level enums/constants in `src/data/`
- Project-level stores in `src/store/`
- Feature-level stores in `src/features/[feature]/store/` (if needed)
- Login works with real backend API
- Tokens stored in localStorage, user data in Zustand
- Token auto-refreshes on 401
- Error toasts show correctly
