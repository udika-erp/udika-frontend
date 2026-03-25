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
  phone?: string | null;
  avatar?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
}

// ==================== Profile & Password Change Types ====================

/**
 * Update Profile Request - Only editable fields
 * User can only update: name, phone, avatar
 */
export interface UpdateProfileRequest {
  name: string;
  phone?: string | null;
  avatar?: string | null;
}

/**
 * Update Profile Response
 */
export interface UpdateProfileResponse extends Employee {}

/**
 * Change Password Request - Self-service password change
 * Requires current password for verification
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change Password Response
 */
export interface ChangePasswordResponse {
  message: string;
  requiresLogout: boolean;
}

/**
 * Force Change Password Request - Admin-initiated password reset
 * Does NOT require current password (admin reset case)
 */
export interface ForceChangePasswordRequest {
  newPassword: string;
}

/**
 * Profile DTO - Read-only fields for display
 */
export interface ProfileReadOnly {
  email: string;
  role: UserRole;
  department: Department;
  position: Position;
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
