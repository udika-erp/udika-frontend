import { z } from 'zod';

export const calendarEventSchema = z.object({
  name: z.string().min(1, 'Tên sự kiện không được để trống'),
  date: z.string().min(1, 'Ngày không được để trống'),
  time: z.string().min(1, 'Thời gian không được để trống'),
  type: z.enum(['wedding', 'corporate', 'birthday', 'charity', 'meeting']),
});

export type CalendarEventFormValues = z.infer<typeof calendarEventSchema>;
