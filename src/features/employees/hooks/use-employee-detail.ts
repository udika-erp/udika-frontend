import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { employeeService } from '../service/employee.service';
import type {
  UpdateEmployeeDetailRequest,
  CreatePerformanceReviewRequest,
  UpdatePerformanceReviewRequest,
  CreateActivityRequest,
} from '../types';
import { useAppToast } from '@/hooks/use-app-toast';

/**
 * ============================
 * QUERY KEYS
 * ============================
 */
const EMPLOYEE_DETAIL_QUERY_KEYS = {
  all: ['employeeDetail'] as const,
  detail: (id: string) => [...EMPLOYEE_DETAIL_QUERY_KEYS.all, 'detail', id] as const,
  workHistory: (id: string) => [...EMPLOYEE_DETAIL_QUERY_KEYS.all, 'workHistory', id] as const,
  attendance: (id: string) => [
    ...EMPLOYEE_DETAIL_QUERY_KEYS.all,
    'attendance',
    id,
  ] as const,
  reviews: (id: string) => [...EMPLOYEE_DETAIL_QUERY_KEYS.all, 'reviews', id] as const,
  notes: (id: string) => [...EMPLOYEE_DETAIL_QUERY_KEYS.all, 'notes', id] as const,
  stats: (id: string) => [...EMPLOYEE_DETAIL_QUERY_KEYS.all, 'stats', id] as const,
};

/**
 * ============================
 * QUERY HOOKS - EMPLOYEE DETAIL AGGREGATIONS
 * ============================
 */

/**
 * useEmployeeDetail
 * Fetch employee detail with extended information
 * Used for Employee Detail page - Tab "Tổng quan"
 *
 * @param id - Employee ID
 * @param enabled - Conditionally enable query
 * @returns Query result with EmployeeDetail or error
 *
 * @example
 * ```tsx
 * const { data: employee, isLoading, error } = useEmployeeDetail(employeeId);
 * ```
 */
