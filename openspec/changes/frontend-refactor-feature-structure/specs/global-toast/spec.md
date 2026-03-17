## ADDED Requirements

### Requirement: Single Toaster provider mounted in App
The system SHALL have exactly one `<Toaster>` (from `sonner`) mounted in `src/app/App.tsx`. No other `<Toaster>` instances SHALL exist in the component tree.

#### Scenario: Only one Toaster in the component tree
- **WHEN** the app is rendered
- **THEN** the DOM contains exactly one sonner toaster root element

### Requirement: useAppToast hook exposes success, error, and info methods
The system SHALL export a `useAppToast` hook from `src/hooks/use-app-toast.ts` with `success(message: string)`, `error(message: string)`, and `info(message: string)` methods that call the corresponding sonner `toast` variants.

#### Scenario: success method triggers a success toast
- **WHEN** `useAppToast().success("Lưu thành công")` is called
- **THEN** a success-styled toast with the message "Lưu thành công" appears

#### Scenario: error method triggers an error toast
- **WHEN** `useAppToast().error("Đã xảy ra lỗi")` is called
- **THEN** an error-styled toast with the message "Đã xảy ra lỗi" appears

### Requirement: Feature components use useAppToast, not direct sonner calls
All feature and page components SHALL trigger toasts via `useAppToast` rather than importing and calling `sonner`'s `toast` directly.

#### Scenario: Customer save success uses useAppToast
- **WHEN** a customer form is saved successfully
- **THEN** `useAppToast().success(...)` is called (not a direct `toast.success()` import)
