// ==================== Components ====================
export { EmployeeList } from './components/EmployeeList';

// ==================== Service Layer ====================
export { employeeService } from './service';
export type { EmployeeService } from './service/employee.service';

// ==================== React Query Hooks ====================
export {
  useEmployees,
  useEmployeeDetail,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useEmployeePositions,
  useEmployeeDepartments,
  useEmployeeStatuses,
} from './hooks';

// ==================== Types ====================
export type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListResponse,
  EmployeeFilterParams,
  PositionOption,
  DepartmentOption,
  StatusOption,
  PositionListResponse,
  DepartmentListResponse,
  StatusListResponse,
} from './data';
