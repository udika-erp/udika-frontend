import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../service/employee.service';
import type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilterParams,
} from '../data/type';
import { useAppToast } from '@/hooks/use-app-toast';

/**
 * ==================== Query Keys ====================
 */
const EMPLOYEES_QUERY_KEYS = {
  all: ['employees'] as const,
  lists: () => [...EMPLOYEES_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: EmployeeFilterParams) =>
    [...EMPLOYEES_QUERY_KEYS.lists(), filters] as const,
  details: () => [...EMPLOYEES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...EMPLOYEES_QUERY_KEYS.details(), id] as const,
  positions: () => [...EMPLOYEES_QUERY_KEYS.all, 'positions'] as const,
  departments: () => [...EMPLOYEES_QUERY_KEYS.all, 'departments'] as const,
  statuses: () => [...EMPLOYEES_QUERY_KEYS.all, 'statuses'] as const,
};

/**
 * ==================== Query Hooks ====================
 */

/**
 * useEmployees
 * Lấy danh sách nhân viên với filter & phân trang
 * 
 * @param filters - Query params: page, limit, search, department, position, status, etc.
 * @returns Query result: data, isLoading, isError, error, isFetching, ...
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useEmployees({
 *   page: 1,
 *   limit: 10,
 *   search: "Nguyen",
 *   department: "HR"
 * });
 * ```
 */
export const useEmployees = (filters: EmployeeFilterParams = {}) => {
  // Clean filters: remove search if < 2 chars (backend requirement)
  const cleanFilters: EmployeeFilterParams = {
    ...filters,
    search: filters.search && filters.search.length >= 2 ? filters.search : undefined,
  };

  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.list(cleanFilters),
    queryFn: async () => {
      const response = await employeeService.getEmployees(cleanFilters);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * useEmployeeDetail
 * Retrieve employee details by ID
 * 
 * @param id - Employee ID
 * @param enabled - Allow query only when enabled = true
 * @returns Query result
 * 
 * @example
 * ```tsx
 * const { data: employee } = useEmployeeDetail(employeeId);
 * ```
 */
export const useEmployeeDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.detail(id),
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * useEmployeeRoles
 * Lấy danh sách các vai trò có sẵn
 * 
 * @returns List of roles
 */
export const useEmployeeRoles = () => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.positions(),
    queryFn: () => employeeService.getRoles(),
    staleTime: 1 * 60 * 60 * 1000, // 1 giờ (static data)
    gcTime: 2 * 60 * 60 * 1000, // 2 giờ
  });
};

/**
 * useEmployeePositions
 * Lấy danh sách các vị trí có sẵn
 * 
 * @returns List of positions
 */
export const useEmployeePositions = () => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.positions(),
    queryFn: () => employeeService.getPositions(),
    staleTime: 1 * 60 * 60 * 1000, // 1 giờ (static data)
    gcTime: 2 * 60 * 60 * 1000, // 2 giờ
  });
};

/**
 * useEmployeeDepartments
 * Lấy danh sách các phòng ban có sẵn
 * 
 * @returns List of departments
 */
export const useEmployeeDepartments = () => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.departments(),
    queryFn: () => employeeService.getDepartments(),
    staleTime: 1 * 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * useEmployeeStatuses
 * Lấy danh sách các trạng thái nhân viên
 * 
 * @returns List of statuses
 */
export const useEmployeeStatuses = () => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEYS.statuses(),
    queryFn: () => employeeService.getStatuses(),
    staleTime: 1 * 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * ==================== Mutation Hooks ====================
 */

/**
 * useCreateEmployee
 * Tạo nhân viên mới
 * 
 * - Tự động invalidate danh sách khi tạo thành công
 * - Hiển thị toast thông báo
 * 
 * @returns Mutation object: mutate, isPending, error, isError, data, ...
 * 
 * @example
 * ```tsx
 * const { mutate: createEmployee } = useCreateEmployee();
 * 
 * const handleSubmit = async (formData) => {
 *   createEmployee(formData);
 * };
 * ```
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) =>
      employeeService.createEmployee(data),
    onSuccess: (newEmployee) => {
      // Invalidate list to refetch
      queryClient.invalidateQueries({
        queryKey: EMPLOYEES_QUERY_KEYS.lists(),
      });

      // Add employee to cache (optional, optimization)
      queryClient.setQueryData(
        EMPLOYEES_QUERY_KEYS.detail(newEmployee.id),
        newEmployee,
      );

      // Show success notification
      toast({
        title: 'Success',
        description: `Employee ${newEmployee.name} has been created. Temporary password sent to email.`,
      });
    },
    onError: (error: any) => {
      console.error('Create employee error:', error);

      const message =
        error?.message || error?.code === '409'
          ? 'Email already exists'
          : 'Unable to create employee. Please try again.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * useUpdateEmployee
 * Cập nhật thông tin nhân viên
 * 
 * - Invalidate danh sách & detail khi cập nhật thành công
 * - Toast thông báo
 * 
 * @returns Mutation object
 * 
 * @example
 * ```tsx
 * const { mutate: updateEmployee } = useUpdateEmployee();
 * 
 * const handleUpdate = (id, updatedData) => {
 *   updateEmployee({ id, data: updatedData });
 * };
 * ```
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeRequest;
    }) => employeeService.updateEmployee(id, data),
    onSuccess: (updatedEmployee) => {
      // Invalidate danh sách
      queryClient.invalidateQueries({
        queryKey: EMPLOYEES_QUERY_KEYS.lists(),
      });

      // Update detail cache
      queryClient.setQueryData(
        EMPLOYEES_QUERY_KEYS.detail(updatedEmployee.id),
        updatedEmployee,
      );

      toast({
        title: 'Thành công',
        description: `Nhân viên ${updatedEmployee.name} đã được cập nhật.`,
      });
    },
    onError: (error: any) => {
      console.error('Update employee error:', error);

      const message =
        error?.code === '404'
          ? 'Nhân viên không tồn tại'
          : error?.code === '409'
            ? 'Email này đã tồn tại'
            : 'Không thể cập nhật nhân viên. Vui lòng thử lại.';

      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * useDeleteEmployee
 * Xóa nhân viên (soft delete: set status = Resigned)
 * 
 * - Invalidate danh sách khi xóa thành công
 * - Toast thông báo
 * 
 * @returns Mutation object
 * 
 * @example
 * ```tsx
 * const { mutate: deleteEmployee } = useDeleteEmployee();
 * 
 * const handleDelete = (id) => {
 *   if (confirm('Bạn có chắc chắn muốn xóa?')) {
 *     deleteEmployee(id);
 *   }
 * };
 * ```
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useAppToast();

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: (_, deletedId) => {
      // Invalidate danh sách
      queryClient.invalidateQueries({
        queryKey: EMPLOYEES_QUERY_KEYS.lists(),
      });

      // Remove từ detail cache
      queryClient.removeQueries({
        queryKey: EMPLOYEES_QUERY_KEYS.detail(deletedId),
      });

      toast({
        title: 'Thành công',
        description: 'Nhân viên đã được xóa.',
      });
    },
    onError: (error: any) => {
      console.error('Delete employee error:', error);

      const message =
        error?.code === '404'
          ? 'Nhân viên không tồn tại'
          : 'Không thể xóa nhân viên. Vui lòng thử lại.';

      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};
