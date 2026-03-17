## ADDED Requirements

### Requirement: DataTable renders typed columns and rows
The `DataTable<T>` component SHALL accept `columns: ColumnDef<T>[]` and `data: T[]` props and render a styled `<table>` using the existing shadcn `Table` primitive. Visual output SHALL be identical to existing page-level tables.

#### Scenario: DataTable renders customer rows
- **WHEN** `CustomerList` passes customer mock data and column definitions to `DataTable`
- **THEN** all rows are rendered with the correct cell content and styling

#### Scenario: DataTable renders with no data
- **WHEN** `data` is an empty array
- **THEN** an empty-state row is displayed with a Vietnamese message (e.g., "Không có dữ liệu")

### Requirement: DataTable supports client-side sorting
The `DataTable` SHALL support sorting on any column marked `sortable: true` in its `ColumnDef`. Clicking a sortable column header SHALL toggle ascending → descending → none order.

#### Scenario: Column header click sorts ascending
- **WHEN** a user clicks a sortable column header for the first time
- **THEN** rows are reordered ascending by that column's value

#### Scenario: Second click on sorted column reverses order
- **WHEN** a user clicks a column header that is already sorted ascending
- **THEN** rows are reordered descending

### Requirement: DataTable supports pagination
The `DataTable` SHALL accept optional `pageSize` (default 10) and render `DataTablePagination` controls (previous, next, page info) below the table. Total row count SHALL be displayed.

#### Scenario: Pagination controls appear when rows exceed page size
- **WHEN** `data` has more entries than `pageSize`
- **THEN** previous/next buttons and page info are visible

#### Scenario: Previous button disabled on first page
- **WHEN** the current page is 1
- **THEN** the previous button is disabled

### Requirement: DataTable supports a loading skeleton state
The `DataTable` SHALL accept an `isLoading` boolean prop. When `true`, it SHALL render skeleton placeholder rows instead of data rows.

#### Scenario: Loading skeletons shown during data fetch
- **WHEN** `isLoading` is `true`
- **THEN** skeleton rows matching `pageSize` are rendered in place of data rows

### Requirement: DataTable supports row actions via ColumnDef
Columns MAY include a `cell` render function returning a `DataTableRowActions` dropdown. The visual and behavioral output SHALL match the existing page-level action dropdowns.

#### Scenario: Row action dropdown opens on trigger click
- **WHEN** a user clicks the action button in a row
- **THEN** a dropdown with the configured action items appears
