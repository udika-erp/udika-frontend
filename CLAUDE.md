## Project: Udika ERP Frontend

Single-page ERP frontend for event companies, built with React + TypeScript + Vite and Vietnamese localization. This file describes how AI agents should reason about the project and which skills/agents to use.

## Tech Stack

- **Repository**: `https://github.com/udika-erp/udika-frontend.git`
- **Default branch**: `dev`

| Layer | Technology |
|-------|-----------|
| Bundler / Dev server | Vite (React + TypeScript, latest stable) |
| Framework | React (latest stable), React Router (SPA) |
| UI | Tailwind CSS v4 + shadcn/ui + Radix primitives |
| Forms | React Hook Form + Zod + `@hookform/resolvers/zod` |
| Data fetching | Axios + TanStack React Query (for remote APIs) |
| State management | Local React state + Zustand for shared/global state |
| Utilities | Lodash for common helper utilities |
| i18n | Vietnamese-first copywriting in UI |
| Tooling | ESLint + Prettier for linting/formatting |
| Deploy | Vercel (recommended) |

## Architecture

### Entry Points & Routing

- `src/main.tsx` → `src/App.tsx` → `RouterProvider` (`src/routes.tsx`)
- `/login` — standalone auth page (no main layout)
- `/` — `MainLayout` wraps all authenticated pages via `<Outlet>`
- Authenticated child routes: dashboard, CRM, customers, employees, events, calendar, attendance, reports (and future ERP modules)

### Directory Structure (frontend-focused)

```
src/
├── assets/            # Static assets (Images, fonts, global CSS/SCSS)
├── components/        # Shared UI components across the app (Button, Table, Modal...)
├── config/            # Environment configuration, constants, theme settings
├── features/          # THE HEART OF THE PROJECT (Feature-based division)
│   ├── auth/          # Authentication/Authorization feature
│   ├── users/         # User management feature
│   └── land-sales/    # Example of a specific business module
│       ├── api/       # API call functions (Axios/Fetch) specific to this module
│       ├── components/# Specific components used only in this module
│       ├── hooks/     # Custom hooks for specific logic (e.g., useLandData)
│       ├── store/     # Local state management (Redux slice or Zustand)
│       ├── types/     # Data type definitions (if using TypeScript)
│       └── index.ts   # Export file for external communication
├── hooks/             # Global hooks shared across the app (useTheme, useDebounce...)
├── layouts/           # Outer layout structures (DashboardLayout, AuthLayout)
├── pages/             # Main pages (Page-level components), used to assemble features
├── routes/            # Routing configuration (React Router / Next.js routing config)
├── services/          # Global API Client configuration (Axios interceptors, token handling)
├── store/             # Global State Management configuration (Root reducer, store setup)
├── types/             # Global types and interfaces used throughout the project
└── utils/             # Helper functions (formatDate, currencyFormatter...)
```

### Data Flow (current → future)

- **Current**:
  - All data is mocked and defined inside page modules as constants.
  - Each page owns its own `useState` for filters, selections, dialogs, etc.
  - There is no real backend wired up yet.
- **Future (recommended)**:
  - Use **Axios** instances (in `services/`) for HTTP requests (with interceptors for auth, error handling).
  - Use **TanStack React Query** for data fetching, caching, and mutations.
  - Use **Zustand** for cross-page UI or domain state that should not live in React Query (filters, selections, wizard progress, etc.).

**Rule of thumb**:
- Keep mock data colocated with the page or feature component until the corresponding API exists.
- When real APIs are added, move network logic into `services/` (Axios) and expose hooks powered by React Query.
- Use Zustand only for state that is not naturally server data (for example, UI preferences, local filters that must be shared, or temporary client-only flows).

## Design System

### Principles

- **Consistency**: Use shadcn/ui primitives as the base; customize via Tailwind and CSS variables rather than re‑inventing components.
- **ERP-first UX**: Optimize for dense information layout, keyboard usage, and fast scanning (tables, filters, bulk actions).
- **Accessibility**: Aim for WCAG 2.1 AA — keyboard nav, screen readers, color contrast.
- **Responsive**: Desktop-first (since it is ERP), but all core flows must still be usable on tablets and smaller screens.
- **Dark mode**: Honor design tokens in `theme.css` with `data-theme` / `dark` variants instead of ad‑hoc color values.

### Component Conventions

- UI primitives live in `src/app/components/ui/` and should stay close to upstream shadcn/ui patterns.
- Layouts live in `src/app/components/layouts/` and own:
  - Sidebar navigation (Vietnamese labels, icons)
  - Top header (breadcrumbs, user menu, quick actions)
