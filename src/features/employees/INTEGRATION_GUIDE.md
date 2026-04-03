# Employee API Integration Guide

## Overview

Đã hoàn thành **3 lớp kiến trúc** cho Employee module:

```
┌─────────────────────────────────────────────────────────┐
│  React Components (EmployeeList, EmployeeForm)          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  React Query Hooks (useEmployees, useMutation)           │
│  - Automatic caching, refetching, invalidation          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Service Layer (EmployeeService extends BaseApiClient)   │
│  - API calls, response unwrapping                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Axios + Auth Interceptor (api instance)                 │
│  - Token auto-attach, CORS headers, error normalization │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/features/employees/
├── data/
│   ├── type.ts                    ← Request/Response types
│   └── index.ts                   ← Exports types
├── service/
│   ├── employee.service.ts        ← EmployeeService class
│   └── index.ts                   ← Exports service
├── hooks/
│   ├── use-employees.ts           ← React Query hooks
│   └── index.ts                   ← Exports hooks
├── components/
│   ├── EmployeeList.tsx           ← To be integrated
│   └── EmployeeForm.tsx           ← To be integrated
└── index.ts                       ← Feature barrel export
```

---

## Available Hooks

### Queries (Read)

#### `useEmployees(filters?)`
Lấy danh sách nhân viên với pagination & filters.

```typescript
// src/features/employees/components/EmployeeList.tsx
import { useEmployees } from '@/features/employees';

export function EmployeeList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = useEmployees(filters);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Total: {data?.total}</h1>
      <table>
        <tbody>
          {data?.items.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Supported Filters:**
```typescript
interface EmployeeFilterParams {
  page?: number;
  limit?: number;
  search?: string;           // Search by name (2+ chars)
  department?: string;       // Board, HR, Sales, etc.
  position?: string;         // Director, Manager, etc.
  status?: string;           // Active, Resigned, OnLeave, Probation
  joinYear?: number;         // Filter by year
  dateFrom?: string;         // ISO datetime
  dateTo?: string;           // ISO datetime
}
```

---

#### `useEmployeeDetail(id, enabled?)`
Lấy chi tiết nhân viên theo ID.

```typescript
import { useEmployeeDetail } from '@/features/employees';

export function EmployeeDetailPage({ id }: { id: string }) {
  const { data: employee, isLoading } = useEmployeeDetail(id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{employee?.name}</h1>
      <p>Email: {employee?.email}</p>
      <p>Position: {employee?.position}</p>
      <p>Department: {employee?.department}</p>
    </div>
  );
}
```

---

#### `useEmployeePositions()`
Lấy danh sách vị trí (dropdown).

```typescript
import { useEmployeePositions } from '@/features/employees';

export function PositionSelect() {
  const { data: positions, isLoading } = useEmployeePositions();

  return (
    <select>
      {positions?.map((pos) => (
        <option key={pos.value} value={pos.value}>
          {pos.label}
        </option>
      ))}
    </select>
  );
}
```

---

#### `useEmployeeDepartments()`
Lấy danh sách phòng ban (dropdown).

```typescript
import { useEmployeeDepartments } from '@/features/employees';

export function DepartmentSelect() {
  const { data: departments } = useEmployeeDepartments();

  return (
    <select>
      {departments?.map((dept) => (
        <option key={dept.value} value={dept.value}>
          {dept.label}
        </option>
      ))}
    </select>
  );
}
```

---

#### `useEmployeeStatuses()`
Lấy danh sách trạng thái (dropdown).

```typescript
import { useEmployeeStatuses } from '@/features/employees';

