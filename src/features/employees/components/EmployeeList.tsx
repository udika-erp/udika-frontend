import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormDialog } from '@/components/modal';
import { EmployeeForm } from './EmployeeForm';
import {
  useEmployees,
  useEmployeeDepartments,
  useEmployeePositions,
  useEmployeeStatuses,
  useDeleteEmployee,
} from '../hooks';
import {
  DEPARTMENT_COLORS,
  DEPARTMENT_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../types';
import type { EmployeeFilterParams } from '../data/type';
import type { EmployeeFormValues } from '../forms/employee.schema';

export function EmployeeList() {
  // ==================== State ====================
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Filters & Pagination
  const [filters, setFilters] = useState<EmployeeFilterParams>({
    page: 1,
    limit: 10,
    search: '',
    department: undefined,
    position: undefined,
    status: undefined,
  });

  // ==================== API Queries ====================
  const { data: employeeList, isLoading: isLoadingEmployees, error: employeeError } = useEmployees(filters);
  const { data: departments } = useEmployeeDepartments();
  const { data: positions } = useEmployeePositions();
  const { data: statuses } = useEmployeeStatuses();
  const { mutate: deleteEmployee } = useDeleteEmployee();

  // ==================== Event Handlers ====================
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleFilterChange = (filterKey: string, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleDeleteConfirm = (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      deleteEmployee(id);
    }
  };

  const handleAddSubmit = (_values: EmployeeFormValues) => {
    setAddOpen(false);
  };

  const handleEditSubmit = (_values: EmployeeFormValues) => {
    setEditingId(null);
  };

  // ==================== Loading State ====================
  if (isLoadingEmployees && employeeList === undefined) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-500">Đang tải danh sách nhân viên...</p>
        </div>
      </div>
    );
  }

  // ==================== Error State ====================
  if (employeeError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nhân viên</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải danh sách nhân viên. {employeeError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // ==================== Render ====================
  const employees = employeeList?.items || [];
  const totalPages = employeeList?.total ? Math.ceil(employeeList.total / (filters.limit || 10)) : 1;
  const currentPage = filters.page || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Nhân viên</h1>
        <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Tìm theo tên, SĐT, email, mã nhân viên..."
          className="pl-10 h-11"
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Select value={filters.department || ''} onValueChange={(v) => handleFilterChange('department', v || undefined)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Phòng ban" />
          </SelectTrigger>
          <SelectContent>
            {departments?.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status || ''} onValueChange={(v) => handleFilterChange('status', v || undefined)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statuses?.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.position || ''} onValueChange={(v) => handleFilterChange('position', v || undefined)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Chức vụ" />
          </SelectTrigger>
          <SelectContent>
            {positions?.map((pos) => (
              <SelectItem key={pos.value} value={pos.value}>
                {pos.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.joinYear?.toString() || ''} onValueChange={(v) => handleFilterChange('joinYear', v ? parseInt(v, 10) : undefined)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Năm vào làm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="h-10" disabled>
          Khoảng thời gian
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEmployees(employees.map((e) => e.id));
                      } else {
                        setSelectedEmployees([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tên nhân viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingEmployees ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <Loader className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không có dữ liệu nhân viên
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEmployees([...selectedEmployees, employee.id]);
                          } else {
                            setSelectedEmployees(selectedEmployees.filter((id) => id !== employee.id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{employee.phone}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{employee.position}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={`${DEPARTMENT_COLORS[employee.department] || 'bg-gray-100'} font-medium`}
                      >
                        {DEPARTMENT_LABELS[employee.department] || employee.department}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={`${STATUS_COLORS[employee.status] || 'bg-gray-100'} font-medium`}
                      >
                        {STATUS_LABELS[employee.status] || employee.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingId(employee.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteConfirm(employee.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị trang <span className="font-medium">{currentPage}</span> trong tổng số{' '}
            <span className="font-medium">{totalPages}</span> ({employeeList?.total || 0} nhân viên)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => currentPage + i - 2)
              .filter((p) => p >= 1 && p <= totalPages)
              .map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  className={page === currentPage ? 'bg-[#2563EB] hover:bg-[#1d4ed8]' : ''}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <FormDialog open={addOpen} onOpenChange={setAddOpen} title="Thêm nhân viên mới">
        <EmployeeForm onSubmit={handleAddSubmit} onCancel={() => setAddOpen(false)} />
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
        title="Chỉnh sửa nhân viên"
      >
        {editingId && (
          <EmployeeForm employeeId={editingId} onSubmit={handleEditSubmit} onCancel={() => setEditingId(null)} />
        )}
      </FormDialog>
    </div>
  );
}
