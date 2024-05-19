import { StatusCodes } from '@base/constants/status-code';

export class HttpException extends Error {
	statusCode: number;
	isOperational: boolean;
	status: string;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(message: string) {
		return new HttpException(message, StatusCodes.BAD_REQUEST);
	}
	static unAuthorized(message: string) {
		return new HttpException(message, StatusCodes.UNAUTHORIZED);
	}

	static notFound(message: string) {
		return new HttpException(message, StatusCodes.NOT_FOUND);
	}
	static conflict(message: string) {
		return new HttpException(message, StatusCodes.CONFLICT);
	}

	static internalServerError(message: string) {
		return new HttpException(message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
