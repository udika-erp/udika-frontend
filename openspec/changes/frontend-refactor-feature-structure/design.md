## Context

Udika ERP Frontend is a React 18 + Vite SPA for event companies. All ~5,000 lines of UI code live in 9 page-level files that mix routing, data shaping, form logic, and view code. No backend is wired yet — data is mocked. The app uses shadcn/ui primitives, Tailwind v4, React Router v7, and Vietnamese copy throughout.

The refactor must preserve pixel-level visual fidelity and all interaction patterns while reorganizing the internal structure, standardizing shared primitives, and introducing scalable patterns for forms, error handling, loading states, and toasts.

## Goals / Non-Goals

**Goals:**
- Split every page-level monolith into a thin page entry point + feature folder(s)
- Create reusable shared component families (DataTable, Typography, Modal, Form controls)
- Establish a single global toast provider and `useAppToast` API
- Add a global Axios instance with interceptors + React Query `QueryClient` with global error handler
- Integrate React Hook Form + Zod for all non-trivial forms
- Add a route-transition loading bar
- Keep the UI, UX, copy, and responsive behavior 100% unchanged

**Non-Goals:**
- No real backend integration (data stays mocked)
- No auth system changes beyond forwarding the token header slot in the Axios interceptor
- No new pages or ERP modules
- No visual redesign, color changes, or typography changes
- No server-side rendering or Next.js migration

## Decisions

### D1: Feature folder location — `src/features/<domain>/` (not `src/app/features/`)

**Decision:** Place feature folders at `src/features/<domain>/` alongside (not inside) `src/app/`.

**Rationale:** `src/app/` is the router+layout layer. Feature code is domain logic, not app shell. Keeping them separate makes the boundary explicit and matches the CLAUDE.md-prescribed structure. Path alias `@/features/customers/...` is clean and consistent.

**Alternative considered:** Nesting inside `src/app/` — rejected because it blurs the app-shell/domain boundary and makes future extraction harder.

---

### D2: Shared components at `src/components/<family>/` (not inside `src/app/components/`)

**Decision:** New shared component families (`table/`, `typography/`, `modal/`, `form/`) live at `src/components/<family>/`. Existing shadcn primitives stay at `src/app/components/ui/`.

**Rationale:** shadcn primitives are low-level (Button, Input, Dialog). The new families are mid-level composition layers. Separating them avoids polluting the shadcn folder and makes it clear which layer something lives in.

**Alternative considered:** Adding new families inside `src/app/components/ui/` — rejected because it mixes generated shadcn code with hand-written composition layers.

---

### D3: DataTable uses a headless render-prop pattern, not a full TanStack Table integration

**Decision:** `DataTable` accepts `columns: ColumnDef[]` and `data: T[]` props and renders a `<table>` with sorting + pagination. It wraps the existing shadcn `Table` primitive. No TanStack Table v8 for now.

**Rationale:** TanStack Table v8 is a significant dependency for features that are currently mocked. The simple column-definition pattern covers all current needs (sorting, pagination, row actions, empty/loading states) without adding complexity. When real APIs arrive, upgrading to TanStack Table is straightforward.

**Alternative considered:** Full TanStack Table integration — deferred; out of scope for a structural refactor.

---

### D4: Forms use React Hook Form + Zod via shadcn Form primitives

**Decision:** All non-trivial forms use `useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })`. Form fields use shadcn `<FormField>` / `<FormItem>` / `<FormLabel>` / `<FormMessage>`. Zod schemas co-located in the feature folder at `features/<domain>/forms/<form-name>.schema.ts`.

**Rationale:** shadcn Form is already in `src/app/components/ui/form.tsx`. React Hook Form + Zod is the stack specified in CLAUDE.md. Co-locating schemas with features avoids cross-feature coupling.

**Alternative considered:** Yup — rejected; Zod is already the specified choice and provides better TypeScript inference.

---

### D5: Global Axios instance in `src/services/api.ts`

**Decision:** A single Axios instance is created in `src/services/api.ts`. Interceptors: (1) request interceptor reads a Zustand auth token (slot, currently empty); (2) response interceptor normalizes errors into `{ message: string; code: string; status: number }`.

