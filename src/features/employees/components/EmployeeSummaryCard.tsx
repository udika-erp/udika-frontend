import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { EmployeeDetail, EmployeeStats } from '../types';

interface EmployeeSummaryCardProps {
  employee: EmployeeDetail;
  stats: EmployeeStats;
  isLoading?: boolean;
}

export function EmployeeSummaryCard({
  employee,
  stats,
  isLoading,
}: EmployeeSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'OnLeave':
        return 'secondary';
      case 'Inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      Active: 'Đang làm việc',
      OnLeave: 'Tạm nghỉ',
      Inactive: 'Nghỉ việc',
    };
    return labels[status] || status;
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        {/* Left: Avatar & Basic Info */}
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg">
            {getInitials(employee.name)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <p className="text-sm text-gray-600">{employee.position}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant={getStatusBadgeVariant(employee.status)}>
                {getStatusLabel(employee.status)}
              </Badge>
              <Badge variant="outline">{employee.department}</Badge>
            </div>
          </div>
        </div>

        {/* Right: Contact & Stats */}
        <div className="space-y-2 text-right">
          <p className="text-sm text-gray-600">
            <span className="font-medium">SĐT:</span> {employee.phone}
          </p>
          <p className="text-sm text-gray-600 break-all">
            <span className="font-medium">Email:</span> {employee.email}
          </p>
          {employee.dateOfBirth && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Ngày sinh:</span> {employee.dateOfBirth}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.totalEvents}</p>
          <p className="text-xs text-green-600">Sự kiện</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.averageRating.toFixed(1)}</p>
          <p className="text-xs text-blue-600">Đánh giá TB</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{stats.performanceRate}%</p>
          <p className="text-xs text-purple-600">Hiệu suất</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-3 text-center">
          <p className="text-2xl font-bold text-orange-700">{stats.kpiAchievementRate}%</p>
          <p className="text-xs text-orange-600">KPI Đạt</p>
        </div>
      </div>
    </Card>
  );
}
