import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(1, 'Tên sự kiện không được để trống'),
  client: z.string().min(1, 'Khách hàng không được để trống'),
  type: z.enum(['Wedding', 'Corporate', 'Birthday', 'Charity', 'Other']),
  date: z.string().min(1, 'Ngày không được để trống'),
  venue: z.string().optional(),
  budget: z.number().min(0).optional(),
  attendees: z.number().min(0).optional(),
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
