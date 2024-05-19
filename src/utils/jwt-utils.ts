import jwt from 'jsonwebtoken';

export class JwtUtils {
	static sign(payload: any, secret: string, expiresIn: string): string {
		return jwt.sign(payload, secret, {
			expiresIn,
		});
	}

	static verify(token: string, secret: string): any {
		return jwt.verify(token, secret);
	}
}
