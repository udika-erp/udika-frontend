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
  department: 'Board' | 'HR' | 'Sales' | 'Marketing' | 'Event' | 'Accounting' | 'Admin';
  status: 'Active' | 'Resigned' | 'OnLeave' | 'Probation';
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
 * PERFORMANCE REVIEW - New entity
 * Performance evaluation by period (quarterly/annual)
 */
export interface PerformanceReview {
  id: string;
  employeeId: string;

  // Evaluation period
  period: string; // e.g., "Q1 2026", "2025"
  reviewDate: string; // ISO date, review date

  // Scores
  score: number; // 1.0 - 5.0
  kpiAchieved: number; // e.g., 8
  kpiTotal: number; // e.g., 10

  // Detailed evaluation
  strengths: string[]; // List of strengths
  improvements: string[]; // List of areas for improvement
  comment?: string | null; // Overall comment

  // Person who reviewed
  reviewerId: string;
  reviewerName?: string; // Populated when fetched
  reviewerTitle?: string; // Reviewer's position/title

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * EMPLOYEE STATS - Aggregated statistics
 * Statistics calculated from other modules
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
 * ACTIVITY - Polymorphic entity from CRM module
 * Used for internal notes with targetType='Employee'
 */
export interface Activity {
  id: string;
  targetType: 'Employee' | 'Customer' | 'Event'; // Polymorphic
  targetId: string;
  type: 'Note' | 'Call' | 'Email' | 'Task'; // Activity type
  title?: string;
  description: string;
  createdBy: string; // User ID who created
  createdByName?: string; // Populated when fetched
  createdByTitle?: string; // Creator's title/position
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
  department?: 'Board' | 'HR' | 'Sales' | 'Marketing' | 'Event' | 'Accounting' | 'Admin';
  status?: 'Active' | 'Resigned' | 'OnLeave' | 'Probation';
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
 * DISPLAY CONSTANTS
 * ============================
 */

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
  Resigned: 'bg-red-100 text-red-700 border-red-200',
  OnLeave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Probation: 'bg-blue-100 text-blue-700 border-blue-200',
};

export const STATUS_LABELS: Record<string, string> = {
  Active: 'Đang làm việc',
  Resigned: 'Nghỉ việc',
  OnLeave: 'Tạm nghỉ',
  Probation: 'Thử việc',
};
