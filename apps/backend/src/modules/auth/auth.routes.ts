import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { loginUser, registerUser } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), registerUser);
authRouter.post('/login', validate(loginSchema), loginUser);
