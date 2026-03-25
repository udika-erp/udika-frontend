import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { profileService } from '../service/profile.service';
import { useAuthStore } from '@/store/auth.store';
import { useAppToast } from '@/hooks/use-app-toast';
import { queryClient } from '@/providers/query-provider';
import type { UpdateProfileRequest, UpdateProfileResponse } from '../data/type';
import type { NormalizedError } from '@/lib/error-messages';

/**
 * Hook to update user profile (name, phone, avatar)
 * Mutates only editable fields
 * Updates auth store on success
 */
export function useUpdateProfile() {
  const toast = useAppToast();
  const setEmployee = useAuthStore((state) => state.setEmployee);

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return await profileService.updateProfile(data);
    },

    onSuccess: (updatedProfile: UpdateProfileResponse) => {
      // Update auth store with new profile
      setEmployee(updatedProfile);

      // Invalidate any profile-related queries
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });

      toast.success('Cập nhật hồ sơ thành công!');
    },

    onError: (error: NormalizedError) => {
      toast.error(error.message || 'Cập nhật hồ sơ thất bại');
    },
  });
}

/**
 * Hook to upload avatar image
 * Validates file before upload
 * Returns avatar URL on success
 */
export function useUploadAvatar() {
  const toast = useAppToast();

  return useMutation({
    mutationFn: async (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Vui lòng chọn một file hình ảnh (JPG, PNG, GIF, WebP)');
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        throw new Error('Kích thước hình ảnh không được vượt quá 2MB');
      }

      return await profileService.uploadAvatar(file);
    },

    onSuccess: (response) => {
      toast.success('Tải ảnh đại diện lên thành công!');
      return response;
    },

    onError: (error: Error | NormalizedError) => {
      const message = error instanceof Error ? error.message : (error as NormalizedError).message;
      toast.error(message);
    },
  });
}

/**
 * Hook to change password (self-service)
 * Requires current password verification
 * Logout user after success (requires re-login)
 */
export function useChangePassword() {
  const toast = useAppToast();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return await profileService.changePassword(data);
    },

    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!');

      // Clear auth and redirect to login (user must re-login)
      setTimeout(() => {
        clearAuth();
        navigate('/login');
      }, 1500);
    },

    onError: (error: NormalizedError) => {
      if (error.message.includes('hiện tại')) {
        toast.error('Mật khẩu hiện tại không chính xác');
      } else {
        toast.error(error.message || 'Đổi mật khẩu thất bại');
      }
    },
  });
}

/**
 * Hook to force change password (admin reset or first login)
 * Does NOT require current password
 * Updates auth store if applicable
 */
export function useForceChangePassword() {
  const toast = useAppToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newPassword: string) => {
      return await profileService.forceChangePassword({ newPassword });
    },

    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!');

      // Redirect to dashboard or appropriate page
      setTimeout(() => {
        navigate('/');
      }, 1500);
    },

    onError: (error: NormalizedError) => {
      toast.error(error.message || 'Đổi mật khẩu thất bại');
    },
  });
}