**Rationale:** Centralizing the Axios instance prevents per-feature instances from diverging on auth or error handling. The interceptor pattern is the CLAUDE.md-recommended approach.

---

### D6: React Query `QueryClient` with global `onError` handler

**Decision:** `QueryClient` is instantiated in `src/app/App.tsx` (or a new `src/providers/query-provider.tsx`) with `defaultOptions.queries.onError` and `defaultOptions.mutations.onError` calling `useAppToast.error()` for network/unexpected errors.

**Rationale:** Prevents duplicate error-toast logic in every query/mutation. Per-component overrides remain possible by providing a local `onError`.

---

### D7: Toast via `sonner` + `useAppToast` hook

**Decision:** `sonner`'s `<Toaster>` (already in `App.tsx`) is the single provider. A thin `useAppToast` hook wraps `sonner`'s `toast.success()`, `toast.error()`, and `toast.info()` with standardized Vietnamese message fallbacks.

**Rationale:** `sonner` is already installed and mounted. Wrapping it hides the implementation and enforces consistent variant usage without adding a second toast library.

---

### D8: Route-transition loading bar via `nprogress`

**Decision:** `nprogress` (lightweight, ~3 KB) is added. A `useNavigationProgress` hook subscribes to React Router's `useNavigation()` state, calling `NProgress.start()` / `NProgress.done()`. The bar is styled to use the existing `--primary` CSS token.

**Alternative considered:** Custom CSS bar — rejected in favor of the battle-tested `nprogress` to avoid reimplementing the same logic.

---

### D9: Zustand store for auth token (minimal)

**Decision:** A minimal `src/store/auth.store.ts` Zustand store holds `{ token: string | null; setToken; clearToken }`. The Axios interceptor reads from it. No other global state is introduced in this refactor (page-level `useState` is sufficient for current mock data).

**Rationale:** Provides the token slot the Axios interceptor needs without over-engineering global state before APIs are wired.

## Risks / Trade-offs

- **Risk:** Large surface area — refactoring 9 pages and introducing ~20 new files simultaneously increases merge-conflict risk.
  → **Mitigation:** Work feature-by-feature (one domain per PR). Shared infrastructure (toast, Axios, QueryClient, DataTable) ships first as its own task group.

- **Risk:** Breaking visual layout while moving JSX between files.
  → **Mitigation:** Run `npm run build` and visually spot-check each page after each feature migration. No CSS changes allowed in the same commits.

- **Risk:** React Hook Form integration may break existing uncontrolled input patterns.
  → **Mitigation:** Only refactor forms explicitly listed in tasks. Keep unmodified forms as-is until a future API-integration phase.

- **Risk:** `nprogress` global CSS may clash with Tailwind resets.
  → **Mitigation:** Import `nprogress/nprogress.css` and override `#nprogress .bar` color with `--primary` token via a single CSS rule in `index.css`.

## Migration Plan

1. Install new dependencies (`axios`, `@tanstack/react-query`, `zustand`, `nprogress`).
2. Introduce infrastructure layer (Axios instance, QueryClient provider, `useAppToast`, loading bar) in `App.tsx` — no page changes yet.
3. Create shared component families (`DataTable`, typography, modal wrappers, form controls) with no page consumers yet.
4. Migrate features one domain at a time (customers → events → employees → calendar → attendance → reports → dashboard → auth/login).
5. For each domain: create feature folder, extract components/hooks/forms, thin out the page file, verify build passes and UI is unchanged.
6. Final cleanup: remove dead code from page files, run `npm run lint` + `npm run format`.

**Rollback:** Each step is a separate commit on a feature branch. Any step can be reverted independently. No database or API changes means zero backend rollback risk.

## Open Questions

- Should `DataTable` support virtualized rows for large datasets (e.g., attendance grid with 100+ employees)? → Deferred to a future performance pass.
- Should Zustand persist auth token to `localStorage`? → Out of scope; handled when real auth is wired.
- Are there plans to add unit tests in this refactor? → Out of scope per the request; structure should make future testing straightforward.
