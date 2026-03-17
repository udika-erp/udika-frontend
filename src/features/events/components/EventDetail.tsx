import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Edit,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface EventDetailData {
  id: number;
  name: string;
  client: string;
  date: string;
  time: string;
  type: string;
  venue: string;
  status: 'planning' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  budget: number;
  attendees: number;
  description: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

const mockEventData: Record<number, EventDetailData> = {
  1: {
    id: 1,
    name: 'Johnson Wedding',
    client: 'Sarah Johnson',
    date: '2026-02-28',
    time: '14:00',
    type: 'Wedding',
    venue: 'Grand Ballroom Hotel',
    status: 'confirmed',
    budget: 15000,
    attendees: 150,
    description: 'Elegant wedding ceremony and reception with outdoor garden cocktail hour.',
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1 555-0123',
    contactEmail: 'sarah.johnson@email.com',
  },
  2: {
    id: 2,
    name: 'Tech Corp Annual Gala',
    client: 'Tech Corp Inc',
    date: '2026-03-05',
    time: '18:00',
    type: 'Corporate',
    venue: 'Convention Center',
    status: 'planning',
    budget: 25000,
    attendees: 300,
    description: 'Annual corporate gala with awards ceremony and networking dinner.',
    contactPerson: 'John Smith',
    contactPhone: '+1 555-0456',
    contactEmail: 'john.smith@techcorp.com',
  },
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'planning':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'planning':
      return 'Đang lên kế hoạch';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'in-progress':
      return 'Đang diễn ra';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

export function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const eventId = parseInt(id || '1');

  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState<EventDetailData>(
    mockEventData[eventId] || mockEventData[1],
  );

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEventData(mockEventData[eventId] || mockEventData[1]);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{eventData.name}</h1>
            <p className="text-gray-600 mt-1">Chi tiết sự kiện</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Hủy
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Lưu
              </Button>
            </>
          ) : (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Status and Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(eventData.date).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="text-lg font-semibold text-gray-900">{eventData.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Khách mời</p>
                <p className="text-lg font-semibold text-gray-900">{eventData.attendees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngân sách</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${eventData.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                {eventData.status === 'confirmed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <Badge className={getStatusColor(eventData.status)}>
                  {getStatusText(eventData.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin sự kiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">Tên sự kiện</Label>
                  {isEditing ? (
                    <Input
                      id="eventName"
                      value={eventData.name}
                      onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">{eventData.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="client">Khách hàng</Label>
                  {isEditing ? (
                    <Input
                      id="client"
                      value={eventData.client}
                      onChange={(e) => setEventData({ ...eventData, client: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">{eventData.client}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Loại sự kiện</Label>
                  {isEditing ? (
                    <Select
                      value={eventData.type}
                      onValueChange={(value) => setEventData({ ...eventData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wedding">Tiệc cưới</SelectItem>
                        <SelectItem value="Corporate">Sự kiện công ty</SelectItem>
                        <SelectItem value="Birthday">Sinh nhật</SelectItem>
                        <SelectItem value="Charity">Từ thiện</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">{eventData.type}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  {isEditing ? (
                    <Select
                      value={eventData.status}
                      onValueChange={(value: EventDetailData['status']) =>
                        setEventData({ ...eventData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Đang lên kế hoạch</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="in-progress">Đang diễn ra</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2">
                      <Badge className={getStatusColor(eventData.status)}>
                        {getStatusText(eventData.status)}
                      </Badge>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="venue">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Địa điểm
                </Label>
                {isEditing ? (
                  <Input
                    id="venue"
                    value={eventData.venue}
                    onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-2">{eventData.venue}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Ngày</Label>
                  {isEditing ? (
                    <Input
                      id="date"
                      type="date"
                      value={eventData.date}
                      onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">
                      {new Date(eventData.date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="time">Giờ</Label>
                  {isEditing ? (
                    <Input
                      id="time"
                      type="time"
                      value={eventData.time}
                      onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">{eventData.time}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Ngân sách</Label>
                  {isEditing ? (
                    <Input
                      id="budget"
                      type="number"
                      value={eventData.budget}
                      onChange={(e) =>
                        setEventData({ ...eventData, budget: parseInt(e.target.value) })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">
                      ${eventData.budget.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="attendees">Số khách mời</Label>
                  {isEditing ? (
                    <Input
                      id="attendees"
                      type="number"
                      value={eventData.attendees}
                      onChange={(e) =>
                        setEventData({ ...eventData, attendees: parseInt(e.target.value) })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-2">{eventData.attendees} người</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{eventData.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Người liên hệ</Label>
                {isEditing ? (
                  <Input
                    value={eventData.contactPerson}
                    onChange={(e) =>
                      setEventData({ ...eventData, contactPerson: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-2">{eventData.contactPerson}</p>
                )}
              </div>
              <div>
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input
                    value={eventData.contactPhone}
                    onChange={(e) =>
                      setEventData({ ...eventData, contactPhone: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-2">{eventData.contactPhone}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={eventData.contactEmail}
                    onChange={(e) =>
                      setEventData({ ...eventData, contactEmail: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-2">{eventData.contactEmail}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
