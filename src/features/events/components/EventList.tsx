import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Filter, Calendar, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef } from '@/components/table';
import { DataTableRowActions, type RowAction } from '@/components/table';
import { FormDialog } from '@/components/modal';
import { EventForm } from './EventForm';
import { useEventFilters } from '../hooks/useEventFilters';
import {
  EVENT_STATUS_COLORS,
  EVENT_STATUS_LABELS,
  type Event,
} from '../types';
import type { EventFormValues } from '../forms/event.schema';

const STATUS_CARD_COLORS: Record<string, string> = {
  all: 'bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200',
  planning:
    'bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border-sky-200',
  confirmed:
    'bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-200',
  'in-progress':
    'bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-200',
  completed:
    'bg-gradient-to-br from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border-slate-200',
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  all: 'text-purple-700',
  planning: 'text-sky-700',
  confirmed: 'text-emerald-700',
  'in-progress': 'text-amber-700',
  completed: 'text-slate-700',
};

const STATUS_RING_COLORS: Record<string, string> = {
  all: 'ring-2 ring-purple-500 ring-offset-2',
  planning: 'ring-2 ring-sky-500 ring-offset-2',
  confirmed: 'ring-2 ring-emerald-500 ring-offset-2',
  'in-progress': 'ring-2 ring-amber-500 ring-offset-2',
  completed: 'ring-2 ring-slate-500 ring-offset-2',
};

const STATUS_CARD_LABELS: Record<string, string> = {
  all: 'Tất cả',
  planning: 'Đang lên kế hoạch',
  confirmed: 'Đã xác nhận',
  'in-progress': 'Đang diễn ra',
  completed: 'Hoàn thành',
};

export function EventList() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredEvents, statusCounts } =
    useEventFilters();

  const [addOpen, setAddOpen] = useState(false);

  const handleAddSubmit = (_values: EventFormValues) => {
    setAddOpen(false);
  };

  const handleViewEvent = (id: number) => {
    navigate(`/events/${id}`);
  };

  const rowActions: RowAction<Event>[] = [
    {
      label: 'Xem chi tiết',
      onClick: (row) => handleViewEvent(row.id),
    },
    {
      label: 'Chỉnh sửa',
      onClick: () => undefined,
    },
    {
      label: 'Xóa',
      onClick: () => undefined,
      variant: 'destructive',
    },
  ];

  const columns: ColumnDef<Event>[] = [
    {
      key: 'name',
      header: 'Tên sự kiện',
      sortable: true,
      cell: (row) => (
        <span
          className="font-medium text-indigo-900 cursor-pointer hover:underline"
          onClick={() => handleViewEvent(row.id)}
        >
          {row.name}
        </span>
      ),
    },
    {
      key: 'client',
      header: 'Khách hàng',
      cell: (row) => <span>{row.client}</span>,
    },
    {
      key: 'date',
      header: 'Ngày',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          {new Date(row.date).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Loại',
      cell: (row) => (
        <Badge variant="outline" className="border-purple-300 text-purple-700">
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'venue',
      header: 'Địa điểm',
      cell: (row) => <span className="text-gray-700">{row.venue}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      cell: (row) => (
        <Badge className={EVENT_STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-700'}>
          {EVENT_STATUS_LABELS[row.status] ?? row.status}
        </Badge>
      ),
    },
    {
      key: 'budget',
      header: 'Ngân sách',
      cell: (row) => (
        <div className="flex items-center gap-1 font-medium text-green-700">
          <DollarSign className="w-4 h-4" />
          {row.budget.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'attendees',
      header: 'Khách mời',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          {row.attendees}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-16 text-right',
      cell: (row) => <DataTableRowActions row={row} actions={rowActions} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sự kiện</h1>
          <p className="text-gray-600 mt-1">Lên kế hoạch và quản lý tất cả sự kiện</p>
        </div>
        <Button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo sự kiện mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['all', 'planning', 'confirmed', 'in-progress', 'completed'] as const).map((status) => (
          <Card
            key={status}
            className={`cursor-pointer transition-all border-2 ${STATUS_CARD_COLORS[status]} ${
              statusFilter === status ? STATUS_RING_COLORS[status] : ''
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <CardContent className="pt-6">
              <div className={`text-3xl font-bold ${STATUS_TEXT_COLORS[status]}`}>
                {statusCounts[status as keyof typeof statusCounts]}
              </div>
              <p className="text-sm text-gray-700 font-medium mt-1">
                {STATUS_CARD_LABELS[status]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="border-2 border-indigo-100">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm theo tên sự kiện, khách hàng hoặc địa điểm..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="border-2 border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-indigo-900">Danh sách sự kiện</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={filteredEvents}
            pageSize={8}
            getRowKey={(row) => String(row.id)}
          />
        </CardContent>
      </Card>

      <FormDialog open={addOpen} onOpenChange={setAddOpen} title="Tạo sự kiện mới" description="Nhập thông tin chi tiết sự kiện bên dưới">
        <EventForm onSubmit={handleAddSubmit} onCancel={() => setAddOpen(false)} />
      </FormDialog>
    </div>
  );
}
