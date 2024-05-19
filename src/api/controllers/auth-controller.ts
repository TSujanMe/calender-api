import { authConfig } from '@base/config/env/auth-env';
import { StatusCodes } from '@base/constants/status-code';
import { JwtUtils } from '@base/utils/jwt-utils';
import { createResponse } from '@base/utils/response-utils';
import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import AuthService from '../services/auth-service';
import { AppConfig } from '@base/config/env/app-env';
import { Environment } from '@base/constants/environment';

@autoInjectable()
export class AuthController {
	constructor(private authService: AuthService) {}

	public async login(req: Request, res: Response, next: NextFunction) {
		const user = await this.authService.login(req.body);
		const expirationTime = parseInt(authConfig.auth.JWT_ACCESS_TOKEN_EXPIRATION_TIME) * 60;
		const accessToken = JwtUtils.sign({ id: user.id }, authConfig.auth.JWT_ACCESS_TOKEN_SECRET_KEY, expirationTime);
		const response = {
			accessToken,
			user,
		};
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: AppConfig.NODE_ENV !== Environment.Development,
			expires: new Date(Date.now() + parseInt(authConfig.auth.JWT_ACCESS_TOKEN_EXPIRATION_TIME) * 60 * 1000),
			// maxAge: +authConfig.auth.JWT_ACCESS_TOKEN_EXPIRATION_TIME * 60 * 1000,
		});
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'User Logged in successfully', response));
	}

	public async register(req: Request, res: Response, next: NextFunction) {
		const user = await this.authService.register(req.body);
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'User Created successfully', user));
	}
}
