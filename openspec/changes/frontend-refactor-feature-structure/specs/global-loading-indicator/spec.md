## ADDED Requirements

### Requirement: Route-transition loading bar using nprogress
The system SHALL display a top-of-page progress bar during React Router navigation transitions. The bar SHALL start when a navigation begins and complete when the new route is rendered. It SHALL use the CSS custom property `--primary` from `theme.css` as its bar color.

#### Scenario: Loading bar starts on route change
- **WHEN** the user clicks a navigation link that triggers a route transition
- **THEN** the top progress bar becomes visible within 100ms

#### Scenario: Loading bar completes when route renders
- **WHEN** the new route component has finished rendering
- **THEN** the progress bar completes and fades out

#### Scenario: Loading bar uses primary color token
- **WHEN** the loading bar is visible
- **THEN** its color matches the `--primary` CSS custom property from `theme.css`

### Requirement: Table and detail views show local loading skeletons
When data-fetching hooks return `isLoading: true`, tables SHALL render skeleton rows and detail views SHALL render skeleton cards. The loading UI SHALL occupy the same dimensions as the loaded content to prevent layout shift.

#### Scenario: Customer list shows skeleton rows while loading
- **WHEN** the customer list query is loading
- **THEN** skeleton placeholder rows are rendered in the table body

#### Scenario: Event detail shows skeleton cards while loading
- **WHEN** the event detail query is loading
- **THEN** skeleton placeholder cards are shown in the detail sections

### Requirement: Forms disable submit button during mutation loading
When a React Query mutation `isPending` is `true`, the form submit button SHALL be disabled and display a loading spinner alongside its label text.

#### Scenario: Submit button disabled during mutation
- **WHEN** a form mutation is in-flight
- **THEN** the submit button has `disabled` attribute and shows a loading indicator
