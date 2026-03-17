import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Tên khách hàng không được để trống'),
  company: z.string().optional(),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  source: z.enum(['Referral', 'Facebook', 'Google', 'Zalo', 'Website']),
  leadStatus: z.enum([
    'New',
    'Contacted',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Won',
    'Lost',
  ]),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
