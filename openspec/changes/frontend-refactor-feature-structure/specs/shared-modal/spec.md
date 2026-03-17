## ADDED Requirements

### Requirement: ConfirmDialog component wraps Radix/shadcn AlertDialog
The system SHALL provide a `ConfirmDialog` component in `src/components/modal/` that accepts `open`, `onOpenChange`, `title`, `description`, `onConfirm`, and `onCancel` props. It SHALL use the existing shadcn `AlertDialog` primitive. Visual appearance, animation, and positioning SHALL match current ad-hoc confirm dialogs in pages.

#### Scenario: ConfirmDialog shows title and description
- **WHEN** `ConfirmDialog` is rendered with `open={true}`, a `title`, and a `description`
- **THEN** the dialog is visible with both pieces of text displayed

#### Scenario: ConfirmDialog calls onConfirm when confirmed
- **WHEN** the user clicks the confirm button
- **THEN** `onConfirm` callback is invoked and the dialog closes

#### Scenario: ConfirmDialog calls onCancel when dismissed
- **WHEN** the user clicks the cancel button or presses Escape
- **THEN** `onCancel` is invoked and `onOpenChange(false)` is called

### Requirement: FormDialog component wraps shadcn Dialog for form-containing modals
The system SHALL provide a `FormDialog` component in `src/components/modal/` that accepts `open`, `onOpenChange`, `title`, optional `description`, and `children` props. The `children` slot SHALL render inside a scrollable `DialogContent`. Visual output SHALL match existing page-level dialogs.

#### Scenario: FormDialog renders children inside dialog content
- **WHEN** `FormDialog` is rendered with `open={true}` and a form as children
- **THEN** the form is visible inside the dialog overlay

#### Scenario: FormDialog closes on overlay click or Escape
- **WHEN** the user clicks the backdrop or presses Escape
- **THEN** `onOpenChange(false)` is called

### Requirement: Modal components are consumed by features instead of re-implemented
Features and pages SHALL import `ConfirmDialog` or `FormDialog` from `@/components/modal/` rather than implementing dialog logic inline.

#### Scenario: Customer delete confirmation uses ConfirmDialog
- **WHEN** a user triggers delete on a customer row
- **THEN** `ConfirmDialog` from `@/components/modal/` is rendered (not an inline dialog)
