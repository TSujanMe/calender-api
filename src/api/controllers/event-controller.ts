import { StatusCodes } from '@base/constants/status-code';
import { createResponse } from '@base/utils/response-utils';
import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import EventService from '../services/event-service';

@autoInjectable()
export class EventController {
	constructor(private eventService: EventService) {}

	public async getAll(req: Request, res: Response, next: NextFunction) {
		const event = await this.eventService.getAllEvent();
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'Event Fetched successfully', event));
	}

	public async get(req: Request, res: Response, next: NextFunction) {
		const event = await this.eventService.getEventByID(+req.params.id);
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'Event Fetched successfully', event));
	}

	public async create(req: Request, res: Response, next: NextFunction) {
		const event = await this.eventService.create('_', req.body);
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'Event Created successfully', event));
	}

	public async update(req: Request, res: Response, next: NextFunction) {
		const eventId = req.params.id;
		const event = await this.eventService.update(+eventId, req.body);
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'Event Updated successfully', event));
	}
	public async delete(req: Request, res: Response, next: NextFunction) {
		const event = await this.eventService.delete(req.body);
		res.status(StatusCodes.OK).json(createResponse(true, StatusCodes.OK, 'Event Deleted successfully', event));
	}
}
