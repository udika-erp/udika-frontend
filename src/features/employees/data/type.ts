import type { Employee } from '@/features/auth/data/type';
import type { PaginatedResponse } from '@/services/api.types';

/**
 * ==================== Request Types ====================
 */

/**
 * Create Employee Request
 * Để tạo nhân viên mới
 */
export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  role: 'SuperAdmin' | 'Admin' | 'HR' | 'Manager' | 'Staff';
  department: 'Board' | 'HR' | 'Sales' | 'Marketing' | 'Event' | 'Accounting' | 'Admin';
  joinDate: string; // ISO date format
  dateOfBirth?: string; // ISO date format
  address?: string;
  avatar?: string; // URL
  salary?: number;
}

/**
 * Update Employee Request
 * Cho phép cập nhật các field
 */
export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  role?: 'SuperAdmin' | 'Admin' | 'HR' | 'Manager' | 'Staff';
  department?: 'Board' | 'HR' | 'Sales' | 'Marketing' | 'Event' | 'Accounting' | 'Admin';
  dateOfBirth?: string;
  address?: string;
  avatar?: string;
  salary?: number;
  status?: 'Active' | 'Resigned' | 'OnLeave' | 'Probation';
  isLoginEnabled?: boolean;
}

/**
 * ==================== Response Types ====================
 */

/**
 * Employee List Response
 * GET /employees response
 */
export interface EmployeeListResponse extends PaginatedResponse<Employee> {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Filter params cho GET /employees
 */
export interface EmployeeFilterParams {
  page?: number;
  limit?: number;
  search?: string; // Tìm theo tên hoặc nhân viên (2+ ký tự)
  department?: string;
  position?: string;
  status?: string;
  joinYear?: number;
  dateFrom?: string; // ISO datetime
  dateTo?: string; // ISO datetime
}

/**
 * Position option
 */
export interface PositionOption {
  value: string;
  label: string;
}

/**
 * Department option
 */
export interface DepartmentOption {
  value: string;
  label: string;
}

/**
 * Status option
 */
export interface StatusOption {
  value: string;
  label: string;
}

/**
 * Dropdown response types
 */
export type PositionListResponse = PositionOption[];
export type DepartmentListResponse = DepartmentOption[];
export type StatusListResponse = StatusOption[];
