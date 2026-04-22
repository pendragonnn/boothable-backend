import { z } from 'zod';

export const uploadPaymentSchema = z.object({
  paymentMethod: z.enum(['Bank Transfer']).default('Bank Transfer'),
});
export type UploadPaymentDto = z.infer<typeof uploadPaymentSchema>;

export const queryPaymentSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  eventId: z.string().uuid().optional(),
  paymentStatus: z.enum(['UNPAID', 'WAITING_VERIFICATION', 'PAID', 'REJECTED']).optional(),
});
export type QueryPaymentDto = z.infer<typeof queryPaymentSchema>;

export const verifyPaymentSchema = z.object({
  paymentStatus: z.enum(['PAID', 'REJECTED']),
});
export type VerifyPaymentDto = z.infer<typeof verifyPaymentSchema>;
