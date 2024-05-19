import appDataSource from '@base/config/database/database-config';
import { HttpException } from '@base/utils/app-error';
import { autoInjectable, singleton } from 'tsyringe';
import { Repository } from 'typeorm'; // Importing getRepository and Repository
import { Event } from '../models/event-model';
import { User } from '../models/user-model';
import { CreateEventSchema, UpdateEventSchema } from '../schemas/event-schema';

/**
 * Service class for managing events.
 */
@autoInjectable()
@singleton()
class EventService {
	private eventRepository: Repository<Event>;

	constructor() {
		this.eventRepository = appDataSource.getRepository(Event);
	}

	/**
	 * Retrieves an event by its ID.
	 * @param id - The ID of the event to retrieve.
	 * @returns The event with the specified ID, or undefined if not found.
	 */
	public async getEventByID(id: number): Promise<Event> {
		const event = await this.eventRepository.findOne({ where: { id } });
		if (!event) {
			throw HttpException.badRequest('Event not found');
		}
		return event;
	}

	/**
	 * Retrieves all events from the event repository.
	 * @returns A Promise that resolves to an array of events.
	 */
	public async getAllEvent(): Promise<Event[]> {
		const events = await this.eventRepository.find({
			where: {
				deletedAt: null,
			},
		});
		return events;
	}

	/**
	 * Creates a new event.
	 *
	 * @param user - The user creating the event.
	 * @param body - The data for the new event.
	 * @returns The newly created event.
	 */
	public async create(user: any, body: CreateEventSchema): Promise<Event> {
		const newUser = this.eventRepository.create({
			attendeeEmail: body.attendeeEmail,
			startTime: body.startTime,
			endTime: body.endTime,
			description: body.description,
			title: body.title,
			creator: user,
		});
		await this.eventRepository.save(newUser);
		return newUser;
	}

	/**
	 * Updates an event with the specified ID.
	 *
	 * @param id - The ID of the event to update.
	 * @param body - The updated data for the event.
	 * @returns A Promise that resolves to the updated event data.
	 */
	public async update(id: number, body: UpdateEventSchema): Promise<Event> {
		const event = await this.getEventByID(id);

		const updatedData = Object.assign(event, body);

		const updatedEventData = await this.eventRepository.save(updatedData);

		return updatedEventData;
	}

	/**
	 * Deletes an event by its ID.
	 * @param id - The ID of the event to delete.
	 * @returns A Promise that resolves to the updated event data after deletion.
	 */
	public async delete(id: number): Promise<Boolean> {
		const event = await this.getEventByID(id);
		await this.eventRepository.softDelete(event.id);
		return true;
	}
}

export default EventService;
