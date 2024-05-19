import { NextFunction, Request, Response } from 'express';
import Logger from '../config/winston-config';
import { Environment } from '@base/constants/environment';
import messages from '@base/constants/messages';
import { AppConfig } from '@base/config/env/app-env';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
	let statusCode = 500;
	console.log(error);

	Logger.error(error);

	let data = {
		success: false,
		message: messages['serverError'],
		...(AppConfig.NODE_ENV === Environment.Development && { originalError: error.message }),
	};
	if (error.isOperational) {
		statusCode = error.statusCode;
		data = {
			...data,
			message: error.message,
		};
	}

	return res.status(statusCode).json(data);
};

export default errorHandler;
