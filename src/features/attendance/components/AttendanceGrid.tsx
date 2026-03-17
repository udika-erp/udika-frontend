import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAttendanceFilters } from '../hooks/useAttendanceFilters';

interface LeaveRequest {
  id: number;
  employee: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

interface OvertimeRequest {
  id: number;
  employee: string;
  date: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  { id: 1, employee: 'Nguyễn Văn A', startDate: '2026-03-20', endDate: '2026-03-22', reason: 'Nghỉ phép thăm gia đình', status: 'approved', submittedDate: '2026-03-10' },
  { id: 2, employee: 'Trần Thị B', startDate: '2026-03-25', endDate: '2026-03-26', reason: 'Nghỉ ốm', status: 'pending', submittedDate: '2026-03-15' },
  { id: 3, employee: 'Lê Văn C', startDate: '2026-04-01', endDate: '2026-04-03', reason: 'Nghỉ việc cá nhân', status: 'pending', submittedDate: '2026-03-16' },
];

const mockOvertimeRequests: OvertimeRequest[] = [
  { id: 1, employee: 'Nguyễn Văn A', date: '2026-03-20', hours: 2, reason: 'Làm thêm giờ để hoàn thành dự án', status: 'approved', submittedDate: '2026-03-10' },
  { id: 2, employee: 'Trần Thị B', date: '2026-03-25', hours: 3, reason: 'Làm thêm giờ để hoàn thành sự kiện', status: 'pending', submittedDate: '2026-03-15' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800 border-green-300';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'approved': return 'Đã duyệt';
    case 'pending': return 'Chờ phê duyệt';
    case 'rejected': return 'Từ chối';
    default: return status;
  }
};

export function AttendanceGrid() {
  const {
    currentDate,
    selectedDates,
    handlePreviousMonth,
    handleNextMonth,
    getDaysInMonthInfo,
    isDateSelected,
    isPastDate,
    toggleDate,
  } = useAttendanceFilters();

  const { daysInMonth, startingDayOfWeek } = getDaysInMonthInfo(currentDate);

  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [overtimeRequests, setOvertimeRequests] = useState(mockOvertimeRequests);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [overtimeDialogOpen, setOvertimeDialogOpen] = useState(false);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState<LeaveRequest | null>(null);
  const [editingOvertimeRequest, setEditingOvertimeRequest] = useState<OvertimeRequest | null>(null);
  const [newLeaveRequest, setNewLeaveRequest] = useState({ employee: '', startDate: '', endDate: '', reason: '', status: 'pending' as const });
  const [newOvertimeRequest, setNewOvertimeRequest] = useState({ employee: '', date: '', hours: 0, reason: '', status: 'pending' as const });

  const handleDateClick = (day: number) => {
    const added = toggleDate(day);
    if (added === false) {
      toast.error('Không thể chấm công ngày trong quá khứ');
    } else if (added) {
      toast.success('Chấm công OK');
    }
  };

  const isToday = (day: number) =>
    day === new Date().getDate() &&
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  const handleAddLeaveRequest = () => {
    if (!newLeaveRequest.employee || !newLeaveRequest.startDate || !newLeaveRequest.endDate) return;
    const newId = Math.max(...leaveRequests.map((r) => r.id), 0) + 1;
    setLeaveRequests([...leaveRequests, { id: newId, ...newLeaveRequest, submittedDate: new Date().toISOString().split('T')[0] }]);
    setNewLeaveRequest({ employee: '', startDate: '', endDate: '', reason: '', status: 'pending' });
    setLeaveDialogOpen(false);
    toast.success('Đã tạo đơn xin nghỉ');
  };

  const handleEditLeaveRequest = () => {
    if (!editingLeaveRequest) return;
    setLeaveRequests(leaveRequests.map((req) => req.id === editingLeaveRequest.id ? editingLeaveRequest : req));
    setEditingLeaveRequest(null);
    setLeaveDialogOpen(false);
    toast.success('Đã cập nhật đơn xin nghỉ');
  };

  const handleDeleteLeaveRequest = (id: number) => {
    setLeaveRequests(leaveRequests.filter((req) => req.id !== id));
    toast.success('Đã xóa đơn xin nghỉ');
  };

  const openEditLeaveDialog = (request: LeaveRequest) => {
    if (request.status === 'approved') { toast.error('Không thể chỉnh sửa đơn đã duyệt'); return; }
    setEditingLeaveRequest({ ...request });
    setLeaveDialogOpen(true);
  };

  const openAddLeaveDialog = () => {
    setEditingLeaveRequest(null);
    setNewLeaveRequest({ employee: '', startDate: '', endDate: '', reason: '', status: 'pending' });
    setLeaveDialogOpen(true);
  };

  const handleAddOvertimeRequest = () => {
    if (!newOvertimeRequest.employee || !newOvertimeRequest.date || !newOvertimeRequest.hours) return;
    const newId = Math.max(...overtimeRequests.map((r) => r.id), 0) + 1;
    setOvertimeRequests([...overtimeRequests, { id: newId, ...newOvertimeRequest, submittedDate: new Date().toISOString().split('T')[0] }]);
    setNewOvertimeRequest({ employee: '', date: '', hours: 0, reason: '', status: 'pending' });
    setOvertimeDialogOpen(false);
    toast.success('Đã tạo đơn bổ sung công');
  };

  const handleEditOvertimeRequest = () => {
    if (!editingOvertimeRequest) return;
    setOvertimeRequests(overtimeRequests.map((req) => req.id === editingOvertimeRequest.id ? editingOvertimeRequest : req));
    setEditingOvertimeRequest(null);
    setOvertimeDialogOpen(false);
    toast.success('Đã cập nhật đơn bổ sung công');
  };

  const handleDeleteOvertimeRequest = (id: number) => {
    setOvertimeRequests(overtimeRequests.filter((req) => req.id !== id));
    toast.success('Đã xóa đơn bổ sung công');
  };

  const openEditOvertimeDialog = (request: OvertimeRequest) => {
    if (request.status === 'approved') { toast.error('Không thể chỉnh sửa đơn đã duyệt'); return; }
    setEditingOvertimeRequest({ ...request });
    setOvertimeDialogOpen(true);
  };

  const openAddOvertimeDialog = () => {
    setEditingOvertimeRequest(null);
    setNewOvertimeRequest({ employee: '', date: '', hours: 0, reason: '', status: 'pending' });
    setOvertimeDialogOpen(true);
  };

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chấm công</h1>
        <p className="text-gray-600 mt-1">Quản lý chấm công và đơn xin nghỉ</p>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              Lịch chấm công
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[150px] text-center">
                Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
              </span>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isSelected = isDateSelected(day);
              const isPast = isPastDate(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                  className={`aspect-square rounded-lg border-2 transition-all relative flex items-center justify-center ${
                    isPast ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                  } ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${today ? 'font-bold' : ''}`}
                >
                  <span className={`text-sm ${today ? 'text-red-600' : ''}`}>{day}</span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">{selectedDates.size}</span> ngày đã chấm công
          </div>
        </CardContent>
      </Card>

      {/* Leave and Overtime Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Đơn xin nghỉ
              </CardTitle>
              <Button size="sm" onClick={openAddLeaveDialog} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-1" />
                Tạo đơn nghỉ
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <div key={request.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{request.employee}</h3>
                      <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      {new Date(request.startDate).toLocaleDateString('vi-VN')} - {new Date(request.endDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-700">{request.reason}</p>
                    <p className="text-xs text-gray-500 mt-2">Gửi ngày: {new Date(request.submittedDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditLeaveDialog(request)} disabled={request.status === 'approved'}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLeaveRequest(request.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {leaveRequests.length === 0 && (
              <div className="text-center py-12 text-gray-500">Chưa có đơn xin nghỉ nào</div>
            )}
          </CardContent>
        </Card>

        {/* Overtime Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Bổ sung công
              </CardTitle>
              <Button size="sm" onClick={openAddOvertimeDialog} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-1" />
                Tạo đơn bổ sung
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overtimeRequests.map((request) => (
                <div key={request.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{request.employee}</h3>
                      <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      {new Date(request.date).toLocaleDateString('vi-VN')} - {request.hours} giờ
                    </p>
                    <p className="text-sm text-gray-700">{request.reason}</p>
                    <p className="text-xs text-gray-500 mt-2">Gửi ngày: {new Date(request.submittedDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditOvertimeDialog(request)} disabled={request.status === 'approved'}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteOvertimeRequest(request.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {overtimeRequests.length === 0 && (
              <div className="text-center py-12 text-gray-500">Chưa có đơn bổ sung công nào</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Dialog */}
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingLeaveRequest ? 'Chỉnh sửa đơn nghỉ' : 'Tạo đơn nghỉ'}</DialogTitle>
            <DialogDescription>{editingLeaveRequest ? 'Cập nhật thông tin đơn xin nghỉ' : 'Tạo đơn xin nghỉ mới'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Nhân viên</Label>
              <Input
                id="employee"
                value={editingLeaveRequest ? editingLeaveRequest.employee : newLeaveRequest.employee}
                onChange={(e) => editingLeaveRequest ? setEditingLeaveRequest({ ...editingLeaveRequest, employee: e.target.value }) : setNewLeaveRequest({ ...newLeaveRequest, employee: e.target.value })}
                placeholder="Nhập tên nhân viên"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Từ ngày</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editingLeaveRequest ? editingLeaveRequest.startDate : newLeaveRequest.startDate}
                  onChange={(e) => editingLeaveRequest ? setEditingLeaveRequest({ ...editingLeaveRequest, startDate: e.target.value }) : setNewLeaveRequest({ ...newLeaveRequest, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Đến ngày</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editingLeaveRequest ? editingLeaveRequest.endDate : newLeaveRequest.endDate}
                  onChange={(e) => editingLeaveRequest ? setEditingLeaveRequest({ ...editingLeaveRequest, endDate: e.target.value }) : setNewLeaveRequest({ ...newLeaveRequest, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Lý do nghỉ</Label>
              <Textarea
                id="reason"
                value={editingLeaveRequest ? editingLeaveRequest.reason : newLeaveRequest.reason}
                onChange={(e) => editingLeaveRequest ? setEditingLeaveRequest({ ...editingLeaveRequest, reason: e.target.value }) : setNewLeaveRequest({ ...newLeaveRequest, reason: e.target.value })}
                placeholder="Nhập lý do xin nghỉ"
                rows={3}
              />
            </div>
            {editingLeaveRequest && (
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={editingLeaveRequest.status}
                  onValueChange={(value: 'pending' | 'approved' | 'rejected') => setEditingLeaveRequest({ ...editingLeaveRequest, status: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ phê duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setLeaveDialogOpen(false); setEditingLeaveRequest(null); }}>Hủy bỏ</Button>
            <Button type="button" className="bg-indigo-600 hover:bg-indigo-700" onClick={editingLeaveRequest ? handleEditLeaveRequest : handleAddLeaveRequest}>
              {editingLeaveRequest ? 'Cập nhật' : 'Tạo đơn'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Overtime Request Dialog */}
      <Dialog open={overtimeDialogOpen} onOpenChange={setOvertimeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingOvertimeRequest ? 'Chỉnh sửa đơn bổ sung công' : 'Tạo đơn bổ sung công'}</DialogTitle>
            <DialogDescription>{editingOvertimeRequest ? 'Cập nhật thông tin đơn bổ sung công' : 'Tạo đơn bổ sung công mới'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overtimeEmployee">Nhân viên</Label>
              <Input
                id="overtimeEmployee"
                value={editingOvertimeRequest ? editingOvertimeRequest.employee : newOvertimeRequest.employee}
                onChange={(e) => editingOvertimeRequest ? setEditingOvertimeRequest({ ...editingOvertimeRequest, employee: e.target.value }) : setNewOvertimeRequest({ ...newOvertimeRequest, employee: e.target.value })}
                placeholder="Nhập tên nhân viên"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overtimeDate">Ngày</Label>
                <Input
                  id="overtimeDate"
                  type="date"
                  value={editingOvertimeRequest ? editingOvertimeRequest.date : newOvertimeRequest.date}
                  onChange={(e) => editingOvertimeRequest ? setEditingOvertimeRequest({ ...editingOvertimeRequest, date: e.target.value }) : setNewOvertimeRequest({ ...newOvertimeRequest, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Số giờ</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={editingOvertimeRequest ? editingOvertimeRequest.hours : newOvertimeRequest.hours}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    editingOvertimeRequest ? setEditingOvertimeRequest({ ...editingOvertimeRequest, hours: val }) : setNewOvertimeRequest({ ...newOvertimeRequest, hours: val });
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overtimeReason">Lý do</Label>
              <Textarea
                id="overtimeReason"
                value={editingOvertimeRequest ? editingOvertimeRequest.reason : newOvertimeRequest.reason}
                onChange={(e) => editingOvertimeRequest ? setEditingOvertimeRequest({ ...editingOvertimeRequest, reason: e.target.value }) : setNewOvertimeRequest({ ...newOvertimeRequest, reason: e.target.value })}
                placeholder="Nhập lý do bổ sung công"
                rows={3}
              />
            </div>
            {editingOvertimeRequest && (
              <div className="space-y-2">
                <Label htmlFor="overtimeStatus">Trạng thái</Label>
                <Select
                  value={editingOvertimeRequest.status}
                  onValueChange={(value: 'pending' | 'approved' | 'rejected') => setEditingOvertimeRequest({ ...editingOvertimeRequest, status: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ phê duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setOvertimeDialogOpen(false); setEditingOvertimeRequest(null); }}>Hủy bỏ</Button>
            <Button type="button" className="bg-purple-600 hover:bg-purple-700" onClick={editingOvertimeRequest ? handleEditOvertimeRequest : handleAddOvertimeRequest}>
              {editingOvertimeRequest ? 'Cập nhật' : 'Tạo đơn'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
