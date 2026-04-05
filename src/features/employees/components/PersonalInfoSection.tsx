import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Phone, MapPin, Heart } from 'lucide-react';
import type { EmployeeDetail } from '../types';

interface PersonalInfoSectionProps {
  employee: EmployeeDetail;
  isLoading?: boolean;
}

export function PersonalInfoSection({ employee, isLoading }: PersonalInfoSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        Thông tin cá nhân
      </h3>
      
      <div className="grid gap-6">
        {/* Basic Info Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Ngày sinh</p>
            <p className="text-base font-semibold">{employee.dateOfBirth || 'Chưa cập nhật'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Địa chỉ</p>
            <p className="text-base font-semibold flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              {employee.address || 'Chưa cập nhật'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Số điện thoại chính</p>
            <p className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              {employee.phone || 'Chưa cập nhật'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Số điện thoại phụ</p>
            <p className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              {employee.phoneSecondary || 'Chưa cập nhật'}
            </p>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="border-t pt-6">
          <h4 className="mb-4 font-semibold flex items-center gap-2 text-red-600">
            <Heart className="h-5 w-5" />
            Liên hệ khẩn cấp
          </h4>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase">Tên</p>
              <p className="text-base font-semibold">{employee.emergencyContactName || 'Chưa cập nhật'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase">Mối quan hệ</p>
              <p className="text-base font-semibold">{employee.emergencyContactRelationship || 'Chưa cập nhật'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase">Số điện thoại</p>
              <p className="text-base font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {employee.emergencyContactPhone || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
