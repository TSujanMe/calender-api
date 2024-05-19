import { eventIOCContainer } from '@base/api/ioc/ioc';
import {
    CreateEventSchema,
    UpdateEventSchema
} from '@base/api/schemas/event-schema';
import RequestValidator from '@base/middlewares/validation-middelware';
import { catchAsync } from '@base/utils/catchAsync-utils';
import { Router } from 'express';

const eventRouter = Router();

eventRouter.post(
    '/get-all',
    catchAsync(eventIOCContainer.getAll.bind(eventIOCContainer))
  );

  eventRouter.post(
    '/:id',
    catchAsync(eventIOCContainer.get.bind(eventIOCContainer))
  );



  eventRouter.post(
    '/create',
    RequestValidator.validate(CreateEventSchema),
    catchAsync(eventIOCContainer.create.bind(eventIOCContainer))
  );


  eventRouter.put(
    '/update',
    RequestValidator.validate(UpdateEventSchema),
    catchAsync(eventIOCContainer.update.bind(eventIOCContainer))
  );


  eventRouter.delete(
    '/:id',
    catchAsync(eventIOCContainer.delete.bind(eventIOCContainer))
  );

export default eventRouter;
