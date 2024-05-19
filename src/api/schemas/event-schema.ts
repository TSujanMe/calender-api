import { HttpException } from '@base/utils/app-error';
import { IsDateTime } from '@base/validation/isValidDate';
import { IsDateString, IsDefined, IsEmail, IsOptional, IsString, IsTimeZone, validate, validateOrReject } from 'class-validator';

export class CreateEventSchema {
	@IsDefined()
	@IsString()
	title: string;

	@IsDefined()
	@IsString()
	description: string;

	@IsDateTime()
	@IsDefined()
	@IsDateString()
	startTime: Date;

	@IsDateTime()
	@IsDefined()
	@IsDateString()
	endTime: Date;

	@IsEmail({}, { each: true })
	@IsString({ each: true })
	@IsDefined()
	attendeeEmail: string[];

	@IsTimeZone()
	@IsDefined()
	timezone: string;

	static validateTime(body: CreateEventSchema) {
		if (new Date() >= body.startTime) {
			throw HttpException.badRequest('Start time must be in the future');
		}
		if (new Date(body.startTime) >= new Date(body.endTime)) {
			throw HttpException.badRequest('Start time must be before end time');
		}
	}

	static async validateCreateEventSchema(data: CreateEventSchema) {
		CreateEventSchema.validateTime(data);
	}
}

export class UpdateEventSchema {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsDateString()
	startTime?: Date;

	@IsOptional()
	@IsDateString()
	endTime?: Date;

	@IsEmail({}, { each: true })
	@IsString({ each: true })
	@IsOptional()
	attendeeEmail?: string[];

	@IsTimeZone()
	@IsDefined()
	timezone: string;

	validateTime() {}
}
