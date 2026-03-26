import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../forms/profile.schema';
import { useChangePassword } from '../hooks/use-profile';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

/**
 * ChangePasswordForm Component
 * Allows user to change their password with validation:
 * - Current password verification
 * - Password complexity rules (8+ chars, uppercase, lowercase, number)
 * - Confirm password match
 */
export function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const changePassword = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Change password error:', error);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Đổi Mật Khẩu</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Thay đổi mật khẩu của bạn để bảo vệ tài khoản
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Password Requirements Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-700 ml-2">
                Mật khẩu phải chứa ít nhất 8 ký tự: Chữ in hoa, chữ thường, và
                số
              </AlertDescription>
            </Alert>

            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật Khẩu Hiện Tại <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật Khẩu Mới <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Xác Nhận Mật Khẩu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Success Alert */}
            {changePassword.isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-700 ml-2">
                  Mật khẩu của bạn đã được thay đổi thành công. Vui lòng đăng
                  nhập lại.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="w-full"
            >
              {changePassword.isPending ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
