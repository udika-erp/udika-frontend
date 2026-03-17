## ADDED Requirements

### Requirement: Global Axios instance with request and response interceptors
The system SHALL export a configured Axios instance from `src/services/api.ts`. The request interceptor SHALL attach an `Authorization: Bearer <token>` header when a token is present in the Zustand auth store. The response interceptor SHALL normalize error responses into `{ message: string; code: string; status: number }`.

#### Scenario: Request interceptor attaches auth header when token exists
- **WHEN** a request is made via the Axios instance and a token is in the store
- **THEN** the request includes `Authorization: Bearer <token>` header

#### Scenario: Request interceptor skips auth header when no token
- **WHEN** a request is made and no token is stored
- **THEN** no `Authorization` header is added

#### Scenario: Response interceptor normalizes API error shape
- **WHEN** the API returns a non-2xx response
- **THEN** the rejected promise value conforms to `{ message: string; code: string; status: number }`

### Requirement: React Query QueryClient has a global onError handler
The `QueryClient` in `src/app/App.tsx` (or `src/providers/query-provider.tsx`) SHALL configure `defaultOptions.queries.onError` and `defaultOptions.mutations.onError` to call `useAppToast().error()` with the normalized error message for unexpected/network errors.

#### Scenario: Unexpected query error triggers error toast
- **WHEN** a React Query query fails with a network error
- **THEN** an error toast is displayed with a Vietnamese-friendly error message

#### Scenario: Mutation error triggers error toast
- **WHEN** a React Query mutation fails
- **THEN** an error toast is displayed via the global handler unless overridden locally

### Requirement: Error messages are user-friendly Vietnamese strings
The system SHALL map normalized API error codes and HTTP status codes to Vietnamese messages. Raw technical error messages SHALL NOT be displayed to users.

#### Scenario: 401 error maps to Vietnamese unauthorized message
- **WHEN** an API call returns HTTP 401
- **THEN** the toast shows "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." (or equivalent)

#### Scenario: Network error maps to Vietnamese connectivity message
- **WHEN** a network request fails with no response
- **THEN** the toast shows "Không thể kết nối. Vui lòng kiểm tra kết nối mạng." (or equivalent)

### Requirement: Form-level API errors are displayed near the form
When a form mutation fails with a field-level API error, the error SHALL be surfaced at the top of the form as a `<Alert variant="destructive">` in addition to (or instead of) a toast. Field-level Zod validation errors SHALL be shown inline via `<FormMessage>`.

#### Scenario: Form submission API error shown as form alert
- **WHEN** a customer create form is submitted and the API returns a business-logic error
- **THEN** an alert is shown at the top of the form with the Vietnamese error message
