/**
 * ============================
 * EMPLOYEE LIST & DETAIL TYPES
 * ============================
 */

export interface Employee {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  department: 'Sales' | 'Operations' | 'Marketing' | 'Finance' | 'HR';
  status: 'Active' | 'Inactive' | 'OnLeave';
  joinDate: string;
  updatedAt: string;
}

/**
 * Extended Employee Detail - bao gồm tất cả thông tin cá nhân, công việc
 * Được dùng cho trang /employees/:id
 */
export interface EmployeeDetail extends Employee {
  // Thông tin cá nhân (mở rộng)
  dateOfBirth?: string | null;
  address?: string | null;
  phoneSecondary?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;

  // Thông tin công việc (mở rộng)
  education?: string | null;
  experience?: string | null;
  skills: string[]; // Tags
  salary?: number | null;

  // System fields
  avatar?: string | null;
  createdAt?: string;
}

/**
 * EVENT PARTICIPATION - Aggregation từ Events Module
 * Lịch sử tham gia sự kiện của nhân viên
 */
export interface EventParticipation {
  id: string;
  eventId: string;
  eventCode: string; // e.g., "SK-2026-015"
  eventName: string;
  eventStatus: 'Planned' | 'InProgress' | 'Completed' | 'Cancelled';
  role: string; // e.g., "Trưởng nhóm", "Điều phối viên"
  eventDate: string; // ISO date
  rating?: number | null; // 1-5 stars
}

/**
 * MONTHLY ATTENDANCE SUMMARY - Aggregation từ Attendance Module
 * Tổng hợp chấm công theo tháng
 */
export interface MonthlyAttendanceSummary {
  month: number; // 1-12
  year: number; // e.g., 2026
  workingDays: number; // Tổng ngày làm việc
  present: number; // Có mặt - green
  late: number; // Đi muộn - yellow
  absent: number; // Vắng mặt - red
  onLeave: number; // Nghỉ phép - blue
}

/**
 * PERFORMANCE REVIEW - Entity mới
 * Đánh giá hiệu suất theo kỳ (quý/năm)
 */
export interface PerformanceReview {
  id: string;
  employeeId: string;

  // Kỳ đánh giá
  period: string; // e.g., "Q1 2026", "2025"
  reviewDate: string; // ISO date, ngày đánh giá

  // Điểm số
  score: number; // 1.0 - 5.0
  kpiAchieved: number; // e.g., 8
  kpiTotal: number; // e.g., 10

  // Đánh giá chi tiết
  strengths: string[]; // Danh sách điểm mạnh
  improvements: string[]; // Danh sách cần cải thiện
  comment?: string | null; // Nhận xét tổng hợp

