import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const usersListSchema = z.object({
  data: z.array(userSchema),
});

export type User = z.infer<typeof userSchema>;
