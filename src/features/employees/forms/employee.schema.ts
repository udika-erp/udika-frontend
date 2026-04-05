import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, 'Tên nhân viên không được để trống'),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  position: z.enum(['Director', 'Manager', 'Supervisor', 'Employee', 'Intern'] as const),
  role: z.enum(['SuperAdmin', 'Admin', 'HR', 'Manager', 'Staff'] as const),
  department: z.enum(['Board', 'HR', 'Sales', 'Marketing', 'Event', 'Accounting', 'Admin'] as const),
  joinDate: z.string().min(1, 'Ngày vào làm không được để trống'),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
