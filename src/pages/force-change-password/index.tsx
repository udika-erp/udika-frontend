import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Loader2, AlertCircle } from 'lucide-react';
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
import { forceChangePasswordSchema, type ForceChangePasswordFormValues } from '@/features/auth/forms/profile.schema';
import { useForceChangePassword } from '@/features/auth/hooks/use-profile';

/**
 * ForceChangePassword Page Component
 * URL: /force-change-password
 * Displayed when: Admin resets password or user first login
 * No current password verification required
 */
export default function ForceChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const [requirementsMet, setRequirementsMet] = useState(false);

  const forceChangePassword = useForceChangePassword();

  const form = useForm<ForceChangePasswordFormValues>({
    resolver: zodResolver(forceChangePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch password field to check requirements
  const newPassword = form.watch('newPassword');
  useEffect(() => {
    if (newPassword) {
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasMinLength = newPassword.length >= 8;

      setRequirementsMet(hasUppercase && hasLowercase && hasNumber && hasMinLength);
    } else {
      setRequirementsMet(false);
    }
  }, [newPassword]);

  const onSubmit = async (values: ForceChangePasswordFormValues) => {
    try {
      await forceChangePassword.mutateAsync(values.newPassword);
    } catch (error) {
      console.error('Force change password error:', error);
    }
  };

  const reason = searchParams.get('reason') || 'request';
  const reasonText = reason === 'first-login' 
    ? 'Đây là lần đầu tiên bạn đăng nhập. Vui lòng đặt mật khẩu mới để tiếp tục.'
    : 'Quản trị viên yêu cầu bạn thay đổi mật khẩu. Vui lòng đặt mật khẩu mới.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Đặt Mật Khẩu Mới</CardTitle>
          <Alert className="bg-amber-50 border-amber-200 mt-4">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-700 ml-2">
              {reasonText}
            </AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Password Requirements */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  📋 YÊU CẦU MẬT KHẨU:
                </p>
                <div className="space-y-1 text-xs">
                  <p className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                    {newPassword.length >= 8 ? '✓' : '○'} Ít nhất 8 ký tự
                  </p>
                  <p className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '○'} Chứa chữ in hoa (A-Z)
                  </p>
                  <p className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    {/[a-z]/.test(newPassword) ? '✓' : '○'} Chứa chữ thường (a-z)
                  </p>
                  <p className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    {/[0-9]/.test(newPassword) ? '✓' : '○'} Chứa số (0-9)
                  </p>
                </div>
              </div>

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
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={forceChangePassword.isPending || !requirementsMet}
                className="w-full"
              >
                {forceChangePassword.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt Mật Khẩu'
                )}
              </Button>

              {/* Info text */}
              <p className="text-xs text-center text-gray-500">
                Sau khi đặt mật khẩu, bạn sẽ được chuyển hướng đến dashboard.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
