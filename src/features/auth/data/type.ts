export type UserRole = 'SuperAdmin' | 'Admin' | 'HR' | 'Manager' | 'Staff';
export type Position = 'Director' | 'Manager' | 'Supervisor' | 'Employee' | 'Intern';
export type Department = 'Board' | 'HR' | 'Sales' | 'Marketing' | 'Event' | 'Accounting' | 'Admin';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  role: UserRole;
  position: Position;
  department: Department;
  status: string;
  isLoginEnabled: boolean;
  joinDate: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  employee: Employee;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