- Route pages under `src/app/pages/` should compose:
  - Layout regions (cards, tables, filters)
  - UI primitives (buttons, dropdowns, dialogs)
  - Small feature components colocated in the same folder if only used there.
- If a component is used across multiple pages, promote it to `src/app/components/` rather than duplicating it.

### Styling Rules

- Tailwind utility classes as the primary styling mechanism.
- Use CSS custom properties defined in `theme.css` for colors, spacing tokens, and radii.
- Avoid inline `style` props unless values are dynamic and cannot be expressed via tokens.
- Prefer semantic Tailwind classes (`text-muted-foreground`, `bg-card`) over raw hex/OKLch values in components.

## Development Workflow

### Typical Frontend Feature Flow

For each new ERP screen or enhancement:

1. **Clarify UX** — Identify which layout pattern and components you will reuse (tables, filters, dialogs, etc.).
2. **Design components** — Compose from existing `ui/` primitives and layout building blocks.
3. **Wire local state** — Use `useState` and derived values for UI interactions (sorting, filtering, dialogs).
4. **Mock data** — Add realistic mock objects at the top of the page file.
5. **Polish** — Verify responsive behavior, keyboard focus, and alignment with `theme.css` tokens.

### Git & Branching Workflow

- **Environments & branches**:
  - `dev` (default branch) → development environment.
  - `main` → production environment.
  - CI (GitHub Actions) should run on both `dev` and `main` so builds stay green before deploy.
- **Feature branches**:
  - Create branches from `dev` using a clear prefix, for example:
    - `feat/...` for new features (e.g. `feat/events-calendar-filters`)
    - `fix/...` for bug fixes (e.g. `fix/customer-table-sorting`)
    - `chore/...` for tooling, config, or refactors (e.g. `chore/add-eslint-prettier`)
  - Keep branches small and focused on a single change set.
- **Pull requests**:
  - Normal flow: open a PR from the feature branch into `dev`.
  - When a dev environment is stable and ready for release, open a PR from `dev` into `main` for production.
  - Ensure CI is green before merging.
  - Prefer squash-merge to keep a clean history per feature.
- **Tags / releases** (optional for later):
  - When deploying stable versions, tag commits as `vX.Y.Z` once a release process is defined.

### Skill & Agent Usage

#### When to use skills (invoke via `/skill-name`):

| Task | Skill |
|------|-------|
| Add a new page or major ERP feature | `/new-feature` |
| Add or refine an AI-powered assistant/feature | `/ai-feature` |
| Investigate a frontend bug or visual glitch | `/fix-bug` |
| Generate or improve tests (when a test setup exists) | `/gen-tests` |
| Deploy or update deployment to Vercel | `/deploy-to-vercel` |
| Decide if an AI feature needs RAG vs simple context | `/rag-decision` |
| Review React performance patterns and bundle impact | `/vercel-react-best-practices` |
| Review UI against generic web design guidelines | `/web-design-guidelines` |

#### When to use agents (dispatched automatically or via `@agent-name`):

| Agent | When to use |
|-------|-------------|
| `@ui-designer` | Designing or refining complex ERP screens and design system work |
| `@ux-researcher` | Thinking through user roles, workflows, and journey maps |
| `@ux-reviewer` | Reviewing loading/empty/error states, accessibility, and responsiveness |
| `@implementer` | Focused single-task implementation (frontend feature work) |
| `@spec-reviewer` | Stage 1 review — does a change match the described spec? |
| `@quality-reviewer` | Stage 2 review — code quality, structure, and maintainability |
| `@security-auditor` | When adding auth flows or integrating real APIs later |
| `@rag-builder` | Only when `/rag-decision` says to build a RAG pipeline |

### Process Skills (workflow orchestration)

| Skill | When to use |
|-------|-------------|
| `/brainstorming` | Before any creative work — new pages, navigation changes, behavior changes |
| `/writing-plans` | Before multi-step features — produces a concrete task list |
| `/executing-plans` | Execute a larger plan with checkpoints and verification |
| `/requesting-code-review` | After completing a significant feature — structured review |
| `/verification-before-completion` | Before claiming work is done — run build/dev checks as applicable |
| `/systematic-debugging` | Before proposing any bug fix — reproduce and narrow down root cause |
| `/finishing-a-development-branch` | When a slice of work is complete and needs integration |

## Code Conventions

### TypeScript & React

- Avoid `any` where possible — prefer specific types or `unknown` with narrowing.
- Favor function components and hooks; no class components.
- Prefer `React.FC` only when you need `children` typing; otherwise annotate props directly.
- Derive state instead of duplicating it; avoid deeply nested prop drilling if a simple context can solve it.

