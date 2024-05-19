
import { Request } from 'express';
import { User } from '@base/api/models/user-model';

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}
