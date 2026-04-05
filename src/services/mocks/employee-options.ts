/**
 * Mock data cho Employee module - Roles, Departments, Statuses
 * Dùng cho dropdown selections trong form tạo/sửa nhân viên
 */

export const MOCK_ROLES = [
  { value: 'SuperAdmin', label: 'Siêu quản trị viên' },
  { value: 'Admin', label: 'Quản trị viên' },
  { value: 'HR', label: 'Nhân sự' },
  { value: 'Manager', label: 'Quản lý' },
  { value: 'Staff', label: 'Nhân viên' },
];

// Keep for backward compatibility if needed
export const MOCK_POSITIONS = MOCK_ROLES;

export const MOCK_DEPARTMENTS = [
  { value: 'Board', label: 'Board' },
  { value: 'HR', label: 'Nhân sự' },
  { value: 'Sales', label: 'Kinh doanh' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Event', label: 'Sự kiện' },
  { value: 'Accounting', label: 'Kế toán' },
  { value: 'Admin', label: 'Hành chính' },
];

export const MOCK_STATUSES = [
  { value: 'Active', label: 'Dang làm việc' },
  { value: 'OnLeave', label: 'Đang nghỉ phép' },
  { value: 'Probation', label: 'Thử việc' },
  { value: 'Resigned', label: 'Đã nghỉ' },
];
