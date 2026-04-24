import { z } from 'zod';

export const createEventCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  icon: z.string().max(255).optional(),
  description: z.string().optional(),
});
export type CreateEventCategoryDto = z.infer<typeof createEventCategorySchema>;

export const updateEventCategorySchema = createEventCategorySchema.partial();
export type UpdateEventCategoryDto = z.infer<typeof updateEventCategorySchema>;

export const queryEventCategorySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});
export type QueryEventCategoryDto = z.infer<typeof queryEventCategorySchema>;
