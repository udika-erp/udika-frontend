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
│   ├── tokens.ts                 # Token utilities (get/set/clear)
│   ├── auth.interceptor.ts       # 401/refresh logic
│   ├── api.ts                    # Axios instance (existing, enhanced)
│   │
│   └── features/
│       ├── AuthService.ts        # extends BaseApiClient, baseUrl = '/auth'
│       ├── CustomersService.ts   # extends BaseApiClient, baseUrl = '/customers'
│       └── ...                   # Other feature services
│
├── store/
│   └── auth.store.ts             # Tokens + user data + auth methods
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

## Auth Design

### Token Model

| Token | Storage | Purpose |
|-------|---------|---------|
| `access_token` | localStorage | API requests (Authorization header) |
| `refresh_token` | localStorage | Obtaining new access token (mocked) |

**localStorage keys:**
- `access_token`
- `refresh_token`

### Login Flow

```
User submits form
  → useLogin mutation
  → AuthService.login(email, password)
  → POST /auth/login
  → { accessToken, refreshToken, user }
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
```

### Request Pipeline

```
Request
  → Axios Request Interceptor
    → Add Authorization: Bearer <access_token>
  → Send to backend

Response
  ← 200-299: Return data
  ← 401: Trigger refresh flow
    → Attempt refresh (single-flight)
    → If success: Retry original request
    → If failure: Logout + redirect /login
  ← 4xx/5xx: Normalize error
```

### 401/Refresh Logic

**Single-flight refresh pattern:**
- Prevents multiple simultaneous refresh attempts
- Queues requests during refresh
- Retries all queued requests with new token

**Mock refresh (temporary):**

```typescript
async refreshToken(): Promise<{ accessToken: string }> {
  // MOCK: Reuse existing access token
  // TODO: Replace with real API call when backend implements /auth/refresh
  const currentToken = getToken(ACCESS_TOKEN_KEY);
  if (!currentToken) throw new Error('No token');
  return { accessToken: currentToken };
}
```

### Auth Store Structure

```typescript
interface AuthState {
  // State
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;

  // Actions
  setAuth: (tokens: StoredTokens, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
  setAuthenticating: (loading: boolean) => void;
}

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}
```

### Global Logout

```typescript
function clearAuthAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  useAuthStore.getState().clearAuth();
  queryClient.clear(); // Clear React Query cache
  window.location.href = '/login';
}
```

## Base Service Class

```typescript
// services/base/BaseApiClient.ts
export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected GET<T>(url: string, params?: object): Promise<T>
  protected POST<T>(url: string, data?: object): Promise<T>
  protected PUT<T>(url: string, data?: object): Promise<T>
  protected DELETE<T>(url: string): Promise<T>
}

// Example usage:
class AuthService extends BaseApiClient {
  constructor() {
    super('/auth');
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.POST<LoginResponse>('/login', data);
  }
}
```

## Error Handling

### Error Types

```typescript
enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

interface NormalizedError {
  type: ErrorType;
  message: string;      // Vietnamese
  code: string;
  status: number;
  details?: unknown;
}
```

### Toast Strategy

**Automatic toast:**
- Network errors
- 5xx server errors
- 401 (after refresh fails)

**Manual handling (no toast):**
- 400 validation errors (form inline)
- 404 not found (page messaging)
- 409 conflicts (user notification)

## Environment Configuration

```bash
# .env.dev
VITE_API_BASE_URL=http://localhost:3000/api

# .env.prod
VITE_API_BASE_URL=https://api.udika.vn/api
```

**Branch mapping:**
- `dev` branch → `.env.dev` → `npm run dev`
- `main` branch → `.env.prod` → `vite build --mode prod`

## React Query Integration

**Query Keys Factory:**

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
};
```

**Hook example:**

```typescript
// features/customers/hooks/use-customers.ts
export function useCustomers(params?: CustomerQueryParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(JSON.stringify(params)),
    queryFn: () => CustomersService.getAll(params),
  });
}
```

## Implementation Steps

1. Create BaseApiClient class with GET, POST, PUT, DELETE
2. Create token utilities (get, set, clear from localStorage)
3. Enhance auth store with user data and methods
4. Create AuthService with login, logout, refreshToken (mock)
5. Define API types (ApiResponse, LoginRequest/Response, PaginatedResponse)
6. Create auth interceptor with 401 handling and single-flight refresh
7. Wire interceptor into axios instance
8. Create useLogin mutation hook
9. Update LoginForm to call useLogin (no UI changes)
10. Create CustomersService as example pattern
11. Create query-keys.ts with customer key factories
12. Create customer query/mutation hooks
13. Enhance QueryProvider with error handling and toast logic

## Constraints

- No UI/styling changes
- Use existing Vietnamese error messages
- Follow feature-based folder structure
- Mock refresh until backend implements endpoint
- Support both dev and prod environments

## Success Criteria

- Login works with real backend API
- Token auto-refreshes on 401 (mocked)
- Auto-logout when refresh fails
- Customers page uses real API (when backend implements)
- Error toasts show correctly
- Form validation errors display inline
