import { Router } from 'express';
import authRouter from './auth-route';
import eventRouter from './event-route';

interface RouteInterface {
	prefex: string;
	router: Router;
	middleware: any[];
}

export const routes: RouteInterface[] = [
	{
		prefex: 'auth',
		router: authRouter,
		middleware: [],
	},
	{
		prefex: 'event',
		router: eventRouter,
		middleware: [],
	},
];
