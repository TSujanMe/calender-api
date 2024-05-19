import { IsDefined, IsString, IsTimeZone, isDefined, isString } from 'class-validator';

export class LoginSchema {
	@IsDefined()
	@IsString()
	email: string;

	@IsDefined()
	@IsString()
	password: string;
}

export class RegisterSchema {
	@IsDefined()
	@IsString()
	email: string;

	@IsDefined()
	@IsString()
	password: string;

	@IsDefined()
	@IsString()
	name: string;

	@IsTimeZone()
	@IsString()
	@IsDefined()
	timezone: string;
}
