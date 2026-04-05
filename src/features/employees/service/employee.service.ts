import { BaseApiClient } from '@/services/base/BaseApiClient';
import { MOCK_ROLES, MOCK_POSITIONS, MOCK_DEPARTMENTS, MOCK_STATUSES } from '@/services/mocks/employee-options';
import { MOCK_EMPLOYEE_DETAILS } from '../types';
import type { Employee } from '@/features/auth/data/type';
import type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListResponse,
  EmployeeFilterParams,
  PositionListResponse,
  DepartmentListResponse,
  StatusListResponse,
} from '../data/type';
import type {
  EmployeeDetail,
  PerformanceReview,
  EmployeeStats,
  Activity,
  UpdateEmployeeDetailRequest,
  CreatePerformanceReviewRequest,
  UpdatePerformanceReviewRequest,
  CreateActivityRequest,
  GetEventParticipationsResponse,
  GetAttendanceSummaryResponse,
  GetPerformanceReviewsResponse,
} from '../types';

/**
 * Employee Service
 * Quản lý tất cả API calls cho Employee module
 * 
 * Extends BaseApiClient để tự động unwrap response { statusCode, message, data }
 * API base path: /employees
 */
export class EmployeeService extends BaseApiClient {
  constructor() {
    super('/employees');
  }

  /**
   * GET /employees
   * Lấy danh sách nhân viên với filter & phân trang
   * 
   * @param filters - Query parameters
   * @returns EmployeeListResponse với paginated items
   */
  async getEmployees(filters?: EmployeeFilterParams): Promise<EmployeeListResponse> {
    console.log('[EmployeeService.getEmployees] Calling API with filters:', filters); // DEBUG
    const response = await this.GET<any>('', filters);
    console.log('[EmployeeService.getEmployees] Raw response from BaseApiClient:', response); // DEBUG
    
    // Transform backend response: { data: [...], total, page, limit } → { items: [...], total, page, limit }
    const transformed: EmployeeListResponse = {
      items: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
    };
    
    console.log('[EmployeeService.getEmployees] Transformed response:', transformed); // DEBUG
    return transformed;
  }

  /**
   * GET /employees/{id}
   * Lấy chi tiết nhân viên theo ID (cấp độ cơ bản)
   * 
   * @param id - Employee ID
   * @returns Thông tin chi tiết của nhân viên
   * @throws Error nếu employee không tồn tại (404)
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return this.GET<Employee>(`/${id}`);
  }

  /**
   * GET /employees/{id}/detail
   * Lấy chi tiết nhân viên mở rộng (bao gồm tất cả thông tin cá nhân, công việc)
   * Được dùng cho trang Employee Detail
   * 
   * @param id - Employee ID
   * @returns EmployeeDetail mở rộng
   * @throws Error nếu employee không tồn tại (404) hoặc 403 nếu không có quyền xem
   */
  async getEmployeeDetail(id: string): Promise<EmployeeDetail> {
    // Return mock data for development
    const mockDetail = MOCK_EMPLOYEE_DETAILS[id];
    if (mockDetail) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDetail;
    }
    
