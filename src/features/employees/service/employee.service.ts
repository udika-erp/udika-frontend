import { BaseApiClient } from '@/services/base/BaseApiClient';
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
   * Lấy chi tiết nhân viên theo ID
   * 
   * @param id - Employee ID
   * @returns Thông tin chi tiết của nhân viên
   * @throws Error nếu employee không tồn tại (404)
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return this.GET<Employee>(`/${id}`);
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
   * Cập nhật thông tin nhân viên
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
   * GET /employees/positions
   * Lấy danh sách các vị trí có sẵn
   * 
   * @returns Mảng các vị trí (Manager, Director, etc.)
   */
  async getPositions(): Promise<PositionListResponse> {
    return this.GET<PositionListResponse>('/positions');
  }

  /**
   * GET /employees/departments
   * Lấy danh sách các phòng ban có sẵn
   * 
   * @returns Mảng các phòng ban (HR, Sales, etc.)
   */
  async getDepartments(): Promise<DepartmentListResponse> {
    return this.GET<DepartmentListResponse>('/departments');
  }

  /**
   * GET /employees/statuses
   * Lấy danh sách các trạng thái nhân viên
   * 
   * @returns Mảng các trạng thái (Active, Resigned, OnLeave, Probation)
   */
  async getStatuses(): Promise<StatusListResponse> {
    return this.GET<StatusListResponse>('/statuses');
  }
}

/**
 * Singleton instance
 * Sử dụng trong hooks & components
 */
export const employeeService = new EmployeeService();
