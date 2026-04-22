import { z } from 'zod';

export const createBookingSchema = z.object({
  boothId: z.string().uuid('Invalid booth ID format'),
  rentalStartDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  rentalEndDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});
export type CreateBookingDto = z.infer<typeof createBookingSchema>;

export const queryBookingSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  eventId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: z.enum(['Pending', 'Waiting Payment', 'Processing', 'Approved', 'Rejected', 'Cancelled']).optional(),
});
export type QueryBookingDto = z.infer<typeof queryBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(['Pending', 'Waiting Payment', 'Processing', 'Approved', 'Rejected', 'Cancelled']),
});
export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusSchema>;
