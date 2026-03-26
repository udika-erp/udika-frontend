import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';

/**
 * ChangePassword Page Component
 * URL: /change-password
 * Displays: Self-service password change form
 * Note: User must be authenticated to access this page
 */
export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { employee } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!employee) {
      navigate('/login', { replace: true });
    }
  }, [employee, navigate]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Đổi Mật Khẩu</h1>
        <p className="text-muted-foreground mt-2">
          Cập nhật mật khẩu của bạn để bảo vệ tài khoản
        </p>
      </div>

      <ChangePasswordForm
        onSuccess={() => {
          // Form automatically handles success and redirect
        }}
      />
    </div>
  );
}
