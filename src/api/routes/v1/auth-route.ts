import { authIOCContainer } from '@base/api/ioc/ioc';
import { LoginSchema, RegisterSchema } from '@base/api/schemas/auth-schema';
import { Environment } from '@base/constants/environment';
import RequestValidator from '@base/middlewares/validation-middelware';
import { catchAsync } from '@base/utils/catchAsync-utils';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', RequestValidator.validate(LoginSchema), catchAsync(authIOCContainer.login.bind(authIOCContainer)));

authRouter.post('/register', RequestValidator.validate(RegisterSchema), catchAsync(authIOCContainer.register.bind(authIOCContainer)));

export default authRouter;
