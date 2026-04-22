import { z } from 'zod';

export const createBoothSchema = z.object({
  boothCode: z.string().min(1, 'Booth code is required'),
  type: z.string().optional(),
  size: z.string().optional(),
  pricePerDay: z.number().min(0, 'Price per day must be a positive number'),
  status: z.enum(['AVAILABLE', 'BOOKED', 'UNAVAILABLE']).default('AVAILABLE'),
  availableStartDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  availableEndDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  description: z.string().optional(),
});
export type CreateBoothDto = z.infer<typeof createBoothSchema>;

export const bulkCreateBoothSchema = z.object({
  booths: z.array(createBoothSchema).min(1, 'At least one booth is required'),
});
export type BulkCreateBoothDto = z.infer<typeof bulkCreateBoothSchema>;

export const updateBoothSchema = createBoothSchema.partial();
export type UpdateBoothDto = z.infer<typeof updateBoothSchema>;

export const queryBoothSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  eventId: z.string().uuid().optional(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'UNAVAILABLE']).optional(),
});
export type QueryBoothDto = z.infer<typeof queryBoothSchema>;
