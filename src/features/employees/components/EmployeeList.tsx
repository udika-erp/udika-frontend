import { useState } from 'react';
import { Search, Plus, ChevronDown, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import {
  DEPARTMENT_COLORS,
  DEPARTMENT_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../types';
import type { EmployeeFormValues } from '../forms/employee.schema';

export function EmployeeList() {
  const {
    searchQuery,
    setSearchQuery,
    selectedEmployees,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredEmployees,
    totalPages,
    startIndex,
    displayedEmployees,
    toggleSelectAll,
    toggleSelectEmployee,
  } = useEmployeeFilters();

  const [addOpen, setAddOpen] = useState(false);

  const handleAddSubmit = (_values: EmployeeFormValues) => {
    setAddOpen(false);
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Phòng ban" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="sales">Kinh doanh</SelectItem>
            <SelectItem value="operations">Vận hành</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="finance">Tài chính</SelectItem>
            <SelectItem value="hr">Nhân sự</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang làm việc</SelectItem>
            <SelectItem value="inactive">Nghỉ việc</SelectItem>
            <SelectItem value="onleave">Tạm nghỉ</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Chức vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="director">Giám đốc</SelectItem>
            <SelectItem value="manager">Trưởng phòng</SelectItem>
            <SelectItem value="staff">Nhân viên</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Năm vào làm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="h-10">
          <ChevronDown className="w-4 h-4 mr-2" />
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
                    checked={
                      displayedEmployees.length > 0 &&
                      selectedEmployees.length === displayedEmployees.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Mã NV
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Ngày vào làm
                </th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => toggleSelectEmployee(employee.id)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">{employee.code}</span>
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
                      className={`${DEPARTMENT_COLORS[employee.department]} font-medium`}
                    >
                      {DEPARTMENT_LABELS[employee.department]}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={`${STATUS_COLORS[employee.status]} font-medium`}
                    >
                      {STATUS_LABELS[employee.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{employee.joinDate}</span>
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị{' '}
            <span className="font-medium">{startIndex + 1}</span> đến{' '}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredEmployees.length)}
            </span>{' '}
            trong tổng số{' '}
            <span className="font-medium">{filteredEmployees.length}</span> nhân viên
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                className={page === currentPage ? 'bg-[#2563EB] hover:bg-[#1d4ed8]' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <FormDialog open={addOpen} onOpenChange={setAddOpen} title="Thêm nhân viên mới">
        <EmployeeForm onSubmit={handleAddSubmit} onCancel={() => setAddOpen(false)} />
      </FormDialog>
    </div>
  );
}
