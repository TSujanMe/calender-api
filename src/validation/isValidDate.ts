import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { isString } from 'class-validator';
import moment from 'moment';

@ValidatorConstraint({ async: false })
class IsDateTimeConstraint implements ValidatorConstraintInterface {
	validate(dateTime: any, args: ValidationArguments) {
		if (!isString(dateTime)) return false;
		const dateTimeFormat = 'YYYY-MM-DD HH:mm';
		return moment(dateTime, dateTimeFormat, true).isValid();
	}

	defaultMessage(args: ValidationArguments) {
		return 'Date and time must be in the format YYYY-MM-DD HH:mm';
	}
}

export function IsDateTime(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsDateTimeConstraint,
		});
	};
}
