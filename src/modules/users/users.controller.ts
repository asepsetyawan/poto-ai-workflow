import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import * as usersService from './users.service.js';
import type { ListUsersQuery, UpdateUserInput } from './users.schema.js';

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await usersService.listUsers(req.query as unknown as ListUsersQuery);
  res.status(200).json({ data: users });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getUserById(req.params.id as string);
  res.status(200).json({ data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.updateUser(req.params.id as string, req.body as UpdateUserInput);
  res.status(200).json({ data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await usersService.deleteUser(req.params.id as string);
  res.status(204).send();
});
