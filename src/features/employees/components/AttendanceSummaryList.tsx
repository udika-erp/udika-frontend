import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { MonthlyAttendanceSummary } from '../types';

/**
 * AttendanceStat Component
 * Display a single attendance stat (e.g., Present, Late, Absent, On Leave)
 */
function AttendanceStat({
  value,
  label,
  bgColor,
  textColor,
}: {
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className={`rounded-lg ${bgColor} p-3 text-center`}>
      <p className={`text-lg font-bold ${textColor}`}>{value}</p>
      <p className={`text-xs ${textColor} opacity-75`}>{label}</p>
    </div>
  );
}

function MonthlyAttendanceCard({ summary }: { summary: MonthlyAttendanceSummary }) {
  const getMonthName = (month: number) => {
    const names = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return names[month - 1];
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">
            {getMonthName(summary.month)} {summary.year}
          </h4>
          <p className="text-sm text-gray-600">
            Total working days: <span className="font-medium">{summary.workingDays}</span> days
          </p>
        </div>
      </div>
      <div className="grid gap-2 grid-cols-4">
        <AttendanceStat
          value={summary.present}
          label="Present"
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <AttendanceStat
          value={summary.late}
          label="Late"
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
        />
        <AttendanceStat
          value={summary.absent}
          label="Absent"
          bgColor="bg-red-50"
          textColor="text-red-700"
        />
        <AttendanceStat
          value={summary.onLeave}
          label="On Leave"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
      </div>
    </Card>
  );
}

interface AttendanceSummaryListProps {
  summaries: MonthlyAttendanceSummary[];
  isLoading?: boolean;
}

export function AttendanceSummaryList({
  summaries,
  isLoading,
}: AttendanceSummaryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-600">No attendance data available</p>
      </div>
    );
  }

  // Sort by year and month descending (most recent first)
  const sorted = [...summaries].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  return (
    <div className="space-y-3">
      {sorted.map((summary) => (
        <MonthlyAttendanceCard
          key={`${summary.year}-${summary.month}`}
          summary={summary}
        />
      ))}
    </div>
  );
}
