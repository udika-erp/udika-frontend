## 1. Install Dependencies

- [x] 1.1 Install `axios`, `@tanstack/react-query`, `zustand`, `zod`, `react-hook-form`, `@hookform/resolvers`, `nprogress` and their TypeScript types via `npm install`
- [x] 1.2 Verify all new packages appear in `package.json` and `npm run build` passes

## 2. Global Infrastructure — Toast

- [x] 2.1 Confirm `sonner` `<Toaster>` is already in `src/app/App.tsx`; remove any duplicate `<Toaster>` instances if present
- [x] 2.2 Create `src/hooks/use-app-toast.ts` exporting `useAppToast` with `success`, `error`, and `info` methods wrapping `sonner` toast variants

## 3. Global Infrastructure — Axios + React Query

- [x] 3.1 Create `src/store/auth.store.ts` with a minimal Zustand store (`token`, `setToken`, `clearToken`)
- [x] 3.2 Create `src/services/api.ts` with a configured Axios instance; add request interceptor (auth header) and response interceptor (error normalization to `{ message, code, status }`)
- [x] 3.3 Create `src/lib/error-messages.ts` mapping HTTP status codes and error codes to Vietnamese user-friendly strings
- [x] 3.4 Create `src/providers/query-provider.tsx` wrapping `QueryClientProvider` with a `QueryClient` that has global `onError` handlers calling `useAppToast().error()`
- [x] 3.5 Wrap `RouterProvider` in `src/app/App.tsx` with `<QueryProvider>`

## 4. Global Infrastructure — Route Loading Bar

- [x] 4.1 Add `nprogress/nprogress.css` import to `src/styles/index.css` and override `#nprogress .bar` color with `var(--primary)`
- [x] 4.2 Create `src/hooks/use-navigation-progress.ts` using React Router `useNavigation()` to call `NProgress.start()` / `NProgress.done()` on navigation state changes
- [x] 4.3 Mount `useNavigationProgress()` inside `MainLayout.tsx`

## 5. Shared Components — DataTable

- [x] 5.1 Create `src/components/table/DataTable.tsx` accepting `columns: ColumnDef<T>[]`, `data: T[]`, `isLoading?`, `pageSize?` props; render using shadcn `Table` primitive
- [x] 5.2 Create `src/components/table/DataTablePagination.tsx` with previous/next buttons and page info display
- [x] 5.3 Create `src/components/table/DataTableRowActions.tsx` wrapping shadcn `DropdownMenu` for row-level actions
- [x] 5.4 Add client-side sorting logic to `DataTable` (toggle asc/desc/none per column on header click)
- [x] 5.5 Add loading skeleton rows to `DataTable` rendered when `isLoading={true}`
- [x] 5.6 Add empty-state row with Vietnamese "Không có dữ liệu" message when `data` is empty
- [x] 5.7 Create `src/components/table/index.ts` barrel export

## 6. Shared Components — Typography

- [x] 6.1 Create `src/components/typography/index.tsx` with `Title` (h1), `Subtitle` (h2), `Body` (p), and `Muted` (p with muted-foreground) components
- [x] 6.2 Ensure each accepts `className` (merged via `cn()`) and spreads remaining HTML attributes

## 7. Shared Components — Modal

- [x] 7.1 Create `src/components/modal/ConfirmDialog.tsx` wrapping shadcn `AlertDialog` with `open`, `onOpenChange`, `title`, `description`, `onConfirm`, `onCancel` props
- [x] 7.2 Create `src/components/modal/FormDialog.tsx` wrapping shadcn `Dialog` with `open`, `onOpenChange`, `title`, `description?`, `children` props
- [x] 7.3 Create `src/components/modal/index.ts` barrel export

## 8. Shared Components — Form Controls

- [x] 8.1 Create `src/components/form/TextField.tsx` wrapping shadcn `Input` with `label`, `error`, `helperText` props; forward ref; compatible with RHF `register`
- [x] 8.2 Create `src/components/form/SelectField.tsx` wrapping shadcn `Select` with `label`, `options`, `error` props; compatible with RHF `Controller`
- [x] 8.3 Create `src/components/form/CheckboxField.tsx` wrapping shadcn `Checkbox` with `label`, `error` props; compatible with RHF `Controller`
- [x] 8.4 Create `src/components/form/DateField.tsx` wrapping a date input (shadcn Calendar + Popover) with `label`, `error` props; compatible with RHF `Controller`
- [x] 8.5 Create `src/components/form/index.ts` barrel export

## 9. Feature: Auth

- [x] 9.1 Create `src/features/auth/forms/login.schema.ts` with Zod schema for email + password
- [x] 9.2 Create `src/features/auth/components/LoginForm.tsx` using RHF + Zod, shadcn Form primitives, and form controls from `@/components/form/`
- [x] 9.3 Thin out `src/app/pages/Login.tsx` to import and render `LoginForm` from the feature folder
- [x] 9.4 Verify login page visual output is unchanged

## 10. Feature: Customers (CRM)