    // Fallback to API call if mock data doesn't exist
    try {
      return this.GET<EmployeeDetail>(`/${id}/detail`);
    } catch {
      throw new Error(`Employee with ID ${id} not found`);
    }
  }

  /**
   * POST /employees
   * Tạo nhân viên mới
   * 
   * Hệ thống sẽ:
   * - Gửi mật khẩu tạm thời qua email
   * - Cho phép nhân viên đối chiếu trong lần đăng nhập đầu tiên
   * 
   * @param data - Employee data
   * @returns Employee vừa được tạo
   * @throws Error nếu email đã tồn tại (409)
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    return this.POST<Employee>('', data);
  }

  /**
   * PUT /employees/{id}
   * Cập nhật thông tin nhân viên (cấp độ cơ bản)
   * 
   * @param id - Employee ID
   * @param data - Fields cần cập nhật
   * @returns Employee sau khi cập nhật
   * @throws Error nếu employee không tồn tại (404) hoặc email đã tồn tại (409)
   */
  async updateEmployee(
    id: string,
    data: UpdateEmployeeRequest,
  ): Promise<Employee> {
    return this.PUT<Employee>(`/${id}`, data);
  }

  /**
   * PUT /employees/{id}/detail
   * Cập nhật chi tiết nhân viên mở rộng
   * Được dùng cho form chỉnh sửa trên trang Employee Detail
   * 
   * @param id - Employee ID
   * @param data - Fields cần cập nhật
   * @returns EmployeeDetail sau khi cập nhật
   * @throws Error nếu employee không tồn tại (404) hoặc email đã tồn tại (409)
   */
  async updateEmployeeDetail(
    id: string,
    data: UpdateEmployeeDetailRequest,
  ): Promise<EmployeeDetail> {
    return this.PUT<EmployeeDetail>(`/${id}/detail`, data);
  }

  /**
   * DELETE /employees/{id}
   * Xóa nhân viên (soft delete: set status = Resigned)
   * 
   * @param id - Employee ID
   * @returns Phản hồi từ server (void)
   * @throws Error nếu employee không tồn tại (404)
   */
  async deleteEmployee(id: string): Promise<void> {
    return this.DELETE<void>(`/${id}`);
  }

  /**
   * ============================
   * EMPLOYEE DETAIL - AGGREGATIONS
   * ============================
   */

  /**
   * GET /employees/{id}/events
   * Lấy lịch sử tham gia sự kiện của nhân viên (aggregation từ Events module)
   * 
   * @param id - Employee ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns GetEventParticipationsResponse
   */
  async getEmployeeEventHistory(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetEventParticipationsResponse> {
    return this.GET<GetEventParticipationsResponse>(`/${id}/events`, { page, limit });
  }

  /**
   * GET /employees/{id}/attendance-summary
   * Lấy tổng hợp chấm công theo tháng (aggregation từ Attendance module)
   * 
   * @param id - Employee ID
   * @param year - Filter by year (default: current year)
   * @returns GetAttendanceSummaryResponse
   */
  async getEmployeeAttendanceSummary(
    id: string,
    year?: number,
  ): Promise<GetAttendanceSummaryResponse> {
    return this.GET<GetAttendanceSummaryResponse>(`/${id}/attendance-summary`, {
      ...(year && { year }),
    });
  }

  /**
   * GET /employees/{id}/reviews
   * Lấy danh sách đánh giá hiệu suất
   * 
   * @param id - Employee ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns GetPerformanceReviewsResponse
   */
  async getEmployeeReviews(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetPerformanceReviewsResponse> {
    return this.GET<GetPerformanceReviewsResponse>(`/${id}/reviews`, { page, limit });
  }

  /**
   * POST /employees/{id}/reviews
   * Tạo đánh giá hiệu suất mới
   * 
   * @param id - Employee ID
   * @param data - Performance review data
   * @returns PerformanceReview vừa được tạo
   * @throws Error nếu employee không tồn tại (404) hoặc 403 nếu không có quyền
   */
  async createEmployeeReview(
    id: string,
    data: CreatePerformanceReviewRequest,
  ): Promise<PerformanceReview> {
    return this.POST<PerformanceReview>(`/${id}/reviews`, data);
  }

  /**
   * PUT /performance-reviews/{reviewId}
   * Cập nhật đánh giá hiệu suất
   * 
   * @param reviewId - Performance Review ID
   * @param data - Updated review data
   * @returns PerformanceReview sau khi cập nhật
   */
  async updatePerformanceReview(
    reviewId: string,
    data: UpdatePerformanceReviewRequest,
  ): Promise<PerformanceReview> {
    // Create inline subclass to avoid abstract class instantiation
    const PerformanceReviewClient = class extends BaseApiClient {
      constructor() {
        super('/performance-reviews');
      }
    };
    const client = new PerformanceReviewClient();
    return client.PUT<PerformanceReview>(`/${reviewId}`, data);
  }

  /**
   * DELETE /performance-reviews/{reviewId}
   * Xóa đánh giá hiệu suất (Admin only)
   * 
   * @param reviewId - Performance Review ID
   * @returns void
   */
  async deletePerformanceReview(reviewId: string): Promise<void> {
    // Create inline subclass to avoid abstract class instantiation
    const PerformanceReviewClient = class extends BaseApiClient {
      constructor() {
        super('/performance-reviews');
      }
    };
    const client = new PerformanceReviewClient();
    return client.DELETE<void>(`/${reviewId}`);
  }

  /**
   * GET /employees/{id}/stats
   * Lấy thống kê tổng hợp của nhân viên
   * 
   * @param id - Employee ID
   * @returns EmployeeStats bao gồm: totalEvents, averageRating, etc.
   */
  async getEmployeeStats(id: string): Promise<EmployeeStats> {
    // Return mock stats for development
    const mockStats: EmployeeStats = {
      totalEvents: 24,
      averageRating: 4.8,
      performanceRate: 98,
      totalEventsCompleted: 24,
      kpiAchievementRate: 95,
      attendanceRate: 98,
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStats;
  }

  /**
   * ============================
   * ACTIVITIES (NOTES) - reuse từ CRM
   * Sử dụng targetType='Employee' để lọc ghi chú của nhân viên
   * ============================
   */

  /**
   * GET /activities
   * Lấy danh sách ghi chú nội bộ của nhân viên
   * 
   * @param employeeId - Employee ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns GetActivitiesResponse
   */
  async getEmployeeNotes(
    employeeId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Activity[] }> {
    const ActivityClient = class extends BaseApiClient {
      constructor() {
        super('/activities');
      }
    };
    const activityClient = new ActivityClient();
    return activityClient.GET<{ data: Activity[] }>('', {
      targetType: 'Employee',
      targetId: employeeId,
      page,
      limit,
    });
  }

  /**
   * POST /activities
   * Tạo ghi chú nội bộ mới
   * 
   * @param data - Activity/Note data (targetType='Employee', type='Note')
   * @returns Activity vừa được tạo
   */
  async createEmployeeNote(data: CreateActivityRequest): Promise<Activity> {
    const ActivityClient = class extends BaseApiClient {
      constructor() {
        super('/activities');
      }
    };
    const activityClient = new ActivityClient();
    return activityClient.POST<Activity>('', data);
  }

  /**
   * PUT /activities/{activityId}
   * Cập nhật ghi chú nội bộ
   * 
   * @param activityId - Activity ID
   * @param data - Updated activity data
   * @returns Activity sau khi cập nhật
   */
  async updateEmployeeNote(
    activityId: string,
    data: Partial<CreateActivityRequest>,
  ): Promise<Activity> {
    const ActivityClient = class extends BaseApiClient {
      constructor() {
        super('/activities');
      }
    };
    const activityClient = new ActivityClient();
    return activityClient.PUT<Activity>(`/${activityId}`, data);
  }

  /**
   * DELETE /activities/{activityId}
   * Xóa ghi chú nội bộ (soft delete)
   * 
   * @param activityId - Activity ID
   * @returns void
   */
  async deleteEmployeeNote(activityId: string): Promise<void> {
    const ActivityClient = class extends BaseApiClient {
      constructor() {
        super('/activities');
      }
    };
    const activityClient = new ActivityClient();
    return activityClient.DELETE<void>(`/${activityId}`);
  }

  /**
   * ============================
   * DROPDOWN OPTIONS
   * ============================
   */

  /**
   * GET /employees/roles (mocked)
   * Lấy danh sách các vai trò có sẵn
   * 
   * @returns Mảng các vai trò (Admin, Manager, Staff, etc.)
   */
  async getRoles(): Promise<PositionListResponse> {
    // TODO: Replace with API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ROLES), 300);
    });
  }

  /**
   * GET /employees/positions (mocked) - Deprecated, use getRoles() instead
   * Lấy danh sách các vị trí có sẵn
   * 
   * @returns Mảng các vị trí (Manager, Director, etc.)
   */
  async getPositions(): Promise<PositionListResponse> {
    // TODO: Replace with API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_POSITIONS), 300);
    });
  }

  /**
   * GET /employees/departments (mocked)
   * Lấy danh sách các phòng ban có sẵn
   * 
   * @returns Mảng các phòng ban (HR, Sales, etc.)
   */
  async getDepartments(): Promise<DepartmentListResponse> {
    // TODO: Replace with API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DEPARTMENTS), 300);
    });
  }

  /**
   * GET /employees/statuses (mocked)
   * Lấy danh sách các trạng thái nhân viên
   * 
   * @returns Mảng các trạng thái (Active, Resigned, OnLeave, Probation)
   */
  async getStatuses(): Promise<StatusListResponse> {
    // TODO: Replace with API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_STATUSES), 300);
    });
  }
}

/**
 * Singleton instance
 * Sử dụng trong hooks & components
 */
export const employeeService = new EmployeeService();
