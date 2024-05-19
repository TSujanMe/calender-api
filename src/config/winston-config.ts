import winston from 'winston';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const level = () => {
	return isDevelopment ? 'debug' : 'warn';
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.colorize({ all: true }), // Colorize for console output
	winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const fileFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const transports = [
	new winston.transports.Console({
		format: format, // Use colorized format for console
	}),
	new winston.transports.File({
		filename: 'logs/error.log',
		level: 'error',
		format: fileFormat, // Use plain text format for files
	}),
	new winston.transports.File({
		filename: 'logs/all.log',
		format: fileFormat, // Use plain text format for files
	}),
];

const Logger = winston.createLogger({
	level: level(),
	levels,
	transports,
});

export default Logger;
