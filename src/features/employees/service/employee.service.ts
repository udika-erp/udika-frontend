import { BaseApiClient } from '@/services/base/BaseApiClient';
import { performanceReviewService } from './performance-review.service';
import { activityService } from './activity.service';
import { MOCK_ROLES, MOCK_POSITIONS, MOCK_DEPARTMENTS, MOCK_STATUSES } from '@/services/mocks/employee-options';
import { MOCK_EMPLOYEE_DETAILS } from '../mocks/employee-data';
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
 * Manages all API calls for the Employee module
 * 
 * Extends BaseApiClient to automatically unwrap response { statusCode, message, data }
 * API base path: /employees
 */
export class EmployeeService extends BaseApiClient {
  constructor() {
    super('/employees');
  }

  /**
   * GET /employees
   * Retrieve employee list with filtering and pagination
   * 
   * @param filters - Query parameters
   * @returns EmployeeListResponse with paginated items
   */
  async getEmployees(filters?: EmployeeFilterParams): Promise<EmployeeListResponse> {
    const response = await this.GET<EmployeeListResponse>('', filters);
    // BaseApiClient.GET() already unwraps response.data.data, so response is the transformed data
    return response;
  }

  /**
   * GET /employees/{id}
   * Retrieve basic employee details by ID
   * 
   * @param id - Employee ID
   * @returns Employee information
   * @throws Error if employee does not exist (404)
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return this.GET<Employee>(`/${id}`);
  }

  /**
   * GET /employees/{id}/detail
   * Retrieve extended employee details (including personal and work information)
   * Used for the Employee Detail page
   * 
   * @param id - Employee ID
   * @returns Extended EmployeeDetail
   * @throws Error if employee does not exist (404) or user lacks permission (403)
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
   * Create a new employee
   * 
   * System will:
   * - Send temporary password via email
   * - Allow employee to reset password on first login
   * 
   * @param data - Employee data
   * @returns Created Employee
   * @throws Error if email already exists (409)
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    return this.POST<Employee>('', data);
  }

  /**
   * PUT /employees/{id}
   * Update employee information (basic level)
   * 
   * @param id - Employee ID
   * @param data - Fields to update
   * @returns Updated Employee
   * @throws Error if employee does not exist (404) or email already exists (409)
   */
  async updateEmployee(
    id: string,
    data: UpdateEmployeeRequest,
  ): Promise<Employee> {
    return this.PUT<Employee>(`/${id}`, data);
  }

  /**
   * PUT /employees/{id}/detail
   * Update extended employee details
   * Used for edit form on the Employee Detail page
   * 
   * @param id - Employee ID
   * @param data - Fields to update
   * @returns Updated EmployeeDetail
   * @throws Error if employee does not exist (404) or email already exists (409)
   */
  async updateEmployeeDetail(
    id: string,
    data: UpdateEmployeeDetailRequest,
  ): Promise<EmployeeDetail> {
    return this.PUT<EmployeeDetail>(`/${id}/detail`, data);
  }

  /**
   * DELETE /employees/{id}
   * Delete employee (soft delete: sets status = Resigned)
   * 
   * @param id - Employee ID
   * @returns Server response (void)
   * @throws Error if employee does not exist (404)
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
   * Retrieve employee event participation history (aggregation from Events module)
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
   * Retrieve monthly attendance summary (aggregation from Attendance module)
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
   * Retrieve performance review list
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
   * Create a new performance review
   * 
   * @param id - Employee ID
   * @param data - Performance review data
   * @returns Created PerformanceReview
   * @throws Error if employee does not exist (404) or user lacks permission (403)
   */
  async createEmployeeReview(
    id: string,
    data: CreatePerformanceReviewRequest,
  ): Promise<PerformanceReview> {
    return this.POST<PerformanceReview>(`/${id}/reviews`, data);
  }

  /**
   * PUT /performance-reviews/{reviewId}
   * Update a performance review
   * 
   * @param reviewId - Performance Review ID
   * @param data - Updated review data
   * @returns Updated PerformanceReview
   */
  async updatePerformanceReview(
    reviewId: string,
    data: UpdatePerformanceReviewRequest,
  ): Promise<PerformanceReview> {
    return performanceReviewService.update(reviewId, data);
  }

  /**
   * DELETE /performance-reviews/{reviewId}
   * Delete a performance review (Admin only)
   *
   * @param reviewId - Performance Review ID
   * @returns void
   */
  async deletePerformanceReview(reviewId: string): Promise<void> {
    return performanceReviewService.delete(reviewId);
  }

  /**
   * ============================
   * ACTIVITIES (NOTES) - Reused from CRM
   * Uses targetType='Employee' to filter employee notes
   * ============================
   */

  /**
   * GET /activities
   * Retrieve list of internal notes for employee
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
    return activityService.getActivities({
      targetType: 'Employee',
      targetId: employeeId,
      page,
      limit,
    });
  }

  /**
   * POST /activities
   * Create a new internal note
   * 
   * @param data - Activity/Note data (targetType='Employee', type='Note')
   * @returns Created Activity
   */
  async createEmployeeNote(data: CreateActivityRequest): Promise<Activity> {
    return activityService.create(data);
  }

  /**
   * PUT /activities/{activityId}
   * Update an internal note
   * 
   * @param activityId - Activity ID
   * @param data - Updated activity data
   * @returns Updated Activity
   */
  async updateEmployeeNote(
    activityId: string,
    data: Partial<CreateActivityRequest>,
  ): Promise<Activity> {
    return activityService.update(activityId, data);
  }

  /**
   * DELETE /activities/{activityId}
   * Delete an internal note (soft delete)
   * 
   * @param activityId - Activity ID
   * @returns void
   */
  async deleteEmployeeNote(activityId: string): Promise<void> {
    return activityService.delete(activityId);
  }

  /**
   * ============================
   * DROPDOWN OPTIONS
   * ============================
   */

  /**
   * GET /employees/roles
   * Retrieve list of available roles
   * 
   * @returns Array of roles (Admin, Manager, Staff, etc.)
   * @note MOCK: Returns mock data. Replace with API call when backend endpoint is ready.
   */
  async getRoles(): Promise<PositionListResponse> {
    // MOCK: Mock data for development - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ROLES), 300);
    });
  }

  /**
   * GET /employees/positions
   * Retrieve list of available positions
   * 
   * @returns Array of positions (Manager, Director, etc.)
   * @deprecated Use getRoles() instead
   * @note MOCK: Returns mock data. Replace with API call when backend endpoint is ready.
   */
  async getPositions(): Promise<PositionListResponse> {
    // MOCK: Mock data for development - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_POSITIONS), 300);
    });
  }

  /**
   * GET /employees/departments
   * Retrieve list of available departments
   * 
   * @returns Array of departments (HR, Sales, etc.)
   * @note MOCK: Returns mock data. Replace with API call when backend endpoint is ready.
   */
  async getDepartments(): Promise<DepartmentListResponse> {
    // MOCK: Mock data for development - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DEPARTMENTS), 300);
    });
  }

  /**
   * GET /employees/statuses
   * Retrieve list of available employee statuses
   * 
   * @returns Array of statuses (Active, Resigned, OnLeave, Probation)
   * @note MOCK: Returns mock data. Replace with API call when backend endpoint is ready.
   */
  async getStatuses(): Promise<StatusListResponse> {
    // MOCK: Mock data for development - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_STATUSES), 300);
    });
  }
}

/**
 * Singleton instance
 * Used in hooks & components
 */
export const employeeService = new EmployeeService();
