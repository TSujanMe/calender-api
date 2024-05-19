// connection.ts
import { authConfig } from '@base/config/env/auth-env';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: authConfig.email.USERNAME,
				pass: authConfig.email.EMAIL_PASSWORD,
			},
		});
	}

	public getTransporter(): Transporter {
		return this.transporter;
	}

	public async sendMail(mailOptions: Mail.Options): Promise<any> {
		return await this.transporter.sendMail(mailOptions);
	}
}
