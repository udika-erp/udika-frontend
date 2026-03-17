import { useState, useEffect } from 'react';
import { KpiCards, kpiPercentage } from '@/features/dashboard/components/KpiCards';
import { RevenueExpenseChart } from '@/features/dashboard/components/RevenueExpenseChart';
import { RecentNotesWidget } from '@/features/dashboard/components/RecentNotesWidget';

const motivationalQuotes = [
  "Thành công là tổng hợp của những nỗ lực nhỏ hàng ngày!",
  "Mỗi sự kiện hoàn hảo bắt đầu từ sự chuẩn bị chu đáo!",
  "Khách hàng hài lòng là thành công lớn nhất của chúng ta!",
  "Hôm nay tốt hơn hôm qua, ngày mai tốt hơn hôm nay!",
  "Đam mê và tận tâm là chìa khóa tạo nên sự kiện đáng nhớ!",
  "Mỗi thử thách là cơ hội để chúng ta phát triển!",
  "Chất lượng không phải là hành động, đó là thói quen!",
  "Sự chuẩn bị tốt là nửa thành công!",
];

const congratulationsMessages = [
  "🎉 Xuất sắc! Bạn đã vượt chỉ tiêu tháng này!",
  "⭐ Tuyệt vời! KPI đã hoàn thành vượt mức!",
  "🏆 Chúc mừng! Thành tích đáng tự hào của tháng này!",
  "💪 Đỉnh cao! Bạn đã làm được điều không tưởng!",
  "🌟 Ấn tượng! Tiếp tục phát huy nhé!",
  "🎊 Hoàn hảo! Đây là kết quả xứng đáng!",
  "✨ Tài năng! Bạn đang tỏa sáng rực rỡ!",
  "🚀 Vượt trội! Tiếp tục bay cao hơn nữa!",
];

export function Dashboard() {
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    const messages = kpiPercentage >= 100 ? congratulationsMessages : motivationalQuotes;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setDisplayMessage(randomMessage);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">
          Chào mừng trở lại! Đây là những gì đang diễn ra với các sự kiện của bạn.
        </p>
      </div>

      <KpiCards />
      <RevenueExpenseChart displayMessage={displayMessage} />
      <RecentNotesWidget />
    </div>
  );
}
