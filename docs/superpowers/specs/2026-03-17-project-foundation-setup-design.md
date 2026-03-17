# Project Foundation Setup — Design Spec

**Date:** 2026-03-17
**Status:** Approved
**Approach:** Atomic all-at-once (Option A)

---

## Overview

A single coordinated pass that: flattens `src/app/` into `src/`, fixes all affected imports, adds ESLint + Prettier, initializes git with remote, sets up Playwright E2E, and tightens TS/Vite config. React stays on 18.3.1 (all current deps are compatible). The tree is never left in a broken state between steps.

---

## 1. Directory Restructure

### Moves

| From | To |
|------|----|
| `src/app/App.tsx` | `src/App.tsx` |
| `src/app/routes.tsx` | `src/routes.tsx` |
| `src/app/pages/` | `src/pages/` |
| `src/app/components/layouts/` | `src/layouts/` |
| `src/app/components/ui/` | `src/components/ui/` |
| `src/app/components/figma/` | `src/components/figma/` |
| `src/app/components/ui/utils.ts` | `src/lib/utils.ts` (cn() utility) |

### Unchanged (already at correct level)

`src/features/`, `src/components/form|modal|table|typography/`, `src/hooks/`, `src/providers/`, `src/services/`, `src/store/`, `src/styles/`

`src/lib/` stays in place and gains `utils.ts` (moved from `src/app/components/ui/utils.ts`). It currently contains only `error-messages.ts`; `utils.ts` is a new addition here.

> **Note:** `react` and `react-dom` remain in `peerDependencies` (a Figma Make origin quirk). No change to the `package.json` dependency sections is required — packages are already resolved in `node_modules`.

### Import Updates Required

| Pattern | Replace with | Affected files |
|---------|-------------|----------------|
| `./app/App.tsx` | `./App.tsx` | `src/main.tsx` |
| `@/app/components/ui/*` | `@/components/ui/*` | ~100 occurrences across 29 files in features, pages, components |
| `@/app/components/ui/utils` | `@/lib/utils` | ~4 files (external cn() imports: TextField, SelectField, DateField, typography/index) |
| `./utils` (relative, inside ui/ files) | `@/lib/utils` | ~43 files inside `src/components/ui/` (shadcn internal imports) |
| `./components/ui/sonner` (in App.tsx) | `@/components/ui/sonner` | `src/App.tsx` |
| `./components/layouts/MainLayout` (in routes.tsx) | `@/layouts/MainLayout` | `src/routes.tsx` |
| `./pages/*` (in routes.tsx) | `@/pages/*` | `src/routes.tsx` |
| `../ui/*` (relative, inside layouts/) | `@/components/ui/*` | `src/layouts/MainLayout.tsx` |

---

## 2. ESLint + Prettier

### New devDependencies

```
eslint
@eslint/js
typescript-eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
prettier
eslint-config-prettier
```

### Config Files

**`eslint.config.js`** (ESLint v9 flat config):
- `eslint:recommended` + `typescript-eslint/recommended`
- `eslint-plugin-react-hooks` (React Hooks rules)
- `eslint-plugin-react-refresh` (React Refresh rules)
- Applied to `**/*.{ts,tsx}` only
- Ignores: `dist/`, `node_modules/`
- `eslint-config-prettier` last to disable conflicting rules

**`.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**`.prettierignore`:** `dist/`, `node_modules/`

### package.json Scripts Added

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

---

## 3. Git Init + Flow

### Setup Steps

1. `git init`
2. `git checkout -b dev` (default branch)
3. `git remote add origin https://github.com/udika-erp/udika-frontend.git`
4. Stage all non-ignored files
5. Initial commit: `chore: initial project setup with restructured src layout`
6. `git push -u origin dev`

### `.gitignore`

```
node_modules/
dist/
.env
.env.*
.DS_Store
*.local
```

### Environment Files (not committed)

**`.env.dev`:**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

**`.env.prod`:**
```
VITE_API_BASE_URL=https://api.udika.vn/api
```

### Branch Convention

| Branch | Purpose |
|--------|---------|
| `main` | Production — PRs from `dev` only |
| `dev` | Default development branch |
| `feat/*` | New features, branch from `dev` |
| `fix/*` | Bug fixes, branch from `dev` |
| `chore/*` | Tooling/config/refactors, branch from `dev` |

---

## 4. Playwright E2E

### New devDependency

```
@playwright/test
```

### Files

- `playwright.config.ts` — base config
- `e2e/` — test directory
- `e2e/example.spec.ts` — smoke test (visits `/`, asserts page loads)

### `playwright.config.ts` Key Settings

```ts
baseURL: 'http://localhost:5173'
testDir: './e2e'
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: true
}
// Browser: chromium only
```

### package.json Scripts Added

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

### Post-Install Step

```bash
npx playwright install chromium
```

---

## 5. TypeScript + Vite Config Updates

### `tsconfig.json` Changes

```json
"noUnusedLocals": true,
"noUnusedParameters": true
```

### `vite.config.ts` Changes

Dev script loads `.env.dev` via Vite mode flag:

```json
"dev": "vite --mode dev"
```

Vite's built-in `--mode` flag loads `.env.[mode]`, so `--mode dev` loads `.env.dev` automatically. No extra vite config needed.

---

## Implementation Order

1. Install ESLint + Prettier devDependencies
2. Install Playwright devDependency + `npx playwright install chromium`
3. Move files (restructure `src/app/` → `src/`)
4. Update all imports (mechanical find-and-replace — all patterns in the table above)
5. Create `eslint.config.js`, `.prettierrc`, `.prettierignore`
6. Create `playwright.config.ts`, `e2e/example.spec.ts`
7. Update `tsconfig.json` (set `noUnusedLocals: true`, `noUnusedParameters: true`)
8. Run `npx tsc --noEmit` — fix any `noUnusedLocals` / `noUnusedParameters` errors before continuing
9. Update `package.json` `dev` script → `vite --mode dev`
10. Create `.gitignore`, `.env.dev`, `.env.prod`
11. Run `npm run lint` — fix any issues
12. Run `npm run build` — verify clean build
13. `git init` + set remote + initial commit + `git push -u origin dev`
