import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { UpdateProfileForm } from '@/features/auth/components/UpdateProfileForm';

/**
 * Profile Page Component
 * URL: /profile
 * Displays: Editable profile form + read-only system information
 */
export default function ProfilePage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Hồ Sơ Cá Nhân</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin tài khoản và cài đặt bảo mật
        </p>
      </div>

      <UpdateProfileForm
        employee={employee}
        onSuccess={() => {
          // Form automatically handles success state
        }}
      />
    </div>
  );
}
