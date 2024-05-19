import AuthService from '@base/api/services/auth-service';
import { authConfig } from '@base/config/env/auth-env';
import { StatusCodes } from '@base/constants/status-code';
import { HttpException } from '@base/utils/app-error';
import { JwtUtils } from '@base/utils/jwt-utils';
import { NextFunction, Request, Response } from 'express';

const authService: AuthService = new AuthService();
async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
	try {
		let token = req.headers.cookie;

		if (!token) throw HttpException.unAuthorized('You are not authorized to perform this action');

		token = token.split('=')[1];

		const credentials = await JwtUtils.verify(token, authConfig.auth.JWT_ACCESS_TOKEN_SECRET_KEY);

		if (!credentials.id) throw HttpException.unAuthorized('You are not authorized to perform this action');

		const user = await authService.getUser(credentials.id);

		req.user = user;

		next();
	} catch (error: any) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: false,
			message: 'You are not authorized to perform this action',
		});
	}
}

export default isAuthenticated;
