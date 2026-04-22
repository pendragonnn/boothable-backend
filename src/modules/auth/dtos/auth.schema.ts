import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.nativeEnum(Role).optional().default(Role.VENDOR),
});
export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});
export type LoginDto = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Token required'),
});
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
