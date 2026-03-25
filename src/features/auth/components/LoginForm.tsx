import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormValues } from '../forms/login.schema';
import { useLogin } from '../hooks/use-login';
import type { NormalizedError } from '@/lib/error-messages';

export function LoginForm() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    form.clearErrors();
    login.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Chào mừng đến với EventERP</CardTitle>
          <CardDescription>
            Đăng nhập để quản lý sự kiện và khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@eventco.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={login.isPending}
              >
                {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </Form>

          {login.isError && (
            <div className="mt-4 rounded-md bg-destructive/10 text-destructive text-sm px-4 py-3">
              {(() => {
                const err = login.error as NormalizedError;
                switch (err?.code) {
                  case 'AUTH_INVALID_CREDENTIALS':
                    return 'Email hoặc mật khẩu không đúng';
                  case 'AUTH_RATE_LIMIT_EXCEEDED':
                    return 'Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau';
                  case 'AUTH_ACCOUNT_DISABLED':
                    return 'Tài khoản đã bị vô hiệu hóa. Liên hệ quản trị viên';
                  case 'AUTH_ACCOUNT_RESIGNED':
                    return 'Tài khoản đã nghỉ việc';
                  case 'NETWORK_ERROR':
                    return 'Không thể kết nối đến server. Kiểm tra kết nối mạng';
                  default:
                    return err?.message ?? 'Đăng nhập thất bại';
                }
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
