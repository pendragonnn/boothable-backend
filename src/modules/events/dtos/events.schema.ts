import { z } from 'zod';

export const createEventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  location: z.string().optional(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(), // allow date string
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  description: z.string().optional(),
  paymentVa: z.string().optional(),
  organizerId: z.string().uuid().optional(), // For Admin explicitly passing organizerId
});
export type CreateEventDto = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial().extend({
  description: z.string().optional(), // For Admin moderation
});
export type UpdateEventDto = z.infer<typeof updateEventSchema>;

export const queryEventSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});
export type QueryEventDto = z.infer<typeof queryEventSchema>;