### Libraries & Patterns

- **Forms**: Prefer React Hook Form + Zod for all non-trivial forms; co-locate schemas with the feature or page.
- **Data fetching**: Use React Query + Axios for any remote API; avoid calling `fetch` directly from components.
- **State**: Prefer React Query for server state and Zustand for shared client state; avoid custom global singletons.
- **Utilities**: Use Lodash for common helpers (debounce, deep clone, etc.) instead of re‑implementing utility logic.

### Error Handling & Edge States

- Handle loading, empty, and error states explicitly on all data‑driven UI (even when using mock data).
- No stray `console.log` in committed code; prefer descriptive `console.error` for unexpected runtime issues during development only.
- Surface user‑friendly messages in Vietnamese; avoid leaking raw error objects to the UI.

### Naming

- Files: `kebab-case.ts` / `kebab-case.tsx` (components may also follow shadcn conventions).
- Components: `PascalCase`.
- Variables/functions: `camelCase`.
- Types/interfaces: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE` when shared or configuration‑like.

### Imports

- Use the `@` alias for `src/` imports where configured (e.g. `@/app/components/ui/button`).
- Group imports in this order:
  1. External libraries
  2. Internal modules via `@/...`
  3. Relative imports (`./`, `../`)
  4. Type‑only imports

## Commands Reference

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint (code quality)
npm run format     # Prettier (code formatting)
```

Keep these commands in sync with `package.json` scripts as tooling evolves (ESLint, Prettier, testing, etc.).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, App Router, TypeScript strict |
| UI | Tailwind CSS v4 + shadcn/ui + Radix primitives |
| API | tRPC v11 + Zod validation |
| Database | PostgreSQL via Prisma 7 + Supabase (pgvector enabled) |
| Auth | NextAuth v5 (beta) + RBAC (roles: ADMIN, MEMBER, VIEWER) |
| AI | Anthropic claude-sonnet-4-6 via Vercel AI SDK (`ai` package) + streaming |
| Jobs | Inngest |
| Testing | Vitest 4 (unit) + Playwright (E2E) |
| Deploy | Vercel |

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages + layouts
│   ├── (auth)/             # Auth-gated routes (login, register)
│   ├── (dashboard)/        # Authenticated dashboard pages
│   ├── api/                # API routes (streaming AI, webhooks only)
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, dialog, etc.)
│   ├── forms/              # Form components (react-hook-form + zod)
│   └── [feature]/          # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # Shared utilities (cn, formatters)
│   └── validations/        # Zod schemas — shared FE + BE source of truth
├── server/
│   ├── routers/            # tRPC routers
│   ├── services/           # Business logic (ai.service, rag.service, etc.)
│   ├── trpc.ts             # tRPC init + context
│   └── db.ts               # Prisma client singleton
└── types/                  # Shared TypeScript types
```

### Data Flow

```
Client Component → tRPC hook → tRPC Router → Service → Prisma → PostgreSQL
                                    ↓
                              Zod validation (shared schemas from lib/validations/)
