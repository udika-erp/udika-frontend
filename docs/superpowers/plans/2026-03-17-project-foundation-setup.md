# Project Foundation Setup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flatten `src/app/` into `src/`, fix all imports, add ESLint + Prettier, set up Playwright E2E, tighten TS/Vite config, init git with remote, and push initial commit to `dev`.

**Architecture:** All changes are made atomically in a single pass so the project is never in a broken intermediate state. File moves happen first, then import rewrites, then tooling config, then verification, then git.

**Tech Stack:** React 18.3.1, Vite 6, TypeScript strict, ESLint v9 flat config, Prettier, Playwright, React Router v7, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-17-project-foundation-setup-design.md`

---

## File Map

### Files to Move (src/app/ → src/)

| Source | Destination |
|--------|-------------|
| `src/app/App.tsx` | `src/App.tsx` |
| `src/app/routes.tsx` | `src/routes.tsx` |
| `src/app/pages/*.tsx` (10 files) | `src/pages/*.tsx` |
| `src/app/components/layouts/MainLayout.tsx` | `src/layouts/MainLayout.tsx` |
| `src/app/components/ui/*.tsx|ts` (~45 files) | `src/components/ui/*.tsx|ts` |
| `src/app/components/figma/ImageWithFallback.tsx` | `src/components/figma/ImageWithFallback.tsx` |
| `src/app/components/ui/utils.ts` | `src/lib/utils.ts` (**replaces** the move above — this goes to lib, not ui) |

> Note: `utils.ts` is moved to `src/lib/utils.ts`, not `src/components/ui/`. All other ui files go to `src/components/ui/`.

### Files to Create

| File | Purpose |
|------|---------|
| `eslint.config.js` | ESLint v9 flat config |
| `.prettierrc` | Prettier formatting rules |
| `.prettierignore` | Files Prettier skips |
| `playwright.config.ts` | Playwright base config targeting localhost:5173 |
| `e2e/example.spec.ts` | Smoke test — visits `/`, asserts page loads |
| `.gitignore` | Ignore node_modules, dist, .env.*, .DS_Store |
| `.env.dev` | `VITE_API_BASE_URL=http://localhost:3000/api` |
| `.env.prod` | `VITE_API_BASE_URL=https://api.udika.vn/api` |

### Files to Modify

| File | Change |
|------|--------|
| `src/main.tsx` | `./app/App.tsx` → `./App.tsx` |
| `src/App.tsx` | `./components/ui/sonner` → `@/components/ui/sonner` |
| `src/routes.tsx` | `./components/layouts/MainLayout` → `@/layouts/MainLayout`; `./pages/*` → `@/pages/*` |
| `src/layouts/MainLayout.tsx` | `../ui/button` → `@/components/ui/button` |
| All 29 feature/page/component files | `@/app/components/ui/*` → `@/components/ui/*` (~100 occurrences) |
| ~4 files using `@/app/components/ui/utils` | → `@/lib/utils` |
| ~43 files inside `src/components/ui/` | `./utils` → `@/lib/utils` |
| `tsconfig.json` | `noUnusedLocals: true`, `noUnusedParameters: true` |
| `package.json` | Add lint/format/test:e2e scripts; change `dev` → `vite --mode dev`; add devDependencies |

---

## Task 1: Install devDependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install ESLint + Prettier devDependencies**

```bash
cd /Users/tuanvq/Documents/Projects/Personal/udika/udika-frontend
npm install --save-dev eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals prettier eslint-config-prettier
```

Expected: packages added to `devDependencies` in `package.json`, no errors.

- [ ] **Step 2: Install Playwright**

```bash
npm install --save-dev @playwright/test
```

Expected: `@playwright/test` added to `devDependencies`.

- [ ] **Step 3: Install Playwright browser binary**

```bash
npx playwright install chromium
```

Expected: Chromium browser downloaded, output ends with "Chromium ... downloaded to ...".

---

## Task 2: Move Files — `src/app/` → `src/`

**Files:**
- Move: all files listed in the File Map above

- [ ] **Step 1: Create destination directories**

```bash
mkdir -p src/pages src/layouts src/components/ui src/components/figma
```

- [ ] **Step 2: Move App.tsx and routes.tsx**

```bash
mv src/app/App.tsx src/App.tsx
mv src/app/routes.tsx src/routes.tsx
```

- [ ] **Step 3: Move pages**

```bash
mv src/app/pages/* src/pages/
```

- [ ] **Step 4: Move layouts**

```bash
mv src/app/components/layouts/MainLayout.tsx src/layouts/MainLayout.tsx
```

- [ ] **Step 5: Move utils.ts to src/lib/ (NOT to src/components/ui/)**

```bash
mv src/app/components/ui/utils.ts src/lib/utils.ts
```

- [ ] **Step 6: Move remaining ui files**

```bash
mv src/app/components/ui/* src/components/ui/
```

Expected: all `.tsx` and `.ts` files (except `utils.ts`, already moved) now in `src/components/ui/`.

- [ ] **Step 7: Move figma component**

```bash
mv src/app/components/figma/ImageWithFallback.tsx src/components/figma/ImageWithFallback.tsx
```

- [ ] **Step 8: Remove now-empty src/app/ directory**

```bash
rm -rf src/app
```

Expected: `src/app/` no longer exists. Verify: `ls src/` should show `App.tsx`, `routes.tsx`, `pages/`, `layouts/`, `components/`, `features/`, `hooks/`, `lib/`, `providers/`, `services/`, `store/`, `styles/`, `main.tsx`.

---

## Task 3: Update Imports — Entry Files

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `src/routes.tsx`
- Modify: `src/layouts/MainLayout.tsx`

- [ ] **Step 1: Fix src/main.tsx**

Open `src/main.tsx`. Change:
```ts
import App from "./app/App.tsx";
```
To:
```ts
import App from "./App.tsx";
```

- [ ] **Step 2: Fix src/App.tsx**

Open `src/App.tsx`. Change:
```ts
import { Toaster } from './components/ui/sonner';
```
To:
```ts
import { Toaster } from '@/components/ui/sonner';
```

The `./routes` import stays as-is (still resolves correctly at `src/` level).

- [ ] **Step 3: Fix src/routes.tsx — layout import**

Open `src/routes.tsx`. Change:
```ts
import { MainLayout } from "./components/layouts/MainLayout";
```
To:
```ts
import { MainLayout } from "@/layouts/MainLayout";
```

- [ ] **Step 4: Fix src/routes.tsx — page imports**

In the same file, change all `./pages/` imports to `@/pages/`:
```ts
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import { CRM } from "@/pages/CRM";
import { CustomerDetail } from "@/pages/CustomerDetail";
import { EventManagement } from "@/pages/EventManagement";
import { EventDetail } from "@/pages/EventDetail";
import { CalendarPage } from "@/pages/CalendarPage";
import { Reports } from "@/pages/Reports";
import { EmployeeList } from "@/pages/EmployeeList";
import { Attendance } from "@/pages/Attendance";
```

- [ ] **Step 5: Fix src/layouts/MainLayout.tsx — relative ui import**

Open `src/layouts/MainLayout.tsx`. Change:
```ts
import { Button } from '../ui/button';
```
To:
```ts
import { Button } from '@/components/ui/button';
```

---

## Task 4: Update Imports — `@/app/components/ui/*` → `@/components/ui/*`

This is a bulk find-and-replace across ~100 occurrences in 29 files.

**Files:** all `.tsx`/`.ts` files in `src/features/`, `src/components/`, `src/pages/`

- [ ] **Step 1: Fix the 4 files that import `@/app/components/ui/utils` → `@/lib/utils` FIRST**

These 4 files (`TextField.tsx`, `SelectField.tsx`, `DateField.tsx`, `typography/index.tsx`) import `cn()` from the utils path. Because `utils.ts` moves to `src/lib/utils.ts` (not `src/components/ui/`), this pattern must be handled separately before the broad replace runs.

```bash
find src/components/form src/components/typography -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's|@/app/components/ui/utils|@/lib/utils|g' {} +
```

- [ ] **Step 2: Verify those 4 files are fixed**

```bash
grep -r "@/app/components/ui/utils" src/components/form src/components/typography
```

Expected: no output.

- [ ] **Step 3: Run bulk replacement for all remaining @/app/components/ui/ paths**

```bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's|@/app/components/ui/|@/components/ui/|g' {} +
```

- [ ] **Step 4: Verify no @/app/ imports remain**

```bash
grep -r "@/app/" src --include="*.tsx" --include="*.ts"
```

Expected: no output (zero matches).

---

## Task 5: Update Imports — `./utils` → `@/lib/utils` Inside ui/ Files

**Files:** ~43 files inside `src/components/ui/`

- [ ] **Step 1: Run bulk replacement for shadcn-internal ./utils imports**

```bash
find src/components/ui -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's|from "./utils"|from "@/lib/utils"|g' {} +
```

- [ ] **Step 2: Verify no ./utils imports remain in ui/**

```bash
grep -r 'from "./utils"' src/components/ui
```

Expected: no output.

---

## Task 6: Create ESLint Config

**Files:**
- Create: `eslint.config.js`

- [ ] **Step 1: Create eslint.config.js**

Create `eslint.config.js` at the project root with this content:

```js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  prettier,
);
```

---

## Task 7: Create Prettier Config

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`

- [ ] **Step 1: Create .prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

- [ ] **Step 2: Create .prettierignore**

```
dist
node_modules
```

---

## Task 8: Create Playwright Config and Smoke Test

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/example.spec.ts`

- [ ] **Step 1: Create playwright.config.ts**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 2: Create e2e/example.spec.ts**

```ts
import { test, expect } from '@playwright/test';

test('dashboard loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ERP/i);
});
```

---

## Task 9: Update tsconfig.json

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Enable noUnused flags**

Open `tsconfig.json`. Change:
```json
"noUnusedLocals": false,
"noUnusedParameters": false,
```
To:
```json
"noUnusedLocals": true,
"noUnusedParameters": true,
```

- [ ] **Step 2: Run TypeScript check and fix any errors**

```bash
npx tsc --noEmit
```

If any `noUnusedLocals` or `noUnusedParameters` errors appear, fix them by either:
- Removing the unused variable/parameter, or
- Prefixing with `_` (e.g., `_unusedParam`) if it must remain in the signature.

Re-run until clean (zero errors).

---

## Task 10: Update package.json Scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update dev script and add new scripts**

In `package.json`, update the `"scripts"` section to:

```json
"scripts": {
  "dev": "vite --mode dev",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## Task 11: Create .gitignore and Environment Files

**Files:**
- Create: `.gitignore`
- Create: `.env.dev`
- Create: `.env.prod`

- [ ] **Step 1: Create .gitignore**

```
node_modules/
dist/
.env
.env.*
.DS_Store
*.local
```

- [ ] **Step 2: Create .env.dev**

```
VITE_API_BASE_URL=http://localhost:3000/api
```

- [ ] **Step 3: Create .env.prod**

```
VITE_API_BASE_URL=https://api.udika.vn/api
```

---

## Task 12: Verify — Lint and Build

**Files:** none created/modified

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: no errors. If warnings or errors appear, fix them before continuing.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build completes successfully, output in `dist/`. Zero TypeScript errors, zero import errors.

- [ ] **Step 3: Spot-check dev server starts**

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
kill %1
```

Expected: HTTP 200.

---

## Task 13: Git Init, Remote, and Initial Commit

**Files:** none

- [ ] **Step 1: Initialize git repository**

```bash
git init
git checkout -b dev
```

Expected: `Initialized empty Git repository` and branch set to `dev`.

- [ ] **Step 2: Set remote origin**

```bash
git remote add origin https://github.com/udika-erp/udika-frontend.git
```

- [ ] **Step 3: Verify remote**

```bash
git remote -v
```

Expected:
```
origin  https://github.com/udika-erp/udika-frontend.git (fetch)
origin  https://github.com/udika-erp/udika-frontend.git (push)
```

- [ ] **Step 4: Stage all files**

```bash
git add .
```

- [ ] **Step 5: Verify staged files look correct**

```bash
git status
```

Check that `.env.dev` and `.env.prod` do NOT appear (they should be gitignored). If they appear, the `.gitignore` pattern is wrong — stop and fix before committing.

- [ ] **Step 6: Create initial commit**

```bash
git commit -m "$(cat <<'EOF'
chore: initial project setup with restructured src layout

- Flatten src/app/ into src/ (pages, layouts, components/ui)
- Move cn() utility to src/lib/utils.ts
- Add ESLint v9 flat config + Prettier
- Add Playwright E2E with smoke test
- Tighten tsconfig (noUnusedLocals, noUnusedParameters)
- Update dev script to load .env.dev via vite --mode dev
- Init git with dev branch, remote origin set

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7: Push to remote**

```bash
git push -u origin dev
```

Expected: branch `dev` pushed to `https://github.com/udika-erp/udika-frontend.git`.

- [ ] **Step 8: If push is rejected (remote already has commits) — pull and retry**

Run only if Step 7 fails with "rejected" or "non-fast-forward":

```bash
git pull origin dev --rebase
git push -u origin dev
```

Expected: push succeeds after rebasing onto any existing remote commits.

---

## Verification Checklist

After all tasks complete, confirm:

- [ ] `ls src/app` → `No such file or directory` (directory removed)
- [ ] `grep -r "@/app/" src` → zero output
- [ ] `grep -r 'from "./utils"' src/components/ui` → zero output
- [ ] `npm run build` → exits 0
- [ ] `npm run lint` → exits 0
- [ ] `git log --oneline` → shows the initial commit on `dev`
- [ ] `.env.dev` and `.env.prod` not tracked: `git ls-files .env.dev` → no output
