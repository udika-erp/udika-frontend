## ADDED Requirements

### Requirement: All non-trivial forms use React Hook Form with Zod resolver
Forms with more than 2 fields or any validation logic SHALL use `useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })`. Zod schemas SHALL be co-located in the feature's `forms/` subfolder (e.g., `src/features/customers/forms/customer.schema.ts`).

#### Scenario: Customer create form uses RHF + Zod
- **WHEN** a developer opens `src/features/customers/forms/`
- **THEN** a Zod schema for customer creation exists and `CustomerForm` uses `useForm` with that schema

#### Scenario: Event create form uses RHF + Zod
- **WHEN** a developer opens `src/features/events/forms/`
- **THEN** a Zod schema for event creation exists and `EventForm` uses `useForm` with that schema

#### Scenario: Login form uses RHF + Zod
- **WHEN** a developer opens `src/features/auth/forms/`
- **THEN** a Zod schema for login credentials exists and `LoginForm` uses `useForm` with that schema

### Requirement: Form values are typed via z.infer
Form value types SHALL be derived from Zod schemas using `z.infer<typeof schema>` and SHALL NOT be manually duplicated as separate TypeScript interfaces.

#### Scenario: CustomerFormValues derived from schema
- **WHEN** a developer inspects the customer form schema file
- **THEN** the type `CustomerFormValues = z.infer<typeof customerSchema>` is exported (not a separate interface)

### Requirement: shadcn Form primitives are used for field rendering
All RHF-connected fields SHALL use `<FormField>`, `<FormItem>`, `<FormLabel>`, and `<FormMessage>` from the shadcn `Form` component so that errors are surfaced consistently.

#### Scenario: Field validation error appears via FormMessage
- **WHEN** a required field is left empty and the form is submitted
- **THEN** `<FormMessage>` renders the Zod error message below the field

### Requirement: Form submission is guarded by Zod validation before any mutation
The `handleSubmit` wrapper from React Hook Form SHALL run Zod validation before calling any submit handler. Invalid forms SHALL NOT trigger API calls or mock data mutations.

#### Scenario: Invalid form submission is blocked
- **WHEN** a user submits a form with invalid data
- **THEN** no submission handler is called and validation errors are displayed inline

#### Scenario: Valid form submission proceeds
- **WHEN** a user submits a form with valid data
- **THEN** the submit callback receives the validated, typed form values