export const useEmployeeDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.detail(id),
    queryFn: () => employeeService.getEmployeeDetail(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * useEmployeeWorkHistory
 * Fetch employee's event participation history
 * Used for Employee Detail page - Tab "Lịch sử công việc"
 *
 * @param id - Employee ID
 * @param page - Pagination page (default: 1)
 * @param limit - Items per page (default: 10)
 * @param enabled - Conditionally enable query
 * @returns Query result with paginated EventParticipation[] or error
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useEmployeeWorkHistory(employeeId, 1, 10);
 * const events = data?.data || [];
 * ```
 */
export const useEmployeeWorkHistory = (
  id: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      ...EMPLOYEE_DETAIL_QUERY_KEYS.workHistory(id),
      page,
      limit,
    ] as const,
    queryFn: () => employeeService.getEmployeeEventHistory(id, page, limit),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * useEmployeeAttendance
 * Fetch employee monthly attendance summary
 * Used for Employee Detail page - Tab "Chấm công"
 *
 * @param id - Employee ID
 * @param year - Filter by year (optional, defaults to current year)
 * @param enabled - Conditionally enable query
 * @returns Query result with MonthlyAttendanceSummary[] or error
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useEmployeeAttendance(employeeId, 2026);
 * const summaries = data?.data || [];
 * ```
 */
export const useEmployeeAttendance = (
  id: string,
  year?: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      ...EMPLOYEE_DETAIL_QUERY_KEYS.attendance(id),
      year,
    ] as const,
    queryFn: () => employeeService.getEmployeeAttendanceSummary(id, year),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * useEmployeeReviews
 * Fetch employee performance reviews
 * Used for Employee Detail page - Tab "Đánh giá"
 *
 * @param id - Employee ID
 * @param page - Pagination page (default: 1)
 * @param limit - Items per page (default: 10)
 * @param enabled - Conditionally enable query
 * @returns Query result with paginated PerformanceReview[] or error
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useEmployeeReviews(employeeId);
 * const reviews = data?.data || [];
 * ```
 */
export const useEmployeeReviews = (
  id: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      ...EMPLOYEE_DETAIL_QUERY_KEYS.reviews(id),
      page,
      limit,
    ] as const,
    queryFn: () => employeeService.getEmployeeReviews(id, page, limit),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * useEmployeeNotes
 * Fetch employee internal notes (Activities with targetType='Employee')
 * Used for Employee Detail page - Tab "Ghi chú"
 *
 * @param id - Employee ID
 * @param page - Pagination page (default: 1)
 * @param limit - Items per page (default: 10)
 * @param enabled - Conditionally enable query
 * @returns Query result with paginated Activity[] or error (only type='Note')
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useEmployeeNotes(employeeId);
 * const notes = data?.data || [];
 * ```
 */
export const useEmployeeNotes = (
  id: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      ...EMPLOYEE_DETAIL_QUERY_KEYS.notes(id),
      page,
      limit,
    ] as const,
    queryFn: () => employeeService.getEmployeeNotes(id, page, limit),
    enabled: !!id && enabled,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * useEmployeeStats
 * Fetch aggregated employee statistics
 * Used for Employee Detail page - Summary cards & Stats section
 *
 * @param id - Employee ID
 * @param enabled - Conditionally enable query
 * @returns Query result with EmployeeStats or error
 *
 * @example
 * ```tsx
 * const { data: stats } = useEmployeeStats(employeeId);
 * // stats.totalEvents, stats.averageRating, stats.performanceRate, ...
 * ```
 */
export const useEmployeeStats = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.stats(id),
    queryFn: () => employeeService.getEmployeeStats(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * ============================
 * MUTATION HOOKS - EMPLOYEE DETAIL UPDATES
 * ============================
 */

/**
 * useUpdateEmployeeDetail
 * Mutation for updating employee detail information
 * Used in Employee Detail Edit Form modal
 *
 * Invalidates:
 * - EmployeeDetail query
 * - EmployeeStats query (if personal info changes)
 * - Employee list (if email/name/position changes)
 *
 * @returns Mutation object: mutate, isPending, isError, error, data
 *
 * @example
 * ```tsx
 * const { mutate: updateEmployee } = useUpdateEmployeeDetail();
 *
 * const handleSubmit = (data: UpdateEmployeeDetailRequest) => {
 *   updateEmployee({ id: employeeId, data });
 * };
 * ```
 */
export const useUpdateEmployeeDetail = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeDetailRequest;
    }) => employeeService.updateEmployeeDetail(id, data),
    onSuccess: (updatedEmployee) => {
      // Invalidate detail & stats
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.detail(updatedEmployee.id),
      });
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.stats(updatedEmployee.id),
      });

      // Also invalidate employee list in case email/name/position changed
      queryClient.invalidateQueries({
        queryKey: ['employees', 'list'],
      });

      toast({
        title: 'Thành công',
        description: `Thông tin nhân viên ${updatedEmployee.name} đã được cập nhật.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.code === '404'
          ? 'Nhân viên không tồn tại'
          : error?.code === '409'
            ? 'Email này đã tồn tại'
            : error?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.';

      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * ============================
 * MUTATION HOOKS - PERFORMANCE REVIEWS
 * ============================
 */

/**
 * useCreatePerformanceReview
 * Create a new performance review for employee
 * Used in Performance Review Form modal
 *
 * Invalidates:
 * - Employee reviews query
 * - Employee stats query
 *
 * @returns Mutation object
 *
 * @example
 * ```tsx
 * const { mutate: createReview } = useCreatePerformanceReview();
 *
 * const handleSubmit = (data: CreatePerformanceReviewRequest) => {
 *   createReview({ employeeId, data });
 * };
 * ```
 */
export const useCreatePerformanceReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({
      employeeId,
      data,
    }: {
      employeeId: string;
      data: CreatePerformanceReviewRequest;
    }) => employeeService.createEmployeeReview(employeeId, data),
    onSuccess: (review) => {
      // Invalidate reviews & stats
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.reviews(review.employeeId),
      });
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.stats(review.employeeId),
      });

      toast({
        title: 'Thành công',
        description: `Đánh giá kỳ ${review.period} đã được tạo.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.code === '403'
          ? 'Bạn không có quyền tạo đánh giá'
          : error?.message || 'Không thể tạo đánh giá. Vui lòng thử lại.';

      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * useUpdatePerformanceReview
 * Update an existing performance review
 *
 * Invalidates:
 * - Employee reviews query (by employeeId from mutation context)
 * - Employee stats query
 *
 * @returns Mutation object
 */
export const useUpdatePerformanceReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: UpdatePerformanceReviewRequest;
    }) => employeeService.updatePerformanceReview(reviewId, data),
    onSuccess: (review) => {
      // Invalidate reviews & stats (need employeeId from review)
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.reviews(review.employeeId),
      });
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.stats(review.employeeId),
      });

      toast({
        title: 'Thành công',
        description: `Đánh giá đã được cập nhật.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể cập nhật đánh giá. Vui lòng thử lại.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * useDeletePerformanceReview
 * Delete a performance review (Admin only)
 *
 * @returns Mutation object - requires employeeId in context for invalidation
 */
export const useDeletePerformanceReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({ reviewId, employeeId }: { reviewId: string; employeeId: string }) =>
      employeeService.deletePerformanceReview(reviewId).then(() => employeeId),
    onSuccess: (employeeId) => {
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.reviews(employeeId),
      });
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.stats(employeeId),
      });

      toast({
        title: 'Thành công',
        description: 'Đánh giá đã được xóa.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể xóa đánh giá. Vui lòng thử lại.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * ============================
 * MUTATION HOOKS - NOTES (ACTIVITIES)
 * ============================
 */

/**
 * useCreateEmployeeNote
 * Create a new internal note (Activity with targetType='Employee')
 * Used in Employee Note Form modal
 *
 * Invalidates:
 * - Employee notes query
 *
 * @returns Mutation object
 *
 * @example
 * ```tsx
 * const { mutate: createNote } = useCreateEmployeeNote();
 *
 * const handleSubmit = (content: string) => {
 *   createNote({
 *     targetType: 'Employee',
 *     targetId: employeeId,
 *     type: 'Note',
 *     description: content,
 *   });
 * };
 * ```
 */
export const useCreateEmployeeNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) =>
      employeeService.createEmployeeNote(data),
    onSuccess: (note) => {
      // Invalidate notes query
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.notes(note.targetId),
      });

      toast({
        title: 'Thành công',
        description: 'Ghi chú đã được tạo.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể tạo ghi chú. Vui lòng thử lại.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * useUpdateEmployeeNote
 * Update an existing internal note
 *
 * @returns Mutation object - requires employeeId for invalidation
 */
export const useUpdateEmployeeNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({
      noteId,
      data,
    }: {
      noteId: string;
      data: Partial<CreateActivityRequest>;
    }) => employeeService.updateEmployeeNote(noteId, data),
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.notes(note.targetId),
      });

      toast({
        title: 'Thành công',
        description: 'Ghi chú đã được cập nhật.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể cập nhật ghi chú. Vui lòng thử lại.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * useDeleteEmployeeNote
 * Delete an internal note (soft delete)
 *
 * @returns Mutation object - requires employeeId for invalidation
 */
export const useDeleteEmployeeNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({ noteId, employeeId }: { noteId: string; employeeId: string }) =>
      employeeService.deleteEmployeeNote(noteId).then(() => employeeId),
    onSuccess: (employeeId) => {
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_DETAIL_QUERY_KEYS.notes(employeeId),
      });

      toast({
        title: 'Thành công',
        description: 'Ghi chú đã được xóa.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể xóa ghi chú. Vui lòng thử lại.',
        variant: 'destructive',
      });
    },
  });
};