export function StatusSelect() {
  const { data: statuses } = useEmployeeStatuses();

  return (
    <select>
      {statuses?.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
```

---

### Mutations (Write)

#### `useCreateEmployee()`
Tạo nhân viên mới. Tự động invalidate danh sách & hiển thị toast.

```typescript
import { useCreateEmployee } from '@/features/employees';
import type { CreateEmployeeRequest } from '@/features/employees';

export function EmployeeForm() {
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const handleSubmit = async (formData: CreateEmployeeRequest) => {
    createEmployee(formData);
    // Toast sẽ tự động hiển thị success/error
    // Danh sách sẽ tự động refetch
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        position: formData.get('position') as any,
        department: formData.get('department') as any,
        dateOfBirth: formData.get('dateOfBirth') as string,
        address: formData.get('address') as string,
        avatar: formData.get('avatar') as string,
        salary: parseFloat(formData.get('salary') as string),
      });
    }}>
      <input name="name" required />
      <input name="email" type="email" required />
      <select name="position" required>
        <option value="">Select position</option>
        {/* Options from useEmployeePositions */}
      </select>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

**Return object:**
```typescript
{
  mutate: (data: CreateEmployeeRequest) => void,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  data: Employee | undefined,
}
```

---

#### `useUpdateEmployee()`
Cập nhật nhân viên. Tự động invalidate danh sách & detail.

```typescript
import { useUpdateEmployee } from '@/features/employees';
import type { UpdateEmployeeRequest } from '@/features/employees';

export function EditEmployeeForm({ employeeId }: { employeeId: string }) {
  const { mutate: updateEmployee, isPending } = useUpdateEmployee();

  const handleSubmit = (formData: UpdateEmployeeRequest) => {
    updateEmployee({
      id: employeeId,
      data: formData,
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const data = {
        name: (e.target as any).name.value,
        email: (e.target as any).email.value,
        // ... other fields
      };
      handleSubmit(data);
    }}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}
```

---

#### `useDeleteEmployee()`
Xóa (soft delete) nhân viên.

```typescript
import { useDeleteEmployee } from '@/features/employees';

export function EmployeeActions({ employeeId }: { employeeId: string }) {
  const { mutate: deleteEmployee, isPending } = useDeleteEmployee();

  const handleDelete = () => {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      deleteEmployee(employeeId);
      // Toast & list refetch tự động
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Integration with EmployeeForm & EmployeeList

### EmployeeForm.tsx
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEmployee, useUpdateEmployee } from '@/features/employees';
import { employeeSchema } from '../forms/employee.schema';
import type { EmployeeFormValues } from '../forms/employee.schema';

interface EmployeeFormProps {
  onSuccess?: () => void;
  initialData?: EmployeeFormValues;
  employeeId?: string;
}

export function EmployeeForm({
  onSuccess,
  initialData,
  employeeId,
}: EmployeeFormProps) {
  const { mutate: createEmployee } = useCreateEmployee();
  const { mutate: updateEmployee } = useUpdateEmployee();
  
  const isEditMode = !!employeeId;
  const { control, handleSubmit } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: EmployeeFormValues) => {
    if (isEditMode) {
      updateEmployee({ id: employeeId, data });
    } else {
      createEmployee(data);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields here */}
      <button type="submit">
        {isEditMode ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
```

### EmployeeList.tsx
```typescript
import { useState } from 'react';
import { useEmployees, useDeleteEmployee } from '@/features/employees';
import type { EmployeeFilterParams } from '@/features/employees';

export function EmployeeList() {
  const [filters, setFilters] = useState<EmployeeFilterParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = useEmployees(filters);
  const { mutate: deleteEmployee } = useDeleteEmployee();

  const handleFilterChange = (newFilters: Partial<EmployeeFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to page 1 on filter change
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Filters */}
      <input
        placeholder="Search..."
        onChange={(e) =>
          handleFilterChange({ search: e.target.value })
        }
      />

      <select
        onChange={(e) =>
          handleFilterChange({ department: e.target.value || undefined })
        }
      >
        <option value="">All Departments</option>
        {/* Options from useEmployeeDepartments */}
      </select>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>
                <button onClick={() => deleteEmployee(employee.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button
          onClick={() =>
            setFilters((p) => ({
              ...p,
              page: Math.max(1, p.page! - 1),
            }))
          }
        >
          Previous
        </button>
        <span>
          Page {data?.page} of {Math.ceil((data?.total || 0) / (filters.limit || 10))}
        </span>
        <button
          onClick={() =>
            setFilters((p) => ({
              ...p,
              page: p.page! + 1,
            }))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## Type Safety

Tất cả types được tự động inferred từ service methods:

```typescript
import type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListResponse,
  EmployeeFilterParams,
  PositionListResponse,
  DepartmentListResponse,
  StatusListResponse,
} from '@/features/employees';

// 100% type-safe end-to-end
const createData: CreateEmployeeRequest = {
  name: 'John Doe',
  email: 'john@example.com',
  position: 'Manager', // Type-checked!
  department: 'HR', // Type-checked!
};
```

---

## Error Handling

Tất cả mutations tự động handle & display toast:

```typescript
// useCreateEmployee, useUpdateEmployee, useDeleteEmployee
// tự động hiển thị:
// - Success toast khi thành công
// - Error toast khi thất bại (email exists, not found, etc)
```

Custom error handling:

```typescript
const { mutate, isError, error } = useCreateEmployee();

if (isError) {
  console.error('Create failed:', error?.message);
}
```

---

## Cache behavior

```typescript
// Queries are cached & reused
useEmployees({ page: 1 });  // Cached 5 minutes
useEmployees({ page: 1 });  // Reuses cache, no API call

// Mutations invalidate related queries
useCreateEmployee(); // Creates → invalidates useEmployees() cache → refetch

// Static data cached longer
useEmployeePositions(); // Cached 1 hour (rarely changes)
```

---

## Testing Mutations

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "ngrok-skip-browser-warning: true" \
     https://siu-biflex-gema.ngrok-free.dev/api/employees
```

---

## Quick Checklist

- ✅ Service layer (`employee.service.ts`) - extends BaseApiClient
- ✅ React Query hooks (`use-employees.ts`) - full mutations + queries
- ✅ Types (`data/type.ts`) - full end-to-end type safety
- ✅ Error handling - automatic toast + error messages
- ✅ Cache invalidation - automatic on mutations
- ⏳ **Next:** Integrate into EmployeeList & EmployeeForm components
