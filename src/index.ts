/// <reference path="./types/express/index.d.ts" />
import 'module-alias/register';
import 'reflect-metadata';
import 'dotenv/config';
import '@base/config/env/infer-env';

import router from '@base/api/routes/index';
import compression from 'compression';
import express, { Application } from 'express';
import helmet from 'helmet';
import appDataSource from './config/database/database-config';
import { AppConfig } from './config/env/app-env';
import { StatusCodes } from './constants/status-code';
import errorHandler from './middlewares/error-middleware';
import Logger from './config/winston-config';
import Connection from './config/mq/connection';

export const startServer = async () => {
	const app: Application = express();

	// Middleware
	app.use(express.json());

	app.use(helmet());

	app.use(compression());

	// Routes
	app.use(router);

	// Error handling
	app.use(errorHandler);


	app.all('*', (_, res) => {
		res.status(StatusCodes.NOT_FOUND).json({
			message: 'No Route found',
			success: false,
		});
	});

	try {
		await appDataSource.initialize();
		const connection = Connection.getInstance();		
		const server = app.listen(AppConfig.PORT, () => {
			Logger.info(`Server is running on port ${AppConfig.PORT}`);
			Logger.info(`SQlite Database is connected`);
			Logger.info(`Redis Database is connected`);
		});

		process.on('SIGINT', () => {
			console.log('Received SIGINT. Shutting down gracefully...');
			server.close(() => {
				console.log('Server closed. Exiting process.');
				process.exit(0);
			});
		});

		process.on('SIGTERM', () => {
			console.log('Received SIGTERM. Shutting down gracefully...');
			server.close(() => {
				console.log('Server closed. Exiting process.');
				process.exit(0);
			});
		});
	} catch (error) {
		// await prismaClient.$disconnect(); // Disconnect to the database
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer();
