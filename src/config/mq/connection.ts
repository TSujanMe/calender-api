import IORedis from 'ioredis';
import { dbConfig } from '../env/db-env';

class Connection {
	private static instance: Connection;
	public redisConnection: any;

	private constructor() {
		this.redisConnection = new IORedis(dbConfig.REDIS_URL);
	}

	public static getInstance(): Connection {
		if (!Connection.instance) {
			Connection.instance = new Connection();
		}
		return Connection.instance;
	}
}

export default Connection;
