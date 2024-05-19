import { IsDateString, IsDefined, IsEmail, IsOptional, IsString, isDefined, isString } from 'class-validator';

export class CreateEventSchema {
	@IsDefined()
	@IsString()
	title: string;

	@IsDefined()
	@IsString()
	description: string;

	@IsDefined()
	@IsDateString()
	startTime: Date;

	@IsDefined()
	@IsDateString()
	endTime: Date;

	@IsEmail({}, { each: true })
	@IsString({ each: true })
	@IsDefined()
	attendeeEmail: string[];
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
}
