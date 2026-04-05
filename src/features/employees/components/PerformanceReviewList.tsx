import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { PerformanceReview } from '../types';

function PerformanceReviewCard({
  review,
  onDelete,
}: {
  review: PerformanceReview;
  onDelete?: (reviewId: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const kpiPercentage = review.kpiTotal > 0 ? (review.kpiAchieved / review.kpiTotal) * 100 : 0;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{review.period}</h4>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{review.score.toFixed(1)}</p>
              <p className="text-xs text-gray-500">/5.0</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Ngày đánh giá: {review.reviewDate}</p>

          {/* KPI Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>KPI</span>
              <span className="font-medium">
                {review.kpiAchieved}/{review.kpiTotal} ({Math.round(kpiPercentage)}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${kpiPercentage}%` }}
              />
            </div>
          </div>

          {/* Expandable Details */}
          {expanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {/* Strengths */}
              {review.strengths.length > 0 && (
                <div>
                  <h5 className="mb-2 flex items-center gap-2 font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Điểm mạnh
                  </h5>
                  <ul className="space-y-1 text-sm">
                    {review.strengths.map((strength, idx) => (
                      <li key={idx} className="text-gray-700">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {review.improvements.length > 0 && (
                <div>
                  <h5 className="mb-2 flex items-center gap-2 font-medium text-orange-700">
                    <AlertCircle className="h-4 w-4" />
                    Cần cải thiện
                  </h5>
                  <ul className="space-y-1 text-sm">
                    {review.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-gray-700">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comment */}
              {review.comment && (
                <div>
                  <h5 className="mb-2 font-medium">Nhận xét</h5>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              )}

              {/* Reviewer Info */}
              {review.reviewerName && (
                <div className="border-t pt-3 text-xs text-gray-600">
                  <p>
                    <span className="font-medium">Người đánh giá:</span> {review.reviewerName}
                    {review.reviewerTitle && ` (${review.reviewerTitle})`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ml-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Thu gọn' : 'Chi tiết'}
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(review.id)}
            >
              Xóa
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

interface PerformanceReviewListProps {
  reviews: PerformanceReview[];
  isLoading?: boolean;
  onDelete?: (reviewId: string) => void;
}

export function PerformanceReviewList({
  reviews,
  isLoading,
  onDelete,
}: PerformanceReviewListProps) {
  const [showForm, setShowForm] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Đánh giá hiệu suất</h3>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hủy' : 'Thêm đánh giá'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-gray-600">
            Form tạo đánh giá sẽ được hiển thị ở đây
          </p>
        </Card>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-600">Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <PerformanceReviewCard
              key={review.id}
              review={review}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
