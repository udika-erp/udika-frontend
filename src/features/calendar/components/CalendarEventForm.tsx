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
import { calendarEventSchema, type CalendarEventFormValues } from '../forms/calendar-event.schema';

interface CalendarEventFormProps {
  defaultValues?: Partial<CalendarEventFormValues>;
  onSubmit: (values: CalendarEventFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CalendarEventForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CalendarEventFormProps) {
  const form = useForm<CalendarEventFormValues>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      name: '',
      date: '',
      time: '',
      type: 'meeting',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sự kiện *</FormLabel>
              <FormControl>
                <Input placeholder="Tên sự kiện" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại sự kiện *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="wedding">Tiệc cưới</SelectItem>
                  <SelectItem value="corporate">Sự kiện công ty</SelectItem>
                  <SelectItem value="birthday">Sinh nhật</SelectItem>
                  <SelectItem value="charity">Từ thiện</SelectItem>
                  <SelectItem value="meeting">Cuộc họp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? 'Đang lưu...' : 'Thêm sự kiện'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
