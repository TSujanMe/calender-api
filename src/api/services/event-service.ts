import appDataSource from '@base/config/database/database-config';
import { HttpException } from '@base/utils/app-error';
import { autoInjectable, singleton } from 'tsyringe';
import { Repository } from 'typeorm'; // Importing getRepository and Repository
import { Event } from '../models/event-model';
import { User } from '../models/user-model';
import { CreateEventSchema, UpdateEventSchema } from '../schemas/event-schema';
import Publisher from '@base/config/mq/publisher';
import { QueueLists } from '@base/constants/queue';
import { Queue } from 'bullmq';
import WorkerClient from '@base/config/mq/worker';
import Connection from '@base/config/mq/connection';
import { EmailService } from '@base/utils/emai-utils';
import { authConfig } from '@base/config/env/auth-env';

/**
 * Service class for managing events.
 */
@autoInjectable()
@singleton()
class EventService {
	private eventRepository: Repository<Event>;
	private queue: Queue;

	constructor() {
		this.eventRepository = appDataSource.getRepository(Event);
		this.queue = Publisher.createQueue(QueueLists.EMAIL);
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
	public async create(user: User, body: CreateEventSchema): Promise<Event> {
		const attendeeEmails = body.attendeeEmail.map((data) => {
			return { email: data.email, email_sent: false };
		});
		CreateEventSchema.validateTime(body);

		const newEvent = this.eventRepository.create({
			attendeeEmail: attendeeEmails,
			startTime: body.startTime,
			endTime: body.endTime,
			description: body.description,
			title: body.title,
			creator: user,
			timezone: body.timezone,
		});
		await this.eventRepository.save(newEvent);

		// Now schedule it for jobs
		const data = {
			startDate: newEvent.startTime,
			eventName: newEvent.title,
		};
		const jobNameForCurrent = newEvent.id + 'current';
		const jobNameForSchedule = newEvent.id + 'schedule';
		this.queue.add(jobNameForCurrent, data, {
			removeOnComplete: true,
		});

		const immediateBefore = new Date(new Date(newEvent.startTime).getTime() - 60000); // 1 minute before
		this.queue.add(
			jobNameForSchedule,
			{
				name: 'meri pyari sagun',
			},
			{
				delay: immediateBefore.getTime() - Date.now(),
			},
		);

		const connection = Connection.getInstance();
		WorkerClient.createWorker(
			QueueLists.EMAIL,
			async (job: any) => {
				const subject = `Event: ${newEvent.title}`;
				const text = `Event: ${newEvent.title} is scheduled at ${newEvent.startTime} to ${newEvent.endTime}`;
				const emailService = new EmailService().sendMail({
					from: authConfig.email.USERNAME,
					to: body.attendeeEmail.map((data) => data.email).join(','),
					subject: subject,
					text,
				});
			},
			{
				connection,
			},
		);

		return newEvent;
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
		// Update attendees
		const attendees = body.attendeeEmail
			? event.attendeeEmail.map((emailData) => {
					const existingAttendee = body.attendeeEmail.find((data) => emailData.email === data.email);
					return existingAttendee ? emailData : { email: emailData.email, email_sent: false };
				})
			: event.attendeeEmail;

		// Reset email_sent if event time changes
		if (event.startTime !== body.startTime || event.endTime !== body.endTime) {
			UpdateEventSchema.validateTime(body);
			attendees.forEach((attendee) => (attendee.email_sent = false));
		}

		const updatedEvent = {
			...event,
			...body,
			attendeeEmail: attendees,
		};

		const updatedEventData = await this.eventRepository.save(updatedEvent);

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
