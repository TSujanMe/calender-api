import { authConfig } from '@base/config/env/auth-env';
import { StatusCodes } from '@base/constants/status-code';
import { JwtUtils } from '@base/utils/jwt-utils';
import { createResponse } from '@base/utils/response-utils';
import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import AuthService from '../services/auth-service';

@autoInjectable()
export class AuthController {
	constructor(private authService: AuthService) {}

	public async login(req: Request, res: Response, next: NextFunction) {
		const user = await this.authService.login(req.body);
		const accessToken = JwtUtils.sign({ id: user.id }, authConfig.auth.JWT_ACCESS_TOKEN_SECRET_KEY, authConfig.auth.JWT_ACCESS_TOKEN_EXPIRATION_TIME);
		const response = {
			accessToken,
			user,
		};
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'User Logged in successfully', response));
	}

	public async register(req: Request, res: Response, next: NextFunction) {
		const user = await this.authService.register(req.body);
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'User Created successfully', user));
	}
}
