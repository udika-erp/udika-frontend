import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
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
  useEmployeeRoles,
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
      role: undefined,
      department: 'Board',
      joinDate: '',
    },
  });

  // ==================== Queries ====================
  const { data: employee, isLoading: isLoadingEmployee } = useEmployeeDetail(
    employeeId || '',
    !!employeeId
  );
  const { data: departments } = useEmployeeDepartments();
  const { data: roles } = useEmployeeRoles();

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
        role: employee.role || 'Staff',
        department: employee.department || 'HR',
        joinDate: employee.joinDate || '',
      });
    }
  }, [employee, employeeId, form]);

  // Close dialog when mutation succeeds
  useEffect(() => {
    if (!isSubmitting) return;
    // Mutation completed - this will be handled by onSuccess callback in mutation hooks
  }, [isSubmitting]);

  // ==================== Handlers ====================
  const handleSubmit = (values: EmployeeFormValues) => {
    if (employeeId) {
      // Update mode
      updateEmployee(
        {
          id: employeeId,
          data: values,
        },
        {
          onSuccess: () => {
            onSubmitProp(values);
          },
        }
      );
    } else {
      // Create mode
      createEmployee(values, {
        onSuccess: () => {
          onSubmitProp(values);
        },
      });
    }
  };

  // ==================== Loading State ====================
  if (employeeId && isLoadingEmployee) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading employee data...</p>
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
              <FormLabel>Employee Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="+84 912 345 678" {...field} />
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
                  <Input type="email" placeholder="john@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles?.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
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
              <FormLabel>Join Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2563EB] hover:bg-[#1d4ed8]"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                {employeeId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              employeeId ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
