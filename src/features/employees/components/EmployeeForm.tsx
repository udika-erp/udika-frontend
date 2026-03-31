import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateEmployee,
  useUpdateEmployee,
  useEmployeeDetail,
  useEmployeeDepartments,
  useEmployeePositions,
} from '../hooks';
import { employeeSchema, type EmployeeFormValues } from '../forms/employee.schema';

interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
  employeeId?: string;
}

export function EmployeeForm({
  onSubmit: onSubmitProp,
  onCancel,
  employeeId,
}: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      position: '',
      department: 'Sales',
      joinDate: '',
    },
  });

  // ==================== Queries ====================
  const { data: employee, isLoading: isLoadingEmployee } = useEmployeeDetail(
    employeeId || '',
    !!employeeId
  );
  const { data: departments } = useEmployeeDepartments();
  const { data: positions } = useEmployeePositions();

  // ==================== Mutations ====================
  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const isSubmitting = isCreating || isUpdating;

  // ==================== Effects ====================
  // Load employee data when in edit mode
  useEffect(() => {
    if (employee && employeeId) {
      form.reset({
        name: employee.name || '',
        phone: employee.phone || '',
        email: employee.email || '',
        position: employee.position || '',
        department: (employee.department as any) || 'Sales',
        joinDate: employee.joinDate || '',
      });
    }
  }, [employee, employeeId, form]);

  // ==================== Handlers ====================
  const handleSubmit = (values: EmployeeFormValues) => {
    if (employeeId) {
      // Update mode
      updateEmployee({
        id: employeeId,
        data: values,
      });
    } else {
      // Create mode
      createEmployee(values);
    }

    // Call parent callback
    onSubmitProp(values);
  };

  // ==================== Loading State ====================
  if (employeeId && isLoadingEmployee) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // ==================== Render ====================
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhân viên *</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại *</FormLabel>
                <FormControl>
                  <Input placeholder="0912 345 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@company.vn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chức vụ *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {positions?.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày vào làm *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2563EB] hover:bg-[#1d4ed8]"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block mr-2">⏳</span>
                {employeeId ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              employeeId ? 'Cập nhật' : 'Tạo'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
