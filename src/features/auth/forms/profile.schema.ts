import { z } from 'zod';

/**
 * ==================== Profile Update Schema ====================
 * Validates editable profile fields
 * Editable: name (required), phone (optional), avatar (optional)
 * Read-only: email, role, department, position
 */

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập họ tên')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .trim(),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || /^[0-9\s+\-()]*$/.test(value),
      'Số điện thoại không hợp lệ'
    )
    .refine(
      (value) => !value || value.length >= 10,
      'Số điện thoại phải có ít nhất 10 ký tự'
    ),
  avatar: z
    .string()
    .optional()
    .nullable(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

/**
 * ==================== Change Password Schema ====================
 * Validates password change with current password verification
 * Rules:
 * - Min 8 characters
 * - Must contain: uppercase, lowercase, number
 * - confirmPassword must match newPassword
 */

const passwordRequirement = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ in hoa')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số');

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: passwordRequirement,
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác với mật khẩu hiện tại',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * ==================== Force Change Password Schema ====================
 * Validates password change WITHOUT current password verification
 * Used when admin resets password or during forced password change
 */

export const forceChangePasswordSchema = z
  .object({
    newPassword: passwordRequirement,
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ForceChangePasswordFormValues = z.infer<typeof forceChangePasswordSchema>;
