import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import * as authService from './auth.service.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body as RegisterInput);
  res.status(201).json(result);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginInput);
  res.status(200).json(result);
});
