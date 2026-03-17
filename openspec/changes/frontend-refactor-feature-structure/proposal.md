## Why

The current Udika ERP Frontend has all UI logic, data shaping, and view code co-located in large page-level files, making the codebase hard to maintain, reuse, and scale as new ERP modules are added. Moving to a feature- and flow-based structure, standardizing shared components, and introducing consistent patterns for error handling, loading, forms, and toasts will reduce duplication and prepare the codebase for real API integration.

## What Changes

- Introduce `src/features/<domain>/` folders for each ERP domain (customers, events, employees, calendar, attendance, reports, dashboard, auth), each containing `components/`, `hooks/`, `forms/`, and `api/` subfolders.
- Page-level components become thin entry points that import from their respective feature folder; all bulk logic moves into feature folders.
- Introduce shared component families in `src/components/`:
  - `table/` — generic `DataTable` + `DataTableToolbar`, `DataTablePagination`, `DataTableRowActions`
  - `typography/` — `Title`, `Subtitle`, `Body`, `Muted` wrappers around Tailwind classes
  - `modal/` — `ConfirmDialog`, `FormDialog` wrappers around shadcn Dialog
  - `form/` — RHF-compatible `TextField`, `SelectField`, `CheckboxField`, `DateField` primitives
- Standardize all buttons on the existing shadcn `Button` primitive (no ad-hoc styled buttons in pages).
- Normalize toast usage: single `sonner` `<Toaster>` in `App.tsx` + `useAppToast` hook for success/error/info variants.
- Add a global Axios instance in `src/services/api.ts` with interceptors for auth headers and error normalization.
- Configure `QueryClient` with a global `onError` handler that maps API errors to Vietnamese-friendly toasts.
- Refactor all non-trivial forms to React Hook Form + Zod (login, customer create/edit, event create/edit, employee create, calendar event creation, attendance filters).
- Add a top-of-page `NProgress`-style loading bar (via `nprogress` or a thin CSS bar) driven by React Router navigation events.

## Capabilities

### New Capabilities

- `feature-folder-structure`: Feature- and flow-oriented directory layout replacing page-level monoliths
- `shared-data-table`: Generic `DataTable` component family powering all entity listing pages
- `shared-typography`: `Title`, `Subtitle`, `Body`, `Muted` typography component wrappers
- `shared-modal`: Reusable `ConfirmDialog` and `FormDialog` wrappers around shadcn Dialog
- `shared-form-controls`: RHF-compatible form control primitives (`TextField`, `SelectField`, etc.)
- `global-toast`: Centralized toast provider and `useAppToast` hook
- `global-error-handling`: Axios interceptors + React Query global error handler + error normalization
- `global-loading-indicator`: Route-transition loading bar wired to React Router
- `rhf-zod-forms`: React Hook Form + Zod integration for all key forms

### Modified Capabilities

- (none — this is a structural refactor; no existing spec-level behavior changes)

## Impact

- **All page files** under `src/app/pages/` will be rewritten as thin entry points (import from feature folders).
- **`src/app/App.tsx`** gains `QueryClientProvider`, updated `<Toaster>` placement, and global loading bar mount.
- **`src/app/routes.tsx`** gains route-change listener for loading bar.
- **New dependencies** to install: `axios`, `@tanstack/react-query`, `zustand`, `zod`, `@hookform/resolvers`, `nprogress` (or equivalent), `react-hook-form` (if not yet present).
- **No visual or UX changes** — all Tailwind classes, design tokens, Vietnamese copy, and responsive breakpoints remain identical.
- **No backend changes** — data remains mocked; only the frontend structure and patterns change.
