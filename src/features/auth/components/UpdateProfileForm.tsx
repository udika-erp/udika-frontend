import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Loader2 } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '../forms/profile.schema';
import { useUpdateProfile, useUploadAvatar } from '../hooks/use-profile';
import type { Employee } from '../data/type';

interface UpdateProfileFormProps {
  employee: Employee;
  onSuccess?: () => void;
}

/**
 * UpdateProfileForm Component
 * Allows user to edit: name, phone, avatar
 * Read-only display: email, role, department, position
 */
export function UpdateProfileForm({
  employee,
  onSuccess,
}: UpdateProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null | undefined>(
    employee?.avatar
  );

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: employee?.name ?? '',
      phone: employee?.phone ?? undefined,
      avatar: employee?.avatar ?? undefined,
    },
  });

  const onSubmit = async (values: UpdateProfileFormValues) => {
    try {
      await updateProfile.mutateAsync(values);
      onSuccess?.();
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleAvatarSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload to server
    try {
      const result = await uploadAvatar.mutateAsync(file);
      setCurrentAvatar(result.avatarUrl);
      setAvatarPreview(null);
      form.setValue('avatar', result.avatarUrl);
    } catch (error) {
      setAvatarPreview(null);
      console.error('Avatar upload error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ảnh Đại Diện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={avatarPreview || currentAvatar || undefined}
                alt={employee.name}
              />
              <AvatarFallback>
                {employee.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="gap-2"
            >
              {uploadAvatar.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Chọn Ảnh
                </>
              )}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
              disabled={uploadAvatar.isPending}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            📡 Định dạng: JPG, PNG, GIF, WebP | Kích thước tối đa: 2MB
          </p>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông Tin Cá Nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Editable: Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Họ Tên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Read-only: Email */}
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={employee?.email ?? ''}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                  <Badge variant="secondary" className="shrink-0">
                    Khóa
                  </Badge>
                </div>
              </FormItem>

              {/* Editable: Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0912345678"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full"
              >
                {updateProfile.isPending ? 'Đang cập nhật...' : 'Cập Nhật Hồ Sơ'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Read-only Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông Tin Hệ Thống</CardTitle>
          <p className="text-xs text-muted-foreground mt-2">
            Các trường này được quản lý bởi nhân sự hoặc quản trị viên
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              CHỨC VỤ
            </p>
            <p className="text-sm font-medium mt-1">{employee?.position ?? 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              PHÒNG BAN
            </p>
            <p className="text-sm font-medium mt-1">{employee?.department ?? 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              VAI TRÒ HỆ THỐNG
            </p>
            <Badge variant="outline" className="mt-1">
              {employee?.role ?? 'Unknown'}
            </Badge>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              TRẠNG THÁI
            </p>
            <Badge variant="outline" className="mt-1">
              {employee?.status ?? 'Unknown'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
