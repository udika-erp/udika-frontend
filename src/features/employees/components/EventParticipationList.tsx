import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import type { EventParticipation } from '../types';

function EventParticipationCard({ participation }: { participation: EventParticipation }) {
  const getEventStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      Planned: 'secondary',
      InProgress: 'default',
      Completed: 'default',
      Cancelled: 'destructive',
    };
    const labels: Record<string, string> = {
      Planned: 'Lên kế hoạch',
      InProgress: 'Đang diễn ra',
      Completed: 'Hoàn thành',
      Cancelled: 'Hủy',
    };
    return { variant: variants[status] || 'outline', label: labels[status] || status };
  };

  const statusBadge = getEventStatusBadge(participation.eventStatus);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{participation.eventName}</h4>
          <p className="text-sm text-gray-600">{participation.eventCode}</p>
          <p className="mt-2 text-sm">
            <span className="font-medium">Vai trò:</span> {participation.role}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Ngày:</span> {participation.eventDate}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Badge variant={statusBadge.variant as any}>{statusBadge.label}</Badge>
          {participation.rating ? (
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(participation.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
            </div>
          ) : (
            <span className="text-xs text-gray-500">Chưa đánh giá</span>
          )}
        </div>
      </div>
    </Card>
  );
}

interface EventParticipationListProps {
  participations: EventParticipation[];
  total: number;
  isLoading?: boolean;
}

export function EventParticipationList({
  participations,
  total,
  isLoading,
}: EventParticipationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-600">Chưa có sự kiện nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {participations.map((p) => (
        <EventParticipationCard key={p.id} participation={p} />
      ))}
      <p className="mt-4 text-center text-sm text-gray-600">
        Hiển thị 1-{participations.length} trên {total} sự kiện
      </p>
    </div>
  );
}
