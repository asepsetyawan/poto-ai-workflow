import { z } from 'zod';

export const listUsersSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z
    .object({
      name: z.string().min(1).max(120),
    })
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
