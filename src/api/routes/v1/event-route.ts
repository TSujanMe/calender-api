import { eventIOCContainer } from '@base/api/ioc/ioc';
import { CreateEventSchema, UpdateEventSchema } from '@base/api/schemas/event-schema';
import isAuthenticated from '@base/middlewares/auth-middleware';
import RequestValidator from '@base/middlewares/validation-middelware';
import { catchAsync } from '@base/utils/catchAsync-utils';
import { Router } from 'express';

const eventRouter = Router();

eventRouter.get('/get-all', catchAsync(eventIOCContainer.getAll.bind(eventIOCContainer)));

eventRouter.get('/:id', catchAsync(eventIOCContainer.get.bind(eventIOCContainer)));

eventRouter.post(
	'/create',
	isAuthenticated,
	RequestValidator.validate(CreateEventSchema),
	catchAsync(eventIOCContainer.create.bind(eventIOCContainer)),
);

eventRouter.put(
	'/update',
	isAuthenticated,
	RequestValidator.validate(UpdateEventSchema),
	catchAsync(eventIOCContainer.update.bind(eventIOCContainer)),
);

eventRouter.delete('/:id', isAuthenticated, catchAsync(eventIOCContainer.delete.bind(eventIOCContainer)));

export default eventRouter;
