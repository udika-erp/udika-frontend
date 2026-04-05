import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, MessageCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormDialog } from '@/components/modal';
import {
  useEmployeeDetailPage,
  useEmployeeWorkHistory,
  useEmployeeAttendance,
  useEmployeeReviews,
  useEmployeeNotes,
} from '@/features/employees/hooks';
import { useDeleteEmployee } from '@/features/employees/hooks';
import { EmployeeForm } from '@/features/employees/components/EmployeeForm';
import { PersonalInfoSection } from '@/features/employees/components/PersonalInfoSection';
import { WorkInfoSection } from '@/features/employees/components/WorkInfoSection';
import { EventParticipationList } from '@/features/employees/components/EventParticipationList';
import { AttendanceSummaryList } from '@/features/employees/components/AttendanceSummaryList';
import { PerformanceReviewList } from '@/features/employees/components/PerformanceReviewList';
import { EmployeeNoteList } from '@/features/employees/components/EmployeeNoteList';

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'history' | 'attendance' | 'reviews' | 'notes'>(
    'overview',
  );
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  // Queries
  const employeeQuery = useEmployeeDetailPage(id || '', activeTab === 'overview');
  const workHistoryQuery = useEmployeeWorkHistory(id || '', 1, 10, activeTab === 'history');
  const attendanceQuery = useEmployeeAttendance(id || '', undefined, activeTab === 'attendance');
  const reviewsQuery = useEmployeeReviews(id || '', 1, 10, activeTab === 'reviews');
  const notesQuery = useEmployeeNotes(id || '', 1, 10, activeTab === 'notes');

  // Mutations
  const { mutate: deleteEmployee } = useDeleteEmployee();

  const employee = employeeQuery.data;
  const isLoading = employeeQuery.isLoading || !id;
  const isError = employeeQuery.isError;

  // Handle errors
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Lỗi</h1>
          <p className="text-gray-600 mb-4">Không thể tải thông tin nhân viên</p>
          <Button onClick={() => navigate('/employees')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy nhân viên</h1>
          <Button onClick={() => navigate('/employees')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const handleDeleteEmployee = () => {
    if (confirm('Bạn chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.')) {
      deleteEmployee(employee.id);
      // Navigation sẽ được xử lý bởi hook toast + refetch
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    }
  };

  const handleEditSubmit = () => {
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/employees')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-sm text-gray-600">{employee.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              // TODO: Implement messaging feature
              console.log('Open messaging for', employee.email);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Nhắn tin
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditModalOpen(true)}
          >
            Chỉnh sửa
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Reset mật khẩu</DropdownMenuItem>
              <DropdownMenuItem>Khóa đăng nhập</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDeleteEmployee}>
                Xóa nhân viên
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Card - TODO: waiting for get employeeStats API endpoint */}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as 'overview' | 'history' | 'attendance' | 'reviews' | 'notes')
        }
      >
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="history">Lịch sử công việc</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>

        {/* Tab: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoSection employee={employee} isLoading={employeeQuery.isLoading} />
            <WorkInfoSection employee={employee} isLoading={employeeQuery.isLoading} />
          </div>
          {/* TODO: PerformanceSummarySection waiting for get employeeStats API endpoint */}
        </TabsContent>

        {/* Tab: Work History */}
        <TabsContent value="history">
          {workHistoryQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <EventParticipationList
              participations={workHistoryQuery.data?.data || []}
              total={workHistoryQuery.data?.total || 0}
              isLoading={workHistoryQuery.isLoading}
            />
          )}
        </TabsContent>

        {/* Tab: Attendance */}
        <TabsContent value="attendance">
          {attendanceQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <AttendanceSummaryList
              summaries={attendanceQuery.data?.data || []}
              isLoading={attendanceQuery.isLoading}
            />
          )}
        </TabsContent>

        {/* Tab: Reviews */}
        <TabsContent value="reviews">
          {reviewsQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <PerformanceReviewList
              reviews={reviewsQuery.data?.data || []}
              isLoading={reviewsQuery.isLoading}
            />
          )}
        </TabsContent>

        {/* Tab: Notes */}
        <TabsContent value="notes">
          {notesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <EmployeeNoteList
              notes={notesQuery.data?.data || []}
              isLoading={notesQuery.isLoading}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <FormDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Chỉnh sửa nhân viên"
        description="Cập nhật thông tin nhân viên"
      >
        <EmployeeForm
          employeeId={employee.id}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditModalOpen(false)}
        />
      </FormDialog>
    </div>
  );
}