```

- **Standard data operations**: Always use tRPC, never raw API routes
- **Streaming AI responses**: Use Next.js API routes (`src/app/api/`) with Vercel AI SDK
- **Background jobs**: Inngest functions triggered from tRPC routers

### Boundary Rules

- `src/server/` is NEVER imported by client components
- Client ↔ Server communication is exclusively through tRPC or API routes
- Zod schemas in `src/lib/validations/` are the single source of truth for both FE and BE

## Design System

### Principles

- **Consistency**: Use shadcn/ui components as the base; customize via Tailwind only
- **Accessibility**: WCAG 2.1 AA minimum — keyboard nav, screen readers, color contrast
- **Responsive**: Mobile-first, breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Dark mode**: Support via Tailwind `dark:` variant and CSS variables

### Component Conventions

- UI primitives live in `src/components/ui/` — generated by shadcn CLI, customized minimally
- Feature components compose UI primitives — never duplicate primitive behavior
- Forms use `react-hook-form` + `@hookform/resolvers/zod` with schemas from `src/lib/validations/`
- Icons from `lucide-react` only — no mixing icon libraries
- Use `class-variance-authority` (cva) for component variants
- Use `cn()` from `src/lib/utils.ts` for conditional class merging

### Styling Rules

- Tailwind utility classes only — no custom CSS except `globals.css` for CSS variables
- No inline `style` props unless dynamically computed (e.g., user-set colors)
- Color tokens via CSS variables, not hardcoded hex/rgb values

## Development Workflow

### Feature Addition Order

Follow this sequence for every new feature:

1. **Schema** — Prisma schema change → `pnpm db:migrate`
2. **Validation** — Zod schema in `src/lib/validations/`
3. **Backend** — tRPC router (TDD-first via `/tdd-feature`)
4. **Hook** — React hook in `src/hooks/`
5. **Form** — Form component in `src/components/forms/`
6. **Page** — Page in `src/app/(dashboard)/`

### Skill & Agent Usage

#### When to use skills (invoke via `/skill-name`):

| Task | Skill |
|------|-------|
| New full-stack feature | `/new-feature` |
| Backend feature (TDD) | `/tdd-feature` |
| DB schema change | `/db-migrate` |
| AI-powered feature | `/ai-feature` |
| API route (streaming/webhooks) | `/add-api-route` |
| Bug investigation | `/fix-bug` |
| Generate missing tests | `/gen-tests` |
| Deploy to Vercel | `/deploy-to-vercel` |
| RAG vs context-stuffing decision | `/rag-decision` |
| Review React/Next.js perf | `/vercel-react-best-practices` |
| Review UI against guidelines | `/web-design-guidelines` |
| Review Postgres queries | `/supabase-postgres-best-practices` |

#### When to use agents (dispatched automatically or via `@agent-name`):

| Agent | When to use |
|-------|-------------|
| `@ui-designer` | Designing visual interfaces, creating/refining components, design system work |
| `@ux-researcher` | User research, persona development, usability analysis, competitive research |
| `@ux-reviewer` | Review loading/empty/error states, accessibility, mobile responsiveness |
| `@spec-reviewer` | Stage 1 code review — does implementation match the spec? |
| `@quality-reviewer` | Stage 2 code review — code quality, security, performance |
| `@security-auditor` | Security audit, vulnerability analysis, compliance checks |
| `@db-analyst` | Find N+1 queries, missing indexes, unbounded queries |
| `@postgres-pro` | Database design, schema modeling, Postgres best practices, query optimization |
| `@rag-builder` | Build RAG pipeline when `/rag-decision` says YES |
| `@implementer` | Focused single-task implementation (TDD-first) |

### Process Skills (workflow orchestration):

| Skill | When to use |
|-------|-------------|
| `/brainstorming` | Before any creative work — features, components, behavior changes |
| `/writing-plans` | Before multi-step implementation — produces task list with skill mapping |
| `/executing-plans` | Execute a written plan with review checkpoints |
| `/requesting-code-review` | After completing a feature — runs `@spec-reviewer` then `@quality-reviewer` |
| `/verification-before-completion` | Before claiming work is done — run tests, verify output |
| `/systematic-debugging` | Before proposing any bug fix — reproduce first, then fix |
| `/finishing-a-development-branch` | When implementation is complete — merge, PR, or cleanup |

## TDD Rules

The `tdd-guard` hook enforces these — do not bypass.

1. NEVER write implementation before a failing test exists
2. Cycle: **write test → RED → write impl → GREEN → refactor**
3. Use `/tdd-feature` for every new backend feature
4. Target: >80% server-side coverage
5. Run `pnpm test` to validate, `pnpm test:coverage` for coverage report

## Code Conventions

### TypeScript

- No `any` types — use `unknown` and narrow
- Strict mode enabled — no implicit any, strict null checks
- Prefer `interface` for object shapes, `type` for unions/intersections

### Error Handling

- Error messages must be user-friendly — no stack traces to client
- No `console.log` in production paths — use `console.error` in catch blocks
- tRPC errors use appropriate codes: `BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`

### Naming

- Files: `kebab-case.ts` (components: `PascalCase.tsx` or `kebab-case.tsx` matching shadcn)
- Variables/functions: `camelCase`
- Types/interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Zod schemas: `entityNameSchema` (e.g., `createUserSchema`)

### Imports

- Use `@/` path alias for `src/` imports
- Group: external deps → internal modules → relative imports → types

## Commands Reference

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm type-check       # TypeScript check (no emit)
pnpm test             # Run unit tests
pnpm test:watch       # Unit tests in watch mode
pnpm test:coverage    # Unit tests with coverage
pnpm test:e2e         # Playwright E2E tests
```

## RAG Decision Checklist

When adding AI features that answer questions from data, run this 30-second check:

1. Does the app search user-uploaded documents or files?
2. Is the core feature a wiki or knowledge base?
3. Does AI answer from a large private unstructured corpus?
4. Is there an onboarding/support/HR chatbot?
5. Could all relevant data fit in a DB query + context window?

**Rule**: 1+ YES on Q1–Q4 → use `/rag-decision` then `@rag-builder`. All NO → context stuffing.
