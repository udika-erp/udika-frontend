## ADDED Requirements

### Requirement: Typography components wrap Tailwind heading and text classes
The system SHALL provide `Title`, `Subtitle`, `Body`, and `Muted` components in `src/components/typography/`. Each SHALL render a semantic HTML element with the corresponding Tailwind classes derived from `theme.css` tokens. Visual output SHALL be identical to the inline Tailwind classes already used in pages.

#### Scenario: Title renders an h1 with correct styles
- **WHEN** `<Title>Tổng quan</Title>` is rendered
- **THEN** an `<h1>` element appears with the same font size, weight, and color as existing page headings

#### Scenario: Muted renders helper text with muted color
- **WHEN** `<Muted>Không có dữ liệu</Muted>` is rendered
- **THEN** a `<p>` element appears with `text-muted-foreground` styling

### Requirement: Typography components accept a className override
Each typography component SHALL accept an optional `className` prop that merges with the default classes via `cn()`, allowing per-instance overrides without changing the defaults.

#### Scenario: Additional className is applied alongside defaults
- **WHEN** `<Title className="mb-4">Heading</Title>` is rendered
- **THEN** the element has both the default heading styles and the `mb-4` margin class

### Requirement: Typography components forward standard HTML attributes
Each typography component SHALL spread remaining HTML attributes onto its root element so consumers can attach `id`, `data-*`, `aria-*`, and event handlers without wrapper divs.

#### Scenario: id attribute is forwarded
- **WHEN** `<Title id="page-title">...</Title>` is rendered
- **THEN** the underlying `<h1>` has `id="page-title"`
