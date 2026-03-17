## ADDED Requirements

### Requirement: Feature domains live in `src/features/<domain>/`
Each ERP domain (customers, events, employees, calendar, attendance, reports, dashboard, auth) SHALL have a dedicated folder at `src/features/<domain>/` containing `components/`, `hooks/`, `forms/`, and `api/` subfolders as needed.

#### Scenario: Feature folder created for customers domain
- **WHEN** a developer navigates to `src/features/customers/`
- **THEN** they find `components/`, `hooks/`, `forms/`, and an `index.ts` barrel export

#### Scenario: Feature folder created for events domain
- **WHEN** a developer navigates to `src/features/events/`
- **THEN** they find `components/`, `hooks/`, `forms/`, and an `index.ts` barrel export

#### Scenario: Feature folder created for employees domain
- **WHEN** a developer navigates to `src/features/employees/`
- **THEN** they find `components/`, `hooks/`, `forms/`, and an `index.ts` barrel export

#### Scenario: Feature folder created for remaining domains
- **WHEN** a developer navigates to `src/features/calendar/`, `src/features/attendance/`, `src/features/reports/`, `src/features/dashboard/`, or `src/features/auth/`
- **THEN** each folder contains the appropriate `components/` and `hooks/` subfolders

### Requirement: Page components are thin entry points
Page files under `src/app/pages/` SHALL contain only route bindings, high-level layout composition, and imports from their corresponding feature folder. They SHALL NOT contain inline business logic, form state, or data-shaping code.

#### Scenario: CustomerPage delegates to feature components
- **WHEN** a developer reads `src/app/pages/CRM.tsx`
- **THEN** it imports `CustomerList` and related components from `@/features/customers/` and composes them without inline logic

#### Scenario: EventPage delegates to feature components
- **WHEN** a developer reads `src/app/pages/EventManagement.tsx`
- **THEN** it imports `EventList` and related components from `@/features/events/` and composes them without inline logic

### Requirement: Cross-cutting shared components remain in `src/components/`
Shared component families that are used by more than one feature SHALL live at `src/components/<family>/` and be importable via the `@/components/<family>` alias.

#### Scenario: DataTable imported from shared location
- **WHEN** a feature component imports a table
- **THEN** it imports from `@/components/table/DataTable` not from a feature-specific folder

#### Scenario: Typography helpers imported from shared location
- **WHEN** a feature component uses a Title or Body wrapper
- **THEN** it imports from `@/components/typography`
