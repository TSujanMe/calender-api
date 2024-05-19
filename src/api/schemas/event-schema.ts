import { HttpException } from '@base/utils/app-error';
import { IsDateTime } from '@base/validation/isValidDate';
import { Type } from 'class-transformer';
import { IsDateString, IsDefined, IsEmail, IsOptional, IsString, IsTimeZone, ValidateNested, validate, validateOrReject } from 'class-validator';

export class AttendeeEmaiilSchema {
	@IsEmail({}, { each: true })
	@IsString({ each: true })
	@IsDefined()
	email: string;
}
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

	@ValidateNested()
	@Type(() => AttendeeEmaiilSchema)
	attendeeEmail: AttendeeEmaiilSchema[];

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

	@ValidateNested()
	@Type(() => AttendeeEmaiilSchema)
	attendeeEmail?: AttendeeEmaiilSchema[];

	@IsTimeZone()
	@IsDefined()
	timezone: string;

	static validateTime(body: UpdateEventSchema) {
		if (new Date() >= body.startTime) {
			throw HttpException.badRequest('Start time must be in the future');
		}
		if (new Date(body.startTime) >= new Date(body.endTime)) {
			throw HttpException.badRequest('Start time must be before end time');
		}
	}
}
