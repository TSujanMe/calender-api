// connection.ts
import nodemailer, { Transporter } from 'nodemailer';

export class Connection {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.example.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'username@example.com',
				pass: 'password',
			},
		});
	}

	public getTransporter(): Transporter {
		return this.transporter;
	}
}