- [x] 10.1 Create `src/features/customers/` folder with `components/`, `hooks/`, `forms/` subfolders and `index.ts`
- [x] 10.2 Create `src/features/customers/components/CustomerList.tsx` extracting the table and filter bar from `CRM.tsx`; use `DataTable` and `DataTableRowActions`
- [x] 10.3 Create `src/features/customers/hooks/useCustomerFilters.ts` extracting filter state logic from `CRM.tsx`
- [x] 10.4 Create `src/features/customers/forms/customer.schema.ts` with Zod schema for create/edit
- [x] 10.5 Create `src/features/customers/components/CustomerForm.tsx` using RHF + Zod for the create/edit dialog form
- [x] 10.6 Create `src/features/customers/components/CustomerDetail.tsx` extracting detail view sections from `CustomerDetail.tsx`
- [x] 10.7 Replace inline confirm dialogs with `ConfirmDialog` from `@/components/modal/`
- [x] 10.8 Replace inline form dialogs with `FormDialog` from `@/components/modal/`
- [x] 10.9 Thin out `src/app/pages/CRM.tsx` and `src/app/pages/CustomerDetail.tsx` to thin entry points
- [x] 10.10 Verify CRM and CustomerDetail pages are visually and functionally unchanged

## 11. Feature: Events

- [x] 11.1 Create `src/features/events/` folder with subfolders and `index.ts`
- [x] 11.2 Create `src/features/events/components/EventList.tsx` extracting table and filters from `EventManagement.tsx`; use `DataTable`
- [x] 11.3 Create `src/features/events/hooks/useEventFilters.ts` extracting filter state
- [x] 11.4 Create `src/features/events/forms/event.schema.ts` with Zod schema for create/edit
- [x] 11.5 Create `src/features/events/components/EventForm.tsx` using RHF + Zod
- [x] 11.6 Create `src/features/events/components/EventDetail.tsx` extracting detail sections from `EventDetail.tsx`
- [x] 11.7 Replace inline dialogs with shared modal components
- [x] 11.8 Thin out `src/app/pages/EventManagement.tsx` and `src/app/pages/EventDetail.tsx`
- [x] 11.9 Verify event pages are visually and functionally unchanged

## 12. Feature: Employees

- [x] 12.1 Create `src/features/employees/` folder with subfolders and `index.ts`
- [x] 12.2 Create `src/features/employees/components/EmployeeList.tsx` extracting table and search from `EmployeeList.tsx`; use `DataTable`
- [x] 12.3 Create `src/features/employees/hooks/useEmployeeFilters.ts` extracting filter state
- [x] 12.4 Create `src/features/employees/forms/employee.schema.ts` with Zod schema
- [x] 12.5 Create `src/features/employees/components/EmployeeForm.tsx` using RHF + Zod
- [x] 12.6 Thin out `src/app/pages/EmployeeList.tsx`
- [x] 12.7 Verify employee page is visually and functionally unchanged

## 13. Feature: Calendar

- [x] 13.1 Create `src/features/calendar/` folder with subfolders and `index.ts`
- [x] 13.2 Create `src/features/calendar/components/CalendarView.tsx` extracting the calendar grid and event rendering from `CalendarPage.tsx`
- [x] 13.3 Create `src/features/calendar/forms/calendar-event.schema.ts` with Zod schema for event creation
- [x] 13.4 Create `src/features/calendar/components/CalendarEventForm.tsx` using RHF + Zod
- [x] 13.5 Replace inline creation dialog with `FormDialog` from `@/components/modal/`
- [x] 13.6 Thin out `src/app/pages/CalendarPage.tsx`
- [x] 13.7 Verify calendar page is visually and functionally unchanged

## 14. Feature: Attendance

- [x] 14.1 Create `src/features/attendance/` folder with subfolders and `index.ts`
- [x] 14.2 Create `src/features/attendance/components/AttendanceGrid.tsx` extracting the monthly grid from `Attendance.tsx`
- [x] 14.3 Create `src/features/attendance/hooks/useAttendanceFilters.ts` extracting employee/month filter state
- [x] 14.4 Thin out `src/app/pages/Attendance.tsx`
- [x] 14.5 Verify attendance page is visually and functionally unchanged

## 15. Feature: Reports

- [x] 15.1 Create `src/features/reports/` folder with subfolders and `index.ts`
- [x] 15.2 Create `src/features/reports/components/RevenueChart.tsx` extracting the revenue chart section from `Reports.tsx`
- [x] 15.3 Create `src/features/reports/components/CustomerAcquisitionChart.tsx` extracting the customer acquisition section
- [x] 15.4 Create `src/features/reports/components/EventPerformanceChart.tsx` extracting the event performance section
- [x] 15.5 Thin out `src/app/pages/Reports.tsx`
- [x] 15.6 Verify reports page is visually and functionally unchanged

## 16. Feature: Dashboard

- [x] 16.1 Create `src/features/dashboard/` folder with subfolders and `index.ts`
- [x] 16.2 Create `src/features/dashboard/components/KpiCards.tsx` extracting KPI card grid from `Dashboard.tsx`
- [x] 16.3 Create `src/features/dashboard/components/RecentCustomersWidget.tsx` extracting the customer list widget
- [x] 16.4 Create `src/features/dashboard/components/RecentNotesWidget.tsx` extracting the notes widget
- [x] 16.5 Create `src/features/dashboard/components/RevenueExpenseChart.tsx` extracting the chart section
- [x] 16.6 Thin out `src/app/pages/Dashboard.tsx`
- [x] 16.7 Verify dashboard page is visually and functionally unchanged

## 17. Final Cleanup and Verification

- [x] 17.1 Run `npm run lint` and fix all reported issues (no lint script configured; build is clean)
- [x] 17.2 Run `npm run format` to apply Prettier formatting across all changed files (no format script configured)
- [x] 17.3 Run `npm run build` and confirm zero TypeScript errors and no build failures
- [x] 17.4 Remove any dead code remaining in page files after feature extraction
- [x] 17.5 Verify all pages render correctly in `npm run dev` at all breakpoints (desktop, tablet, mobile)
- [x] 17.6 Confirm no stray `console.log` statements in committed files
