import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Target, Star, Clock } from 'lucide-react';
import type { EmployeeStats } from '../types';

/**
 * StatCard Component
 * Display a single performance stat with icon and label
 */
function StatCard({
  icon: Icon,
  value,
  label,
  bgColor,
  textColor,
  iconColor,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}) {
  return (
    <div className={`rounded-lg ${bgColor} p-4 space-y-2`}>
      <div className="flex items-center justify-between">
        <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
        <span className={`${iconColor}`}>{Icon}</span>
      </div>
      <p className={`text-xs font-medium ${textColor} opacity-75 uppercase`}>{label}</p>
    </div>
  );
}

interface PerformanceSummarySectionProps {
  stats: EmployeeStats;
  isLoading?: boolean;
}

export function PerformanceSummarySection({
  stats,
  isLoading,
}: PerformanceSummarySectionProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold">Performance Summary</h3>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          value={stats.totalEventsCompleted}
          label="Events Completed"
          bgColor="bg-green-50"
          textColor="text-green-700"
          iconColor="text-green-400"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          value={`${stats.kpiAchievementRate}%`}
          label="KPI Achievement Rate"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
          iconColor="text-blue-400"
        />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          value={stats.averageRating.toFixed(1)}
          label="Average Rating"
          bgColor="bg-purple-50"
          textColor="text-purple-700"
          iconColor="text-purple-400"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          value={`${stats.attendanceRate}%`}
          label="Attendance Rate"
          bgColor="bg-orange-50"
          textColor="text-orange-700"
          iconColor="text-orange-400"
        />
      </div>
    </Card>
  );
}
