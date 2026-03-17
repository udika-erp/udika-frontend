import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  PhoneCall,
  Calendar,
  FileText,
  Star,
  Download,
  MoreVertical,
  Plus,
  Edit,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const customerData = {
  id: '1',
  code: 'KH-2024-001',
  name: 'Nguyễn Văn Anh',
  company: 'Công ty CP ABC',
  role: 'Giám đốc Marketing',
  leadStatus: 'Qualified',
  priority: 'Hot',
  phone: '0912 345 678',
  phoneSecondary: '0987 654 321',
  email: 'anh.nguyen@abc.com.vn',
  address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
  zalo: '0912345678',
  website: 'https://abc.com.vn',
  source: 'Referral',
  referrer: 'Trần Thị Mai',
  customerType: 'Doanh nghiệp',
  industry: 'Công nghệ thông tin',
  tags: ['VIP', 'Tiềm năng cao', 'Sự kiện lớn'],
  priorityLevel: 'Cao',
  firstContact: '15/01/2026',
  expectedClose: '30/03/2026',
  internalNotes: 'Khách hàng tiềm năng cao, quan tâm tổ chức sự kiện cuối năm cho 500 người.',
  assignee: {
    name: 'Trần Minh',
    avatar: 'TM',
  },
};

const activityHistory = [
  {
    id: 1,
    type: 'call',
    title: 'Cuộc gọi tư vấn',
    date: '25/02/2026',
    time: '14:30',
    staff: 'Trần Minh',
    content: 'Trao đổi về nhu cầu tổ chức sự kiện tri ân khách hàng cuối quý 1. Khách quan tâm địa điểm tại TPHCM, quy mô 300-500 người.',
    nextAction: 'Gửi báo giá trong 2 ngày',
  },
  {
    id: 2,
    type: 'email',
    title: 'Gửi thông tin dịch vụ',
    date: '20/02/2026',
    time: '10:15',
    staff: 'Trần Minh',
    content: 'Đã gửi email giới thiệu các gói dịch vụ tổ chức sự kiện và portfolio công ty.',
    nextAction: 'Theo dõi phản hồi sau 3 ngày',
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Gặp mặt trực tiếp',
    date: '15/02/2026',
    time: '09:00',
    staff: 'Trần Minh',
    content: 'Gặp gỡ tại văn phòng khách hàng. Thảo luận về kế hoạch marketing và sự kiện năm 2026.',
    nextAction: 'Chuẩn bị báo giá chi tiết',
  },
];

const quotations = [
  {
    id: 1,
    code: 'BG-2026-045',
    eventName: 'Sự kiện tri ân khách hàng Q1',
    createdDate: '26/02/2026',
    value: 450000000,
    status: 'Đang đàm phán',
    hasFile: true,
  },
  {
    id: 2,
    code: 'BG-2026-032',
    eventName: 'Hội nghị nội bộ công ty',
    createdDate: '18/02/2026',
    value: 180000000,
    status: 'Đã gửi',
    hasFile: true,
  },
];

