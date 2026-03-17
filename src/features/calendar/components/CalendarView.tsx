import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormDialog } from '@/components/modal';
import { CalendarEventForm } from './CalendarEventForm';
import type { CalendarEventFormValues } from '../forms/calendar-event.schema';

interface CalendarEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  type: 'wedding' | 'corporate' | 'birthday' | 'charity' | 'meeting';
  color: string;
}

interface DailyReport {
  id: number;
  userName: string;
  userAvatar: string;
  yesterday: string;
  today: string;
  difficulties: string;
}

const mockCalendarEvents: CalendarEvent[] = [
  { id: 1, name: 'Johnson Wedding', date: '2026-02-28', time: '14:00', type: 'wedding', color: 'bg-pink-500' },
  { id: 2, name: 'Venue Site Visit', date: '2026-02-24', time: '10:00', type: 'meeting', color: 'bg-gray-500' },
  { id: 3, name: 'Tech Corp Gala', date: '2026-03-05', time: '18:00', type: 'corporate', color: 'bg-blue-500' },
  { id: 4, name: 'Client Meeting', date: '2026-02-25', time: '15:00', type: 'meeting', color: 'bg-gray-500' },
  { id: 5, name: 'Smith Birthday', date: '2026-03-10', time: '19:00', type: 'birthday', color: 'bg-green-500' },
  { id: 6, name: 'Catering Tasting', date: '2026-02-26', time: '12:00', type: 'meeting', color: 'bg-gray-500' },
];

const mockDailyReports: DailyReport[] = [
  { id: 1, userName: 'Nguyễn Văn An', userAvatar: 'NVA', yesterday: 'Tele sale cho khách', today: 'Tìm địa điểm phù hợp', difficulties: 'Cần địa điểm mới khách chưa đi trong phạm vi 20km' },
  { id: 2, userName: 'Trần Thị Bình', userAvatar: 'TTB', yesterday: 'Khảo sát địa điểm tổ chức sự kiện', today: 'Gặp khách hàng báo giá', difficulties: 'Khách yêu cầu giảm giá 15%' },
  { id: 3, userName: 'Lê Minh Cường', userAvatar: 'LMC', yesterday: 'Hoàn thiện hợp đồng sự kiện', today: 'Liên hệ nhà cung cấp thiết bị âm thanh', difficulties: 'Thiết bị chất lượng cao vượt ngân sách' },
  { id: 4, userName: 'Phạm Thu Hà', userAvatar: 'PTH', yesterday: 'Tư vấn gói tiệc cưới cho khách', today: 'Thực hiện báo cáo doanh thu tuần', difficulties: 'Không' },
  { id: 5, userName: 'Hoàng Đức Khải', userAvatar: 'HDK', yesterday: 'Kiểm tra tiến độ sự kiện công ty', today: 'Điều phối đội ngũ setup sự kiện', difficulties: 'Thiếu 2 nhân viên do ốm' },
  { id: 6, userName: 'Võ Thị Mai', userAvatar: 'VTM', yesterday: 'Chốt đơn hàng sinh nhật', today: 'Follow up khách hàng tiềm năng', difficulties: 'Khách chưa trả lời email' },
];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function CalendarView() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [addOpen, setAddOpen] = useState(false);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getEventsForDate = (dateStr: string) =>
    mockCalendarEvents.filter((event) => event.date === dateStr);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const isToday = (day: number) =>
    day === 22 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026;

  const handleAddSubmit = (_values: CalendarEventFormValues) => {
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý lịch sự kiện</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm sự kiện
        </Button>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {days.map((day) => {
              const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDate(dateStr);

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                    isToday(day) ? 'bg-indigo-50 border-indigo-500' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className={`text-xs text-white px-1 py-0.5 rounded truncate ${event.color}`}>
                        {event.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                    )}
                  </div>

                  {dayEvents.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="space-y-3">
                        <div className="font-semibold text-gray-900 border-b pb-2">
                          {new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-3 hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            <div className={`w-3 h-3 rounded-full ${event.color} mt-1 flex-shrink-0`} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{event.name}</p>
                              <p className="text-sm text-gray-600 mt-0.5">{event.time}</p>
                              <Badge variant="secondary" className="mt-1 text-xs capitalize">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event Type Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Loại sự kiện</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { color: 'bg-pink-500', label: 'Wedding' },
                { color: 'bg-blue-500', label: 'Corporate' },
                { color: 'bg-green-500', label: 'Birthday' },
                { color: 'bg-purple-500', label: 'Charity' },
                { color: 'bg-gray-500', label: 'Meeting' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${color} rounded`} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Reports Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo hàng ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDailyReports.map((report) => (
              <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-semibold text-sm">{report.userAvatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{report.userName}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Hôm qua</p>
                    <p className="text-sm text-gray-700">{report.yesterday}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Hôm nay</p>
                    <p className="text-sm text-gray-700">{report.today}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Khó khăn</p>
                    <p className={`text-sm ${report.difficulties === 'Không' ? 'text-green-600 font-medium' : 'text-red-600'}`}>
                      {report.difficulties}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <FormDialog open={addOpen} onOpenChange={setAddOpen} title="Thêm sự kiện">
        <CalendarEventForm onSubmit={handleAddSubmit} onCancel={() => setAddOpen(false)} />
      </FormDialog>
    </div>
  );
}
