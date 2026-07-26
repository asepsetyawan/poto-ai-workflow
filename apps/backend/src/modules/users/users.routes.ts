import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { getUserSchema, listUsersSchema, updateUserSchema } from './users.schema.js';
import { deleteUser, getUser, listUsers, updateUser } from './users.controller.js';

export const usersRouter = Router();

// Every route below requires a valid JWT. Apply narrower auth (e.g. ownership
// or role checks) inside the controller/service layer, not here.
usersRouter.use(requireAuth);

usersRouter.get('/', validate(listUsersSchema), listUsers);
usersRouter.get('/:id', validate(getUserSchema), getUser);
usersRouter.patch('/:id', validate(updateUserSchema), updateUser);
usersRouter.delete('/:id', validate(getUserSchema), deleteUser);
