import { useState } from 'react';
import { Plus, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, type ColumnDef } from '@/components/table';
import { DataTableRowActions, type RowAction } from '@/components/table';
import { FormDialog } from '@/components/modal';
import { ConfirmDialog } from '@/components/modal';
import { CustomerForm } from './CustomerForm';
import { useCustomerFilters } from '../hooks/useCustomerFilters';
import {
  SOURCE_COLORS,
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
  type Customer,
} from '../types';
import type { CustomerFormValues } from '../forms/customer.schema';

export function CustomerList() {
  const {
    searchQuery,
    setSearchQuery,
    filteredCustomers,
    selectedCustomers,
    toggleSelectAll,
    toggleSelectCustomer,
  } = useCustomerFilters();

  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const handleAddSubmit = (_values: CustomerFormValues) => {
    // Mock: would call API mutation in real app
    setAddOpen(false);
  };

  const rowActions: RowAction<Customer>[] = [
    {
      label: 'Xem',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => undefined, // handled via Link in cell
    },
    {
      label: 'Sửa',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => undefined,
    },
    {
      label: 'Xóa',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => setDeleteTarget(row),
      variant: 'destructive',
    },
  ];

  const columns: ColumnDef<Customer>[] = [
    {
      key: 'select',
      header: '',
      cell: (row) => (
        <Checkbox
          checked={selectedCustomers.includes(row.id)}
          onCheckedChange={() => toggleSelectCustomer(row.id)}
        />
      ),
      className: 'w-12',
    },
    {
      key: 'code',
      header: 'Mã KH',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Tên khách hàng',
      sortable: true,
      cell: (row) => (
        <div>
          <Link
            to={`/crm/${row.id}`}
            className="text-sm font-medium text-gray-900 hover:text-[#2563EB] cursor-pointer"
          >
            {row.name}
          </Link>
          {row.company && (
            <div className="text-xs text-gray-500 mt-0.5">{row.company}</div>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Liên hệ',
      cell: (row) => (
        <div>
          <div className="text-sm text-gray-900">{row.phone}</div>
          <div className="text-xs text-gray-500 mt-0.5">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Nguồn khách',
      sortable: true,
      cell: (row) => (
        <Badge
          variant="outline"
          className={`${SOURCE_COLORS[row.source] ?? 'bg-gray-100 text-gray-700'} font-medium`}
        >
          {row.source}
        </Badge>
      ),
    },
    {
      key: 'leadStatus',
      header: 'Trạng thái Lead',
      sortable: true,
      cell: (row) => (
        <Badge
          variant="outline"
          className={`${LEAD_STATUS_COLORS[row.leadStatus] ?? 'bg-gray-100 text-gray-700'} font-medium`}
        >
          {LEAD_STATUS_LABELS[row.leadStatus] ?? row.leadStatus}
        </Badge>
      ),
    },
    {
      key: 'assignee',
      header: 'Người phụ trách',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-medium">
            {row.assignee.avatar}
          </div>
          <span className="text-sm text-gray-900">{row.assignee.name}</span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Ngày cập nhật',
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600">{row.updatedAt}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-16',
      cell: (row) => (
        <DataTableRowActions
          row={row}
          actions={rowActions.map((a) =>
            a.label === 'Xem'
              ? {
                  ...a,
                  icon: (
                    <Link to={`/crm/${row.id}`} className="flex items-center">
                      <Eye className="w-4 h-4" />
                    </Link>
                  ),
                }
              : a,
          )}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Khách hàng</h1>
        <Button
          className="bg-[#2563EB] hover:bg-[#1d4ed8]"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm khách hàng
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Tìm theo tên, SĐT, email..."
          className="pl-10 h-11"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Trạng thái lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="new">Mới</SelectItem>
            <SelectItem value="contacted">Đã liên hệ</SelectItem>
            <SelectItem value="qualified">Đủ điều kiện</SelectItem>
            <SelectItem value="proposal">Báo giá</SelectItem>
            <SelectItem value="negotiation">Đàm phán</SelectItem>
            <SelectItem value="won">Thành công</SelectItem>
            <SelectItem value="lost">Thất bại</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Nguồn khách" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="zalo">Zalo</SelectItem>
            <SelectItem value="website">Website</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Người phụ trách" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="tranminh">Trần Minh</SelectItem>
            <SelectItem value="phamha">Phạm Hà</SelectItem>
            <SelectItem value="ngolan">Ngô Lan</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Loại khách hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="corporate">Doanh nghiệp</SelectItem>
            <SelectItem value="individual">Cá nhân</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="h-10">
          <ChevronDown className="w-4 h-4 mr-2" />
          Khoảng thời gian
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white">
        <div className="flex items-center px-1 pb-2">
          <Checkbox
            checked={
              filteredCustomers.length > 0 &&
              selectedCustomers.length === filteredCustomers.length
            }
            onCheckedChange={() => toggleSelectAll(filteredCustomers)}
            className="mr-3"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredCustomers}
          pageSize={8}
          getRowKey={(row) => row.id}
        />
      </div>

      {/* Add Dialog */}
      <FormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Thêm khách hàng mới"
      >
        <CustomerForm
          onSubmit={handleAddSubmit}
          onCancel={() => setAddOpen(false)}
        />
      </FormDialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa khách hàng"
        description={`Bạn có chắc muốn xóa khách hàng "${deleteTarget?.name}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={() => setDeleteTarget(null)}
      />
    </div>
  );
}
