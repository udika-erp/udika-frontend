## ADDED Requirements

### Requirement: TextField is an RHF-compatible text input primitive
The system SHALL provide a `TextField` component in `src/components/form/` that wraps the shadcn `Input` primitive, forwards refs, and integrates with React Hook Form via `register` or `Controller`. It SHALL accept `label`, `error`, `helperText`, `placeholder`, and all standard `<input>` HTML attributes.

#### Scenario: TextField displays a label and input
- **WHEN** `<TextField label="Họ tên" />` is rendered
- **THEN** a visible `<label>` and `<input>` are rendered with the correct association

#### Scenario: TextField displays validation error
- **WHEN** `error` prop contains a message string
- **THEN** the error message is displayed below the input in `text-destructive` color

#### Scenario: TextField works with React Hook Form register
- **WHEN** `{...register("name")}` is spread onto `TextField`
- **THEN** the input participates in the RHF form lifecycle (value, onChange, onBlur)

### Requirement: SelectField is an RHF-compatible select primitive
The system SHALL provide a `SelectField` component that wraps shadcn `Select`, forwards refs via `Controller`, and accepts `label`, `options: { label: string; value: string }[]`, `error`, and RHF `control` + `name` props.

#### Scenario: SelectField renders all options
- **WHEN** `options` contains 3 items
- **THEN** all 3 items are visible in the dropdown

#### Scenario: SelectField displays validation error
- **WHEN** validation fails and `error` is set
- **THEN** error message is shown below the select

### Requirement: CheckboxField is an RHF-compatible checkbox
The system SHALL provide a `CheckboxField` component wrapping shadcn `Checkbox`. It SHALL accept `label`, `error`, and integrate with RHF `Controller`.

#### Scenario: CheckboxField toggles checked state
- **WHEN** a user clicks the checkbox
- **THEN** the checked state toggles and the RHF field value updates

### Requirement: DateField is an RHF-compatible date input
The system SHALL provide a `DateField` component that accepts `label`, `error`, and renders a date input (using shadcn Calendar + Popover or a native `<input type="date">` as appropriate). It SHALL integrate with RHF `Controller`.

#### Scenario: DateField shows selected date
- **WHEN** an initial date value is provided
- **THEN** the formatted date is displayed in the trigger button

### Requirement: Form controls correctly display validation messages via shadcn FormMessage
All form control components SHALL be usable inside shadcn `<FormField>` / `<FormItem>` context so that `<FormMessage>` renders errors sourced from the Zod schema automatically.

#### Scenario: Zod validation error surfaced via FormMessage
- **WHEN** a form is submitted with an invalid field
- **THEN** the `<FormMessage>` below the corresponding control shows the Zod error message