  // Người đánh giá
  reviewerId: string;
  reviewerName?: string; // Populated khi GET
  reviewerTitle?: string; // Chức vụ người đánh giá

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * EMPLOYEE STATS - Aggregation tổng hợp
 * Thống kê tính toán từ các module khác
 */
export interface EmployeeStats {
  totalEvents: number; // Tổng sự kiện đã tham gia
  averageRating: number; // Đánh giá trung bình (0-5)
  performanceRate: number; // Hiệu suất %
  totalEventsCompleted: number; // Sự kiện hoàn thành
  kpiAchievementRate: number; // Tỷ lệ KPI đạt %
  attendanceRate: number; // Tỷ lệ tham dự %
}

/**
 * ACTIVITY - polymorphic entity từ CRM module
 * Dùng cho Ghi chú nội bộ với targetType='Employee'
 */
export interface Activity {
  id: string;
  targetType: 'Employee' | 'Customer' | 'Event'; // Polymorphic
  targetId: string;
  type: 'Note' | 'Call' | 'Email' | 'Task'; // Activity type
  title?: string;
  description: string;
  createdBy: string; // Employee ID
  createdByName?: string; // Populated
  createdByTitle?: string; // Chức vụ
  createdAt: string;
  updatedAt: string;
}

/**
 * ============================
 * REQUEST / RESPONSE TYPES
 * ============================
 */

/**
 * Update Employee Detail Request
 */
export interface UpdateEmployeeDetailRequest {
  name?: string;
  email?: string;
  phone?: string;
  phoneSecondary?: string | null;
  role?: 'SuperAdmin' | 'Admin' | 'HR' | 'Manager' | 'Staff';
  department?: 'Sales' | 'Operations' | 'Marketing' | 'Finance' | 'HR';
  status?: 'Active' | 'Inactive' | 'OnLeave';
  dateOfBirth?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;
  education?: string | null;
  experience?: string | null;
  skills?: string[];
  salary?: number | null;
  avatar?: string | null;
}

/**
 * Create Performance Review Request
 */
export interface CreatePerformanceReviewRequest {
  period: string;
  reviewDate: string;
  score: number;
  kpiAchieved: number;
  kpiTotal: number;
  strengths: string[];
  improvements: string[];
  comment?: string;
}

/**
 * Update Performance Review Request
 */
export interface UpdatePerformanceReviewRequest {
  period?: string;
  reviewDate?: string;
  score?: number;
  kpiAchieved?: number;
  kpiTotal?: number;
  strengths?: string[];
  improvements?: string[];
  comment?: string;
}

/**
 * Create Activity (Note) Request
 */
export interface CreateActivityRequest {
  targetType: 'Employee' | 'Customer' | 'Event';
  targetId: string;
  type: 'Note' | 'Call' | 'Email' | 'Task';
  title?: string;
  description: string;
}

/**
 * Response Types
 */
export interface GetEventParticipationsResponse {
  data: EventParticipation[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAttendanceSummaryResponse {
  data: MonthlyAttendanceSummary[];
  employeeId: string;
}

export interface GetPerformanceReviewsResponse {
  data: PerformanceReview[];
  total: number;
  page: number;
  limit: number;
}

export interface GetActivitiesResponse {
  data: Activity[];
  total: number;
  page: number;
  limit: number;
}

/**
 * ============================
 * MOCK DATA & CONSTANTS
 * ============================
 */

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    code: 'NV-2023-001',
    name: 'Nguyễn Lan Anh',
    phone: '0976 543 210',
    email: 'lananh@eventco.vn',
    position: 'Admin',
    department: 'HR',
    status: 'Active',
    joinDate: '01/10/2023',
    updatedAt: '26/02/2026',
  },
  {
    id: '2',
    code: 'NV-2024-001',
    name: 'Nguyễn Văn An',
    phone: '0912 345 678',
    email: 'an.nguyen@eventco.vn',
    position: 'Manager',
    department: 'Sales',
    status: 'Active',
    joinDate: '01/01/2024',
    updatedAt: '15/02/2026',
  },
  {
    id: '3',
    code: 'NV-2024-002',
    name: 'Trần Thị Bình',
    phone: '0987 654 321',
    email: 'binh.tran@eventco.vn',
    position: 'Staff',
    department: 'Sales',
    status: 'Active',
    joinDate: '15/02/2024',
    updatedAt: '18/02/2026',
  },
  {
    id: '4',
    code: 'NV-2024-003',
    name: 'Lê Minh Cường',
    phone: '0901 234 567',
    email: 'cuong.le@eventco.vn',
    position: 'Manager',
    department: 'Event',
    status: 'Active',
    joinDate: '10/01/2024',
    updatedAt: '20/02/2026',
  },
  {
    id: '5',
    code: 'NV-2024-004',
    name: 'Phạm Thu Hà',
    phone: '0938 765 432',
    email: 'ha.pham@eventco.vn',
    position: 'Staff',
    department: 'Marketing',
    status: 'Active',
    joinDate: '20/01/2024',
    updatedAt: '22/02/2026',
  },
  {
    id: '6',
    code: 'NV-2024-005',
    name: 'Hoàng Đức Khải',
    phone: '0945 123 456',
    email: 'khai.hoang@eventco.vn',
    position: 'Manager',
    department: 'Accounting',
    status: 'Active',
    joinDate: '05/02/2024',
    updatedAt: '23/02/2026',
  },
  {
    id: '7',
    code: 'NV-2024-006',
    name: 'Võ Thị Mai',
    phone: '0919 876 543',
    email: 'mai.vo@eventco.vn',
    position: 'Staff',
    department: 'Sales',
    status: 'OnLeave',
    joinDate: '25/01/2024',
    updatedAt: '24/02/2026',
  },
  {
    id: '8',
    code: 'NV-2024-007',
    name: 'Đỗ Văn Tuấn',
    phone: '0932 456 789',
    email: 'tuan.do@eventco.vn',
    position: 'Staff',
    department: 'Accounting',
    status: 'Active',
    joinDate: '15/08/2023',
    updatedAt: '25/02/2026',
  },
  {
    id: '9',
    code: 'NV-2024-008',
    name: 'Trần Minh Đức',
    phone: '0905 678 901',
    email: 'minhduc.tran@eventco.vn',
    position: 'Manager',
    department: 'HR',
    status: 'Active',
    joinDate: '12/03/2024',
    updatedAt: '01/03/2026',
  },
  {
    id: '10',
    code: 'NV-2024-009',
    name: 'Lý Thảo Nhi',
    phone: '0918 234 567',
    email: 'thao.nhi@eventco.vn',
    position: 'Staff',
    department: 'Marketing',
    status: 'Active',
    joinDate: '18/02/2024',
    updatedAt: '02/03/2026',
  },
  {
    id: '11',
    code: 'NV-2024-010',
    name: 'Vũ Sơn Tùng',
    phone: '0925 789 012',
    email: 'son.tung@eventco.vn',
    position: 'HR',
    department: 'HR',
    status: 'Active',
    joinDate: '05/03/2024',
    updatedAt: '03/03/2026',
  },
  {
    id: '12',
    code: 'NV-2024-011',
    name: 'Cao Minh Khánh',
    phone: '0942 345 678',
    email: 'minh.khanh@eventco.vn',
    position: 'Staff',
    department: 'Event',
    status: 'Probation',
    joinDate: '20/03/2024',
    updatedAt: '04/03/2026',
  },
  {
    id: '13',
    code: 'NV-2024-012',
    name: 'Phan Thanh Hương',
    phone: '0954 012 345',
    email: 'thanh.huong@eventco.vn',
    position: 'Staff',
    department: 'Admin',
    status: 'Active',
    joinDate: '25/03/2024',
    updatedAt: '05/03/2026',
  },
];

export const DEPARTMENT_COLORS: Record<string, string> = {
  Sales: 'bg-blue-100 text-blue-700 border-blue-200',
  Event: 'bg-purple-100 text-purple-700 border-purple-200',
  Marketing: 'bg-pink-100 text-pink-700 border-pink-200',
  Accounting: 'bg-green-100 text-green-700 border-green-200',
  HR: 'bg-orange-100 text-orange-700 border-orange-200',
  Board: 'bg-red-100 text-red-700 border-red-200',
  Admin: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export const DEPARTMENT_LABELS: Record<string, string> = {
  Sales: 'Kinh doanh',
  Event: 'Sự kiện',
  Marketing: 'Marketing',
  Accounting: 'Kế toán',
  HR: 'Nhân sự',
  Board: 'Ban lãnh đạo',
  Admin: 'Hành chính',
};

export const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Inactive: 'bg-red-100 text-red-700 border-red-200',
  OnLeave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export const STATUS_LABELS: Record<string, string> = {
  Active: 'Đang làm việc',
  Inactive: 'Nghỉ việc',
  OnLeave: 'Tạm nghỉ',
};

/**
 * Mock Employee Details - Extended data for Employee Detail page
 * Maps employee ID to EmployeeDetail with all personal/work info
 */
export const MOCK_EMPLOYEE_DETAILS: Record<string, EmployeeDetail> = {
  '1': {
    id: '1',
    code: 'NV-2023-001',
    name: 'Nguyễn Lan Anh',
    phone: '0976 543 210',
    email: 'lananh@eventco.vn',
    position: 'Admin',
    department: 'HR',
    status: 'Active',
    joinDate: '01/10/2023',
    updatedAt: '26/02/2026',
    dateOfBirth: '15/03/1990',
    address: 'Hà Nội, Việt Nam',
    phoneSecondary: '0912 345 678',
    emergencyContactName: 'Nguyễn Văn Anh',
    emergencyContactRelationship: 'Anh trai',
    emergencyContactPhone: '0981 234 567',
    education: 'Thạc sĩ Quản lý Nhân sự - ĐH KTQD',
    experience: '8 năm kinh nghiệm quản lý nhân sự',
    skills: ['Recruitment', 'Performance Management', 'Employee Relations', 'HR Strategy'],
    salary: 18000000,
    avatar: null,
  },
  '2': {
    id: '2',
    code: 'NV-2024-001',
    name: 'Nguyễn Văn An',
    phone: '0912 345 678',
    email: 'an.nguyen@eventco.vn',
    position: 'Manager',
    department: 'Sales',
    status: 'Active',
    joinDate: '01/01/2024',
    updatedAt: '15/02/2026',
    dateOfBirth: '22/07/1992',
    address: '123 Đường Tây Sơn, Hà Nội',
    phoneSecondary: null,
    emergencyContactName: 'Nguyễn Thị Hoa',
    emergencyContactRelationship: 'Vợ',
    emergencyContactPhone: '0987 654 321',
    education: 'Cử nhân Marketing - ĐH Kinh Tế',
    experience: '6 năm kinh nghiệm bán hàng',
    skills: ['Sales Management', 'Negotiation', 'CRM', 'Team Leadership', 'Customer Relations'],
    salary: 16000000,
    avatar: null,
  },
  '3': {
    id: '3',
    code: 'NV-2024-002',
    name: 'Trần Thị Bình',
    phone: '0987 654 321',
    email: 'binh.tran@eventco.vn',
    position: 'Staff',
    department: 'Sales',
    status: 'Active',
    joinDate: '15/02/2024',
    updatedAt: '18/02/2026',
    dateOfBirth: '10/05/1998',
    address: 'Quận 1, TP. Hồ Chí Minh',
    phoneSecondary: null,
    emergencyContactName: 'Trần Văn Bình',
    emergencyContactRelationship: 'Cha',
    emergencyContactPhone: '0901 234 567',
    education: 'Cử nhân Thương mại',
    experience: '2 năm kinh nghiệm bán hàng',
    skills: ['Customer Service', 'Sales', 'Communication', 'Product Knowledge'],
    salary: 12000000,
    avatar: null,
  },
  '4': {
    id: '4',
    code: 'NV-2024-003',
    name: 'Lê Minh Cường',
    phone: '0901 234 567',
    email: 'cuong.le@eventco.vn',
    position: 'Manager',
    department: 'Event',
    status: 'Active',
    joinDate: '10/01/2024',
    updatedAt: '20/02/2026',
    dateOfBirth: '03/12/1991',
    address: 'Phường Bến Thành, Quận 1, TP. HCM',
    phoneSecondary: '0923 456 789',
    emergencyContactName: 'Lê Thị Minh',
    emergencyContactRelationship: 'Mẹ',
    emergencyContactPhone: '0912 345 678',
    education: 'Cử nhân Điều hành Sự kiện - ĐH Kinh Tế',
    experience: '7 năm tổ chức sự kiện',
    skills: ['Event Planning', 'Project Management', 'Vendor Management', 'Budget Control', 'Team Coordination'],
    salary: 15000000,
    avatar: null,
  },
  '5': {
    id: '5',
    code: 'NV-2024-004',
    name: 'Phạm Thu Hà',
    phone: '0938 765 432',
    email: 'ha.pham@eventco.vn',
    position: 'Staff',
    department: 'Marketing',
    status: 'Active',
    joinDate: '20/01/2024',
    updatedAt: '22/02/2026',
    dateOfBirth: '08/08/1999',
    address: 'Hà Nội',
    phoneSecondary: null,
    emergencyContactName: 'Phạm Tuấn Hà',
    emergencyContactRelationship: 'Anh trai',
    emergencyContactPhone: '0945 123 456',
    education: 'Cử nhân Truyền thông Đại chúng',
    experience: '1.5 năm kinh nghiệm marketing',
    skills: ['Social Media Marketing', 'Content Creation', 'Analytics', 'Branding', 'Digital Marketing'],
    salary: 11500000,
    avatar: null,
  },
  '6': {
    id: '6',
    code: 'NV-2024-005',
    name: 'Hoàng Đức Khải',
    phone: '0945 123 456',
    email: 'khai.hoang@eventco.vn',
    position: 'Manager',
    department: 'Accounting',
    status: 'Active',
    joinDate: '05/02/2024',
    updatedAt: '23/02/2026',
    dateOfBirth: '18/11/1989',
    address: 'Quận Thanh Xuân, Hà Nội',
    phoneSecondary: '0934 567 890',
    emergencyContactName: 'Hoàng Thị Hoa',
    emergencyContactRelationship: 'Vợ',
    emergencyContactPhone: '0989 123 456',
    education: 'Cử nhân Kế toán - ĐH Kinh Tế',
    experience: '9 năm kinh nghiệm kế toán',
    skills: ['Financial Analysis', 'Accounting', 'Tax Planning', 'Auditing', 'Financial Reporting'],
    salary: 17000000,
    avatar: null,
  },
  '7': {
    id: '7',
    code: 'NV-2024-006',
    name: 'Võ Thị Mai',
    phone: '0919 876 543',
    email: 'mai.vo@eventco.vn',
    position: 'Staff',
    department: 'Sales',
    status: 'OnLeave',
    joinDate: '25/01/2024',
    updatedAt: '24/02/2026',
    dateOfBirth: '14/06/2000',
    address: 'Gò Vấp, TP. Hồ Chí Minh',
    phoneSecondary: null,
    emergencyContactName: 'Võ Văn Thế',
    emergencyContactRelationship: 'Cha',
    emergencyContactPhone: '0901 234 567',
    education: 'Cử nhân Kinh tế',
    experience: '1 năm kinh nghiệm bán hàng',
    skills: ['Customer Service', 'Sales', 'Communication', 'Problem Solving'],
    salary: 11000000,
    avatar: null,
  },
  '8': {
    id: '8',
    code: 'NV-2024-007',
    name: 'Đỗ Văn Tuấn',
    phone: '0932 456 789',
    email: 'tuan.do@eventco.vn',
    position: 'Staff',
    department: 'Accounting',
    status: 'Active',
    joinDate: '15/08/2023',
    updatedAt: '25/02/2026',
    dateOfBirth: '27/04/1995',
    address: 'Quận 7, TP. Hồ Chí Minh',
    phoneSecondary: null,
    emergencyContactName: 'Đỗ Thị Hương',
    emergencyContactRelationship: 'Mẹ',
    emergencyContactPhone: '0987 654 321',
    education: 'Cử nhân Kế toán',
    experience: '4 năm kinh nghiệm kế toán',
    skills: ['Accounting Software', 'Bookkeeping', 'Data Entry', 'Financial Records'],
    salary: 12500000,
    avatar: null,
  },
  '9': {
    id: '9',
    code: 'NV-2024-008',
    name: 'Trần Minh Đức',
    phone: '0905 678 901',
    email: 'minhduc.tran@eventco.vn',
    position: 'Manager',
    department: 'HR',
    status: 'Active',
    joinDate: '12/03/2024',
    updatedAt: '01/03/2026',
    dateOfBirth: '07/09/1991',
    address: 'Hà Đông, Hà Nội',
    phoneSecondary: '0923 456 789',
    emergencyContactName: 'Trần Thu Hà',
    emergencyContactRelationship: 'Chị',
    emergencyContactPhone: '0901 234 567',
    education: 'Thạc sĩ Quản lý Công ty',
    experience: '7 năm kinh nghiệm lĩnh vực nhân sự',
    skills: ['HR Management', 'Recruitment', 'Training', 'Employee Development', 'Payroll'],
    salary: 16500000,
    avatar: null,
  },
  '10': {
    id: '10',
    code: 'NV-2024-009',
    name: 'Lý Thảo Nhi',
    phone: '0918 234 567',
    email: 'thao.nhi@eventco.vn',
    position: 'Staff',
    department: 'Marketing',
    status: 'Active',
    joinDate: '18/02/2024',
    updatedAt: '02/03/2026',
    dateOfBirth: '12/02/1999',
    address: 'Cầu Giấy, Hà Nội',
    phoneSecondary: null,
    emergencyContactName: 'Lý Kiên Sơn',
    emergencyContactRelationship: 'Bố',
    emergencyContactPhone: '0976 543 210',
    education: 'Cử nhân Thiết kế Đồ họa',
    experience: '2 năm kinh nghiệm marketing',
    skills: ['Graphic Design', 'Social Media', 'Content Creation', 'Photography', 'Video Editing'],
    salary: 12000000,
    avatar: null,
  },
  '11': {
    id: '11',
    code: 'NV-2024-010',
    name: 'Vũ Sơn Tùng',
    phone: '0925 789 012',
    email: 'son.tung@eventco.vn',
    position: 'HR',
    department: 'HR',
    status: 'Active',
    joinDate: '05/03/2024',
    updatedAt: '03/03/2026',
    dateOfBirth: '30/10/1996',
    address: 'Bắc Từ Liêm, Hà Nội',
    phoneSecondary: null,
    emergencyContactName: 'Vũ Thị Liên',
    emergencyContactRelationship: 'Mẹ',
    emergencyContactPhone: '0987 654 321',
    education: 'Cử nhân Quản lý Nhân sự',
    experience: '3 năm kinh nghiệm nhân sự',
    skills: ['Recruitment', 'Employee Relations', 'Training', 'HR Administration', 'Payroll Processing'],
    salary: 13000000,
    avatar: null,
  },
  '12': {
    id: '12',
    code: 'NV-2024-011',
    name: 'Cao Minh Khánh',
    phone: '0942 345 678',
    email: 'minh.khanh@eventco.vn',
    position: 'Staff',
    department: 'Event',
    status: 'Probation',
    joinDate: '20/03/2024',
    updatedAt: '04/03/2026',
    dateOfBirth: '05/01/2001',
    address: 'Quận 3, TP. Hồ Chí Minh',
    phoneSecondary: null,
    emergencyContactName: 'Cao Thành Kiên',
    emergencyContactRelationship: 'Anh trai',
    emergencyContactPhone: '0912 345 678',
    education: 'Sinh viên Quản lý Sự kiện',
    experience: 'Chưa có kinh nghiệm',
    skills: ['Communication', 'Organization', 'Teamwork', 'Problem Solving'],
    salary: 10000000,
    avatar: null,
  },
  '13': {
    id: '13',
    code: 'NV-2024-012',
    name: 'Phan Thanh Hương',
    phone: '0954 012 345',
    email: 'thanh.huong@eventco.vn',
    position: 'Staff',
    department: 'Admin',
    status: 'Active',
    joinDate: '25/03/2024',
    updatedAt: '05/03/2026',
    dateOfBirth: '19/11/1997',
    address: 'Từ Liêm, Hà Nội',
    phoneSecondary: null,
    emergencyContactName: 'Phan Văn Minh',
    emergencyContactRelationship: 'Anh trai',
    emergencyContactPhone: '0945 123 456',
    education: 'Cử nhân Quản trị Văn phòng',
    experience: '3 năm kinh nghiệm hành chính',
    skills: ['Office Administration', 'Data Management', 'Document Management', 'Communication'],
    salary: 11500000,
    avatar: null,
  },
};