const events = [
  {
    id: 1,
    name: 'Lễ kỷ niệm 10 năm thành lập',
    type: 'Doanh nghiệp',
    date: '15/03/2025',
    venue: 'Khách sạn Intercontinental',
    scale: '500 khách',
    value: 850000000,
    status: 'Hoàn thành',
    rating: 5,
  },
  {
    id: 2,
    name: 'Team Building 2025',
    type: 'Doanh nghiệp',
    date: '20/06/2025',
    venue: 'Vũng Tàu Resort',
    scale: '200 người',
    value: 320000000,
    status: 'Hoàn thành',
    rating: 4,
  },
  {
    id: 3,
    name: 'Hội nghị khách hàng Q2',
    type: 'Hội nghị',
    date: '15/04/2026',
    venue: 'Trung tâm Hội nghị Quốc gia',
    scale: '300 người',
    value: 450000000,
    status: 'Đang chuẩn bị',
    rating: 0,
  },
  {
    id: 4,
    name: 'Gala Dinner cuối năm',
    type: 'Doanh nghiệp',
    date: '20/12/2026',
    venue: 'JW Marriott Hotel',
    scale: '600 khách',
    value: 950000000,
    status: 'Lên kế hoạch',
    rating: 0,
  },
  {
    id: 5,
    name: 'Workshop nội bộ',
    type: 'Training',
    date: '25/03/2026',
    venue: 'Văn phòng công ty',
    scale: '50 người',
    value: 85000000,
    status: 'Đang diễn ra',
    rating: 0,
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call':
      return <PhoneCall className="w-5 h-5 text-blue-600" />;
    case 'email':
      return <Mail className="w-5 h-5 text-purple-600" />;
    case 'meeting':
      return <Calendar className="w-5 h-5 text-green-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
};

const getActivityBgColor = (type: string) => {
  switch (type) {
    case 'call':
      return 'bg-blue-100';
    case 'email':
      return 'bg-purple-100';
    case 'meeting':
      return 'bg-green-100';
    default:
      return 'bg-gray-100';
  }
};

export function CustomerDetailView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isKanbanView, setIsKanbanView] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/crm')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-gray-600">Khách hàng</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{customerData.name}</span>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-2xl font-semibold">
                NVA
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {customerData.name}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {customerData.company} • {customerData.role}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                    Qualified
                  </Badge>
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    Hot
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    <span>{customerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4" />
                    <span>{customerData.email}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-700 border-purple-200"
                  >
                    {customerData.source}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-start gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1">Người phụ trách</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-medium">
                    {customerData.assignee.avatar}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {customerData.assignee.name}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo báo giá
                </Button>
                <Button variant="outline">
                  Ghi nhận hoạt động
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-6 py-3"
          >
            Thông tin
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-6 py-3"
          >
            Lịch sử
          </TabsTrigger>
          <TabsTrigger
            value="quotations"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-6 py-3"
          >
            Báo giá
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent px-6 py-3"
          >
            Chương trình
          </TabsTrigger>
        </TabsList>

        {/* Tab: Info */}
        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Contact Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin liên hệ</CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên khách hàng</Label>
                  <Input value={customerData.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Công ty</Label>
                  <Input value={customerData.company} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Chức vụ</Label>
                  <Input value={customerData.role} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SĐT chính</Label>
                    <Input value={customerData.phone} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>SĐT phụ</Label>
                    <Input value={customerData.phoneSecondary} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={customerData.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <Textarea value={customerData.address} readOnly rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Zalo</Label>
                    <Input value={customerData.zalo} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={customerData.website} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Classification Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân loại</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loại khách hàng</Label>
                    <Select defaultValue="corporate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                        <SelectItem value="individual">Cá nhân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ngành nghề</Label>
                    <Input value={customerData.industry} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Nguồn khách</Label>
                    <Input value={customerData.source} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Người giới thiệu</Label>
                    <Input value={customerData.referrer} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {customerData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CRM Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái CRM</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Trạng thái lead</Label>
                    <div className="flex items-center gap-2 overflow-x-auto py-2">
                      {['New', 'Contacted', 'Qualified', 'Proposal', 'Won'].map(
                        (status, index) => (
                          <div key={status} className="flex items-center">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                                status === 'Qualified'
                                  ? 'bg-[#2563EB] text-white'
                                  : index < 3
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {index + 1}
                            </div>
                            {index < 4 && (
                              <div
                                className={`w-8 h-0.5 ${
                                  index < 2 ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>New</span>
                      <span>Contacted</span>
                      <span className="font-medium text-[#2563EB]">Qualified</span>
                      <span>Proposal</span>
                      <span>Won</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mức độ ưu tiên</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="low">Thấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ngày tiếp cận</Label>
                      <Input value={customerData.firstContact} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Ngày dự kiến chốt</Label>
                      <Input value={customerData.expectedClose} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ghi chú nội bộ</Label>
                    <Textarea value={customerData.internalNotes} rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: History */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Plus className="w-4 h-4 mr-2" />
                Thêm hoạt động
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activityHistory.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${getActivityBgColor(activity.type)} flex items-center justify-center`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < activityHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {activity.date} • {activity.time} • {activity.staff}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {activity.content}
                      </p>
                      <div className="bg-blue-50 border-l-4 border-[#2563EB] px-3 py-2 mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Hành động tiếp theo:</span>{' '}
                          {activity.nextAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Quotations */}
        <TabsContent value="quotations" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách báo giá</CardTitle>
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Plus className="w-4 h-4 mr-2" />
                Tạo báo giá mới
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Mã BG
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Tên sự kiện
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Ngày tạo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Giá trị
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        File
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotations.map((quote) => (
                      <tr key={quote.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {quote.code}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">
                            {quote.eventName}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {quote.createdDate}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {quote.value.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className={
                              quote.status === 'Đang đàm phán'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }
                          >
                            {quote.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          {quote.hasFile && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Events */}
        <TabsContent value="events" className="mt-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Lịch sử chương trình
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid className={`w-4 h-4 ${!isKanbanView ? 'text-gray-400' : 'text-[#2563EB]'}`} />
                  <Switch
                    checked={isKanbanView}
                    onCheckedChange={setIsKanbanView}
                  />
                  <LayoutList className={`w-4 h-4 ${isKanbanView ? 'text-gray-400' : 'text-[#2563EB]'}`} />
                  <span className="text-sm text-gray-600">
                    {isKanbanView ? 'Kanban' : 'Danh sách'}
                  </span>
                </div>
                <Button variant="outline">
                  Xem tất cả
                </Button>
              </div>
            </div>

            {!isKanbanView ? (
              // Grid View (Original)
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {event.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 text-xs"
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <Badge
                          className={
                            event.status === 'Hoàn thành'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : event.status === 'Đang chuẩn bị'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : event.status === 'Đang diễn ra'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Quy mô:</span>
                          <span>{event.scale}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Giá trị hợp đồng</p>
                          <p className="font-semibold text-[#2563EB]">
                            {event.value.toLocaleString('vi-VN')} VNĐ
                          </p>
                        </div>
                        {event.rating > 0 && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < event.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Kanban View
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Column: Lên kế hoạch */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Lên kế hoạch</h3>
                    <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                      {events.filter(e => e.status === 'Lên kế hoạch').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {events.filter(e => e.status === 'Lên kế hoạch').map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {event.name}
                          </h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs mb-3">
                            {event.type}
                          </Badge>
                          <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-[#2563EB]">
                              {event.value.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Column: Đang chuẩn bị */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Đang chuẩn bị</h3>
                    <Badge variant="secondary" className="bg-yellow-200 text-yellow-700">
                      {events.filter(e => e.status === 'Đang chuẩn bị').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {events.filter(e => e.status === 'Đang chuẩn bị').map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {event.name}
                          </h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs mb-3">
                            {event.type}
                          </Badge>
                          <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-[#2563EB]">
                              {event.value.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Column: Đang diễn ra */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Đang diễn ra</h3>
                    <Badge variant="secondary" className="bg-blue-200 text-blue-700">
                      {events.filter(e => e.status === 'Đang diễn ra').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {events.filter(e => e.status === 'Đang diễn ra').map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {event.name}
                          </h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs mb-3">
                            {event.type}
                          </Badge>
                          <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-[#2563EB]">
                              {event.value.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Column: Hoàn thành */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Hoàn thành</h3>
                    <Badge variant="secondary" className="bg-green-200 text-green-700">
                      {events.filter(e => e.status === 'Hoàn thành').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {events.filter(e => e.status === 'Hoàn thành').map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            {event.name}
                          </h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs mb-3">
                            {event.type}
                          </Badge>
                          <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="line-clamp-1">{event.venue}</span>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#2563EB]">
                                {event.value.toLocaleString('vi-VN')} VNĐ
                              </p>
                              {event.rating > 0 && (
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: event.rating }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}