import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, BookOpen, Zap, DollarSign } from 'lucide-react';
import type { EmployeeDetail } from '../types';

interface WorkInfoSectionProps {
  employee: EmployeeDetail;
  isLoading?: boolean;
}

export function WorkInfoSection({ employee, isLoading }: WorkInfoSectionProps) {
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
        <Briefcase className="h-5 w-5 text-green-600" />
        Thông tin công việc
      </h3>
      
      <div className="space-y-6">
        {/* Work Info Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Ngày vào làm</p>
            <p className="text-base font-semibold">{employee.joinDate}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Chức vụ</p>
            <p className="text-base font-semibold">{employee.position}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Phòng ban</p>
            <p className="text-base font-semibold">{employee.department}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Trạng thái</p>
            <p className="text-base font-semibold">{employee.status}</p>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="border-t pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Trình độ học vấn
              </p>
              <p className="text-base font-semibold">{employee.education || 'Chưa cập nhật'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase">Kinh nghiệm làm việc</p>
              <p className="text-base font-semibold">{employee.experience || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {employee.skills && employee.skills.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="mb-4 font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Kỹ năng
            </h4>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Salary */}
        {employee.salary && (
          <div className="border-t pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Lương
              </p>
              <p className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(employee.salary)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
