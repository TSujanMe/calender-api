import { Environment } from '@base/constants/environment';
import { z } from 'zod';

const envVariable = z.object({
	PORT: z.string(),
	NODE_ENV: z.nativeEnum(Environment),
	JWT_ACCESS_TOKEN_SECRET_KEY: z.string(),
	JWT_REFRESH_TOKEN_SECRET_KEY: z.string(),
	JWT_ACCESS_TOKEN_EXPIRY_TIME_IN_MINUTEES: z.string(),
	JWT_REFRESH_TOKEN_EXIIRY_TIME_IN_MINUTES: z.string(),
	REDIS_URL: z.string(),
});

envVariable.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariable> {}
	}
}
